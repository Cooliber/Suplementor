import { ResearchStudy, EvidenceLevel, EnhancedSupplement } from '@/types/enhanced-supplement';
import { advancedDebugger, DebugCategory } from './advanced-debugging';

export interface PubMedSearchResult {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  abstract?: string;
  doi?: string;
  pmc?: string;
}

export interface ResearchSummary {
  supplementId: string;
  totalStudies: number;
  evidenceDistribution: {
    strong: number;
    moderate: number;
    weak: number;
    insufficient: number;
    conflicting: number;
  };
  keyFindings: string[];
  recommendedDosages: string[];
  safetyProfile: {
    commonSideEffects: string[];
    contraindications: string[];
    interactions: string[];
  };
  lastUpdated: Date;
}

export interface EvidenceAnalysis {
  overallStrength: EvidenceLevel;
  confidenceScore: number; // 0-100
  studyQualityScore: number; // 0-100
  consistencyScore: number; // 0-100
  relevanceScore: number; // 0-100
  recommendations: string[];
}

class ResearchIntegrationSystem {
  private static instance: ResearchIntegrationSystem;
  private researchCache: Map<string, PubMedSearchResult[]> = new Map();
  private summaryCache: Map<string, ResearchSummary> = new Map();
  
  static getInstance(): ResearchIntegrationSystem {
    if (!ResearchIntegrationSystem.instance) {
      ResearchIntegrationSystem.instance = new ResearchIntegrationSystem();
    }
    return ResearchIntegrationSystem.instance;
  }

  /**
   * Searches PubMed for research related to a supplement
   */
  public async searchPubMed(
    query: string,
    maxResults: number = 20,
    filters?: {
      publicationTypes?: string[];
      dateRange?: { start: string; end: string };
      humanStudies?: boolean;
    }
  ): Promise<PubMedSearchResult[]> {
    advancedDebugger.info(DebugCategory.API, 'Starting PubMed search', { 
      query, 
      maxResults, 
      filters 
    });

    // Check cache first
    const cacheKey = `${query}-${maxResults}-${JSON.stringify(filters)}`;
    if (this.researchCache.has(cacheKey)) {
      return this.researchCache.get(cacheKey)!;
    }

    try {
      // Build PubMed API query
      let searchTerm = query;
      
      if (filters?.humanStudies) {
        searchTerm += ' AND humans[MeSH Terms]';
      }
      
      if (filters?.publicationTypes) {
        const typeFilter = filters.publicationTypes
          .map(type => `${type}[Publication Type]`)
          .join(' OR ');
        searchTerm += ` AND (${typeFilter})`;
      }

      if (filters?.dateRange) {
        searchTerm += ` AND ("${filters.dateRange.start}"[Date - Publication] : "${filters.dateRange.end}"[Date - Publication])`;
      }

      // Step 1: Search for PMIDs
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerm)}&retmax=${maxResults}&retmode=json`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (!searchData.esearchresult?.idlist?.length) {
        advancedDebugger.warn(DebugCategory.API, 'No results found for PubMed search', { query });
        return [];
      }

      const pmids = searchData.esearchresult.idlist;

      // Step 2: Fetch detailed information
      const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;
      
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      const results: PubMedSearchResult[] = pmids.map((pmid: string) => {
        const paper = detailsData.result[pmid];
        if (!paper) return null;

        return {
          pmid,
          title: paper.title || 'No title available',
          authors: paper.authors?.map((author: any) => author.name) || [],
          journal: paper.fulljournalname || paper.source || 'Unknown journal',
          pubDate: paper.pubdate || 'Unknown date',
          doi: paper.articleids?.find((id: any) => id.idtype === 'doi')?.value,
          pmc: paper.articleids?.find((id: any) => id.idtype === 'pmc')?.value
        };
      }).filter(Boolean);

      // Cache results
      this.researchCache.set(cacheKey, results);

      advancedDebugger.info(DebugCategory.API, 'PubMed search completed', { 
        resultsCount: results.length,
        query 
      });

      return results;
    } catch (error) {
      advancedDebugger.error(DebugCategory.API, 'PubMed search failed', error);
      return [];
    }
  }

  /**
   * Fetches abstract for a specific paper
   */
  public async fetchAbstract(pmid: string): Promise<string | null> {
    try {
      const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`;
      const response = await fetch(url);
      const xmlText = await response.text();
      
      // Parse XML to extract abstract
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      const abstractElements = doc.querySelectorAll('AbstractText');
      
      if (abstractElements.length === 0) return null;

      const abstractText = Array.from(abstractElements)
        .map(element => element.textContent || '')
        .join('\n');

      return abstractText;
    } catch (error) {
      advancedDebugger.error(DebugCategory.API, 'Failed to fetch abstract', { pmid, error });
      return null;
    }
  }

  /**
   * Generates a research summary for a supplement
   */
  public async generateSupplementResearchSummary(supplement: EnhancedSupplement): Promise<ResearchSummary> {
    advancedDebugger.info(DebugCategory.AI, 'Generating research summary', { 
      supplementId: supplement.id 
    });

    // Check cache
    if (this.summaryCache.has(supplement.id)) {
      const cached = this.summaryCache.get(supplement.id)!;
      // Return cached if less than 24 hours old
      if (Date.now() - cached.lastUpdated.getTime() < 24 * 60 * 60 * 1000) {
        return cached;
      }
    }

    // Search terms for the supplement
    const searchTerms = [
      supplement.name,
      ...supplement.commonNames,
      ...supplement.activeCompounds.slice(0, 3) // Limit to avoid too broad search
    ].filter(term => term.length > 3); // Filter out very short terms

    const allResults: PubMedSearchResult[] = [];
    
    // Search for each term
    for (const term of searchTerms) {
      const results = await this.searchPubMed(term, 10, {
        publicationTypes: ['Randomized Controlled Trial', 'Clinical Trial', 'Meta-Analysis'],
        humanStudies: true,
        dateRange: { start: '2010/01/01', end: '2024/12/31' }
      });
      allResults.push(...results);
    }

    // Remove duplicates based on PMID
    const uniqueResults = allResults.filter((result, index, array) => 
      array.findIndex(r => r.pmid === result.pmid) === index
    );

    // Analyze research quality and evidence
    const evidenceAnalysis = this.analyzeEvidence(supplement, uniqueResults);
    
    // Generate summary
    const summary: ResearchSummary = {
      supplementId: supplement.id,
      totalStudies: uniqueResults.length,
      evidenceDistribution: this.calculateEvidenceDistribution(supplement.research),
      keyFindings: this.extractKeyFindings(supplement, uniqueResults),
      recommendedDosages: this.extractDosageRecommendations(supplement, uniqueResults),
      safetyProfile: {
        commonSideEffects: supplement.sideEffects.map(se => se.effect),
        contraindications: supplement.contraindications,
        interactions: supplement.interactions.map(i => i.description)
      },
      lastUpdated: new Date()
    };

    // Cache the summary
    this.summaryCache.set(supplement.id, summary);

    return summary;
  }

  /**
   * Analyzes the quality and strength of evidence
   */
  public analyzeEvidence(supplement: EnhancedSupplement, studies: PubMedSearchResult[]): EvidenceAnalysis {
    const studyQuality = this.calculateStudyQualityScore(studies);
    const consistency = this.calculateConsistencyScore(supplement.research);
    const relevance = this.calculateRelevanceScore(supplement, studies);
    
    const confidenceScore = (studyQuality + consistency + relevance) / 3;
    
    const overallStrength = this.determineOverallEvidenceLevel(confidenceScore, supplement.research);

    return {
      overallStrength,
      confidenceScore,
      studyQualityScore: studyQuality,
      consistencyScore: consistency,
      relevanceScore: relevance,
      recommendations: this.generateEvidenceRecommendations(confidenceScore, overallStrength)
    };
  }

  /**
   * Tracks evidence changes over time
   */
  public trackEvidenceChanges(supplementId: string): {
    trend: 'improving' | 'declining' | 'stable';
    recentChanges: { date: Date; change: string; impact: 'positive' | 'negative' | 'neutral' }[];
  } {
    // This would track evidence changes over time
    // For now, return mock data
    return {
      trend: 'stable',
      recentChanges: [
        {
          date: new Date('2024-01-15'),
          change: 'New meta-analysis published showing positive effects',
          impact: 'positive'
        }
      ]
    };
  }

  private calculateEvidenceDistribution(research: ResearchStudy[]) {
    const distribution = {
      strong: 0,
      moderate: 0,
      weak: 0,
      insufficient: 0,
      conflicting: 0
    };

    research.forEach(study => {
      distribution[study.evidenceLevel]++;
    });

    return distribution;
  }

  private extractKeyFindings(supplement: EnhancedSupplement, studies: PubMedSearchResult[]): string[] {
    // This would use NLP to extract key findings from study abstracts
    // For now, return supplement's primary effects
    return supplement.primaryEffects.slice(0, 5);
  }

  private extractDosageRecommendations(supplement: EnhancedSupplement, studies: PubMedSearchResult[]): string[] {
    // Extract dosage information from studies
    const standardDose = `${supplement.dosageInfo.standard.min}-${supplement.dosageInfo.standard.max}${supplement.dosageInfo.standard.unit}`;
    const recommendations = [standardDose];

    if (supplement.dosageInfo.clinical) {
      const clinicalDose = `${supplement.dosageInfo.clinical.min}-${supplement.dosageInfo.clinical.max}${supplement.dosageInfo.clinical.unit} (clinical studies)`;
      recommendations.push(clinicalDose);
    }

    return recommendations;
  }

  private calculateStudyQualityScore(studies: PubMedSearchResult[]): number {
    if (studies.length === 0) return 0;

    // Score based on study types and recency
    let totalScore = 0;
    let maxScore = 0;

    studies.forEach(study => {
      let studyScore = 50; // Base score
      maxScore += 100;

      // Bonus for recent studies
      const year = parseInt(study.pubDate.split(' ')[0]) || 2000;
      if (year >= 2020) studyScore += 25;
      else if (year >= 2015) studyScore += 15;
      else if (year >= 2010) studyScore += 10;

      // Bonus for having DOI (suggests peer review)
      if (study.doi) studyScore += 25;

      totalScore += Math.min(100, studyScore);
    });

    return Math.round((totalScore / maxScore) * 100);
  }

  private calculateConsistencyScore(research: ResearchStudy[]): number {
    if (research.length < 2) return 50;

    // Check if studies show consistent results
    const evidenceLevels = research.map(r => r.evidenceLevel);
    const strongCount = evidenceLevels.filter(e => e === EvidenceLevel.STRONG).length;
    const moderateCount = evidenceLevels.filter(e => e === EvidenceLevel.MODERATE).length;
    const conflictingCount = evidenceLevels.filter(e => e === EvidenceLevel.CONFLICTING).length;

    if (conflictingCount > research.length * 0.3) return 30; // High conflict
    if (strongCount + moderateCount > research.length * 0.7) return 90; // High consistency
    return 60; // Moderate consistency
  }

  private calculateRelevanceScore(supplement: EnhancedSupplement, studies: PubMedSearchResult[]): number {
    // This would analyze how relevant the studies are to the supplement's claimed benefits
    // For now, return a score based on number of studies and supplement goals
    const baseScore = Math.min(90, studies.length * 10);
    const goalBonus = supplement.userGoals.length > 0 ? 10 : 0;
    return Math.min(100, baseScore + goalBonus);
  }

  private determineOverallEvidenceLevel(confidenceScore: number, research: ResearchStudy[]): EvidenceLevel {
    if (confidenceScore >= 85 && research.some(r => r.evidenceLevel === EvidenceLevel.STRONG)) {
      return EvidenceLevel.STRONG;
    } else if (confidenceScore >= 65) {
      return EvidenceLevel.MODERATE;
    } else if (confidenceScore >= 45) {
      return EvidenceLevel.WEAK;
    } else if (research.some(r => r.evidenceLevel === EvidenceLevel.CONFLICTING)) {
      return EvidenceLevel.CONFLICTING;
    } else {
      return EvidenceLevel.INSUFFICIENT;
    }
  }

  private generateEvidenceRecommendations(confidenceScore: number, evidenceLevel: EvidenceLevel): string[] {
    const recommendations: string[] = [];

    if (confidenceScore >= 80) {
      recommendations.push('Strong evidence supports the use of this supplement');
    } else if (confidenceScore >= 60) {
      recommendations.push('Moderate evidence supports potential benefits');
    } else {
      recommendations.push('Limited evidence available, use with caution');
    }

    if (evidenceLevel === EvidenceLevel.CONFLICTING) {
      recommendations.push('Results are mixed - individual response may vary significantly');
    }

    if (confidenceScore < 50) {
      recommendations.push('Consider waiting for more research before use');
    }

    recommendations.push('Consult healthcare provider before starting supplementation');

    return recommendations;
  }
}

export const researchIntegrationSystem = ResearchIntegrationSystem.getInstance();