import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { CredentialSummary } from '../shared/types.js'

interface PersistedCredential extends CredentialSummary {
  encryptedPassword: string
}

interface PersistedCredentialVault {
  version: 1
  credentials: PersistedCredential[]
}

export interface CredentialEncryption {
  encrypt(value: string): Promise<Buffer>
  decrypt(value: Buffer): Promise<{ result: string; shouldReEncrypt: boolean }>
}

function normalizedOrigin(value: string): string | null {
  try {
    const url = new URL(value)
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname) return null
    return url.origin
  } catch {
    return null
  }
}

function validPersistedCredential(value: unknown): value is PersistedCredential {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<PersistedCredential>
  return (
    typeof entry.id === 'string' && entry.id.length > 0 && entry.id.length <= 128 &&
    typeof entry.origin === 'string' && normalizedOrigin(entry.origin) === entry.origin &&
    typeof entry.username === 'string' && entry.username.length <= 512 &&
    typeof entry.encryptedPassword === 'string' && entry.encryptedPassword.length > 0 &&
    typeof entry.createdAt === 'string' && Number.isFinite(Date.parse(entry.createdAt)) &&
    typeof entry.updatedAt === 'string' && Number.isFinite(Date.parse(entry.updatedAt))
  )
}

export class CredentialStore {
  private readonly entries = new Map<string, PersistedCredential>()
  private saveQueue: Promise<void> = Promise.resolve()

  constructor(
    private readonly path: string,
    private readonly encryption: CredentialEncryption
  ) {}

  async load(): Promise<CredentialSummary[]> {
    this.entries.clear()
    try {
      const value = JSON.parse(await readFile(this.path, 'utf8')) as Partial<PersistedCredentialVault>
      if (value.version !== 1 || !Array.isArray(value.credentials)) return []
      for (const entry of value.credentials) {
        if (validPersistedCredential(entry)) this.entries.set(entry.id, { ...entry })
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
    }
    return this.list()
  }

  list(): CredentialSummary[] {
    return [...this.entries.values()]
      .map(({ encryptedPassword: _encryptedPassword, ...summary }) => ({ ...summary }))
      .sort((left, right) => left.origin.localeCompare(right.origin) || left.username.localeCompare(right.username))
  }

  has(origin: string, username: string): boolean {
    const normalized = normalizedOrigin(origin)
    return Boolean(normalized && [...this.entries.values()].some((entry) => entry.origin === normalized && entry.username === username))
  }

  async save(origin: string, username: string, password: string): Promise<CredentialSummary> {
    const normalized = normalizedOrigin(origin)
    if (!normalized) throw new TypeError('Credential origin must be an HTTP or HTTPS origin')
    if (username.length > 512) throw new TypeError('Credential username is too long')
    if (!password || password.length > 16_384) throw new TypeError('Credential password must be between 1 and 16384 characters')
    const existing = [...this.entries.values()].find((entry) => entry.origin === normalized && entry.username === username)
    const now = new Date().toISOString()
    const entry: PersistedCredential = {
      id: existing?.id ?? randomUUID(),
      origin: normalized,
      username,
      encryptedPassword: (await this.encryption.encrypt(password)).toString('base64'),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    }
    this.entries.set(entry.id, entry)
    await this.persist()
    const { encryptedPassword: _encryptedPassword, ...summary } = entry
    return { ...summary }
  }

  async password(id: string): Promise<string> {
    const entry = this.entries.get(id)
    if (!entry) throw new Error('Saved credential not found')
    const decrypted = await this.encryption.decrypt(Buffer.from(entry.encryptedPassword, 'base64'))
    if (decrypted.shouldReEncrypt) {
      entry.encryptedPassword = (await this.encryption.encrypt(decrypted.result)).toString('base64')
      entry.updatedAt = new Date().toISOString()
      await this.persist()
    }
    return decrypted.result
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

  private persist(): Promise<void> {
    const value: PersistedCredentialVault = { version: 1, credentials: [...this.entries.values()] }
    const operation = this.saveQueue.then(async () => {
      await mkdir(dirname(this.path), { recursive: true })
      const temporaryPath = `${this.path}.tmp`
      await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
      await rename(temporaryPath, this.path)
    })
    this.saveQueue = operation.catch(() => undefined)
    return operation
  }
}
