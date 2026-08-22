import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SupportSettingsPanel from '../../src/renderer/src/components/SupportSettingsPanel.vue'
import { useCommercialLicenseController } from '../../src/renderer/src/composables/useCommercialLicenseController.js'
import { createBronomI18n } from '../../src/renderer/src/i18n.js'
import type { BronomLicenseApi, CommercialLicenseState } from '../../src/shared/types.js'

function deferred<Value>() {
  let resolve!: (value: Value) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<Value>((next, fail) => {
    resolve = next
    reject = fail
  })
  return { promise, resolve, reject }
}

function license(overrides: Partial<CommercialLicenseState> = {}): CommercialLicenseState {
  return {
    status: 'not-activated',
    active: false,
    secureStorageAvailable: true,
    ...overrides
  }
}

function renderPanel(initial = license()) {
  const activate = vi.fn(async () => license({ status: 'active', active: true, maskedKey: '••••-TEST' }))
  const api: BronomLicenseApi = {
    getState: vi.fn(async () => initial),
    activate,
    refresh: vi.fn(async () => initial),
    deactivate: vi.fn(async () => license()),
    onChanged: vi.fn(() => () => undefined)
  }
  const controller = useCommercialLicenseController({
    api,
    confirmDeactivate: () => true,
    emptyKeyMessage: () => 'Enter a supporter key.',
    formatError: (error) => error instanceof Error ? error.message : String(error)
  })
  controller.accept(initial)
  const rendered = render(SupportSettingsPanel, {
    global: { plugins: [createBronomI18n('en-US')] },
    props: {
      controller,
      formatNumber: (value: number) => String(value),
      formatDateTime: (value: string) => `formatted:${value}`
    }
  })
  return { activate, controller, rendered }
}

describe('SupportSettingsPanel', () => {
  it('renders active license metadata and formats validation details', () => {
    const { controller } = renderPanel(license({
      status: 'active',
      active: true,
      maskedKey: '••••-MNOP',
      activations: 2,
      activationLimit: 3,
      lastValidatedAt: '2026-08-22T12:00:00.000Z'
    }))

    expect(screen.getByRole('heading', { name: 'Thank you for supporting Bronom' })).toBeVisible()
    expect(screen.getByText(/••••-MNOP/)).toBeVisible()
    expect(screen.getByText(/2 of 3 device activations used/)).toHaveTextContent('formatted:2026-08-22T12:00:00.000Z')
    controller.dispose()
  })

  it('disables activation controls while a request is pending and clears the accepted key', async () => {
    const activating = deferred<CommercialLicenseState>()
    const { activate, controller } = renderPanel()
    activate.mockImplementationOnce(() => activating.promise)
    const user = userEvent.setup()
    const key = screen.getByLabelText('Supporter key')

    await user.type(key, 'ABCD-EFGH-IJKL-MNOP')
    await user.click(screen.getByRole('button', { name: 'Activate supporter key' }))

    expect(key).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Activating…' })).toBeDisabled()
    activating.resolve(license({ status: 'active', active: true, maskedKey: '••••-MNOP' }))
    await vi.waitFor(() => expect(controller.busy.value).toBe(false))
    expect(controller.keyDraft.value).toBe('')
    controller.dispose()
  })

  it('announces a provider failure once when the live state carries the same message', async () => {
    const activating = deferred<CommercialLicenseState>()
    const { activate, controller } = renderPanel()
    activate.mockImplementationOnce(() => activating.promise)
    controller.keyDraft.value = 'ABCD-EFGH-IJKL-MNOP'

    const operation = controller.activate()
    controller.accept(license({ message: 'Supporter service unavailable' }))
    activating.reject(new Error('Supporter service unavailable'))
    await expect(operation).resolves.toBe(false)

    expect(screen.getAllByText('Supporter service unavailable')).toHaveLength(1)
    expect(screen.getByRole('alert')).toHaveTextContent('Supporter service unavailable')
    controller.dispose()
  })

  it('emits external support links without navigating inside the component', async () => {
    const { controller, rendered } = renderPanel()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Apache 2.0 license ↗' }))

    expect(rendered.emitted().openUrl).toEqual([['https://github.com/Netroforge/bronom/blob/main/LICENSE']])
    controller.dispose()
  })
})
