import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useConsoleController } from '../../src/renderer/src/composables/useConsoleController.js'
import type { BrowserConsoleMessage, BrowserState, BrowserTabState } from '../../src/shared/types.js'

function tab(id = 'tab-1'): BrowserTabState {
  return {
    id,
    title: 'Example',
    url: 'https://example.test/app',
    loading: false,
    canGoBack: false,
    canGoForward: false,
    active: true,
    pinned: false,
    sleeping: false,
    humanInteractionLocked: false,
    preserveDiagnosticLogs: false,
    zoomPercent: 100,
    audible: false,
    muted: false,
    devToolsOpen: false
  }
}

function message(text: string): BrowserConsoleMessage {
  return {
    timestamp: '2026-08-21T12:00:00.000Z',
    level: 'error',
    message: text,
    lineNumber: 12,
    sourceId: 'https://example.test/app.js'
  }
}

function state(activeTab: BrowserTabState): BrowserState {
  return {
    tabs: [activeTab],
    closedTabs: [],
    activeTabId: activeTab.id,
    allHumanInteractionLocked: false,
    mcpUrl: '',
    profilePath: '/profile',
    mcpTabGroups: [],
    savedTabGroups: []
  }
}

function deferred<Value>() {
  let resolve!: (value: Value) => void
  const promise = new Promise<Value>((next) => (resolve = next))
  return { promise, resolve }
}

function createController() {
  const activeTab = ref<BrowserTabState | undefined>(tab())
  const open = ref(false)
  const accepted: BrowserState[] = []
  const browser = {
    listConsoleMessages: vi.fn(async () => [] as BrowserConsoleMessage[]),
    setDiagnosticLogPreservation: vi.fn(async () => state(tab()))
  }
  const controller = useConsoleController({
    activeTab,
    open,
    browser,
    translate: (key) => key,
    copyText: async () => true,
    acceptBrowserState: (next) => accepted.push(next),
    keepsSeparatePanelOpen: () => false
  })
  return { activeTab, open, accepted, browser, controller }
}

describe('console controller', () => {
  it('invalidates an in-flight refresh when reset on the same tab', async () => {
    const pending = deferred<BrowserConsoleMessage[]>()
    const { browser, controller } = createController()
    browser.listConsoleMessages.mockImplementationOnce(() => pending.promise)

    const loading = controller.refresh()
    controller.reset()
    pending.resolve([message('stale')])
    await loading

    expect(controller.messages.value).toEqual([])
    expect(controller.state.value).toBe('idle')
    controller.dispose()
  })

  it('ignores a response from the previously active tab', async () => {
    const pending = deferred<BrowserConsoleMessage[]>()
    const { activeTab, browser, controller } = createController()
    browser.listConsoleMessages.mockImplementationOnce(() => pending.promise)

    const loading = controller.refresh()
    activeTab.value = tab('tab-2')
    pending.resolve([message('old tab')])
    await loading

    expect(controller.messages.value).toEqual([])
    expect(controller.state.value).toBe('loading')
    controller.dispose()
  })

  it('publishes authoritative state after changing log preservation', async () => {
    const { accepted, browser, controller } = createController()
    const next = state({ ...tab(), preserveDiagnosticLogs: true })
    browser.setDiagnosticLogPreservation.mockResolvedValue(next)
    const input = document.createElement('input')
    input.checked = true

    await controller.updatePreservation({ currentTarget: input } as unknown as Event)

    expect(browser.setDiagnosticLogPreservation).toHaveBeenCalledWith('tab-1', true)
    expect(accepted).toEqual([next])
    controller.dispose()
  })
})
