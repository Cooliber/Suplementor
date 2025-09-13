'use client';





import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { recommendStack } from './logic/recommender';
import  { type RecommendResponse } from './logic/recommender';
import { nootropicsDatabase } from '../suplementy/data/nootropics-database';
import { supplementsDatabase } from '../suplementy/data/supplements-database';
import type { Supplement } from '@/types/supplement';

interface Recommendation {
  item: Supplement;
  synergyScore: number;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

/**
 * Sortable item component for drag-and-drop functionality
 * @param id - Unique identifier for the sortable item
 * @param children - React children to render inside the sortable item
 * @returns Sortable div with drag handlers
 */
const SortableItem = ({ id, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

/**
 * Main stack builder page component
 * Handles goal selection, recommendations, drag-and-drop stack building, and export functionality
 * @returns Stack builder UI with sidebar, main stack area, and recommendation cards
 */
export default function StackBuilderPage() {
  const [goals, setGoals] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stack, setStack] = useState<string[]>([]);
  const [nootropics, setNootropics] = useState<Supplement[]>(nootropicsDatabase);
  const [validationResult, setValidationResult] = useState<RecommendResponse | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (goals.length > 0) {
      const response = recommendStack(goals, undefined, stack);
      setRecommendations(response.recommendations as unknown as Recommendation[]);
      // Filter items for sidebar based on recs
      const recItems = response.recommendations.map((r) => r.item);
      setNootropics(recItems);
      setValidationResult(response);
    }
  }, [goals, stack]);

  const getItemById = (id: string): Supplement | null => [...nootropicsDatabase, ...supplementsDatabase].find(s => s.id === id || s.name === id) ?? null;

  const handleJsonExport = () => {
    const stackData = stack.map(id => {
      const item = getItemById(id);
      if (!item) return null;
      return {
        name: item.polishName,
        dosage: item.dosage,
        warnings: item.contraindications?.join(', ') || ''
      };
    }).filter(Boolean);
    const blob = new Blob([JSON.stringify(stackData, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stack.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePdfExport = async () => {
    try {
      // @ts-ignore
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.text('Twój Stack Suplementów', 10, 10);
      let y = 20;
      stack.forEach(id => {
        const item = getItemById(id);
        if (item) {
          doc.text(`${item.polishName} - ${item.dosage}`, 10, y);
          y += 10;
        }
      });
      doc.save('stack.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Eksport PDF wymaga zainstalowania jspdf: npm i jspdf');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStack((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        if (oldIndex === -1) {
          // Dropped from sidebar to stack
          return [...items, active.id as string];
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Budowniczy Stacków</h1>
      
      <div className="flex flex-col sm:flex-col md:flex-row gap-6">
        {/* Sidebar: Available Nootropics */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Dostępne Nootropiki</CardTitle>
            </CardHeader>
            <CardContent>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={nootropics.map(n => n.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {nootropics.map((nootropic) => (
                      <SortableItem key={nootropic.id} id={nootropic.id}>
                        <Card className="cursor-grab active:cursor-grabbing p-2" aria-label={`Przeciągnij nootropik ${nootropic.polishName}`}>
                          <p className="font-medium">{nootropic.polishName} ({nootropic.name})</p>
                        </Card>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>

        {/* Main Stack Area */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Twój Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext items={stack} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 min-h-[200px]">
                  {stack.map((id) => {
                    const item = getItemById(id);
                    if (!item) return null;
                    return (
                      <SortableItem key={id} id={id}>
                        <Card className="p-2" aria-label={`Element stacku ${item.polishName}`}>
                          <p className="font-medium">{item.polishName}</p>
                          <p className="text-sm text-gray-600">{item.dosage}</p>
                        </Card>
                      </SortableItem>
                    );
                  })}
                </div>
              </SortableContext>
              <div className="mt-4">
                <Button onClick={handleJsonExport} aria-label="Eksportuj stos do JSON">
                  Eksportuj stos (JSON)
                </Button>
                <Button onClick={handlePdfExport} aria-label="Eksportuj stos do PDF" className="ml-2">
                  Eksportuj stos (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goal Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Wybierz Cel</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={goals[goals.length - 1] || ''} onValueChange={(value) => {
            if (!goals.includes(value)) {
              setGoals(prev => [...prev, value]);
            }
          }}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Wybierz cel (system lub ogólny)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wzmacnianie poznawcze">Wzmacnianie poznawcze</SelectItem>
              <SelectItem value="Redukcja stresu">Redukcja stresu</SelectItem>
              <SelectItem value="Metaboliczne wsparcie">Metaboliczne wsparcie</SelectItem>
              {/* System-based options */}
              <SelectItem value="układ nerwowy">Układ nerwowy (Nervous System) - Wsparcie poznawcze</SelectItem>
              <SelectItem value="układ krążenia">Układ krążenia (Cardiovascular) - Wsparcie serca</SelectItem>
              <SelectItem value="układ odpornościowy">Układ odpornościowy (Immune) - Wzmocnienie obrony</SelectItem>
              <SelectItem value="układ trawienny">Układ trawienny (Digestive) - Wsparcie jelit</SelectItem>
              <SelectItem value="układ endokrynny">Układ endokrynny (Endocrine) - Balans hormonalny</SelectItem>
              <SelectItem value="układ mięśniowo-szkieletowy">Układ mięśniowo-szkieletowy (Musculoskeletal) - Siła i kości</SelectItem>
            </SelectContent>
          </Select>
          {/* Display selected goals */}
          {goals.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {goals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => setGoals(prev => prev.filter(g => g !== goal))}>
                  {goal} ✕
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sugerowane Suplementy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => {
              const item = rec.item;
              const polishName = item.polishName;
              const mechanismOrDesc = item.notes || '';
              const dosage = item.dosage;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{polishName} - Suplement</CardTitle>
                    <Badge variant="secondary">Synergia: {rec.synergyScore}/100</Badge>
                    {validationResult?.recommendedForSystem && (
                      <Badge variant="outline">{validationResult.recommendedForSystem}</Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Opis: {mechanismOrDesc.slice(0, 100)}...
                    </CardDescription>
                    <p className="text-sm mt-2">Dawkowanie: {dosage}</p>
                    {validationResult?.systemWarnings && validationResult.systemWarnings.length > 0 && (
                      <Alert className="mt-2">
                        <AlertDescription className="text-sm text-red-600">
                          {validationResult.systemWarnings[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      {/* Note for PDF */}
      <Alert>
        <AlertDescription>
          Aby użyć eksportu PDF, zainstaluj jsPDF: npm i jspdf
        </AlertDescription>
      </Alert>
    </div>
  );
}