'use client';

import { ArrowLeft, Brain, Shield, Zap, Heart, Package, Calculator, Target, CheckCircle, BarChart3, Plus, Save, Minus, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { StackProgress } from './components/StackProgress';
import { stackTemplates } from './data/stack-templates';

interface Supplement {
   id: string;
   name: string;
   polishName: string;
   category: string;
   dosage: string;
   timing: string;
   price: string;
   interactions: string[];
   synergies: string[];
   halfLife: string;
   mechanism: string;
   warnings: string[];
   contraindications: string[];
 }

interface StackItem {
  supplement: Supplement;
  customDosage: string;
  customTiming: string;
  notes: string;
}

interface NeuroStack {
  id: string;
  name: string;
  description: string;
  goal: string;
  items: StackItem[];
  totalCost: string;
  cycleLength: string;
  createdAt: Date;
}

const supplements: Supplement[] = [
  {
    id: "l-lysine",
    name: "L-lysine PharmaLysine",
    polishName: "L-lizyna PharmaLysine",
    category: "Aminokwasy",
    dosage: "500-2000mg",
    timing: "Na czczo",
    price: "3.99€",
    interactions: ["arginine"],
    synergies: ["magnesium", "b6"],
    halfLife: "2-3h",
    mechanism: "Prekursor neuroprzekaźników",
    warnings: ["Może nasilać działanie leków przeciwwirusowych"],
    contraindications: ["Ciąża, karmienie piersią - konsultacja lekarska"]
  },
  {
    id: "magnesium-l-threonate",
    name: "Magnesium L-threonate",
    polishName: "Magnez L-treonian",
    category: "Minerały",
    dosage: "1000-2000mg",
    timing: "Wieczorem",
    price: "7.49€",
    interactions: ["calcium", "zinc", "antybiotyki"],
    synergies: ["l-theanine", "melatonin", "vitamin-d"],
    halfLife: "6-8h",
    mechanism: "Przekracza barierę krew-mózg, poprawia neuroplastyczność",
    warnings: ["Może powodować rozluźnienie jelit w dużych dawkach"],
    contraindications: ["Niewydolność nerek", "blok serca"]
  },
  {
    id: "alpha-gpc",
    name: "Alpha-GPC 50%",
    polishName: "Alfa-GPC 50%",
    category: "Cholina",
    dosage: "250-600mg",
    timing: "Rano",
    price: "12.99€",
    interactions: ["antycholinergiki", "leki na alzheimera"],
    synergies: ["huperzine", "l-tyrosine", "uridine"],
    halfLife: "4-6h",
    mechanism: "Zwiększa acetylocholinę, wsparcie pamięci i skupienia",
    warnings: ["Może powodować bóle głowy u niektórych osób"],
    contraindications: ["Choroby układu nerwowego - konsultacja lekarska"]
  },
  {
    id: "l-theanine",
    name: "L-Theanine",
    polishName: "L-teanina",
    category: "Aminokwasy",
    dosage: "100-400mg",
    timing: "Rano/Wieczorem",
    price: "8.99€",
    interactions: ["leki na ciśnienie", "usypiające"],
    synergies: ["caffeine", "magnesium", "ashwagandha"],
    halfLife: "2-5h",
    mechanism: "Zwiększa fale alfa, redukcja stresu bez sedacji",
    warnings: ["Może nasilać działanie leków uspokajających"],
    contraindications: ["Nadciśnienie - monitorowanie ciśnienia"]
  },
  {
    id: "rhodiola",
    name: "Rhodiola Rosea 3%",
    polishName: "Różeniec górski 3%",
    category: "Adaptogeny",
    dosage: "200-600mg",
    timing: "Rano",
    price: "9.99€",
    interactions: ["ssri", "maoi", "leki na cukrzycę"],
    synergies: ["ashwagandha", "b-vitamins", "magnesium"],
    halfLife: "4-6h",
    mechanism: "Moduluje HPA axis, adaptacja do stresu",
    warnings: ["Może nasilać działanie leków przeciwdepresyjnych"],
    contraindications: ["Choroby afektywne dwubiegunowe", "ciśnienie skokowe"]
  },
  {
    id: "ashwagandha-ksm",
    name: "Ashwagandha KSM-66",
    polishName: "Ashwagandha KSM-66",
    category: "Adaptogeny",
    dosage: "300-600mg",
    timing: "Wieczorem",
    price: "15.99€",
    interactions: ["leki tarczycowe", "immunosupresanty", "leki nasenne"],
    synergies: ["rhodiola", "magnesium", "l-theanine"],
    halfLife: "8-12h",
    mechanism: "Redukuje kortyzol, poprawa odporności na stres",
    warnings: ["Może nasilać działanie leków immunosupresyjnych"],
    contraindications: ["Autoimmunologiczne choroby", "niedoczynność tarczycy"]
  },
  {
    id: "bacopa-monnieri",
    name: "Bacopa Monnieri 50%",
    polishName: "Bakopa drobnolistna 50%",
    category: "Zioła ajurwedyjskie",
    dosage: "300-600mg",
    timing: "Z posiłkiem",
    price: "11.99€",
    interactions: ["leki tarczycowe", "leki przeciwdrgawkowe"],
    synergies: ["ginkgo", "lion's-mane", "omega-3"],
    halfLife: "8-12h",
    mechanism: "Poprawa pamięci długotrwałej, neuroprotekcja",
    warnings: ["Wymaga 4-6 tygodni aby zadziałać"],
    contraindications: ["Choroby wątroby", "bradycardia"]
  },
  {
    id: "lion's-mane",
    name: "Lion's Mane 10:1",
    polishName: "Grzyb Mane 10:1",
    category: "Grzyby nootropowe",
    dosage: "500-1000mg",
    timing: "Rano",
    price: "18.99€",
    interactions: ["leki przeciwzakrzepowe"],
    synergies: ["bacopa", "psilocybin-micro", "niacin"],
    halfLife: "24h+",
    mechanism: "Stymuluje NGF, neuroregeneracja",
    warnings: ["Może nasilać działanie leków przeciwzakrzepowych"],
    contraindications: ["Alergie na grzyby", "zabiegi chirurgiczne"]
  },
  {
    id: "n-acetyl-l-tyrosine",
    name: "N-Acetyl-L-Tyrosine",
    polishName: "N-acetylo-L-tyrozyna",
    category: "Aminokwasy",
    dosage: "350-700mg",
    timing: "Rano",
    price: "14.99€",
    interactions: ["leki tarczycowe", "maoi", "leki na parkinsona"],
    synergies: ["alpha-gpc", "rhodiola", "b-vitamins"],
    halfLife: "2-3h",
    mechanism: "Prekursor dopaminy i noradrenaliny",
    warnings: ["Może nasilać działanie leków na tarczycę"],
    contraindications: ["Choroby afektywne dwubiegunowe", "nadciśnienie"]
  },
  {
    id: "phosphatidylserine",
    name: "Phosphatidylserine 50%",
    polishName: "Fosfatydyloseryna 50%",
    category: "Fosfolipidy",
    dosage: "100-300mg",
    timing: "Z posiłkiem",
    price: "16.99€",
    interactions: ["leki przeciwzakrzepowe", "leki na cukrzycę"],
    synergies: ["dha", "ginkgo", "acetyl-l-carnitine"],
    halfLife: "4-6h",
    mechanism: "Wsparcie błon komórkowych, pamięć",
    warnings: ["Może obniżać ciśnienie krwi"],
    contraindications: ["Niskie ciśnienie", "zabiegi chirurgiczne"]
  }
];

const defaultStackTemplates: NeuroStack[] = [
  {
    id: "focus-flow",
    name: "Stack Skupienia i Flow",
    description: "Zoptymalizowany stack dla głębokiego skupienia i produktywności",
    goal: "Zwiększenie koncentracji i wydajności mentalnej",
    items: [
      {
        supplement: supplements[2]!, // Alpha-GPC
        customDosage: "400mg",
        customTiming: "Rano na czczo",
        notes: "Podstawowy nootrop dla pamięci roboczej"
      },
      {
        supplement: supplements[3]!, // L-Theanine
        customDosage: "200mg",
        customTiming: "Z kofeiną",
        notes: "Zbalansowana energia bez stresu"
      },
      {
        supplement: supplements[0]!, // L-Lysine
        customDosage: "1000mg",
        customTiming: "Między posiłkami",
        notes: "Wsparcie dla neuroprzekaźników"
      }
    ],
    totalCost: "25.97€/miesiąc",
    cycleLength: "8 tygodni",
    createdAt: new Date()
  },
  {
    id: "stress-resilience",
    name: "Stack Odporności na Stres",
    description: "Adaptogenny stack dla redukcji stresu i poprawy nastroju",
    goal: "Redukcja stresu i poprawa odporności psychicznej",
    items: [
      {
        supplement: supplements[4]!, // Rhodiola
        customDosage: "400mg",
        customTiming: "Rano na czczo",
        notes: "Adaptogen dla energii i nastroju"
      },
      {
        supplement: supplements[5]!, // Ashwagandha
        customDosage: "500mg",
        customTiming: "Wieczorem",
        notes: "Redukcja kortyzolu i poprawa snu"
      },
      {
        supplement: supplements[1]!, // Magnesium
        customDosage: "1500mg",
        customTiming: "Przed snem",
        notes: "Relaksacja i jakość snu"
      }
    ],
    totalCost: "33.47€/miesiąc",
    cycleLength: "12 tygodni",
    createdAt: new Date()
  }
];


/**
 *
 */
export default function StackBuilderPage() {
  const [currentStack, setCurrentStack] = useState<NeuroStack>({
    id: "custom-" + Date.now(),
    name: "Mój Stack",
    description: "Spersonalizowany stack neuroregulacyjny",
    goal: "",
    items: [],
    totalCost: "0€",
    cycleLength: "4 tygodnie",
    createdAt: new Date()
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'analysis' | 'progress'>('builder');

  const totalDailyCost = useMemo(() => {
    const total = currentStack.items.reduce((sum, item) => {
      const price = parseFloat(item.supplement.price.replace('€', ''));
      return sum + price;
    }, 0);
    return total.toFixed(2) + "€/dzień";
  }, [currentStack.items]);

  const interactions = useMemo(() => {
    const allInteractions: string[] = [];
    const supplementsInStack = currentStack.items.map(item => item.supplement);
    
    supplementsInStack.forEach(supplement => {
      supplement.interactions.forEach(interaction => {
        if (supplementsInStack.some(s => s.id === interaction || s.name.toLowerCase().includes(interaction))) {
          allInteractions.push(`${supplement.polishName} → ${interaction}`);
        }
      });
    });
    
    return allInteractions;
  }, [currentStack.items]);

  const synergies = useMemo(() => {
    const allSynergies: string[] = [];
    const supplementsInStack = currentStack.items.map(item => item.supplement);
    
    supplementsInStack.forEach(supplement => {
      supplement.synergies.forEach(synergy => {
        if (supplementsInStack.some(s => s.id === synergy || s.name.toLowerCase().includes(synergy))) {
          allSynergies.push(`${supplement.polishName} ↔ ${synergy}`);
        }
      });
    });
    
    return allSynergies;
  }, [currentStack.items]);

  const addSupplement = (supplement: Supplement) => {
    const newItem: StackItem = {
      supplement,
      customDosage: supplement.dosage,
      customTiming: supplement.timing,
      notes: ""
    };
    
    setCurrentStack(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeSupplement = (index: number) => {
    setCurrentStack(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateStackItem = (index: number, field: keyof StackItem, value: string) => {
    setCurrentStack(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const loadTemplate = (templateId: string) => {
    const template = stackTemplates.find(t => t.id === templateId);
    if (template) {
      setCurrentStack({
        ...template,
        id: "custom-" + Date.now(),
        name: template.name + " (kopia)",
        createdAt: new Date()
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Nootropy": return <Brain className="h-4 w-4" />;
      case "Adaptogeny": return <Shield className="h-4 w-4" />;
      case "Aminokwasy": return <Zap className="h-4 w-4" />;
      case "Minerały": return <Heart className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powrót do strony głównej
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kreator Stacków Neuroregulacyjnych</h1>
          <p className="text-lg text-gray-600">
            Zbuduj spersonalizowany stack suplementów dla Twoich celów neuroregulacyjnych
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'builder', label: 'Kreator', icon: <Calculator className="h-4 w-4" /> },
                { id: 'templates', label: 'Szablony', icon: <Target className="h-4 w-4" /> },
                { id: 'analysis', label: 'Analiza', icon: <CheckCircle className="h-4 w-4" /> },
                { id: 'progress', label: 'Postęp', icon: <BarChart3 className="h-4 w-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Builder Tab */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Supplements */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Dostępne Suplementy</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                  {supplements.map(supplement => (
                    <div key={supplement.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{supplement.polishName}</h4>
                          <p className="text-sm text-gray-600">{supplement.category}</p>
                          <p className="text-sm font-medium text-green-600">{supplement.price}</p>
                        </div>
                        <Button
                          onClick={() => addSupplement(supplement)}
                          size="sm"
                          variant="default"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

            </Card>
            </div>

            {/* Current Stack */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Twój Stack</CardTitle>
                      <CardDescription>{currentStack.items.length} suplementów • {totalDailyCost}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="default">
                        <Save className="h-4 w-4 mr-1" />
                        Zapisz
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>

                {currentStack.items.length === 0 ? (
                  <div className="text-center py-12">
                    <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Dodaj suplementy aby zbudować swój stack</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentStack.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.supplement.polishName}</h4>
                            <p className="text-sm text-gray-600">{item.supplement.category}</p>
                          </div>
                          <button
                            onClick={() => removeSupplement(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dawka</label>
                            <input
                              type="text"
                              value={item.customDosage}
                              onChange={(e) => updateStackItem(index, 'customDosage', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Czas</label>
                            <input
                              type="text"
                              value={item.customTiming}
                              onChange={(e) => updateStackItem(index, 'customTiming', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notatki</label>
                          <textarea
                            value={item.notes}
                            onChange={(e) => updateStackItem(index, 'notes', e.target.value)}
                            className="w-full border rounded px-2 py-1 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defaultStackTemplates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {template.items.length} suplementów
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Target className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{template.goal}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{template.cycleLength}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium">{template.totalCost}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skład stacka:</h4>
                  <div className="space-y-1">
                    {template.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {item.supplement.polishName} - {item.customDosage}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    loadTemplate(template.id);
                    setActiveTab('builder');
                  }}
                  className="w-full"
                >
                  Użyj szablonu
                </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Interactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Interakcje
                </CardTitle>
              </CardHeader>
              <CardContent>
              {interactions.length > 0 ? (
                <div className="space-y-2">
                  {interactions.map((interaction, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm text-red-800">{interaction}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Brak wykrytych interakcji</p>
              )}
              </CardContent>
            </Card>

            {/* Synergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Synergia
                </CardTitle>
              </CardHeader>
              <CardContent>
              {synergies.length > 0 ? (
                <div className="space-y-2">
                  {synergies.map((synergy, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm text-green-800">{synergy}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Brak wykrytych synergii</p>
              )}
              </CardContent>
            </Card>

            {/* Daily Schedule */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Plan dnia
                </CardTitle>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Rano (na czczo)</h4>
                  {currentStack.items.filter(item => item.customTiming.toLowerCase().includes('rano') || item.customTiming.toLowerCase().includes('czczo')).map((item, index) => (
                    <div key={index} className="text-sm text-blue-800 mb-1">
                      • {item.supplement.polishName} - {item.customDosage}
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 rounded p-4">
                  <h4 className="font-medium text-green-900 mb-2">Z posiłkiem</h4>
                  {currentStack.items.filter(item => item.customTiming.toLowerCase().includes('posiłkiem')).map((item, index) => (
                    <div key={index} className="text-sm text-green-800 mb-1">
                      • {item.supplement.polishName} - {item.customDosage}
                    </div>
                  ))}
                </div>
                <div className="bg-purple-50 rounded p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Wieczorem</h4>
                  {currentStack.items.filter(item => item.customTiming.toLowerCase().includes('wieczorem') || item.customTiming.toLowerCase().includes('snem')).map((item, index) => (
                    <div key={index} className="text-sm text-purple-800 mb-1">
                      • {item.supplement.polishName} - {item.customDosage}
                    </div>
                  ))}
                </div>
              </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <StackProgress
              stackId={currentStack.id}
              stackName={currentStack.name}
              totalDays={parseInt(currentStack.cycleLength) || 28}
            />
          </div>
        )}
      </div>
    </div>
  );
}