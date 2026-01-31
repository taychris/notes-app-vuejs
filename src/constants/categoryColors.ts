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
    color: 'bg-gray-400 hover:bg-gray-400/90 dark:bg-gray-700 dark:hover:bg-gray-700/90 dark:text-white'
  },
  [Category.PERSONAL]: {
    color: 'bg-cyan-400 hover:bg-cyan-400/90 dark:bg-cyan-700 dark:hover:bg-cyan-700/90 dark:text-white'
  },
  [Category.WORK]: {
    color: 'bg-emerald-400 hover:bg-emerald-400/90 dark:bg-emerald-700 dark:hover:bg-emerald-700/90 dark:text-white'
  },
  [Category.IDEAS]: {
    color: 'bg-purple-400 hover:bg-purple-400/90 dark:bg-purple-700 dark:hover:bg-purple-700/90 dark:text-white'
  },
  [Category.TODO]: {
    color: 'bg-amber-400 hover:bg-amber-400/90 dark:bg-yellow-600 dark:hover:bg-yellow-600/90 dark:text-white'
  },
  [Category.OTHER]: {
    color: 'bg-pink-400 hover:bg-pink-400/90 dark:bg-pink-700 dark:hover:bg-pink-700/90 dark:text-white'
  }
}
