import { ref, type Ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useWorkspaceEditorController } from '../../src/renderer/src/composables/useWorkspaceEditorController.js'
import type {
  BrowserState,
  BrowserTabGroupState,
  BrowserTabGroupUpdate,
  BrowserWorkspaceCreateOptions,
  BrowserWorkspaceStorageTransferOptions
} from '../../src/shared/types.js'

function workspace(id: string, name: string, isDefault = false): BrowserTabGroupState {
  return {
    id,
    name,
    color: isDefault ? 'blue' : 'purple',
    createdAt: '2026-08-22T00:00:00.000Z',
    lastUsedAt: '2026-08-22T00:00:00.000Z',
    tabCount: 0,
    activeTabId: null,
    isDefault,
    storageKind: isDefault ? 'default' : 'isolated',
    storageOriginCount: isDefault ? 2 : 1
  }
}

function browserState(locked = false): BrowserState {
  return {
    tabs: [],
    closedTabs: [],
    activeTabId: null,
    allHumanInteractionLocked: locked,
    mcpUrl: 'http://127.0.0.1:47812/mcp',
    profilePath: '/profile',
    mcpTabGroups: [workspace('default', 'Default', true), workspace('agent', 'Agent workspace')],
    savedTabGroups: []
  }
}

function createController(initialState = browserState()) {
  const state: Ref<BrowserState> = ref(initialState)
  const open = ref(false)
  const confirm = vi.fn(() => true)
  const browser = {
    getState: vi.fn(async () => state.value),
    createWorkspace: vi.fn(async (_options: BrowserWorkspaceCreateOptions) => state.value),
    updateTabGroup: vi.fn(async (_id: string, _updates: BrowserTabGroupUpdate) => state.value),
    listWorkspaceStorageOrigins: vi.fn(async (id: string) => id === 'default'
      ? ['https://default.example', 'https://shared.example']
      : ['https://agent.example']),
    transferWorkspaceStorage: vi.fn(async (options: BrowserWorkspaceStorageTransferOptions) => ({
      workspaceId: options.workspaceId,
      direction: options.direction,
      cookieCount: 2,
      localStorageOriginCount: 1,
      localStorageItemCount: 3,
      origins: options.origins ?? []
    })),
    closeWorkspace: vi.fn(async (_id: string) => state.value)
  }
  const syncState = vi.fn(async (next: Promise<BrowserState> | BrowserState) => {
    state.value = await Promise.resolve(next)
  })
  const controller = useWorkspaceEditorController({
    state,
    open,
    browser,
    syncState,
    translate: (key, parameters) => parameters ? `${key}:${JSON.stringify(parameters)}` : key,
    formatNumber: (value) => String(value),
    confirm
  })
  return { state, open, confirm, browser, syncState, controller }
}

describe('workspace editor controller', () => {
  it('creates a Default-forked workspace with only explicitly selected origins', async () => {
    const { open, browser, syncState, controller } = createController()
    await controller.openNew()
    controller.name.value = 'Focused fork'
    controller.storageMode.value = 'fork-default'
    controller.selectedOrigins.value = ['https://shared.example']

    await controller.save()

    expect(browser.createWorkspace).toHaveBeenCalledWith({
      name: 'Focused fork',
      color: 'purple',
      storage: 'fork-default',
      origins: ['https://shared.example']
    })
    expect(syncState).toHaveBeenCalledOnce()
    expect(open.value).toBe(false)
    controller.dispose()
  })

  it('reloads the source inventory when transfer direction changes and saves through syncState', async () => {
    const { browser, syncState, controller } = createController()
    await controller.openExisting('agent')
    expect(browser.listWorkspaceStorageOrigins).toHaveBeenCalledTimes(1)
    expect(browser.listWorkspaceStorageOrigins).toHaveBeenLastCalledWith('default')

    controller.transferDirection.value = 'to-default'
    await vi.waitFor(() => expect(browser.listWorkspaceStorageOrigins).toHaveBeenLastCalledWith('agent'))
    await vi.waitFor(() => expect(controller.originOptions.value).toEqual(['https://agent.example']))
    await controller.transferStorage()

    expect(browser.transferWorkspaceStorage).toHaveBeenCalledWith({
      workspaceId: 'agent',
      direction: 'to-default',
      origins: undefined
    })
    expect(controller.storageState.value).toBe('saved')
    expect(controller.storageMessage.value).toContain('"cookies":"2"')
    expect(syncState).toHaveBeenCalledTimes(2)
    controller.dispose()
  })

  it('blocks permanent close while global human interaction is locked', async () => {
    const { confirm, browser, controller } = createController(browserState(true))
    await controller.openExisting('agent')
    await controller.closeWorkspace()

    expect(confirm).not.toHaveBeenCalled()
    expect(browser.closeWorkspace).not.toHaveBeenCalled()
    expect(controller.error.value).toBe('runtime.workspace.unlock')
    controller.dispose()
  })
})
