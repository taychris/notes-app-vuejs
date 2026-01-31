import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'

/**
 * Formats a date as relative time ("5 minutes ago", "2 hours ago") for today,
 * or as a readable date for older dates.
 *
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted string representing the relative or absolute date
 *
 * @example
 * formatRelativeDate(new Date()) // "less than a minute ago"
 * formatRelativeDate(twoDaysAgo) // "Jan 29, 2026"
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isToday(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true })
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }

  return format(dateObj, 'PP')
}
