import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { CommercialLicenseStore, type CommercialLicenseEncryption } from '../src/main/commercial-license-store.js'

const temporaryDirectories: string[] = []
const encryption: CommercialLicenseEncryption = {
  encrypt: async (value) => Buffer.from(`protected:${value}`, 'utf8'),
  decrypt: async (value) => ({ result: value.toString('utf8').replace(/^protected:/, ''), shouldReEncrypt: false })
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

async function createStore(): Promise<{ path: string; store: CommercialLicenseStore }> {
  const directory = await mkdtemp(join(tmpdir(), 'bronom-license-test-'))
  temporaryDirectories.push(directory)
  const path = join(directory, 'profile', 'commercial-license.json')
  const store = new CommercialLicenseStore(path, encryption)
  await store.load()
  return { path, store }
}

describe('CommercialLicenseStore', () => {
  it('persists the license key encrypted and exposes only a suffix', async () => {
    const { path, store } = await createStore()
    await store.saveActivation('ABCD-EFGH-IJKL-MNOP', {
      valid: true,
      status: 'active',
      productId: 'prod_bronom',
      instanceId: 'inst_abcdefgh1234',
      activations: 1,
      activationLimit: 3,
      expiresAt: null
    })

    const file = await readFile(path, 'utf8')
    expect(file).not.toContain('ABCD-EFGH-IJKL-MNOP')
    expect(store.summary(true)).toMatchObject({ active: true, maskedKey: '••••-MNOP', activationLimit: 3 })
    expect(await store.credentials()).toEqual({ licenseKey: 'ABCD-EFGH-IJKL-MNOP', instanceId: 'inst_abcdefgh1234' })
  })

  it('keeps a stable anonymous installation name after deactivation', async () => {
    const { store } = await createStore()
    const name = store.installationName()
    await store.saveActivation('ABCD-EFGH-IJKL-MNOP', {
      valid: true,
      status: 'active',
      productId: 'prod_bronom',
      instanceId: 'inst_abcdefgh1234',
      activationLimit: 3
    })
    await store.clear()
    expect(store.installationName()).toBe(name)
    expect(store.summary(true)).toMatchObject({ active: false, status: 'not-activated' })
  })

  it('marks a retained activation inactive when the subscription no longer grants access', async () => {
    const { store } = await createStore()
    await store.saveActivation('ABCD-EFGH-IJKL-MNOP', {
      valid: true,
      status: 'active',
      productId: 'prod_bronom',
      instanceId: 'inst_abcdefgh1234',
      activationLimit: 3
    })

    await store.markInactive()

    expect(store.summary(true)).toMatchObject({ active: false, status: 'inactive', maskedKey: '••••-MNOP' })
    expect(await store.credentials()).toEqual({ licenseKey: 'ABCD-EFGH-IJKL-MNOP', instanceId: 'inst_abcdefgh1234' })
  })
})
