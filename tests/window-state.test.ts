import { describe, expect, it } from 'vitest'
import { restoreWindowBounds, type DisplayLike, type SavedWindowState } from '../src/main/window-state.js'

const displays: DisplayLike[] = [
  { id: 1, workArea: { x: 0, y: 0, width: 1920, height: 1080 } },
  { id: 2, workArea: { x: 1920, y: 0, width: 2560, height: 1440 } }
]

describe('restoreWindowBounds', () => {
  it('restores the saved position on the same display', () => {
    const saved: SavedWindowState = {
      bounds: { x: 2200, y: 180, width: 1400, height: 900 },
      displayId: 2,
      maximized: false,
      fullScreen: false
    }
    expect(restoreWindowBounds(saved, displays, { width: 1200, height: 800 })).toEqual(saved.bounds)
  })

  it('keeps an oversized or partially off-screen window inside the display', () => {
    const saved: SavedWindowState = {
      bounds: { x: 4300, y: 1300, width: 3000, height: 2000 },
      displayId: 2,
      maximized: false,
      fullScreen: false
    }
    expect(restoreWindowBounds(saved, displays, { width: 1200, height: 800 })).toEqual({
      x: 1920,
      y: 0,
      width: 2560,
      height: 1440
    })
  })

  it('centers on the primary display when the saved display is disconnected', () => {
    const saved: SavedWindowState = {
      bounds: { x: 3000, y: 100, width: 1200, height: 800 },
      displayId: 99,
      maximized: false,
      fullScreen: false
    }
    expect(restoreWindowBounds(saved, displays, { width: 1200, height: 800 })).toEqual({
      x: 360,
      y: 140,
      width: 1200,
      height: 800
    })
  })
})
