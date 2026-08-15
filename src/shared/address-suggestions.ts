export type AddressSuggestionKind = 'tab' | 'bookmark' | 'history'
export type AddressSuggestionScope = 'all' | 'tabs' | 'bookmarks' | 'history'

export interface AddressSuggestion {
  id: string
  kind: AddressSuggestionKind
  title: string
  url: string
  tabId?: string
  faviconDataUrl?: string
  pinned?: boolean
  visitCount?: number
}

interface SuggestionTab {
  id: string
  title: string
  url: string
  pinned?: boolean
  faviconDataUrl?: string
}

interface SuggestionBookmark {
  id: string
  title: string
  url: string
}

interface SuggestionHistoryEntry {
  id: string
  title: string
  url: string
  visitCount: number
}

export interface AddressSuggestionInput {
  query: string
  activeTabId: string | null
  tabs: SuggestionTab[]
  bookmarks: SuggestionBookmark[]
  history: SuggestionHistoryEntry[]
  limit?: number
}

function parseQuery(rawQuery: string): { scope: AddressSuggestionScope; terms: string[] } {
  const query = rawQuery.trim()
  const match = query.match(/^@(tabs|bookmarks|history)(?:\s+|$)/i)
  const scope = (match?.[1]?.toLocaleLowerCase() ?? 'all') as AddressSuggestionScope
  const content = match ? query.slice(match[0].length) : query
  return {
    scope,
    terms: content.toLocaleLowerCase().split(/\s+/).filter(Boolean)
  }
}

function canonicalUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') parsed.hash = ''
    return parsed.href
  } catch {
    return url
  }
}

function matches(title: string, url: string, terms: string[]): boolean {
  if (!terms.length) return true
  const searchable = `${title} ${url}`.toLocaleLowerCase()
  return terms.every((term) => searchable.includes(term))
}

export function buildLocalAddressSuggestions(input: AddressSuggestionInput): AddressSuggestion[] {
  const { scope, terms } = parseQuery(input.query)
  if (scope === 'all' && !terms.length) return []
  const limit = Math.max(1, Math.min(20, Math.trunc(input.limit ?? 8)))
  const suggestions: AddressSuggestion[] = []
  const activeTab = input.tabs.find((tab) => tab.id === input.activeTabId)
  const seen = new Set(activeTab ? [canonicalUrl(activeTab.url)] : [])

  const add = (suggestion: AddressSuggestion): void => {
    if (suggestions.length >= limit || !matches(suggestion.title, suggestion.url, terms)) return
    const key = canonicalUrl(suggestion.url)
    if (seen.has(key)) return
    seen.add(key)
    suggestions.push(suggestion)
  }

  if (scope === 'all' || scope === 'tabs') {
    for (const tab of input.tabs) {
      if (tab.id === input.activeTabId || tab.url.startsWith('bronom://home')) continue
      add({
        id: `tab:${tab.id}`,
        kind: 'tab',
        title: tab.title || 'New tab',
        url: tab.url,
        tabId: tab.id,
        ...(tab.faviconDataUrl ? { faviconDataUrl: tab.faviconDataUrl } : {}),
        pinned: tab.pinned === true
      })
    }
  }
  if (scope === 'all' || scope === 'bookmarks') {
    for (const bookmark of input.bookmarks) {
      add({ id: `bookmark:${bookmark.id}`, kind: 'bookmark', title: bookmark.title, url: bookmark.url })
    }
  }
  if (scope === 'all' || scope === 'history') {
    for (const entry of input.history) {
      add({
        id: `history:${entry.id}`,
        kind: 'history',
        title: entry.title,
        url: entry.url,
        visitCount: entry.visitCount
      })
    }
  }
  return suggestions
}
