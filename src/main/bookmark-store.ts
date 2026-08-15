import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { BrowserBookmark } from '../shared/types.js'

const MAX_BOOKMARKS = 500
const MAX_BOOKMARK_TITLE = 200
const MAX_BOOKMARK_URL = 4_096

interface PersistedBookmarks {
  version: 1
  bookmarks: BrowserBookmark[]
}

export function normalizeBookmarkUrl(value: string): string | null {
  if (!value || value.length > MAX_BOOKMARK_URL) return null
  try {
    const url = new URL(value)
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname) return null
    return url.href
  } catch {
    return null
  }
}

function normalizeBookmarkTitle(value: string, url: string): string {
  const title = value.replace(/\s+/g, ' ').trim().slice(0, MAX_BOOKMARK_TITLE)
  return title || new URL(url).hostname
}

function validBookmark(value: unknown): value is BrowserBookmark {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<BrowserBookmark>
  return (
    typeof entry.id === 'string' && entry.id.length > 0 && entry.id.length <= 128 &&
    typeof entry.url === 'string' && normalizeBookmarkUrl(entry.url) === entry.url &&
    typeof entry.title === 'string' && entry.title.length > 0 && entry.title.length <= MAX_BOOKMARK_TITLE &&
    typeof entry.createdAt === 'string' && Number.isFinite(Date.parse(entry.createdAt)) &&
    typeof entry.updatedAt === 'string' && Number.isFinite(Date.parse(entry.updatedAt))
  )
}

export class BookmarkStore {
  private readonly entries = new Map<string, BrowserBookmark>()
  private saveQueue: Promise<void> = Promise.resolve()

  constructor(private readonly path: string) {}

  async load(): Promise<BrowserBookmark[]> {
    this.entries.clear()
    try {
      const value = JSON.parse(await readFile(this.path, 'utf8')) as Partial<PersistedBookmarks>
      if (value.version !== 1 || !Array.isArray(value.bookmarks)) return []
      const seenUrls = new Set<string>()
      for (const entry of value.bookmarks) {
        if (!validBookmark(entry) || seenUrls.has(entry.url) || this.entries.size >= MAX_BOOKMARKS) continue
        seenUrls.add(entry.url)
        this.entries.set(entry.id, { ...entry })
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
    }
    return this.list()
  }

  list(): BrowserBookmark[] {
    return [...this.entries.values()]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.title.localeCompare(right.title))
      .map((entry) => ({ ...entry }))
  }

  get(id: string): BrowserBookmark | undefined {
    const entry = this.entries.get(id)
    return entry ? { ...entry } : undefined
  }

  findByUrl(value: string): BrowserBookmark | undefined {
    const url = normalizeBookmarkUrl(value)
    if (!url) return undefined
    const entry = [...this.entries.values()].find((candidate) => candidate.url === url)
    return entry ? { ...entry } : undefined
  }

  async add(value: { url: string; title: string }): Promise<BrowserBookmark> {
    const url = normalizeBookmarkUrl(value.url)
    if (!url) throw new TypeError('Bookmark URL must be an HTTP or HTTPS address')
    const existing = [...this.entries.values()].find((entry) => entry.url === url)
    if (!existing && this.entries.size >= MAX_BOOKMARKS) throw new Error(`Bookmark limit reached (${MAX_BOOKMARKS})`)
    const now = new Date().toISOString()
    const entry: BrowserBookmark = {
      id: existing?.id ?? randomUUID(),
      url,
      title: normalizeBookmarkTitle(value.title, url),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    }
    this.entries.set(entry.id, entry)
    await this.persist()
    return { ...entry }
  }

  async rename(id: string, title: string): Promise<BrowserBookmark> {
    const entry = this.entries.get(id)
    if (!entry) throw new Error(`Bookmark not found: ${id}`)
    entry.title = normalizeBookmarkTitle(title, entry.url)
    entry.updatedAt = new Date().toISOString()
    await this.persist()
    return { ...entry }
  }

  async remove(id: string): Promise<boolean> {
    const removed = this.entries.delete(id)
    if (removed) await this.persist()
    return removed
  }

  private persist(): Promise<void> {
    const value: PersistedBookmarks = { version: 1, bookmarks: this.list() }
    const operation = this.saveQueue.then(async () => {
      await mkdir(dirname(this.path), { recursive: true })
      const temporaryPath = `${this.path}.tmp`
      await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
      await rename(temporaryPath, this.path)
    })
    this.saveQueue = operation.catch(() => undefined)
    return operation
  }
}
