import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCalorieStore } from './useCalorieStore'

// Mock Firebase so tests run without a real project
vi.mock('../firebase', () => ({ auth: {}, db: {} }))
vi.mock('../utils/firestore', () => ({
  loadUserData: vi.fn().mockResolvedValue(null),
  saveUserProfile: vi.fn().mockResolvedValue(undefined),
  saveUserLogs: vi.fn().mockResolvedValue(undefined),
  fetchFriendData: vi.fn(),
}))

import { fetchFriendData } from '../utils/firestore'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe('useCalorieStore — profile', () => {
  it('initialises with null profile when localStorage is empty', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    expect(result.current.profile).toBeNull()
  })

  it('setupProfile sets the profile', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => {
      result.current.setupProfile({ name: 'Alex', goal: 1800 })
    })
    expect(result.current.profile).toEqual({ name: 'Alex', goal: 1800 })
  })

  it('updateProfile merges changes into existing profile', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => result.current.setupProfile({ name: 'Alex', goal: 1800 }))
    act(() => result.current.updateProfile({ goal: 1500 }))
    expect(result.current.profile).toEqual({ name: 'Alex', goal: 1500 })
  })

  it('updateProfile does not overwrite unrelated fields', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => result.current.setupProfile({ name: 'Alex', goal: 1800 }))
    act(() => result.current.updateProfile({ name: 'Jordan' }))
    expect(result.current.profile.goal).toBe(1800)
  })
})

describe('useCalorieStore — food log', () => {
  it('initialises with empty logs', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    expect(result.current.logs).toEqual({})
  })

  it('addEntry adds a food entry to today\'s log', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => result.current.addEntry('Apple', 95))
    const today = Object.keys(result.current.logs)[0]
    expect(result.current.logs[today]).toHaveLength(1)
    expect(result.current.logs[today][0].name).toBe('Apple')
    expect(result.current.logs[today][0].cal).toBe(95)
  })

  it('addEntry appends multiple entries to the same day', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => result.current.addEntry('Apple', 95))
    act(() => result.current.addEntry('Banana', 105))
    const today = Object.keys(result.current.logs)[0]
    expect(result.current.logs[today]).toHaveLength(2)
  })

  it('addEntry assigns a unique id to each entry', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => result.current.addEntry('Apple', 95))
    act(() => result.current.addEntry('Banana', 105))
    const today = Object.keys(result.current.logs)[0]
    const ids = result.current.logs[today].map((e) => e.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('deleteEntry removes the correct entry by id', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => result.current.addEntry('Apple', 95))
    act(() => result.current.addEntry('Banana', 105))
    const today = Object.keys(result.current.logs)[0]
    const idToDelete = result.current.logs[today][0].id
    act(() => result.current.deleteEntry(idToDelete, today))
    expect(result.current.logs[today]).toHaveLength(1)
    expect(result.current.logs[today][0].name).toBe('Banana')
  })

  it('deleteEntry leaves other days unaffected', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => {
      result.current.addEntry('Apple', 95)
    })
    const today = Object.keys(result.current.logs)[0]
    const id = result.current.logs[today][0].id
    act(() => result.current.deleteEntry(id, '2026-01-01'))
    expect(result.current.logs[today]).toHaveLength(1)
  })
})

describe('useCalorieStore — friend', () => {
  it('initialises with null friend', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    expect(result.current.friend).toBeNull()
  })

  it('importFriend fetches by UID and sets friend data', async () => {
    fetchFriendData.mockResolvedValueOnce({
      name: 'Jordan',
      goal: 2000,
      logs: {},
    })
    const { result } = renderHook(() => useCalorieStore(null))
    await act(async () => {
      await result.current.importFriend('uid-jordan')
    })
    expect(result.current.friend.name).toBe('Jordan')
    expect(result.current.friend.goal).toBe(2000)
    expect(result.current.friendUid).toBe('uid-jordan')
  })

  it('importFriend throws if UID not found in Firestore', async () => {
    fetchFriendData.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useCalorieStore(null))
    await expect(
      act(async () => { await result.current.importFriend('bad-uid') })
    ).rejects.toThrow('No user found with that code.')
  })

  it('clearFriend resets friend and friendUid to null', async () => {
    fetchFriendData.mockResolvedValueOnce({ name: 'Jordan', goal: 2000, logs: {} })
    const { result } = renderHook(() => useCalorieStore(null))
    await act(async () => {
      await result.current.importFriend('uid-jordan')
    })
    act(() => result.current.clearFriend())
    expect(result.current.friend).toBeNull()
    expect(result.current.friendUid).toBeNull()
  })

  it('syncFriend refreshes friend data from Firestore', async () => {
    fetchFriendData.mockResolvedValue({ name: 'Jordan', goal: 2000, logs: {} })
    localStorage.setItem('cb_friend_uid', JSON.stringify('uid-jordan'))
    const { result } = renderHook(() => useCalorieStore(null))
    await act(async () => {
      await result.current.syncFriend()
    })
    await waitFor(() => expect(result.current.friend?.name).toBe('Jordan'))
  })
})

describe('useCalorieStore — persistence', () => {
  it('persists profile to localStorage', () => {
    const { result } = renderHook(() => useCalorieStore(null))
    act(() => result.current.setupProfile({ name: 'Alex', goal: 1800 }))
    const stored = JSON.parse(localStorage.getItem('cb_profile'))
    expect(stored.name).toBe('Alex')
  })

  it('restores profile from localStorage on mount', () => {
    localStorage.setItem('cb_profile', JSON.stringify({ name: 'Alex', goal: 1800 }))
    const { result } = renderHook(() => useCalorieStore(null))
    expect(result.current.profile.name).toBe('Alex')
  })

  it('restores logs from localStorage on mount', () => {
    const logs = { '2026-03-12': [{ id: '1', name: 'Apple', cal: 95 }] }
    localStorage.setItem('cb_logs', JSON.stringify(logs))
    const { result } = renderHook(() => useCalorieStore(null))
    expect(result.current.logs['2026-03-12']).toHaveLength(1)
  })
})
