import { create } from 'zustand'

interface UserProfile {
  goals: string[]
  age: number
  conditions: string[]
  updateProfile: (profile: Partial<UserProfile>) => void
}

export const useUserProfile = create<UserProfile>((set) => ({
  goals: ['Wzmacnianie poznawcze', 'układ nerwowy'], // default goals
  age: 30,
  conditions: [],
  updateProfile: (profile) => set((state) => ({ ...state, ...profile }))
}))
