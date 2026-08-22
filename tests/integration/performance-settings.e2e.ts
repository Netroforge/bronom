import { mkdir, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { expect, test } from './fixtures.js'

test('serializes Memory Saver settings and sleeps eligible tabs without stale shell state', async ({
  appWindow,
  profileDirectory
}) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Memory Saver fixture</title><main>Eligible website tab</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Memory Saver fixture server did not expose a port')
  const websiteUrl = `http://127.0.0.1:${address.port}/`

  try {
    await appWindow.evaluate(`(async () => {
      const url = ${JSON.stringify(websiteUrl)};
      await window.bronom.newTab({ url, active: true });
      await window.bronom.newTab({ url, active: true });
    })()`)

    await appWindow.getByRole('button', { name: 'Settings' }).click()
    await appWindow.getByRole('button', { name: /Performance/ }).click()
    const automatic = appWindow.getByRole('checkbox', { name: 'Automatically sleep inactive tabs' })
    const timeout = appWindow.getByRole('combobox', { name: 'Sleep after' })
    const sleepNow = appWindow.getByRole('button', { name: 'Sleep eligible tabs now' })
    await expect(appWindow.getByText('0 sleeping')).toBeVisible()
    await expect(appWindow.getByText('of 2 website tabs')).toBeVisible()
    await expect(automatic).toBeChecked()
    await expect(timeout).toHaveValue('60')

    const settingsPath = join(profileDirectory, 'settings.json')
    const blockedTemporaryPath = `${settingsPath}.tmp`
    await rm(blockedTemporaryPath, { recursive: true, force: true })
    await mkdir(blockedTemporaryPath)
    try {
      await automatic.click()
      await expect(appWindow.getByRole('alert', { name: 'Setting not saved' })).toBeVisible()
      await expect(automatic).toBeChecked()
      await expect(timeout).toHaveValue('60')
      await expect.poll(() => appWindow.evaluate('window.bronomSettings.get()')).toMatchObject({
        memorySaverEnabled: true,
        memorySaverTimeoutMinutes: 60
      })
    } finally {
      await rm(blockedTemporaryPath, { recursive: true, force: true })
    }

    await timeout.selectOption('15')
    await expect.poll(async () => JSON.parse(await readFile(settingsPath, 'utf8'))).toMatchObject({
      memorySaverEnabled: true,
      memorySaverTimeoutMinutes: 15
    })

    await sleepNow.click()
    await expect(appWindow.getByText('1 sleeping')).toBeVisible()
    await automatic.uncheck()
    await expect(automatic).not.toBeChecked()
    await expect(sleepNow).toBeDisabled()
    await expect(appWindow.getByText('0 sleeping')).toBeVisible()

    await appWindow.getByRole('button', { name: 'Reset to default' }).click()
    await expect(automatic).toBeChecked()
    await expect(timeout).toHaveValue('60')
    await expect.poll(async () => JSON.parse(await readFile(settingsPath, 'utf8'))).toMatchObject({
      memorySaverEnabled: true,
      memorySaverTimeoutMinutes: 60
    })
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})
