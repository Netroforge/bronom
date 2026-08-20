import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { CredentialStore, type CredentialEncryption } from '../src/main/credential-store.js'

const temporaryDirectories: string[] = []
const encryption: CredentialEncryption = {
  encrypt: async (value) => Buffer.from(`encrypted:${value}`, 'utf8'),
  decrypt: async (value) => ({ result: value.toString('utf8').replace(/^encrypted:/, ''), shouldReEncrypt: false })
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

async function createStore(credentialEncryption: CredentialEncryption = encryption): Promise<{ path: string; store: CredentialStore }> {
  const directory = await mkdtemp(join(tmpdir(), 'bronom-credentials-test-'))
  temporaryDirectories.push(directory)
  const path = join(directory, 'profile', 'credentials.json')
  return { path, store: new CredentialStore(path, credentialEncryption) }
}

describe('CredentialStore', () => {
  it('persists encrypted passwords and exposes metadata only', async () => {
    const { path, store } = await createStore()
    const saved = await store.save('https://example.com/login', 'person@example.com', 'correct horse battery staple')
    expect(saved).toMatchObject({ origin: 'https://example.com', username: 'person@example.com' })
    expect('encryptedPassword' in saved).toBe(false)
    const file = await readFile(path, 'utf8')
    expect(file).not.toContain('correct horse battery staple')

    const restored = new CredentialStore(path, encryption)
    expect(await restored.load()).toEqual([saved])
    expect(await restored.password(saved.id)).toBe('correct horse battery staple')
  })

  it('updates the matching origin and username instead of creating duplicates', async () => {
    const { store } = await createStore()
    const original = await store.save('https://example.com', 'person', 'old password')
    const updated = await store.save('https://example.com/account', 'person', 'new password')
    expect(updated.id).toBe(original.id)
    expect(updated.createdAt).toBe(original.createdAt)
    expect(store.list()).toHaveLength(1)
    expect(await store.password(original.id)).toBe('new password')
  })

  it('serializes overlapping saves for the same account and keeps the last password', async () => {
    let releaseEncryption: () => void = () => undefined
    const encryptionGate = new Promise<void>((resolve) => { releaseEncryption = resolve })
    const delayedEncryption: CredentialEncryption = {
      ...encryption,
      encrypt: async (value) => {
        await encryptionGate
        return encryption.encrypt(value)
      }
    }
    const { path, store } = await createStore(delayedEncryption)

    const firstSave = store.save('https://example.com/login', 'person', 'first password')
    const secondSave = store.save('https://example.com/account', 'person', 'second password')
    releaseEncryption()
    const [first, second] = await Promise.all([firstSave, secondSave])

    expect(second.id).toBe(first.id)
    expect(store.list()).toHaveLength(1)
    expect(await store.password(first.id)).toBe('second password')
    const restored = new CredentialStore(path, encryption)
    expect(await restored.load()).toHaveLength(1)
    expect(await restored.password(first.id)).toBe('second password')
  })

  it('keeps removal ordered behind an overlapping password update', async () => {
    let blockEncryption = false
    let releaseEncryption: () => void = () => undefined
    const encryptionGate = new Promise<void>((resolve) => { releaseEncryption = resolve })
    const delayedEncryption: CredentialEncryption = {
      ...encryption,
      encrypt: async (value) => {
        if (blockEncryption) await encryptionGate
        return encryption.encrypt(value)
      }
    }
    const { path, store } = await createStore(delayedEncryption)
    const saved = await store.save('https://example.com', 'person', 'first password')

    blockEncryption = true
    const pendingUpdate = store.save('https://example.com/account', 'person', 'updated password')
    const pendingRemoval = store.remove(saved.id)
    releaseEncryption()
    await expect(pendingUpdate).resolves.toMatchObject({ id: saved.id })
    await expect(pendingRemoval).resolves.toBe(true)

    expect(store.list()).toEqual([])
    const restored = new CredentialStore(path, encryption)
    expect(await restored.load()).toEqual([])
  })

  it('repairs duplicate persisted accounts by keeping the newest password', async () => {
    const { path, store } = await createStore()
    const original = await store.save('https://example.com', 'person', 'old password')
    const persisted = JSON.parse(await readFile(path, 'utf8')) as {
      version: 1
      credentials: Array<Record<string, string>>
    }
    persisted.credentials.push({
      ...persisted.credentials[0]!,
      id: 'newer-duplicate',
      encryptedPassword: Buffer.from('encrypted:new password', 'utf8').toString('base64'),
      updatedAt: '2099-01-01T00:00:00.000Z'
    })
    await writeFile(path, `${JSON.stringify(persisted, null, 2)}\n`, 'utf8')

    const restored = new CredentialStore(path, encryption)
    expect(await restored.load()).toEqual([
      expect.objectContaining({ id: 'newer-duplicate', origin: original.origin, username: original.username })
    ])
    expect(await restored.password('newer-duplicate')).toBe('new password')
    expect((JSON.parse(await readFile(path, 'utf8')) as { credentials: unknown[] }).credentials).toHaveLength(1)
  })

  it('removes one credential or clears the complete vault', async () => {
    const { store } = await createStore()
    const first = await store.save('https://one.example', 'one', 'secret one')
    await store.save('https://two.example', 'two', 'secret two')
    expect(await store.remove(first.id)).toBe(true)
    expect(store.list().map((credential) => credential.origin)).toEqual(['https://two.example'])
    await store.clear()
    expect(store.list()).toEqual([])
  })

  it('rejects unsafe origins and empty passwords', async () => {
    const { store } = await createStore()
    await expect(store.save('file:///tmp/login', 'person', 'secret')).rejects.toThrow('HTTP or HTTPS')
    await expect(store.save('https://example.com', 'person', '')).rejects.toThrow('between 1 and 16384')
  })
})
