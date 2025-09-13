import { z } from 'zod'

export const SupplementSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  polishName: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  benefits: z.array(z.string()).min(1),
  dosage: z.string().min(1),
  timing: z.string().min(1),
  price: z.string().min(1),
  sklad: z.object({
    activeIngredient: z.string().min(1),
    concentration: z.string().min(1),
    form: z.string().min(1),
    additional: z.array(z.string())
  }),
  neuroEffects: z.array(z.string()).min(1),
  warnings: z.array(z.string()),
  source: z.string().min(1)
})

export type Supplement = z.infer<typeof SupplementSchema>
