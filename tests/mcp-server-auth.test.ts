import { describe, expect, it } from 'vitest'
import { mcpRequestAuthorized } from '../src/main/mcp/server.js'

describe('MCP HTTP authentication', () => {
  it('requires the configured bearer token', () => {
    const token = 'abcdefghijklmnopqrstuvwxyz_ABCDEFG-1234567890'
    expect(mcpRequestAuthorized(token, undefined)).toBe(false)
    expect(mcpRequestAuthorized(token, 'Bearer wrong')).toBe(false)
    expect(mcpRequestAuthorized(token, `Bearer ${token}`)).toBe(true)
  })

  it('allows requests when authentication is explicitly disabled', () => {
    expect(mcpRequestAuthorized(undefined, undefined)).toBe(true)
  })
})
