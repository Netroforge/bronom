import { describe, expect, it } from 'vitest'
import { replacedPackageVersion } from '../src/shared/update-runtime.js'

describe('running update replacement detection', () => {
  it('detects when a Linux package replaced the app beneath the running process', () => {
    expect(replacedPackageVersion('2.14.0', JSON.stringify({ version: '2.15.0' }))).toBe('2.15.0')
  })

  it('does not restart when the running and on-disk versions match', () => {
    expect(replacedPackageVersion('2.15.0', JSON.stringify({ version: '2.15.0' }))).toBeNull()
  })

  it.each([
    '',
    'not json',
    JSON.stringify({}),
    JSON.stringify({ version: '../unsafe' })
  ])('ignores an invalid package manifest: %s', (manifest) => {
    expect(replacedPackageVersion('2.15.0', manifest)).toBeNull()
  })
})
