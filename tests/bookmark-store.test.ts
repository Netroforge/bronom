import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { BookmarkStore, normalizeBookmarkUrl } from '../src/main/bookmark-store.js'

const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

async function createStore(): Promise<{ path: string; store: BookmarkStore }> {
  const directory = await mkdtemp(join(tmpdir(), 'bronom-bookmarks-test-'))
  temporaryDirectories.push(directory)
  const path = join(directory, 'profile', 'bookmarks.json')
  return { path, store: new BookmarkStore(path) }
}

describe('BookmarkStore', () => {
  it('atomically persists, restores, renames, and removes bookmarks', async () => {
    const { path, store } = await createStore()
    const first = await store.add({ url: 'https://example.com/docs', title: '  Example   docs  ' })
    expect(first).toMatchObject({ url: 'https://example.com/docs', title: 'Example docs' })
    await store.rename(first.id, 'Reference')
    expect((await new BookmarkStore(path).load())[0]).toMatchObject({ id: first.id, title: 'Reference' })
    expect(JSON.parse(await readFile(path, 'utf8'))).toMatchObject({ version: 1 })
    expect(await store.remove(first.id)).toBe(true)
    expect(store.list()).toEqual([])
  })

  it('updates an existing URL instead of creating a duplicate', async () => {
    const { store } = await createStore()
    const first = await store.add({ url: 'https://example.com/', title: 'First' })
    const updated = await store.add({ url: 'https://example.com', title: 'Updated' })
    expect(updated.id).toBe(first.id)
    expect(store.list()).toHaveLength(1)
    expect(store.list()[0]!.title).toBe('Updated')
  })

  it('ignores malformed persisted entries and duplicate URLs', async () => {
    const { path, store } = await createStore()
    await mkdir(join(path, '..'), { recursive: true })
    const now = new Date().toISOString()
    await writeFile(path, JSON.stringify({
      version: 1,
      bookmarks: [
        { id: 'one', url: 'https://example.com/', title: 'One', createdAt: now, updatedAt: now },
        { id: 'two', url: 'https://example.com/', title: 'Duplicate', createdAt: now, updatedAt: now },
        { id: 'unsafe', url: 'javascript:alert(1)', title: 'Unsafe', createdAt: now, updatedAt: now }
      ]
    }), 'utf8')
    expect(await store.load()).toEqual([expect.objectContaining({ id: 'one' })])
  })

  it.each(['javascript:alert(1)', 'file:///tmp/test', 'about:blank', 'not a URL'])('rejects unsafe bookmark URL %s', (url) => {
    expect(normalizeBookmarkUrl(url)).toBeNull()
  })
})
