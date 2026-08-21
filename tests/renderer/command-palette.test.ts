import { fireEvent, render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CommandPalette from '../../src/renderer/src/components/CommandPalette.vue'
import { createBronomI18n } from '../../src/renderer/src/i18n.js'

describe('CommandPalette', () => {
  it('owns accessible filtering and delegates the selected command', async () => {
    const runCommand = vi.fn(async () => undefined)
    const view = render(CommandPalette, {
      global: { plugins: [createBronomI18n('en-US')] },
      props: {
        open: true,
        websiteAvailable: false,
        formatNumber: String,
        runCommand
      }
    })
    const user = userEvent.setup()
    const search = screen.getByRole('combobox', { name: 'Search commands' })

    expect(screen.getByRole('dialog', { name: 'Commands' })).toBeVisible()
    await user.type(search, 'settings')
    expect(screen.getByRole('option', { name: /Open Settings/ })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Enter}')
    await vi.waitFor(() => expect(runCommand).toHaveBeenCalledWith('settings'))
    expect(view.emitted()['update:open']?.at(-1)).toEqual([false])
  })

  it('ignores pointer events caused by a live command-list reflow', async () => {
    let now = 1_000
    const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now)
    const view = render(CommandPalette, {
      global: { plugins: [createBronomI18n('en-US')] },
      props: {
        open: true,
        websiteAvailable: true,
        formatNumber: String,
        runCommand: vi.fn()
      }
    })
    const settings = screen.getByRole('option', { name: /Open Settings/ })
    const history = screen.getByRole('option', { name: /Show browsing history/ })

    await fireEvent.pointerMove(settings, { clientX: 40, clientY: 80 })
    expect(settings).toHaveAttribute('aria-selected', 'true')
    await view.rerender({ websiteAvailable: false })
    await fireEvent.pointerMove(history, { clientX: 40, clientY: 80 })
    expect(settings).toHaveAttribute('aria-selected', 'true')
    await fireEvent.pointerMove(history, { clientX: 41, clientY: 80 })
    expect(settings).toHaveAttribute('aria-selected', 'true')
    now += 151
    await fireEvent.pointerMove(history, { clientX: 42, clientY: 80 })
    expect(history).toHaveAttribute('aria-selected', 'true')
    nowSpy.mockRestore()
  })

  it('accepts the first intentional pointer move after opening over a recently changed list', async () => {
    const now = 1_000
    const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now)
    const view = render(CommandPalette, {
      global: { plugins: [createBronomI18n('en-US')] },
      props: {
        open: false,
        websiteAvailable: false,
        formatNumber: String,
        runCommand: vi.fn()
      }
    })

    await view.rerender({ websiteAvailable: true })
    await view.rerender({ open: true })
    const settings = screen.getByRole('option', { name: /Open Settings/ })
    await fireEvent.pointerMove(settings, { clientX: 40, clientY: 80 })

    expect(settings).toHaveAttribute('aria-selected', 'true')
    nowSpy.mockRestore()
  })
})
