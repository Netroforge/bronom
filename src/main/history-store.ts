import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { BrowserHistoryEntry } from '../shared/types.js'

const HISTORY_VERSION = 1
const MAX_HISTORY_ENTRIES = 2_000
const MAX_HISTORY_TITLE = 200
const MAX_HISTORY_URL = 4_096
const HISTORY_RETENTION_MS = 90 * 24 * 60 * 60 * 1_000

interface PersistedHistory {
  version: typeof HISTORY_VERSION
  entries: BrowserHistoryEntry[]
}

export function normalizeHistoryUrl(value: string): string | null {
  if (!value || value.length > MAX_HISTORY_URL) return null
  try {
    const url = new URL(value)
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname) return null
    url.username = ''
    url.password = ''
    url.hash = ''
    return url.href
  } catch {
    return null
  }
}

function normalizeTitle(value: string, url: string): string {
  const title = value.replace(/\s+/g, ' ').trim().slice(0, MAX_HISTORY_TITLE)
  return title || new URL(url).hostname
}

function validEntry(value: unknown, oldestAllowed: number): value is BrowserHistoryEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<BrowserHistoryEntry>
  const visitedAt = typeof entry.visitedAt === 'string' ? Date.parse(entry.visitedAt) : Number.NaN
  return (
    typeof entry.id === 'string' && entry.id.length > 0 && entry.id.length <= 128
    && typeof entry.url === 'string' && normalizeHistoryUrl(entry.url) === entry.url
    && typeof entry.title === 'string' && entry.title.length > 0 && entry.title.length <= MAX_HISTORY_TITLE
    && Number.isFinite(visitedAt) && visitedAt >= oldestAllowed
    && Number.isInteger(entry.visitCount) && (entry.visitCount ?? 0) > 0
  )
}

export class HistoryStore {
  private readonly entries = new Map<string, BrowserHistoryEntry>()
  private saveQueue: Promise<void> = Promise.resolve()

  constructor(private readonly path: string, private readonly now: () => number = Date.now) {}

  async load(): Promise<BrowserHistoryEntry[]> {
    this.entries.clear()
    try {
      const value = JSON.parse(await readFile(this.path, 'utf8')) as Partial<PersistedHistory>
      if (value.version !== HISTORY_VERSION || !Array.isArray(value.entries)) return []
      const oldestAllowed = this.now() - HISTORY_RETENTION_MS
      const sorted = value.entries
        .filter((entry) => validEntry(entry, oldestAllowed))
        .sort((left, right) => right.visitedAt.localeCompare(left.visitedAt))
      const seenUrls = new Set<string>()
      for (const entry of sorted) {
        if (seenUrls.has(entry.url) || this.entries.size >= MAX_HISTORY_ENTRIES) continue
        seenUrls.add(entry.url)
        this.entries.set(entry.id, { ...entry })
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
    }
    return this.list()
  }

  list(): BrowserHistoryEntry[] {
    return [...this.entries.values()]
      .sort((left, right) => right.visitedAt.localeCompare(left.visitedAt) || left.title.localeCompare(right.title))
      .map((entry) => ({ ...entry }))
  }

  async record(value: { url: string; title: string }): Promise<BrowserHistoryEntry | null> {
    const url = normalizeHistoryUrl(value.url)
    if (!url) return null
    const existing = [...this.entries.values()].find((entry) => entry.url === url)
    const entry: BrowserHistoryEntry = {
      id: existing?.id ?? randomUUID(),
      url,
      title: normalizeTitle(value.title, url),
      visitedAt: new Date(this.now()).toISOString(),
      visitCount: (existing?.visitCount ?? 0) + 1
    }
    if (existing) this.entries.delete(existing.id)
    this.entries.set(entry.id, entry)
    this.prune()
    await this.persist()
    return { ...entry }
  }

  async remove(id: string): Promise<boolean> {
    const removed = this.entries.delete(id)
    if (removed) await this.persist()
    return removed
  }

  async clear(): Promise<void> {
    if (!this.entries.size) return
    this.entries.clear()
    await this.persist()
  }

  async clearOrigin(origin: string): Promise<number> {
    let removed = 0
    for (const entry of this.entries.values()) {
      if (new URL(entry.url).origin !== origin) continue
      this.entries.delete(entry.id)
      removed += 1
    }
    if (removed) await this.persist()
    return removed
  }

  private prune(): void {
    const oldestAllowed = this.now() - HISTORY_RETENTION_MS
    for (const entry of this.list()) {
      if (Date.parse(entry.visitedAt) < oldestAllowed) this.entries.delete(entry.id)
    }
    const overflow = this.list().slice(MAX_HISTORY_ENTRIES)
    for (const entry of overflow) this.entries.delete(entry.id)
  }

  private persist(): Promise<void> {
    const value: PersistedHistory = { version: HISTORY_VERSION, entries: this.list() }
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
