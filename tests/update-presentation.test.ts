import { describe, expect, it } from 'vitest'
import {
  shellHeightForOverlays,
  shouldShowUpdateStatusPill,
  shouldAutoDismissUpdateStatus
} from '../src/shared/update-presentation.js'

describe('update notification presentation', () => {
  it('shows active update feedback in the status area', () => {
    expect(shouldShowUpdateStatusPill('checking')).toBe(true)
    expect(shouldShowUpdateStatusPill('up-to-date')).toBe(true)
    expect(shouldShowUpdateStatusPill('available')).toBe(true)
    expect(shouldShowUpdateStatusPill('downloading')).toBe(true)
    expect(shouldShowUpdateStatusPill('downloaded')).toBe(true)
    expect(shouldShowUpdateStatusPill('install-error')).toBe(true)
    expect(shouldShowUpdateStatusPill('error')).toBe(true)
    expect(shouldShowUpdateStatusPill('disabled')).toBe(true)
    expect(shouldShowUpdateStatusPill('idle')).toBe(false)
  })

  it('auto-dismisses only the successful up-to-date result', () => {
    expect(shouldAutoDismissUpdateStatus('up-to-date')).toBe(true)
    expect(shouldAutoDismissUpdateStatus('checking')).toBe(false)
    expect(shouldAutoDismissUpdateStatus('available')).toBe(false)
  })

  it('keeps status indicators out of the webpage layout', () => {
    expect(shellHeightForOverlays({
      shellHeight: 104,
      viewportHeight: 900,
      modalOpen: false
    })).toBe(104)
  })

  it('moves the website below a floating shell panel', () => {
    expect(shellHeightForOverlays({
      shellHeight: 104,
      viewportHeight: 900,
      modalOpen: false,
      floatingOverlayBottom: 584.2
    })).toBe(585)
  })

  it('reserves the full surface for a modal shell overlay', () => {
    expect(shellHeightForOverlays({
      shellHeight: 104,
      viewportHeight: 900,
      modalOpen: true,
      floatingOverlayBottom: 584
    })).toBe(900)
  })
})
