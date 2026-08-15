import { mkdtemp, readFile, rm } from 'node:fs/promises'
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

async function createStore(): Promise<{ path: string; store: CredentialStore }> {
  const directory = await mkdtemp(join(tmpdir(), 'bronom-credentials-test-'))
  temporaryDirectories.push(directory)
  const path = join(directory, 'profile', 'credentials.json')
  return { path, store: new CredentialStore(path, encryption) }
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
