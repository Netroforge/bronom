import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { HistoryStore, normalizeHistoryUrl } from '../src/main/history-store.js'

const directories: string[] = []

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

async function storeAt(now = Date.UTC(2026, 7, 13)): Promise<{ path: string; store: HistoryStore }> {
  const directory = await mkdtemp(join(tmpdir(), 'bronom-history-'))
  directories.push(directory)
  const path = join(directory, 'history.json')
  return { path, store: new HistoryStore(path, () => now) }
}

describe('HistoryStore', () => {
  it('normalizes safe web addresses and removes credentials and fragments', () => {
    expect(normalizeHistoryUrl('https://user:secret@example.com/path?q=1#private')).toBe('https://example.com/path?q=1')
    expect(normalizeHistoryUrl('bronom://home/')).toBeNull()
    expect(normalizeHistoryUrl('data:text/plain,secret')).toBeNull()
  })

  it('persists visits, deduplicates addresses, and increments visit counts', async () => {
    const { path, store } = await storeAt()
    await store.record({ url: 'https://example.com/page#first', title: ' First   title ' })
    await store.record({ url: 'https://example.com/page#second', title: 'Updated title' })
    expect(store.list()).toEqual([
      expect.objectContaining({ url: 'https://example.com/page', title: 'Updated title', visitCount: 2 })
    ])
    const restored = new HistoryStore(path, () => Date.UTC(2026, 7, 13))
    await restored.load()
    expect(restored.list()).toEqual(store.list())
  })

  it('supports individual removal and clearing without touching another store', async () => {
    const { path, store } = await storeAt()
    const first = await store.record({ url: 'https://one.example/', title: 'One' })
    await store.record({ url: 'https://two.example/', title: 'Two' })
    expect(first).not.toBeNull()
    await store.remove(first!.id)
    expect(store.list()).toHaveLength(1)
    await store.clear()
    expect(store.list()).toEqual([])
    expect(JSON.parse(await readFile(path, 'utf8')).entries).toEqual([])
  })

  it('clears history for one exact website origin', async () => {
    const { store } = await storeAt()
    await store.record({ url: 'https://example.com/one', title: 'One' })
    await store.record({ url: 'https://example.com/two', title: 'Two' })
    await store.record({ url: 'https://other.example.com/', title: 'Other' })
    await store.record({ url: 'http://example.com/', title: 'Different scheme' })

    expect(await store.clearOrigin('https://example.com')).toBe(2)
    expect(store.list().map((entry) => entry.url).sort()).toEqual([
      'http://example.com/',
      'https://other.example.com/'
    ])
  })

  it('drops expired, malformed, unsafe, and duplicate persisted entries', async () => {
    const now = Date.UTC(2026, 7, 13)
    const { path, store } = await storeAt(now)
    const recent = new Date(now - 1_000).toISOString()
    const expired = new Date(now - 91 * 24 * 60 * 60 * 1_000).toISOString()
    await writeFile(path, JSON.stringify({
      version: 1,
      entries: [
        { id: 'new', url: 'https://example.com/', title: 'New', visitedAt: recent, visitCount: 2 },
        { id: 'duplicate', url: 'https://example.com/', title: 'Duplicate', visitedAt: recent, visitCount: 1 },
        { id: 'old', url: 'https://old.example/', title: 'Old', visitedAt: expired, visitCount: 1 },
        { id: 'unsafe', url: 'file:///secret', title: 'Unsafe', visitedAt: recent, visitCount: 1 },
        { broken: true }
      ]
    }))
    await store.load()
    expect(store.list()).toEqual([expect.objectContaining({ id: 'new' })])
  })
})
