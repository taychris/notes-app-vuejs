import { z } from 'zod'
import { Category } from '@/types'

export const noteSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(3, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  category: z.nativeEnum(Category, {
    required_error: 'Category is required',
    invalid_type_error: 'Please select a valid category',
  }),
})

export type NoteFormValues = z.infer<typeof noteSchema>
