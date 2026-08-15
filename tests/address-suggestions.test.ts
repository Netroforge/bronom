import { describe, expect, it } from 'vitest'
import { buildLocalAddressSuggestions } from '../src/shared/address-suggestions.js'

describe('buildLocalAddressSuggestions', () => {
  const tabs = [
    { id: 'active', title: 'Current project', url: 'https://current.example/path' },
    { id: 'docs', title: 'Project documentation', url: 'https://docs.example/guide#intro', pinned: true }
  ]
  const bookmarks = [
    { id: 'duplicate', title: 'Saved documentation', url: 'https://docs.example/guide' },
    { id: 'design', title: 'Design reference', url: 'https://design.example/' }
  ]
  const history = [
    { id: 'docs-history', title: 'Old docs visit', url: 'https://docs.example/guide#old', visitCount: 4 },
    { id: 'release', title: 'Project release notes', url: 'https://release.example/', visitCount: 2 }
  ]

  it('prioritizes open tabs and deduplicates local URLs across sources', () => {
    expect(buildLocalAddressSuggestions({
      query: 'project',
      activeTabId: 'active',
      tabs,
      bookmarks,
      history
    })).toEqual([
      expect.objectContaining({ kind: 'tab', title: 'Project documentation', tabId: 'docs', pinned: true }),
      expect.objectContaining({ kind: 'history', title: 'Project release notes', visitCount: 2 })
    ])
  })

  it('supports explicit local scopes, multi-term matching, and bounded output', () => {
    expect(buildLocalAddressSuggestions({
      query: '@bookmarks design reference',
      activeTabId: 'active',
      tabs,
      bookmarks,
      history
    })).toEqual([
      expect.objectContaining({ kind: 'bookmark', title: 'Design reference' })
    ])
    expect(buildLocalAddressSuggestions({
      query: '@history',
      activeTabId: 'active',
      tabs,
      bookmarks,
      history,
      limit: 1
    })).toEqual([
      expect.objectContaining({ kind: 'history', title: 'Old docs visit' })
    ])
  })

  it('does not suggest anything for an empty unscoped query or the active URL', () => {
    expect(buildLocalAddressSuggestions({ query: '', activeTabId: 'active', tabs, bookmarks, history })).toEqual([])
    expect(buildLocalAddressSuggestions({ query: 'current', activeTabId: 'active', tabs, bookmarks, history })).toEqual([])
  })
})
