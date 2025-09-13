'use client';

import {
  Brain,
  Network,
  Share2,
  TrendingUp,
  Activity,
  Target,
  Zap,
  Heart,
  Shield,
  Lightbulb,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Eye,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  Settings,
  Download,
  Info
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';


interface KnowledgeNode {
  id: string;
  label: string;
  category: string;
  type: 'concept' | 'mechanism' | 'supplement' | 'protocol' | 'research';
  importance: number;
  connections: string[];
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  color?: string;
  size?: number;
}

interface KnowledgeConnection {
  source: string;
  target: string;
  type: 'related' | 'prerequisite' | 'mechanism' | 'evidence';
  strength: number;
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  importance: number;
  description: string;
  relatedNodes: string[];
}

interface NetworkMetrics {
  totalNodes: number;
  totalConnections: number;
  averageDegree: number;
  clusteringCoefficient: number;
  density: number;
}

const knowledgeNodes: KnowledgeNode[] = [
  {
    id: 'neuroplasticity',
    label: 'Neuroplastyczność',
    category: 'Neurobiologia',
    type: 'concept',
    importance: 95,
    connections: ['bdnf', 'neurogenesis', 'synaptic-plasticity', 'lions-mane', 'exercise']
  },
  {
    id: 'bdnf',
    label: 'BDNF',
    category: 'Neurotrofiny',
    type: 'mechanism',
    importance: 90,
    connections: ['neuroplasticity', 'exercise', 'omega-3', 'curcumin']
  },
  {
    id: 'omega-3',
    label: 'Omega-3 (DHA/EPA)',
    category: 'Suplementy',
    type: 'supplement',
    importance: 85,
    connections: ['bdnf', 'neuroplasticity', 'memory', 'inflammation', 'mood']
  },
  {
    id: 'lions-mane',
    label: 'Lion\'s Mane',
    category: 'Suplementy',
    type: 'supplement',
    importance: 80,
    connections: ['ngf', 'neurogenesis', 'memory', 'focus']
  },
  {
    id: 'ngf',
    label: 'NGF',
    category: 'Neurotrofiny',
    type: 'mechanism',
    importance: 75,
    connections: ['lions-mane', 'neurogenesis', 'nerve-regeneration']
  },
  {
    id: 'memory',
    label: 'Pamięć',
    category: 'Funkcje poznawcze',
    type: 'concept',
    importance: 90,
    connections: ['hippocampus', 'acetylcholine', 'omega-3', 'lions-mane', 'sleep']
  },
  {
    id: 'acetylcholine',
    label: 'Acetylocholina',
    category: 'Neuroprzekaźniki',
    type: 'mechanism',
    importance: 85,
    connections: ['memory', 'focus', 'alpha-gpc', 'huperzine-a']
  },
  {
    id: 'alpha-gpc',
    label: 'Alpha-GPC',
    category: 'Suplementy',
    type: 'supplement',
    importance: 75,
    connections: ['acetylcholine', 'memory', 'focus', 'citicoline']
  },
  {
    id: 'sleep',
    label: 'Sen',
    category: 'Lifestyle',
    type: 'protocol',
    importance: 95,
    connections: ['memory', 'neuroplasticity', 'melatonin', 'circadian-rhythm']
  },
  {
    id: 'circadian-rhythm',
    label: 'Rytm dobowy',
    category: 'Lifestyle',
    type: 'protocol',
    importance: 80,
    connections: ['sleep', 'cortisol', 'melatonin', 'performance']
  }
];

const connections: KnowledgeConnection[] = [
  { source: 'neuroplasticity', target: 'bdnf', type: 'mechanism', strength: 0.9 },
  { source: 'bdnf', target: 'omega-3', type: 'evidence', strength: 0.8 },
  { source: 'lions-mane', target: 'ngf', type: 'mechanism', strength: 0.85 },
  { source: 'memory', target: 'acetylcholine', type: 'mechanism', strength: 0.9 },
  { source: 'sleep', target: 'memory', type: 'related', strength: 0.95 },
  { source: 'circadian-rhythm', target: 'sleep', type: 'prerequisite', strength: 0.8 }
];

const timelineEvents: TimelineEvent[] = [
  {
    id: 'neuroplasticity-discovery',
    title: 'Odkrycie neuroplastyczności',
    date: '1960',
    category: 'Badania',
    importance: 95,
    description: 'Rewolucyjne odkrycie, że mózg dorosły może się zmieniać',
    relatedNodes: ['neuroplasticity', 'research']
  },
  {
    id: 'bdnf-identification',
    title: 'Identyfikacja BDNF',
    date: '1989',
    category: 'Badania',
    importance: 90,
    description: 'Odkrycie czynnika neurotroficznego pochodzenia mózgowego',
    relatedNodes: ['bdnf', 'neuroplasticity']
  },
  {
    id: 'omega-3-brain-research',
    title: 'Badania Omega-3 i mózgu',
    date: '2000',
    category: 'Suplementy',
    importance: 85,
    description: 'Pierwsze badania kliniczne wpływu Omega-3 na funkcje poznawcze',
    relatedNodes: ['omega-3', 'memory', 'research']
  },
  {
    id: 'lions-mane-studies',
    title: 'Badania Lion\'s Mane',
    date: '2009',
    category: 'Suplementy',
    importance: 80,
    description: 'Badania kliniczne potwierdzające działanie Lion\'s Mane',
    relatedNodes: ['lions-mane', 'ngf', 'memory']
  }
];

export function InteractiveKnowledgeVisualizations() {
  const [activeTab, setActiveTab] = useState('network');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [importanceThreshold, setImportanceThreshold] = useState([0, 100]);
  const [showLabels, setShowLabels] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter nodes based on criteria
  const filteredNodes = useMemo(() => {
    return knowledgeNodes.filter(node => {
      const categoryMatch = selectedCategory === 'all' || node.category === selectedCategory;
      const typeMatch = selectedType === 'all' || node.type === selectedType;
      const importanceMatch = (node?.importance ?? 0) >= (importanceThreshold?.[0] ?? 0) && (node?.importance ?? 0) <= (importanceThreshold?.[1] ?? 100);
      return categoryMatch && typeMatch && importanceMatch;
    });
  }, [selectedCategory, selectedType, importanceThreshold]);

  // Calculate network metrics
  const networkMetrics = useMemo((): NetworkMetrics => {
    const totalNodes = filteredNodes.length;
    const totalConnections = connections.filter(conn => 
      filteredNodes.some(n => n.id === conn.source) && 
      filteredNodes.some(n => n.id === conn.target)
    ).length;
    
    const averageDegree = totalNodes > 0 ? (totalConnections * 2) / totalNodes : 0;
    const density = totalNodes > 1 ? (totalConnections * 2) / (totalNodes * (totalNodes - 1)) : 0;
    
    return {
      totalNodes,
      totalConnections,
      averageDegree,
      clusteringCoefficient: 0.65, // Simplified calculation
      density
    };
  }, [filteredNodes]);

  // Color mapping for categories
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Neurobiologia': '#3b82f6',
      'Suplementy': '#10b981',
      'Neurotrofiny': '#8b5cf6',
      'Neuroprzekaźniki': '#f59e0b',
      'Funkcje poznawcze': '#ef4444',
      'Lifestyle': '#06b6d4',
      'Mechanizmy': '#8b5cf6'
    };
    return colors[category] || '#6b7280';
  };

  // Type icons
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'concept': return <Brain className="h-4 w-4" />;
      case 'mechanism': return <Network className="h-4 w-4" />;
      case 'supplement': return <Zap className="h-4 w-4" />;
      case 'protocol': return <Target className="h-4 w-4" />;
      case 'research': return <Activity className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  // Render network visualization
  const renderNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set zoom
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);

    // Draw connections
    connections.forEach(conn => {
      const sourceNode = filteredNodes.find(n => n.id === conn.source);
      const targetNode = filteredNodes.find(n => n.id === conn.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode?.x || 0, sourceNode?.y || 0);
        ctx.lineTo(targetNode?.x || 0, targetNode?.y || 0);
        ctx.strokeStyle = conn.type === 'mechanism' ? '#3b82f6' : 
                         conn.type === 'evidence' ? '#10b981' : 
                         conn.type === 'related' ? '#f59e0b' : '#8b5cf6';
        ctx.lineWidth = conn.strength * 3;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
      }
    });

    // Draw nodes
    filteredNodes.forEach(node => {
      const x = node?.x || 0;
      const y = node?.y || 0;
      const size = ((node?.importance ?? 0) / 100) * 30 + 10;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = getCategoryColor(node.category);
      ctx.globalAlpha = selectedNode === node.id ? 1 : 0.8;
      ctx.fill();
      
      // Node border
      ctx.strokeStyle = selectedNode === node.id ? '#1f2937' : '#ffffff';
      ctx.lineWidth = selectedNode === node.id ? 3 : 2;
      ctx.stroke();
      
      // Labels
      if (showLabels) {
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 1;
        ctx.fillText(node.label, x, y + size + 15);
      }
    });

    ctx.restore();
  };

  useEffect(() => {
    // Initialize node positions
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    filteredNodes.forEach((node, index) => {
      const angle = (index / filteredNodes.length) * 2 * Math.PI;
      const radius = 150 + Math.random() * 100;
      node.x = centerX + Math.cos(angle) * radius;
      node.y = centerY + Math.sin(angle) * radius;
    });

    renderNetwork();
  }, [filteredNodes, selectedNode, showLabels, zoomLevel]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoomLevel;
    const y = (event.clientY - rect.top) / zoomLevel;

    // Find clicked node
    const clickedNode = filteredNodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(x - (node?.x || 0), 2) + Math.pow(y - (node?.y || 0), 2)
      );
      const size = ((node?.importance ?? 0) / 100) * 30 + 10;
      return distance <= size;
    });

    setSelectedNode(clickedNode ? clickedNode.id : null);
  };

  const selectedNodeData = selectedNode ? 
    knowledgeNodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interaktywne Wizualizacje Wiedzy
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Odkryj powiązania między konceptami i zobacz wiedzę z nowej perspektywy
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="network">Sieć wiedzy</TabsTrigger>
            <TabsTrigger value="timeline">Oś czasu</TabsTrigger>
            <TabsTrigger value="insights">Analiza</TabsTrigger>
            <TabsTrigger value="explore">Eksploracja</TabsTrigger>
          </TabsList>

          <TabsContent value="network">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtry</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Kategoria</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Wszystkie</SelectItem>
                          <SelectItem value="Neurobiologia">Neurobiologia</SelectItem>
                          <SelectItem value="Suplementy">Suplementy</SelectItem>
                          <SelectItem value="Neurotrofiny">Neurotrofiny</SelectItem>
                          <SelectItem value="Neuroprzekaźniki">Neuroprzekaźniki</SelectItem>
                          <SelectItem value="Funkcje poznawcze">Funkcje poznawcze</SelectItem>
                          <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Typ</label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Wszystkie</SelectItem>
                          <SelectItem value="concept">Koncepcja</SelectItem>
                          <SelectItem value="mechanism">Mechanizm</SelectItem>
                          <SelectItem value="supplement">Suplement</SelectItem>
                          <SelectItem value="protocol">Protokół</SelectItem>
                          <SelectItem value="research">Badania</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Znaczenie</label>
                      <Slider
                        value={importanceThreshold}
                        onValueChange={setImportanceThreshold}
                        max={100}
                        min={0}
                        step={5}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>{importanceThreshold?.[0] ?? 0}</span>
                        <span>{importanceThreshold?.[1] ?? 100}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Etykiety</label>
                      <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Zoom</label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setZoomLevel(1)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Node Details */}
                {selectedNodeData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Szczegóły</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">{selectedNodeData.label}</h4>
                          <p className="text-sm text-gray-600">{selectedNodeData.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(selectedNodeData.type)}
                          <span className="text-sm">{selectedNodeData.type}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Znaczenie: </span>
                          <span className="text-sm">{selectedNodeData?.importance ?? 0}/100</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Połączenia: </span>
                          <span className="text-sm">{selectedNodeData.connections.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Network Visualization */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Sieć wiedzy</CardTitle>
                    <CardDescription>
                      Interaktywna mapa powiązań między konceptami
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="border rounded-lg cursor-crosshair"
                        onClick={handleCanvasClick}
                        style={{
                          maxWidth: '100%',
                          height: 'auto'
                        }}
                      />
                      
                      {/* Legend */}
                      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                        <h4 className="text-sm font-medium mb-2">Legenda</h4>
                        <div className="space-y-1 text-xs">
                          {Object.entries({
                            'Neurobiologia': '#3b82f6',
                            'Suplementy': '#10b981',
                            'Neurotrofiny': '#8b5cf6',
                            'Neuroprzekaźniki': '#f59e0b',
                            'Funkcje poznawcze': '#ef4444',
                            'Lifestyle': '#06b6d4'
                          }).map(([category, color]) => (
                            <div key={category} className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color as string }}
                              />
                              <span>{category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Oś czasu rozwoju wiedzy</CardTitle>
                <CardDescription>Kluczowe wydarzenia w rozwoju nootropików</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto">
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="text-sm font-medium text-gray-600">
                        {event.date}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-4">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                        (event?.importance ?? 0) > 90 ? 'from-red-500 to-red-600' :
                        (event?.importance ?? 0) > 80 ? 'from-orange-500 to-orange-600' :
                        'from-yellow-500 to-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1 pb-6 border-l-2 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{event.category}</Badge>
                            <Badge variant="secondary">
                              Znaczenie: {event?.importance ?? 0}/100
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Network Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Metryki sieci</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Węzły</span>
                      <span className="font-medium">{networkMetrics.totalNodes}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Połączenia</span>
                      <span className="font-medium">{networkMetrics.totalConnections}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stopień średni</span>
                      <span className="font-medium">{networkMetrics.averageDegree.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gęstość</span>
                      <span className="font-medium">{networkMetrics.density.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rozkład kategorii</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      filteredNodes.reduce((acc, node) => {
                        acc[node.category] = (acc[node.category] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category) as string }}
                          />
                          <span className="text-sm">{category}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Nodes by Importance */}
              <Card>
                <CardHeader>
                  <CardTitle>Najważniejsze koncepty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredNodes
                      .sort((a, b) => (b?.importance ?? 0) - (a?.importance ?? 0))
                      .slice(0, 5)
                      .map(node => (
                        <div key={node.id} className="flex items-center justify-between">
                          <span className="text-sm">{node.label}</span>
                          <Badge variant="secondary">{node?.importance ?? 0}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Connection Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Typy połączeń</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      connections.reduce((acc, conn) => {
                        acc[conn.type] = (acc[conn.type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{type}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="explore">
            <Card>
              <CardHeader>
                <CardTitle>Eksploracja wiedzy</CardTitle>
                <CardDescription>
                  Interaktywne narzędzie do odkrywania powiązań między konceptami
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Wybierz koncept do eksploracji</h3>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {filteredNodes.map(node => (
                          <Button
                            key={node.id}
                            variant={selectedNode === node.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setSelectedNode(node.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getCategoryColor(node.category) as string }}
                              />
                              <span>{node.label}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {selectedNodeData && (
                    <div>
                      <h3 className="font-medium mb-4">Powiązania</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Bezpośrednie połączenia</h4>
                          <div className="space-y-2">
                            {selectedNodeData.connections.map(connectionId => {
                              const connectedNode = knowledgeNodes.find(n => n.id === connectionId);
                              if (!connectedNode) return null;
                              return (
                                <div key={connectionId} className="flex items-center gap-2 p-2 border rounded">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getCategoryColor(connectedNode.category) as string }}
                                  />
                                  <span className="text-sm">{connectedNode.label}</span>
                                  <Badge variant="outline" className="ml-auto">
                                    {connectedNode?.importance ?? 0}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Podobne koncepty</h4>
                          <div className="text-sm text-gray-600">
                            Koncepty o podobnym znaczeniu w tej samej kategorii
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}