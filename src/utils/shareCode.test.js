import { describe, it, expect } from 'vitest'
import { makeShareCode, parseCode } from './shareCode'

const mockProfile = { name: 'Alex', goal: 1800 }

const mockLogs = {
  '2026-03-12': [
    { id: '1', name: 'Oatmeal', cal: 166, time: '8:00 AM' },
    { id: '2', name: 'Chicken breast', cal: 165, time: '12:00 PM' },
  ],
  '2026-03-11': [{ id: '3', name: 'Apple', cal: 95, time: '9:00 AM' }],
}

describe('makeShareCode', () => {
  it('returns a non-empty base64 string', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    expect(typeof code).toBe('string')
    expect(code.length).toBeGreaterThan(0)
  })

  it('produces a string parseable as JSON after base64 decode', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    const decoded = JSON.parse(atob(code))
    expect(decoded).toBeDefined()
  })

  it('encodes the correct name and goal', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    const decoded = JSON.parse(atob(code))
    expect(decoded.name).toBe('Alex')
    expect(decoded.goal).toBe(1800)
  })

  it('sets version to 1', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    const decoded = JSON.parse(atob(code))
    expect(decoded.v).toBe(1)
  })

  it('includes a history array of 7 entries', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    const decoded = JSON.parse(atob(code))
    expect(decoded.history).toHaveLength(7)
  })

  it('includes a ts timestamp', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    const decoded = JSON.parse(atob(code))
    expect(typeof decoded.ts).toBe('number')
    expect(decoded.ts).toBeGreaterThan(0)
  })
})

describe('parseCode', () => {
  it('round-trips: parseCode(makeShareCode()) returns valid data', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    const result = parseCode(code)
    expect(result).not.toBeNull()
    expect(result.name).toBe('Alex')
    expect(result.goal).toBe(1800)
    expect(result.v).toBe(1)
  })

  it('returns null for an empty string', () => {
    expect(parseCode('')).toBeNull()
  })

  it('returns null for a random non-base64 string', () => {
    expect(parseCode('not-a-valid-code!!!')).toBeNull()
  })

  it('returns null for valid base64 that is not a v1 payload', () => {
    const badPayload = btoa(JSON.stringify({ v: 2, name: 'X' }))
    expect(parseCode(badPayload)).toBeNull()
  })

  it('trims whitespace before parsing', () => {
    const code = makeShareCode(mockProfile, mockLogs)
    const result = parseCode(`  ${code}  `)
    expect(result).not.toBeNull()
  })
})
