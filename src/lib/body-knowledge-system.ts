import { BodySystem, MechanismOfAction, EnhancedSupplement } from '@/types/enhanced-supplement';
import { advancedDebugger, DebugCategory } from './advanced-debugging';

export interface BodySystemInfo {
  id: BodySystem;
  name: string;
  description: string;
  primaryFunctions: string[];
  keyOrgans: OrganInfo[];
  commonIssues: string[];
  keyBiomarkers: string[];
  supplementEffects: SupplementSystemEffect[];
  learningModules: LearningModule[];
}

export interface OrganInfo {
  name: string;
  function: string;
  location: string;
  commonIssues: string[];
  keyNutrients: string[];
  supplementSupport: string[];
}

export interface SupplementSystemEffect {
  supplementId: string;
  supplementName: string;
  effects: string[];
  mechanisms: MechanismOfAction[];
  timeframe: string;
  evidenceLevel: 'strong' | 'moderate' | 'weak' | 'theoretical';
  researchLinks: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  type: 'anatomy' | 'physiology' | 'pathology' | 'nutrition' | 'supplementation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // e.g., "10 minutes"
  prerequisites: string[];
  content: ModuleContent;
  quiz: QuizQuestion[];
  resources: string[];
}

export interface ModuleContent {
  introduction: string;
  sections: ContentSection[];
  keyTakeaways: string[];
  practicalTips: string[];
}

export interface ContentSection {
  title: string;
  content: string;
  illustrations?: string[];
  interactiveElements?: InteractiveElement[];
}

export interface InteractiveElement {
  type: 'diagram' | 'animation' | 'calculator' | 'simulation';
  title: string;
  description: string;
  data?: any;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface UserProgress {
  userId: string;
  completedModules: string[];
  quizScores: { moduleId: string; score: number; completedAt: Date }[];
  learningPath: string[];
  preferences: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    focusAreas: BodySystem[];
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'knowledge' | 'consistency' | 'application' | 'mastery';
}

class BodyKnowledgeSystem {
  private static instance: BodyKnowledgeSystem;
  private systemsDatabase: Map<BodySystem, BodySystemInfo> = new Map();
  private learningModules: Map<string, LearningModule> = new Map();
  
  static getInstance(): BodyKnowledgeSystem {
    if (!BodyKnowledgeSystem.instance) {
      BodyKnowledgeSystem.instance = new BodyKnowledgeSystem();
    }
    return BodyKnowledgeSystem.instance;
  }

  private constructor() {
    this.initializeBodySystems();
    this.initializeLearningModules();
  }

  private initializeBodySystems() {
    // Nervous System
    this.systemsDatabase.set(BodySystem.NERVOUS, {
      id: BodySystem.NERVOUS,
      name: 'Nervous System',
      description: 'The body\'s control center, responsible for processing information, coordinating movement, and regulating bodily functions.',
      primaryFunctions: [
        'Information processing and integration',
        'Motor control and coordination', 
        'Sensory perception',
        'Memory formation and recall',
        'Emotional regulation',
        'Autonomic function control'
      ],
      keyOrgans: [
        {
          name: 'Brain',
          function: 'Central processing unit for thoughts, emotions, memory, and motor control',
          location: 'Skull cavity',
          commonIssues: ['Cognitive decline', 'Depression', 'Anxiety', 'Memory problems'],
          keyNutrients: ['Omega-3 fatty acids', 'B-vitamins', 'Choline', 'Magnesium'],
          supplementSupport: ['Lion\'s Mane', 'Bacopa Monnieri', 'Phosphatidylserine', 'Alpha-GPC']
        },
        {
          name: 'Spinal Cord',
          function: 'Information highway between brain and peripheral nervous system',
          location: 'Vertebral column',
          commonIssues: ['Nerve compression', 'Inflammation', 'Degenerative changes'],
          keyNutrients: ['B12', 'Folate', 'Alpha-lipoic acid'],
          supplementSupport: ['Curcumin', 'Alpha-lipoic acid', 'B-complex']
        }
      ],
      commonIssues: [
        'Cognitive decline',
        'Memory problems', 
        'Anxiety and depression',
        'Sleep disorders',
        'Neurodegenerative diseases'
      ],
      keyBiomarkers: [
        'BDNF (Brain-derived neurotrophic factor)',
        'Acetylcholine levels',
        'Dopamine metabolites',
        'Cortisol levels',
        'Inflammatory markers (CRP, IL-6)'
      ],
      supplementEffects: [
        {
          supplementId: 'alpha-gpc',
          supplementName: 'Alpha-GPC',
          effects: ['Increases acetylcholine production', 'Enhances memory formation', 'Improves focus'],
          mechanisms: [MechanismOfAction.NEUROTRANSMITTER_MODULATION],
          timeframe: '30-60 minutes onset, 2-8 weeks for sustained benefits',
          evidenceLevel: 'strong',
          researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/21030620/']
        },
        {
          supplementId: 'lions-mane',
          supplementName: 'Lion\'s Mane Mushroom',
          effects: ['Stimulates NGF production', 'Promotes neurogenesis', 'Supports neuroplasticity'],
          mechanisms: [MechanismOfAction.GENE_EXPRESSION],
          timeframe: '2-8 weeks for noticeable cognitive benefits',
          evidenceLevel: 'moderate',
          researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/24266378/']
        }
      ],
      learningModules: []
    });

    // Cardiovascular System
    this.systemsDatabase.set(BodySystem.CARDIOVASCULAR, {
      id: BodySystem.CARDIOVASCULAR,
      name: 'Cardiovascular System',
      description: 'The heart and blood vessels that pump and circulate blood throughout the body, delivering oxygen and nutrients.',
      primaryFunctions: [
        'Blood circulation',
        'Oxygen and nutrient delivery',
        'Waste product removal',
        'Temperature regulation',
        'Immune system support',
        'Hormone transport'
      ],
      keyOrgans: [
        {
          name: 'Heart',
          function: 'Muscular pump that circulates blood throughout the body',
          location: 'Chest cavity, slightly left of center',
          commonIssues: ['Arrhythmias', 'Heart disease', 'High blood pressure', 'Heart failure'],
          keyNutrients: ['CoQ10', 'Magnesium', 'Potassium', 'Omega-3 fatty acids'],
          supplementSupport: ['Hawthorn', 'Coenzyme Q10', 'Magnesium', 'Garlic']
        },
        {
          name: 'Blood Vessels',
          function: 'Network of arteries, veins, and capillaries that transport blood',
          location: 'Throughout the entire body',
          commonIssues: ['Atherosclerosis', 'Poor circulation', 'Varicose veins', 'Blood clots'],
          keyNutrients: ['Vitamin C', 'Vitamin E', 'Nitric oxide precursors'],
          supplementSupport: ['L-Arginine', 'Beetroot extract', 'Ginkgo Biloba']
        }
      ],
      commonIssues: [
        'High blood pressure',
        'High cholesterol',
        'Poor circulation',
        'Heart rhythm disorders',
        'Atherosclerosis'
      ],
      keyBiomarkers: [
        'Blood pressure',
        'Cholesterol levels (LDL, HDL, Total)',
        'Triglycerides',
        'C-reactive protein (CRP)',
        'Homocysteine',
        'BNP (B-type natriuretic peptide)'
      ],
      supplementEffects: [
        {
          supplementId: 'coq10',
          supplementName: 'Coenzyme Q10',
          effects: ['Improves heart muscle function', 'Reduces oxidative stress', 'May lower blood pressure'],
          mechanisms: [MechanismOfAction.ANTIOXIDANT, MechanismOfAction.METABOLIC_ENHANCEMENT],
          timeframe: '4-12 weeks for cardiovascular benefits',
          evidenceLevel: 'strong',
          researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/28914794/']
        }
      ],
      learningModules: []
    });

    // Digestive System
    this.systemsDatabase.set(BodySystem.DIGESTIVE, {
      id: BodySystem.DIGESTIVE,
      name: 'Digestive System',
      description: 'The organs responsible for breaking down food, absorbing nutrients, and eliminating waste.',
      primaryFunctions: [
        'Food digestion and breakdown',
        'Nutrient absorption',
        'Waste elimination',
        'Immune system support (gut-associated lymphoid tissue)',
        'Neurotransmitter production',
        'Microbiome maintenance'
      ],
      keyOrgans: [
        {
          name: 'Stomach',
          function: 'Breaks down food with acid and enzymes',
          location: 'Upper left abdomen',
          commonIssues: ['Acid reflux', 'Ulcers', 'Gastritis', 'Low stomach acid'],
          keyNutrients: ['B12', 'Intrinsic factor', 'Zinc'],
          supplementSupport: ['Digestive enzymes', 'Probiotics', 'L-Glutamine']
        },
        {
          name: 'Small Intestine',
          function: 'Primary site of nutrient absorption',
          location: 'Abdominal cavity',
          commonIssues: ['Leaky gut', 'SIBO', 'Malabsorption', 'Food sensitivities'],
          keyNutrients: ['All vitamins and minerals', 'Amino acids', 'Fatty acids'],
          supplementSupport: ['Probiotics', 'L-Glutamine', 'Digestive enzymes']
        }
      ],
      commonIssues: [
        'Digestive disorders',
        'Food intolerances',
        'Inflammatory bowel conditions',
        'Microbiome imbalances',
        'Malabsorption syndromes'
      ],
      keyBiomarkers: [
        'Inflammatory markers (Calprotectin, Lactoferrin)',
        'Digestive enzyme levels',
        'Microbiome diversity',
        'Intestinal permeability markers',
        'SCFA (Short-chain fatty acids)'
      ],
      supplementEffects: [
        {
          supplementId: 'probiotics',
          supplementName: 'Probiotics',
          effects: ['Improves gut microbiome', 'Enhances immune function', 'Reduces inflammation'],
          mechanisms: [MechanismOfAction.ANTI_INFLAMMATORY],
          timeframe: '2-4 weeks for microbiome changes',
          evidenceLevel: 'strong',
          researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/28539734/']
        }
      ],
      learningModules: []
    });

    // Add more body systems...
    this.initializeRemainingBodySystems();
  }

  private initializeRemainingBodySystems() {
    // Immune System
    this.systemsDatabase.set(BodySystem.IMMUNE, {
      id: BodySystem.IMMUNE,
      name: 'Immune System',
      description: 'The body\'s defense network that protects against pathogens, toxins, and abnormal cells.',
      primaryFunctions: [
        'Pathogen recognition and elimination',
        'Immune memory formation',
        'Inflammatory response regulation',
        'Tissue repair and healing',
        'Cancer cell surveillance',
        'Autoimmune regulation'
      ],
      keyOrgans: [
        {
          name: 'Thymus',
          function: 'T-cell maturation and training',
          location: 'Upper chest, behind sternum',
          commonIssues: ['Age-related shrinkage', 'Compromised T-cell function'],
          keyNutrients: ['Zinc', 'Vitamin C', 'Vitamin D'],
          supplementSupport: ['Zinc', 'Elderberry', 'Astragalus']
        },
        {
          name: 'Bone Marrow',
          function: 'Production of immune cells',
          location: 'Inside bones',
          commonIssues: ['Decreased production with age', 'Nutrient deficiencies'],
          keyNutrients: ['Iron', 'B12', 'Folate'],
          supplementSupport: ['Colostrum', 'Beta-glucans', 'Medicinal mushrooms']
        }
      ],
      commonIssues: [
        'Frequent infections',
        'Autoimmune conditions',
        'Chronic inflammation',
        'Allergies and sensitivities',
        'Slow wound healing'
      ],
      keyBiomarkers: [
        'White blood cell count and differential',
        'Immunoglobulin levels (IgA, IgG, IgM)',
        'Inflammatory markers (CRP, ESR)',
        'Cytokine levels',
        'NK cell activity'
      ],
      supplementEffects: [
        {
          supplementId: 'vitamin-d',
          supplementName: 'Vitamin D',
          effects: ['Modulates immune response', 'Reduces autoimmune risk', 'Enhances pathogen resistance'],
          mechanisms: [MechanismOfAction.GENE_EXPRESSION, MechanismOfAction.RECEPTOR_AGONISM],
          timeframe: '2-8 weeks for immune modulation',
          evidenceLevel: 'strong',
          researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/25803928/']
        }
      ],
      learningModules: []
    });

    // Add remaining systems (Endocrine, Musculoskeletal, etc.) with similar detail...
  }

  private initializeLearningModules() {
    // Nervous System Basics
    const nervousSystemBasics: LearningModule = {
      id: 'nervous-system-basics',
      title: 'Nervous System Fundamentals',
      type: 'anatomy',
      difficulty: 'beginner',
      estimatedTime: '15 minutes',
      prerequisites: [],
      content: {
        introduction: 'Learn about the basic structure and function of your nervous system, the body\'s control center.',
        sections: [
          {
            title: 'Overview of the Nervous System',
            content: 'The nervous system is divided into two main parts: the central nervous system (CNS) consisting of the brain and spinal cord, and the peripheral nervous system (PNS) consisting of all nerves outside the CNS.',
            illustrations: ['/images/nervous-system-overview.svg'],
            interactiveElements: [
              {
                type: 'diagram',
                title: 'Interactive Nervous System Map',
                description: 'Click on different parts to learn their functions',
                data: { components: ['brain', 'spinal-cord', 'peripheral-nerves'] }
              }
            ]
          },
          {
            title: 'Neurotransmitters and Communication',
            content: 'Neurons communicate through chemical messengers called neurotransmitters. Key neurotransmitters include acetylcholine, dopamine, serotonin, and GABA, each with specific functions.',
            illustrations: ['/images/neurotransmitter-synapse.svg']
          },
          {
            title: 'Brain Regions and Functions',
            content: 'Different brain regions have specialized functions: the prefrontal cortex for executive function, hippocampus for memory, and cerebellum for balance and coordination.',
            illustrations: ['/images/brain-regions.svg']
          }
        ],
        keyTakeaways: [
          'The nervous system controls all body functions',
          'Neurotransmitters enable communication between neurons',
          'Different brain regions have specialized functions',
          'The nervous system can be supported through proper nutrition'
        ],
        practicalTips: [
          'Maintain a regular sleep schedule for optimal brain function',
          'Exercise regularly to promote neuroplasticity',
          'Practice mindfulness to reduce stress on the nervous system',
          'Consider supplements like omega-3s for brain health'
        ]
      },
      quiz: [
        {
          id: 'ns-q1',
          question: 'What are the two main divisions of the nervous system?',
          type: 'multiple_choice',
          options: [
            'Central and peripheral',
            'Sympathetic and parasympathetic', 
            'Motor and sensory',
            'Conscious and unconscious'
          ],
          correctAnswer: 'Central and peripheral',
          explanation: 'The nervous system is divided into the central nervous system (brain and spinal cord) and the peripheral nervous system (all other nerves).'
        },
        {
          id: 'ns-q2',
          question: 'Which neurotransmitter is primarily involved in memory and learning?',
          type: 'multiple_choice',
          options: ['Dopamine', 'Serotonin', 'Acetylcholine', 'GABA'],
          correctAnswer: 'Acetylcholine',
          explanation: 'Acetylcholine is the primary neurotransmitter involved in learning, memory formation, and attention.'
        }
      ],
      resources: [
        'https://www.ninds.nih.gov/health-information/public-education/brain-basics',
        'https://pubmed.ncbi.nlm.nih.gov/neuroplasticity-reviews'
      ]
    };

    this.learningModules.set('nervous-system-basics', nervousSystemBasics);

    // Supplement Mechanisms Module
    const supplementMechanisms: LearningModule = {
      id: 'supplement-mechanisms',
      title: 'How Supplements Affect Your Body',
      type: 'supplementation',
      difficulty: 'intermediate',
      estimatedTime: '20 minutes',
      prerequisites: ['nervous-system-basics'],
      content: {
        introduction: 'Understand the various ways supplements interact with your body systems to produce their effects.',
        sections: [
          {
            title: 'Mechanisms of Action',
            content: 'Supplements work through various mechanisms including enzyme modulation, receptor interactions, antioxidant activity, and gene expression changes.',
            interactiveElements: [
              {
                type: 'animation',
                title: 'Supplement Absorption Animation',
                description: 'See how supplements move through your digestive system',
                data: {}
              }
            ]
          },
          {
            title: 'Bioavailability and Absorption',
            content: 'Not all supplements are absorbed equally. Factors affecting bioavailability include formulation, timing, and individual factors.',
            interactiveElements: [
              {
                type: 'calculator',
                title: 'Bioavailability Calculator',
                description: 'Calculate effective doses based on bioavailability',
                data: {}
              }
            ]
          }
        ],
        keyTakeaways: [
          'Supplements work through multiple mechanisms',
          'Bioavailability affects supplement effectiveness',
          'Timing and formulation matter',
          'Individual factors influence response'
        ],
        practicalTips: [
          'Take fat-soluble vitamins with meals',
          'Space out mineral supplements to avoid competition',
          'Consider bioavailable forms of supplements',
          'Track your response to optimize timing and dosage'
        ]
      },
      quiz: [
        {
          id: 'sm-q1',
          question: 'What is bioavailability?',
          type: 'short_answer',
          correctAnswer: 'The proportion of a supplement that enters circulation and can have an active effect',
          explanation: 'Bioavailability refers to how much of an ingested supplement actually reaches the bloodstream in an active form.'
        }
      ],
      resources: []
    };

    this.learningModules.set('supplement-mechanisms', supplementMechanisms);
  }

  /**
   * Gets comprehensive information about a body system
   */
  public getBodySystemInfo(system: BodySystem): BodySystemInfo | null {
    advancedDebugger.info(DebugCategory.API, 'Fetching body system info', { system });
    return this.systemsDatabase.get(system) || null;
  }

  /**
   * Gets learning modules for a specific body system
   */
  public getSystemLearningModules(system: BodySystem): LearningModule[] {
    const systemInfo = this.systemsDatabase.get(system);
    if (!systemInfo) return [];
    
    return systemInfo.learningModules;
  }

  /**
   * Gets all available learning modules
   */
  public getAllLearningModules(): LearningModule[] {
    return Array.from(this.learningModules.values());
  }

  /**
   * Gets a specific learning module
   */
  public getLearningModule(moduleId: string): LearningModule | null {
    return this.learningModules.get(moduleId) || null;
  }

  /**
   * Gets personalized learning path based on user interests and current knowledge
   */
  public generatePersonalizedLearningPath(
    userInterests: BodySystem[],
    currentKnowledgeLevel: 'beginner' | 'intermediate' | 'advanced',
    focusAreas: ('anatomy' | 'physiology' | 'supplementation')[]
  ): LearningModule[] {
    advancedDebugger.info(DebugCategory.AI, 'Generating personalized learning path', {
      interests: userInterests,
      level: currentKnowledgeLevel,
      focusAreas
    });

    const allModules = this.getAllLearningModules();
    const relevantModules = allModules.filter(module => {
      // Filter by difficulty level
      const levelMatch = this.isAppropriateLevel(module.difficulty, currentKnowledgeLevel);
      
      // Filter by focus areas
      const focusMatch = focusAreas.includes(module.type);
      
      // Filter by user interests (check if module relates to user's interested body systems)
      const interestMatch = this.moduleMatchesInterests(module, userInterests);
      
      return levelMatch && focusMatch && interestMatch;
    });

    // Sort by prerequisites and logical progression
    return this.sortModulesByProgression(relevantModules);
  }

  /**
   * Tracks user progress through learning modules
   */
  public updateUserProgress(
    userId: string,
    moduleId: string,
    quizScore?: number
  ): UserProgress {
    // This would typically interact with a database
    // For now, return a mock progress object
    const progress: UserProgress = {
      userId,
      completedModules: [moduleId],
      quizScores: quizScore ? [{ moduleId, score: quizScore, completedAt: new Date() }] : [],
      learningPath: [],
      preferences: {
        difficulty: 'beginner',
        focusAreas: [BodySystem.NERVOUS],
        learningStyle: 'visual'
      },
      achievements: this.checkForNewAchievements(userId, moduleId, quizScore)
    };

    advancedDebugger.info(DebugCategory.USER_INTERACTION, 'Updated user learning progress', {
      userId,
      moduleId,
      score: quizScore
    });

    return progress;
  }

  /**
   * Gets supplement effects on specific body systems
   */
  public getSupplementEffectsOnSystem(
    system: BodySystem, 
    supplements: EnhancedSupplement[]
  ): SupplementSystemEffect[] {
    const systemInfo = this.systemsDatabase.get(system);
    if (!systemInfo) return [];

    return systemInfo.supplementEffects.filter(effect =>
      supplements.some(supp => supp.id === effect.supplementId)
    );
  }

  /**
   * Analyzes how a supplement stack affects different body systems
   */
  public analyzeStackSystemEffects(supplements: EnhancedSupplement[]): {
    system: BodySystem;
    totalEffects: number;
    positiveEffects: string[];
    mechanisms: MechanismOfAction[];
    evidenceLevel: 'strong' | 'moderate' | 'weak';
  }[] {
    const systemEffects: Map<BodySystem, {
      effects: string[];
      mechanisms: Set<MechanismOfAction>;
      evidenceLevels: string[];
    }> = new Map();

    // Analyze each supplement's effects on body systems
    supplements.forEach(supplement => {
      supplement.targetSystems.forEach(system => {
        if (!systemEffects.has(system)) {
          systemEffects.set(system, {
            effects: [],
            mechanisms: new Set(),
            evidenceLevels: []
          });
        }

        const systemData = systemEffects.get(system)!;
        systemData.effects.push(...supplement.primaryEffects);
        supplement.mechanismsOfAction.forEach(mech => systemData.mechanisms.add(mech));
        systemData.evidenceLevels.push(supplement.evidenceLevel);
      });
    });

    // Convert to analysis format
    return Array.from(systemEffects.entries()).map(([system, data]) => ({
      system,
      totalEffects: data.effects.length,
      positiveEffects: [...new Set(data.effects)], // Remove duplicates
      mechanisms: Array.from(data.mechanisms),
      evidenceLevel: this.calculateOverallEvidenceLevel(data.evidenceLevels)
    }));
  }

  private isAppropriateLevel(
    moduleLevel: 'beginner' | 'intermediate' | 'advanced',
    userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): boolean {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const moduleIndex = levels.indexOf(moduleLevel);
    const userIndex = levels.indexOf(userLevel);
    
    // Allow modules at user's level or one level above
    return moduleIndex <= userIndex + 1;
  }

  private moduleMatchesInterests(module: LearningModule, interests: BodySystem[]): boolean {
    // This would check if the module content relates to user's interested body systems
    // For now, return true for all modules
    return true;
  }

  private sortModulesByProgression(modules: LearningModule[]): LearningModule[] {
    // Sort modules to ensure prerequisites come first
    const sorted: LearningModule[] = [];
    const remaining = [...modules];

    while (remaining.length > 0) {
      const canAdd = remaining.filter(module =>
        module.prerequisites.every(prereq =>
          sorted.some(added => added.id === prereq)
        )
      );

      if (canAdd.length === 0) break; // Prevent infinite loop

      // Add modules with satisfied prerequisites
      canAdd.forEach(module => {
        sorted.push(module);
        const index = remaining.indexOf(module);
        remaining.splice(index, 1);
      });
    }

    return sorted;
  }

  private checkForNewAchievements(
    userId: string,
    moduleId: string,
    quizScore?: number
  ): Achievement[] {
    const achievements: Achievement[] = [];

    // First module completion
    if (moduleId === 'nervous-system-basics') {
      achievements.push({
        id: 'first-steps',
        title: 'First Steps',
        description: 'Completed your first learning module',
        icon: '🎓',
        unlockedAt: new Date(),
        category: 'knowledge'
      });
    }

    // Perfect quiz score
    if (quizScore === 100) {
      achievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieved a perfect score on a quiz',
        icon: '💯',
        unlockedAt: new Date(),
        category: 'mastery'
      });
    }

    return achievements;
  }

  private calculateOverallEvidenceLevel(evidenceLevels: string[]): 'strong' | 'moderate' | 'weak' {
    const counts = evidenceLevels.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if ((counts.strong || 0) >= (counts.moderate || 0) + (counts.weak || 0)) {
      return 'strong';
    } else if ((counts.moderate || 0) > (counts.weak || 0)) {
      return 'moderate';
    } else {
      return 'weak';
    }
  }
}

export const bodyKnowledgeSystem = BodyKnowledgeSystem.getInstance();