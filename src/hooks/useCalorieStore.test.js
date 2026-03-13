import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalorieStore } from './useCalorieStore'

beforeEach(() => {
  localStorage.clear()
})

describe('useCalorieStore — profile', () => {
  it('initialises with null profile when localStorage is empty', () => {
    const { result } = renderHook(() => useCalorieStore())
    expect(result.current.profile).toBeNull()
  })

  it('setupProfile sets the profile', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => {
      result.current.setupProfile({ name: 'Alex', goal: 1800 })
    })
    expect(result.current.profile).toEqual({ name: 'Alex', goal: 1800 })
  })

  it('updateProfile merges changes into existing profile', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.setupProfile({ name: 'Alex', goal: 1800 }))
    act(() => result.current.updateProfile({ goal: 1500 }))
    expect(result.current.profile).toEqual({ name: 'Alex', goal: 1500 })
  })

  it('updateProfile does not overwrite unrelated fields', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.setupProfile({ name: 'Alex', goal: 1800 }))
    act(() => result.current.updateProfile({ name: 'Jordan' }))
    expect(result.current.profile.goal).toBe(1800)
  })
})

describe('useCalorieStore — food log', () => {
  it('initialises with empty logs', () => {
    const { result } = renderHook(() => useCalorieStore())
    expect(result.current.logs).toEqual({})
  })

  it('addEntry adds a food entry to today\'s log', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.addEntry('Apple', 95))
    const today = Object.keys(result.current.logs)[0]
    expect(result.current.logs[today]).toHaveLength(1)
    expect(result.current.logs[today][0].name).toBe('Apple')
    expect(result.current.logs[today][0].cal).toBe(95)
  })

  it('addEntry appends multiple entries to the same day', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.addEntry('Apple', 95))
    act(() => result.current.addEntry('Banana', 105))
    const today = Object.keys(result.current.logs)[0]
    expect(result.current.logs[today]).toHaveLength(2)
  })

  it('addEntry assigns a unique id to each entry', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.addEntry('Apple', 95))
    act(() => result.current.addEntry('Banana', 105))
    const today = Object.keys(result.current.logs)[0]
    const ids = result.current.logs[today].map((e) => e.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('deleteEntry removes the correct entry by id', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.addEntry('Apple', 95))
    act(() => result.current.addEntry('Banana', 105))
    const today = Object.keys(result.current.logs)[0]
    const idToDelete = result.current.logs[today][0].id
    act(() => result.current.deleteEntry(idToDelete, today))
    expect(result.current.logs[today]).toHaveLength(1)
    expect(result.current.logs[today][0].name).toBe('Banana')
  })

  it('deleteEntry leaves other days unaffected', () => {
    const { result } = renderHook(() => useCalorieStore())
    // Manually seed a different day
    act(() => {
      result.current.addEntry('Apple', 95)
    })
    const today = Object.keys(result.current.logs)[0]
    const id = result.current.logs[today][0].id
    act(() => result.current.deleteEntry(id, '2026-01-01'))
    // today's log should be unchanged
    expect(result.current.logs[today]).toHaveLength(1)
  })
})

describe('useCalorieStore — friend', () => {
  const friendData = {
    v: 1, name: 'Jordan', goal: 2000,
    today: { date: '2026-03-12', consumed: 1200 },
    history: [], ts: Date.now(),
  }

  it('initialises with null friend', () => {
    const { result } = renderHook(() => useCalorieStore())
    expect(result.current.friend).toBeNull()
  })

  it('importFriend sets friend data', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.importFriend(friendData))
    expect(result.current.friend.name).toBe('Jordan')
    expect(result.current.friend.goal).toBe(2000)
  })

  it('clearFriend resets friend to null', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.importFriend(friendData))
    act(() => result.current.clearFriend())
    expect(result.current.friend).toBeNull()
  })
})

describe('useCalorieStore — persistence', () => {
  it('persists profile to localStorage', () => {
    const { result } = renderHook(() => useCalorieStore())
    act(() => result.current.setupProfile({ name: 'Alex', goal: 1800 }))
    const stored = JSON.parse(localStorage.getItem('cb_profile'))
    expect(stored.name).toBe('Alex')
  })

  it('restores profile from localStorage on mount', () => {
    localStorage.setItem('cb_profile', JSON.stringify({ name: 'Alex', goal: 1800 }))
    const { result } = renderHook(() => useCalorieStore())
    expect(result.current.profile.name).toBe('Alex')
  })

  it('restores logs from localStorage on mount', () => {
    const logs = { '2026-03-12': [{ id: '1', name: 'Apple', cal: 95 }] }
    localStorage.setItem('cb_logs', JSON.stringify(logs))
    const { result } = renderHook(() => useCalorieStore())
    expect(result.current.logs['2026-03-12']).toHaveLength(1)
  })
})
