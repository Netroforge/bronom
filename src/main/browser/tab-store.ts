import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { defaultTabGroupColor, isBrowserTabGroupColor, type BrowserTabGroupColor } from '../../shared/tab-groups.js'
import {
  isBrowserSplitOrientation,
  normalizeSplitViewRatio,
  type BrowserSplitViewState
} from '../../shared/split-view.js'

export interface PersistedTab {
  id: string
  title: string
  url: string
  pinned?: boolean
  humanInteractionLocked?: boolean
  mcpGroupId?: string
}

export interface PersistedTabGroup {
  id: string
  name: string
  color: BrowserTabGroupColor
  createdAt: string
  lastUsedAt: string
  activeTabId?: string | null
}

export interface PersistedSavedTabGroup {
  id: string
  name: string
  color: BrowserTabGroupColor
  savedAt: string
  tabs: Array<Pick<PersistedTab, 'title' | 'url' | 'pinned'>>
}

export interface PersistedBrowserState {
  activeTabId: string | null
  splitView?: BrowserSplitViewState
  allHumanInteractionLocked?: boolean
  defaultHumanGroupId?: string
  tabs: PersistedTab[]
  mcpTabGroups?: PersistedTabGroup[]
  savedTabGroups?: PersistedSavedTabGroup[]
}

export class TabStateStore {
  constructor(private readonly path: string) {}

  async load(): Promise<PersistedBrowserState | null> {
    try {
      const data = JSON.parse(await readFile(this.path, 'utf8')) as PersistedBrowserState
      if (!Array.isArray(data.tabs)) return null
      return {
        activeTabId: typeof data.activeTabId === 'string' ? data.activeTabId : null,
        ...(data.splitView
          && typeof data.splitView.firstTabId === 'string'
          && typeof data.splitView.secondTabId === 'string'
          && data.splitView.firstTabId !== data.splitView.secondTabId
          && isBrowserSplitOrientation(data.splitView.orientation)
          && typeof data.splitView.ratio === 'number'
          ? {
              splitView: {
                firstTabId: data.splitView.firstTabId,
                secondTabId: data.splitView.secondTabId,
                orientation: data.splitView.orientation,
                ratio: normalizeSplitViewRatio(data.splitView.ratio)
              }
            }
          : {}),
        allHumanInteractionLocked: data.allHumanInteractionLocked === true,
        ...(typeof data.defaultHumanGroupId === 'string' ? { defaultHumanGroupId: data.defaultHumanGroupId } : {}),
        mcpTabGroups: Array.isArray(data.mcpTabGroups)
          ? data.mcpTabGroups.filter((group): group is PersistedTabGroup => (
            typeof group?.id === 'string'
            && typeof group.name === 'string'
            && typeof group.createdAt === 'string'
            && typeof group.lastUsedAt === 'string'
          )).map((group) => ({
            ...group,
            color: isBrowserTabGroupColor(group.color) ? group.color : defaultTabGroupColor(group.id),
            activeTabId: typeof group.activeTabId === 'string' ? group.activeTabId : null
          }))
          : [],
        savedTabGroups: Array.isArray(data.savedTabGroups)
          ? data.savedTabGroups.filter((group): group is PersistedSavedTabGroup => (
            typeof group?.id === 'string'
            && typeof group.name === 'string'
            && typeof group.savedAt === 'string'
            && Array.isArray(group.tabs)
          )).map((group) => ({
            id: group.id,
            name: group.name,
            color: isBrowserTabGroupColor(group.color) ? group.color : defaultTabGroupColor(group.id),
            savedAt: group.savedAt,
            tabs: group.tabs.filter((tab) => (
              typeof tab?.title === 'string' && typeof tab.url === 'string'
            )).map((tab) => ({
              title: tab.title,
              url: tab.url,
              pinned: tab.pinned === true
            }))
          })).filter((group) => group.tabs.length > 0)
          : [],
        tabs: data.tabs.filter(
          (tab): tab is PersistedTab =>
            typeof tab?.id === 'string' && typeof tab.title === 'string' && typeof tab.url === 'string'
        ).map((tab) => ({
          id: tab.id,
          title: tab.title,
          url: tab.url,
          pinned: tab.pinned === true,
          humanInteractionLocked: tab.humanInteractionLocked === true,
          ...(typeof tab.mcpGroupId === 'string' ? { mcpGroupId: tab.mcpGroupId } : {})
        }))
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
      return null
    }
  }

  async save(state: PersistedBrowserState): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true })
    const temporaryPath = `${this.path}.tmp`
    await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
    await rename(temporaryPath, this.path)
  }
}
