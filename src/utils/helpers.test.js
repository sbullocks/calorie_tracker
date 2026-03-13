import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { todayKey, fmtDate, dayLabel, calColor, sumCal, last7Days } from './helpers'

describe('todayKey', () => {
  it('returns today in YYYY-MM-DD format', () => {
    const result = todayKey()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('matches the current local date', () => {
    const d = new Date()
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    expect(todayKey()).toBe(expected)
  })
})

describe('fmtDate', () => {
  it('formats a date string into a readable label', () => {
    const result = fmtDate('2026-03-12')
    expect(result).toContain('Mar')
    expect(result).toContain('12')
  })

  it('does not include the year', () => {
    const result = fmtDate('2026-03-12')
    expect(result).not.toContain('2026')
  })
})

describe('dayLabel', () => {
  it('returns "Today" for today\'s date', () => {
    expect(dayLabel(todayKey())).toBe('Today')
  })

  it('returns "Yest" for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const key = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    expect(dayLabel(key)).toBe('Yest')
  })

  it('returns a weekday abbreviation for older dates', () => {
    const result = dayLabel('2026-03-09') // a Monday
    expect(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).toContain(result)
  })
})

describe('calColor', () => {
  it('returns green when well under goal', () => {
    expect(calColor(0.5)).toBe('var(--green)')
  })

  it('returns orange when approaching goal (85-99%)', () => {
    expect(calColor(0.9)).toBe('var(--orange)')
  })

  it('returns red when at or over goal', () => {
    expect(calColor(1.0)).toBe('var(--red)')
    expect(calColor(1.2)).toBe('var(--red)')
  })

  it('returns green at exactly 84%', () => {
    expect(calColor(0.84)).toBe('var(--green)')
  })

  it('returns orange at exactly 85%', () => {
    expect(calColor(0.85)).toBe('var(--orange)')
  })
})

describe('sumCal', () => {
  it('returns 0 for an empty array', () => {
    expect(sumCal([])).toBe(0)
  })

  it('sums the cal property of each entry', () => {
    const entries = [{ cal: 100 }, { cal: 250 }, { cal: 50 }]
    expect(sumCal(entries)).toBe(400)
  })

  it('handles a single entry', () => {
    expect(sumCal([{ cal: 300 }])).toBe(300)
  })
})

describe('last7Days', () => {
  it('returns exactly 7 dates', () => {
    expect(last7Days()).toHaveLength(7)
  })

  it('each date is in YYYY-MM-DD format', () => {
    last7Days().forEach((d) => expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/))
  })

  it('last entry is today', () => {
    const days = last7Days()
    expect(days[6]).toBe(todayKey())
  })

  it('dates are in ascending order', () => {
    const days = last7Days()
    for (let i = 1; i < days.length; i++) {
      expect(new Date(days[i]) > new Date(days[i - 1])).toBe(true)
    }
  })
})
