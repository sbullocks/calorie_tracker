import { describe, it, expect, beforeEach } from 'vitest'
import { load, save } from './storage'

beforeEach(() => {
  localStorage.clear()
})

describe('save', () => {
  it('stores a value in localStorage as JSON', () => {
    save('test_key', { a: 1 })
    expect(localStorage.getItem('test_key')).toBe('{"a":1}')
  })

  it('can store arrays', () => {
    save('arr', [1, 2, 3])
    expect(localStorage.getItem('arr')).toBe('[1,2,3]')
  })
})

describe('load', () => {
  it('returns parsed value when key exists', () => {
    localStorage.setItem('test_key', '{"x":42}')
    expect(load('test_key', null)).toEqual({ x: 42 })
  })

  it('returns the default value when key does not exist', () => {
    expect(load('missing', 'fallback')).toBe('fallback')
  })

  it('returns the default value when stored JSON is invalid', () => {
    localStorage.setItem('bad', 'not-json{{')
    expect(load('bad', [])).toEqual([])
  })

  it('round-trips a complex object correctly', () => {
    const obj = { name: 'Alex', goal: 1800, logs: { '2026-03-12': [{ id: '1', cal: 300 }] } }
    save('profile', obj)
    expect(load('profile', null)).toEqual(obj)
  })
})
