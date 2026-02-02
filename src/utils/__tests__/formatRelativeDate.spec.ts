import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { format, formatDistanceToNow } from 'date-fns'
import { formatRelativeDate } from '@/utils/formatRelativeDate'

describe('formatRelativeDate', () => {
  const fixedNow = new Date(2026, 1, 2, 12, 0, 0)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedNow)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('formats a date from today as relative time with a suffix', () => {
    const fiveMinutesAgo = new Date(fixedNow.getTime() - 5 * 60 * 1000)
    const expected = formatDistanceToNow(fiveMinutesAgo, { addSuffix: true })

    expect(formatRelativeDate(fiveMinutesAgo)).toBe(expected)
  })

  it('accepts an ISO string input for today', () => {
    const fiveMinutesAgo = new Date(fixedNow.getTime() - 5 * 60 * 1000)
    const expected = formatDistanceToNow(fiveMinutesAgo, { addSuffix: true })

    expect(formatRelativeDate(fiveMinutesAgo.toISOString())).toBe(expected)
  })

  it('formats a date from yesterday as "Yesterday"', () => {
    const yesterday = new Date(2026, 1, 1, 12, 0, 0)
    expect(formatRelativeDate(yesterday)).toBe('Yesterday')
  })

  it('accepts an ISO string input for yesterday', () => {
    const yesterday = new Date(2026, 1, 1, 12, 0, 0)
    expect(formatRelativeDate(yesterday.toISOString())).toBe('Yesterday')
  })

  it('formats older dates using a readable date', () => {
    const older = new Date(2026, 0, 29, 12, 0, 0)
    expect(formatRelativeDate(older)).toBe(format(older, 'PP'))
  })

  it('throws for invalid date strings', () => {
    expect(() => formatRelativeDate('not-a-date')).toThrow()
  })
})
