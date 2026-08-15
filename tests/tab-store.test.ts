import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { TabStateStore } from '../src/main/browser/tab-store.js'
import { defaultTabGroupColor } from '../src/shared/tab-groups.js'

const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

async function createStore(): Promise<{ path: string; store: TabStateStore }> {
  const directory = await mkdtemp(join(tmpdir(), 'bronom-test-'))
  temporaryDirectories.push(directory)
  const path = join(directory, 'state', 'tabs.json')
  return { path, store: new TabStateStore(path) }
}

describe('TabStateStore', () => {
  it('atomically persists and restores tab state', async () => {
    const { path, store } = await createStore()
    const state = {
      activeTabId: 'tab-2',
      allHumanInteractionLocked: true,
      tabs: [
        { id: 'tab-1', title: 'One', url: 'https://one.example', pinned: true, humanInteractionLocked: true },
        { id: 'tab-2', title: 'Two', url: 'https://two.example' }
      ]
    }
    await store.save(state)
    expect(JSON.parse(await readFile(path, 'utf8'))).toEqual(state)
    expect(await store.load()).toEqual({
      ...state,
      mcpTabGroups: [],
      savedTabGroups: [],
      tabs: [
        state.tabs[0],
        { ...state.tabs[1], pinned: false, humanInteractionLocked: false }
      ]
    })
  })

  it('loads pre-lock state files with interaction unlocked', async () => {
    const { path, store } = await createStore()
    await mkdir(join(path, '..'), { recursive: true })
    await writeFile(path, JSON.stringify({
      activeTabId: 'legacy-tab',
      tabs: [{ id: 'legacy-tab', title: 'Legacy', url: 'https://legacy.example' }]
    }), 'utf8')

    expect(await store.load()).toEqual({
      activeTabId: 'legacy-tab',
      allHumanInteractionLocked: false,
      mcpTabGroups: [],
      savedTabGroups: [],
      tabs: [{
        id: 'legacy-tab',
        title: 'Legacy',
        url: 'https://legacy.example',
        pinned: false,
        humanInteractionLocked: false
      }]
    })
  })

  it('persists tab groups and tab ownership across restarts', async () => {
    const { store } = await createStore()
    const state = {
      activeTabId: 'agent-tab',
      defaultHumanGroupId: '7298fc5e-42e2-4ae5-a1ee-dbec515369f1',
      mcpTabGroups: [{
        id: '7298fc5e-42e2-4ae5-a1ee-dbec515369f1',
        name: 'Checkout debugging',
        color: 'orange' as const,
        createdAt: '2026-08-14T09:00:00.000Z',
        lastUsedAt: '2026-08-14T09:01:00.000Z',
        activeTabId: 'agent-tab'
      }],
      savedTabGroups: [{
        id: 'f1395ff9-b3bd-48cb-95fa-f221ba78d65c',
        name: 'Saved checkout research',
        color: 'blue' as const,
        savedAt: '2026-08-14T09:02:00.000Z',
        tabs: [{ title: 'Orders', url: 'https://shop.example/orders', pinned: true }]
      }],
      tabs: [{
        id: 'agent-tab',
        title: 'Checkout',
        url: 'https://shop.example/checkout',
        mcpGroupId: '7298fc5e-42e2-4ae5-a1ee-dbec515369f1'
      }]
    }
    await store.save(state)
    expect(await store.load()).toEqual({
      ...state,
      allHumanInteractionLocked: false,
      tabs: [{ ...state.tabs[0], pinned: false, humanInteractionLocked: false }]
    })
  })

  it('persists a bounded split-view layout', async () => {
    const { path, store } = await createStore()
    await mkdir(join(path, '..'), { recursive: true })
    await writeFile(path, JSON.stringify({
      activeTabId: 'second',
      splitView: {
        firstTabId: 'first',
        secondTabId: 'second',
        orientation: 'horizontal',
        ratio: 0.9
      },
      tabs: [
        { id: 'first', title: 'First', url: 'https://first.example' },
        { id: 'second', title: 'Second', url: 'https://second.example' }
      ]
    }), 'utf8')

    expect((await store.load())?.splitView).toEqual({
      firstTabId: 'first',
      secondTabId: 'second',
      orientation: 'horizontal',
      ratio: 0.75
    })
  })

  it('assigns a stable palette color to tab groups saved before colors were supported', async () => {
    const { path, store } = await createStore()
    const groupId = '7298fc5e-42e2-4ae5-a1ee-dbec515369f1'
    await mkdir(join(path, '..'), { recursive: true })
    await writeFile(path, JSON.stringify({
      activeTabId: null,
      tabs: [],
      mcpTabGroups: [{
        id: groupId,
        name: 'Legacy group',
        createdAt: '2026-08-14T09:00:00.000Z',
        lastUsedAt: '2026-08-14T09:01:00.000Z'
      }]
    }), 'utf8')

    expect((await store.load())?.mcpTabGroups).toEqual([expect.objectContaining({
      id: groupId,
      color: defaultTabGroupColor(groupId)
    })])
  })

  it('returns null for missing and malformed files', async () => {
    const { path, store } = await createStore()
    expect(await store.load()).toBeNull()
    await mkdir(join(path, '..'), { recursive: true })
    await writeFile(path, '{not json', 'utf8')
    expect(await store.load()).toBeNull()
  })
})
