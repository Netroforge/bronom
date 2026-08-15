import { describe, expect, it } from 'vitest'
import {
  DEFAULT_INTERFACE_SCALE,
  INTERFACE_SCALE_OPTIONS,
  isInterfaceScale,
  scaleShellMetric
} from '../src/shared/interface-scale.js'

describe('interface scale', () => {
  it('provides a readable default and a bounded explicit scale', () => {
    expect(DEFAULT_INTERFACE_SCALE).toBe(1.1)
    expect(INTERFACE_SCALE_OPTIONS.map((option) => option.value)).toEqual([1, 1.1, 1.25])
    expect(INTERFACE_SCALE_OPTIONS.every((option) => isInterfaceScale(option.value))).toBe(true)
  })

  it('maps CSS shell geometry to Electron content coordinates', () => {
    expect(scaleShellMetric(105, 1)).toBe(105)
    expect(scaleShellMetric(105, 1.1)).toBe(116)
    expect(scaleShellMetric(320, 1.25)).toBe(400)
  })

  it('rejects unsafe geometry inputs', () => {
    expect(scaleShellMetric(Number.NaN, 1.1)).toBe(0)
    expect(scaleShellMetric(-10, 1.1)).toBe(0)
    expect(scaleShellMetric(105, 0)).toBe(0)
  })
})
