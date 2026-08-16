import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { CommercialLicenseProviderResult, CommercialLicenseState } from '../shared/types.js'

interface PersistedCommercialLicense {
  version: 1
  installationId: string
  encryptedLicenseKey?: string
  keySuffix?: string
  instanceId?: string
  status?: string
  activations?: number
  activationLimit?: number | null
  expiresAt?: string | null
  lastValidatedAt?: string
}

export interface CommercialLicenseEncryption {
  encrypt(value: string): Promise<Buffer>
  decrypt(value: Buffer): Promise<{ result: string; shouldReEncrypt: boolean }>
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function licenseGrantIsActive(status: string | undefined, expiresAt: string | null | undefined): boolean {
  if (status !== 'active') return false
  if (expiresAt == null) return true
  const expiration = Date.parse(expiresAt)
  return Number.isFinite(expiration) && expiration > Date.now()
}

function parsedState(value: unknown): PersistedCommercialLicense | null {
  if (!value || typeof value !== 'object') return null
  const entry = value as Partial<PersistedCommercialLicense>
  if (entry.version !== 1 || typeof entry.installationId !== 'string' || entry.installationId.length < 16) return null
  if (entry.encryptedLicenseKey !== undefined && (typeof entry.encryptedLicenseKey !== 'string' || !entry.encryptedLicenseKey)) return null
  if (entry.instanceId !== undefined && (typeof entry.instanceId !== 'string' || !entry.instanceId)) return null
  if (entry.lastValidatedAt !== undefined && !validDate(entry.lastValidatedAt)) return null
  return { ...entry, version: 1, installationId: entry.installationId }
}

export class CommercialLicenseStore {
  private value: PersistedCommercialLicense = { version: 1, installationId: randomUUID() }
  private saveQueue: Promise<void> = Promise.resolve()

  constructor(
    private readonly path: string,
    private readonly encryption: CommercialLicenseEncryption
  ) {}

  async load(): Promise<void> {
    try {
      const parsed = parsedState(JSON.parse(await readFile(this.path, 'utf8')))
      if (parsed) this.value = parsed
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
    }
  }

  installationName(): string {
    return `Bronom ${this.value.installationId.replaceAll('-', '').slice(0, 12)}`
  }

  hasActivation(): boolean {
    return Boolean(this.value.encryptedLicenseKey && this.value.instanceId)
  }

  async credentials(): Promise<{ licenseKey: string; instanceId: string } | null> {
    if (!this.value.encryptedLicenseKey || !this.value.instanceId) return null
    const decrypted = await this.encryption.decrypt(Buffer.from(this.value.encryptedLicenseKey, 'base64'))
    if (decrypted.shouldReEncrypt) {
      this.value.encryptedLicenseKey = (await this.encryption.encrypt(decrypted.result)).toString('base64')
      await this.persist()
    }
    return { licenseKey: decrypted.result, instanceId: this.value.instanceId }
  }

  async saveActivation(licenseKey: string, result: CommercialLicenseProviderResult): Promise<void> {
    if (!result.instanceId) throw new Error('License activation did not return an instance ID')
    this.value = {
      ...this.value,
      encryptedLicenseKey: (await this.encryption.encrypt(licenseKey)).toString('base64'),
      keySuffix: licenseKey.replaceAll('-', '').slice(-4).toUpperCase(),
      instanceId: result.instanceId,
      status: result.status,
      activations: result.activations,
      activationLimit: result.activationLimit,
      expiresAt: result.expiresAt,
      lastValidatedAt: new Date().toISOString()
    }
    await this.persist()
  }

  async saveValidation(result: CommercialLicenseProviderResult): Promise<void> {
    this.value = {
      ...this.value,
      status: result.valid ? result.status : 'inactive',
      activations: result.activations,
      activationLimit: result.activationLimit,
      expiresAt: result.expiresAt,
      lastValidatedAt: new Date().toISOString()
    }
    await this.persist()
  }

  async markInactive(): Promise<void> {
    this.value = {
      ...this.value,
      status: 'inactive',
      lastValidatedAt: new Date().toISOString()
    }
    await this.persist()
  }

  async clear(): Promise<void> {
    this.value = { version: 1, installationId: this.value.installationId }
    await this.persist()
  }

  summary(secureStorageAvailable: boolean, message?: string): CommercialLicenseState {
    const hasActivation = this.hasActivation()
    const active = hasActivation && licenseGrantIsActive(this.value.status, this.value.expiresAt)
    const status = this.value.status === 'active' && !active && hasActivation ? 'expired' : this.value.status
    return {
      status: hasActivation ? (status ?? 'validation-required') : 'not-activated',
      active,
      secureStorageAvailable,
      maskedKey: this.value.keySuffix ? `••••-${this.value.keySuffix}` : undefined,
      activations: this.value.activations,
      activationLimit: this.value.activationLimit,
      expiresAt: this.value.expiresAt,
      lastValidatedAt: this.value.lastValidatedAt,
      message
    }
  }

  private persist(): Promise<void> {
    const snapshot = { ...this.value }
    const operation = this.saveQueue.then(async () => {
      await mkdir(dirname(this.path), { recursive: true })
      const temporaryPath = `${this.path}.tmp`
      await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
      await rename(temporaryPath, this.path)
    })
    this.saveQueue = operation.catch(() => undefined)
    return operation
  }
}
