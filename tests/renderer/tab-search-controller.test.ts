import { nextTick, ref, type Ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useTabSearchController } from '../../src/renderer/src/composables/useTabSearchController.js'
import type {
  BrowserSavedTabGroupState,
  BrowserState,
  BrowserTabState
} from '../../src/shared/types.js'

function tab(id: string, active = false): BrowserTabState {
  return {
    id,
    title: `Tab ${id}`,
    url: `https://${id}.example`,
    loading: false,
    canGoBack: false,
    canGoForward: false,
    active,
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

function savedGroup(id: string): BrowserSavedTabGroupState {
  return {
    id,
    name: `Saved ${id}`,
    color: 'purple',
    savedAt: '2026-08-22T00:00:00.000Z',
    storageOriginCount: 0,
    tabs: [{ title: 'Saved page', url: 'https://saved.example', pinned: false }]
  }
}

function browserState(tabs: BrowserTabState[] = [tab('alpha'), tab('beta', true)]): BrowserState {
  return {
    tabs,
    closedTabs: [],
    activeTabId: tabs.find((candidate) => candidate.active)?.id ?? null,
    allHumanInteractionLocked: false,
    mcpUrl: 'http://127.0.0.1:47812/mcp',
    profilePath: '/profile',
    mcpTabGroups: [],
    savedTabGroups: []
  }
}

function createController(initialState = browserState()) {
  const state: Ref<BrowserState> = ref(initialState)
  const open = ref(false)
  const selectTab = vi.fn(async () => undefined)
  const expandTabGroup = vi.fn()
  const browser = {
    closeTab: vi.fn(async () => state.value),
    reopenClosedTab: vi.fn(async () => state.value),
    setTabPinned: vi.fn(async () => state.value),
    restoreSavedTabGroup: vi.fn(async () => state.value),
    deleteSavedTabGroup: vi.fn(async () => state.value)
  }
  const syncState = vi.fn(async (next: Promise<BrowserState> | BrowserState) => {
    state.value = await Promise.resolve(next)
  })
  const controller = useTabSearchController({
    state,
    open,
    mcpActivityByTab: ref({}),
    browser,
    syncState,
    selectTab,
    expandTabGroup,
    translate: (key) => key,
    formatNumber: String,
    formatTime: String,
    describeEmulation: () => '',
    confirm: () => true,
    formatError: (_cause, fallback) => fallback,
    showError: vi.fn()
  })
  return { state, open, selectTab, expandTabGroup, browser, syncState, controller }
}

describe('tab search controller', () => {
  it('preserves the selected item identity when live results are inserted or reordered', async () => {
    const { state, controller } = createController()
    await controller.openPanel()
    expect(controller.selectedResult.value).toMatchObject({ kind: 'open', tab: { id: 'beta' } })

    state.value = { ...state.value, savedTabGroups: [savedGroup('research')] }
    expect(controller.selection.value).toBe(2)
    expect(controller.selectedResult.value).toMatchObject({ kind: 'open', tab: { id: 'beta' } })

    state.value = { ...state.value, tabs: [tab('beta', true), tab('alpha')] }
    expect(controller.selection.value).toBe(1)
    expect(controller.selectedResult.value).toMatchObject({ kind: 'open', tab: { id: 'beta' } })
    controller.dispose()
  })

  it('runs the still-selected tab after an archived workspace appears ahead of it', async () => {
    const { state, open, selectTab, expandTabGroup, controller } = createController()
    await controller.openPanel()
    state.value = { ...state.value, savedTabGroups: [savedGroup('research')] }

    controller.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }))
    await vi.waitFor(() => expect(selectTab).toHaveBeenCalledWith('beta'))

    expect(expandTabGroup).toHaveBeenCalledWith(expect.objectContaining({ id: 'beta' }))
    expect(open.value).toBe(false)
    controller.dispose()
  })

  it('resets selection to the first match when the search query changes', async () => {
    const { controller } = createController()
    await controller.openPanel()
    controller.query.value = 'alpha'
    await nextTick()

    expect(controller.selection.value).toBe(0)
    expect(controller.selectedResult.value).toMatchObject({ kind: 'open', tab: { id: 'alpha' } })
    controller.dispose()
  })

  it('does not reopen after it is closed while initial focus is still pending', async () => {
    const { open, controller } = createController()
    const opening = controller.openPanel()
    controller.close()
    await opening

    expect(open.value).toBe(false)
    controller.dispose()
  })
})
