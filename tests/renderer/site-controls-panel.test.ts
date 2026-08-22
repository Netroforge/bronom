import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SiteControlsPanel from '../../src/renderer/src/components/SiteControlsPanel.vue'
import { createBronomI18n } from '../../src/renderer/src/i18n.js'
import type { SitePermissionEntry } from '../../src/shared/types.js'

const cameraPermission: SitePermissionEntry = {
  origin: 'https://example.test',
  permission: 'media',
  decision: 'allow'
}

function renderPanel() {
  const setPermission = vi.fn()
  const resetPermission = vi.fn()
  const openPermissionSettings = vi.fn()
  const openPrivacySettings = vi.fn()
  const view = render(SiteControlsPanel, {
    global: { plugins: [createBronomI18n('en-US')] },
    props: {
      open: true,
      dock: 'right',
      hostname: 'example.test',
      addressKind: 'Secure',
      origin: 'https://example.test',
      summary: { origin: 'https://example.test', cookieCount: 2, historyEntries: 3, historyVisits: 5 },
      state: 'idle',
      message: '',
      permissions: [cameraPermission],
      usesDefaultProfile: true,
      locale: 'en-US',
      permissionLabel: () => 'Camera',
      setPermission,
      resetPermission,
      openPermissionSettings,
      openPrivacySettings
    }
  })
  return { view, setPermission, resetPermission, openPermissionSettings, openPrivacySettings }
}

describe('SiteControlsPanel', () => {
  it('owns site summary and permission interactions', async () => {
    const { setPermission, resetPermission, openPermissionSettings, openPrivacySettings } = renderPanel()
    const user = userEvent.setup()

    expect(screen.getByRole('dialog', { name: 'example.test' })).toBeVisible()
    expect(screen.getByText('2')).toBeVisible()
    expect(screen.getByText('3')).toBeVisible()
    await user.selectOptions(screen.getByRole('combobox', { name: /Camera/ }), 'deny')
    await user.click(screen.getByTitle('Reset to default'))
    await user.click(screen.getByRole('button', { name: 'All site settings' }))
    await user.click(screen.getByRole('button', { name: 'Clear data for this website' }))

    expect(setPermission).toHaveBeenCalledWith(cameraPermission, expect.any(Event))
    expect(resetPermission).toHaveBeenCalledWith(cameraPermission)
    expect(openPermissionSettings).toHaveBeenCalledOnce()
    expect(openPrivacySettings).toHaveBeenCalledOnce()
  })

  it('emits dock and close model changes', async () => {
    const { view } = renderPanel()
    const user = userEvent.setup()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Dock site controls' }), 'bottom')
    await user.click(screen.getByRole('button', { name: 'Close site controls' }))

    expect(view.emitted()['update:dock']?.at(-1)).toEqual(['bottom'])
    expect(view.emitted()['update:open']?.at(-1)).toEqual([false])
  })
})
