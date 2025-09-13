import { describe, it, expect, vi, beforeEach } from 'vitest';

import { type Supplement } from '@/types/supplement';

import { recommendStack } from './recommender';

// Mock databases
vi.mock('../../suplementy/data/supplements-database', () => ({
  supplementsDatabase: [
    {
      id: 'test-supplement',
      name: 'Test Supplement',
      dosage: '100mg',
      frequency: 'daily',
      timeOfDay: ['08:00'],
      category: 'cognitive',
      startDate: '2024-01-01',
      notes: 'Test description with pamięć and koncentracja',
      sideEffects: ['Nie stosować przy chorobach serca'],
      contraindications: ['heart disease']
    } as Supplement
  ]
}));

vi.mock('../../suplementy/data/nootropics-database', () => ({
  nootropicsDatabase: [
    {
      id: 'test-nootropic',
      name: 'L-Theanine',
      dosage: '200mg',
      frequency: 'daily',
      timeOfDay: ['08:00'],
      category: 'cognitive',
      startDate: '2024-01-01',
      notes: 'Promuje relaksację z koncentracją',
      sideEffects: []
    } as Supplement
  ]
}));

describe('recommendStack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('recommends supplements matching goals', () => {
    const goals = ['Wzmacnianie poznawcze'];
    const result = recommendStack(goals);

    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0]?.item.name).toBe('Test Supplement');
    expect(result.recommendations[0]?.synergyScore).toBeGreaterThan(0);
  });

  it('calculates synergy score for predefined pairs', () => {
    const goals = ['Wzmacnianie poznawcze'];
    const currentStack = ['Caffeine'];
    const result = recommendStack(goals, undefined, currentStack);

    expect(result.recommendations[0]?.synergyScore).toBeGreaterThan(50); // base + synergy bonus
  });

  it('validates stack for incompatibilities', () => {
    const goals = ['Redukcja stresu'];
    const currentStack = ['Caffeine', 'Test Supplement']; // assume incompatibility
    const result = recommendStack(goals, undefined, currentStack);

    expect(result.validatedStack).toBe(false);
    expect(result.warnings).toHaveLength(1);
  });

  it('filters by user conditions', () => {
    const goals = ['Wzmacnianie poznawcze'];
    const userProfile = { age: 25, conditions: ['heart disease'] };
    const result = recommendStack(goals, userProfile);

    // Assuming test supplement has heart warning
    expect(result.recommendations).toHaveLength(0); // filtered out
  });

  it('sorts recommendations by synergy score', () => {
    const goals = ['Wzmacnianie poznawcze'];
    const result = recommendStack(goals);

    expect(result.recommendations[0]?.synergyScore).toBeGreaterThanOrEqual(result.recommendations[1]?.synergyScore || 0);
  });
});