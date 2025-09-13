import {
  type DragEndEvent,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

import { recommendStack } from '@/app/stack-builder/logic/recommender'
import { type Supplement } from '@/types/supplement'
import { supplements } from '@/app/wiedza/data/supplements-database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { safeLocalStorage, ErrorLogger, AppError, ErrorType } from '@/lib/error-handling'
import {
  IntakeLogSchema,
  type IntakeLog,
  type SupplementWithTracking
} from '@/types/supplement'

import { Sparkline } from './Sparkline'

type Suggestion = {
  item: {
    polishName: string
    description: string
    neuroEffects: string[]
  }
  synergyScore: number
}

/**
 *
 */
export const IntakeDragBoard = () => {
  const [logs, setLogs] = useState<IntakeLog[]>([])
  const [selectedSupplementId, setSelectedSupplementId] = useState<string | null>(null)
  const [currentLog, setCurrentLog] = useState<IntakeLog>({
    date: new Date().toISOString().split('T')[0] || '',
    supplements: [],
    immuneImpact: []
  })
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [userGoals] = useState<string[]>(['Wzmacnianie poznawcze', 'układ nerwowy']) // Default goals, can be from Zustand later

  const updateSuggestions = (currentSupplements: SupplementWithTracking[]) => {
    try {
      const currentStackNames = currentSupplements.map((s) => s.name)
      const result = recommendStack(userGoals, undefined, currentStackNames)
      const mappedSuggestions: Suggestion[] = result.recommendations
        .slice(0, 3)
        .map((rec) => ({
          item: {
            polishName: rec.item.polishName || rec.item.name,
            description: rec.item.notes || '',
            neuroEffects: [] // TODO: Add neuroEffects if available in Supplement type
          },
          synergyScore: rec.synergyScore
        }))
      setSuggestions(mappedSuggestions)
    } catch (error) {
      ErrorLogger.getInstance().log(
        new AppError('Failed to update suggestions', ErrorType.COMPONENT, {
          error,
          currentSupplements
        })
      )
      setSuggestions([])
    }
  }

  useEffect(() => {
    const savedLogs = safeLocalStorage.getItem('intakeLogs')
    if (savedLogs && Array.isArray(savedLogs)) {
      const validatedLogs: IntakeLog[] = []
      for (const log of savedLogs) {
        const result = IntakeLogSchema.safeParse(log)
        if (result.success) {
          validatedLogs.push(result.data)
        } else {
          ErrorLogger.getInstance().log(
            new AppError('Invalid log format in storage', ErrorType.VALIDATION, {
              log,
              errors: result.error.errors
            })
          )
        }
      }
      setLogs(validatedLogs)
    } else if (savedLogs !== null) {
      setError('Failed to load saved logs - invalid format')
    }
  }, [])

  useEffect(() => {
    const success = safeLocalStorage.setItem('intakeLogs', logs)
    if (!success) {
      setError('Failed to save logs')
    }
  }, [logs])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setCurrentLog((prev) => {
        const oldIndex = prev.supplements.findIndex((s) => s.id === active.id)
        const newIndex = prev.supplements.findIndex((s) => s.id === over.id)
        const newSupplements = arrayMove(prev.supplements, oldIndex, newIndex)
        updateSuggestions(newSupplements)
        return {
          ...prev,
          supplements: newSupplements
        }
      })
    }
  }

  const addSupplement = () => {
    if (selectedSupplementId) {
      const supToAdd = supplements.find((s) => s.id === selectedSupplementId)
      if (supToAdd) {
        setCurrentLog((prev) => {
          const newSupplements = [
            ...prev.supplements,
            { ...supToAdd, dosage: '0', time: '' }
          ]
          updateSuggestions(newSupplements)
          return {
            ...prev,
            supplements: newSupplements
          }
        })
        setSelectedSupplementId(null)
      }
    }
  }

  const removeSupplement = (id: string) => {
    setCurrentLog((prev) => ({
      ...prev,
      supplements: prev.supplements.filter((s) => s.id !== id)
    }))
  }

  const updateSupplement = (id: string, field: 'dosage' | 'time', value: string) => {
    setCurrentLog((prev) => ({
      ...prev,
      supplements: prev.supplements.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    }))
  }

  const saveLog = () => {
    const immuneImpactValue = currentLog.supplements.reduce((sum, sup) => {
      const dbSup = supplements.find((s) => s.id === sup.id)
      if (dbSup) {
        // Assign a numerical value to each benefit for immune impact calculation
        const benefitScore =
          dbSup.benefits?.reduce((score: number, benefit: string) => {
            if (
              benefit.toLowerCase().includes('immune') ||
              benefit.toLowerCase().includes('stress reduction') ||
              benefit.toLowerCase().includes('antioxidant')
            ) {
              return score + 1 // Example: assign 1 point for relevant benefits
            }
            return score
          }, 0) || 0
        return sum + benefitScore * parseFloat(sup.dosage || '0') // Multiply by dosage for more impact
      }
      return sum
    }, 0)

    // For Sparkline, we need an array of numbers. Let's make it a single point for now.
    const immuneImpact = [immuneImpactValue]
    const newLog = { ...currentLog, immuneImpact }
    setLogs((prev) => [...prev, newLog])
    setCurrentLog({
      date: new Date().toISOString().split('T')[0] || '',
      supplements: [],
      immuneImpact: []
    })
    setSuggestions([]) // Clear suggestions after save
  }

  useEffect(() => {
    if (currentLog.supplements.length > 0) {
      updateSuggestions(currentLog.supplements)
    } else {
      setSuggestions([])
    }
  }, [currentLog.supplements])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intake Drag Board</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Select
            onValueChange={setSelectedSupplementId}
            value={selectedSupplementId || ''}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a supplement" />
            </SelectTrigger>
            <SelectContent>
              {supplements.map((sup) => (
                <SelectItem key={sup.id} value={sup.id}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addSupplement} disabled={!selectedSupplementId}>
            Add
          </Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={currentLog.supplements.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {currentLog.supplements.map((sup) => (
              <SortableItem
                key={sup.id}
                id={sup.id}
                supplement={sup}
                updateSupplement={updateSupplement}
                removeSupplement={removeSupplement}
              />
            ))}
          </SortableContext>
        </DndContext>
        <Button onClick={saveLog} className="mt-4">
          Zapisz Dziennik
        </Button>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Trend Wpływu na Odporność</h3>
          {logs.length > 0 && (
            <Sparkline
              data={logs.map((log) => log.immuneImpact[0] || 0)}
              width={300}
              height={100}
              strokeColor="#3b82f6"
              strokeWidth={2}
            />
          )}
        </div>

        {/* Real-time Suggestions */}
        {suggestions.length > 0 && (
          <TooltipProvider>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Sugestie Synergiczne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className="flex cursor-pointer items-center rounded bg-blue-50 p-2 hover:bg-blue-100">
                          <div className="mr-2 font-medium">
                            {suggestion.item.polishName}
                          </div>
                          <Badge variant="secondary" className="ml-auto">
                            {Math.round(suggestion.synergyScore)}%
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{suggestion.item.description}</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Neuroefekty: {suggestion.item.neuroEffects.join(', ')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  )
}

/**
 *
 */
const SortableItem = ({
  id,
  supplement,
  updateSupplement,
  removeSupplement
}: {
  id: string
  supplement: SupplementWithTracking
  updateSupplement: (id: string, field: 'dosage' | 'time', value: string) => void
  removeSupplement: (id: string) => void
}) => {
  const dbSup = supplements.find((s) => s.id === supplement.id)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 flex items-center rounded border p-2"
    >
      <div {...attributes} {...listeners} className="mr-2 cursor-grab">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="mx-2 flex-grow">
        <div className="font-semibold">{supplement.name}</div>
        {dbSup && (
          <div className="text-sm text-gray-500">
            <p>Category: {dbSup.category}</p>
            <p>Benefits: {dbSup.benefits?.join(', ') || ''}</p>
          </div>
        )}
      </div>
      <Input
        type="number"
        placeholder="Dosage"
        value={supplement.dosage}
        onChange={(e) => updateSupplement(id, 'dosage', e.target.value)}
        className="mx-2 w-24"
      />
      <Input
        placeholder="Time"
        value={supplement.time}
        onChange={(e) => updateSupplement(id, 'time', e.target.value)}
        className="mx-2 w-32"
      />
      <Button variant="ghost" onClick={() => removeSupplement(id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
