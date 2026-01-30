import { Category } from '@/types'

/**
 * Color mapping for all categories including 'All'
 * 
 * @type {Record<Category | 'All', { color: string }>}
 * 
 * Each color property contains Tailwind CSS classes for light and dark modes.
 */
export const categoryColors: Record<Category | 'All', { color: string }> = {
  All: {
    color: 'bg-background dark:bg-gray-700'
  },
  [Category.PERSONAL]: {
    color: 'bg-cyan-300 dark:bg-cyan-600'
  },
  [Category.WORK]: {
    color: 'bg-emerald-300 dark:bg-emerald-600'
  },
  [Category.IDEAS]: {
    color: 'bg-purple-300 dark:bg-purple-600'
  },
  [Category.TODO]: {
    color: 'bg-amber-300 dark:bg-amber-600'
  },
  [Category.OTHER]: {
    color: 'bg-pink-300 dark:bg-pink-600'
  }
}
