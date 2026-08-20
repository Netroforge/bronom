import { expect, test } from './fixtures.js'
import type { BrowserState, CredentialStorageStatus, CredentialSummary } from '../../src/shared/types.js'

test('exposes metadata-only password controls and fails closed without secure storage', async ({ appWindow }) => {
  const state = await appWindow.evaluate(`Promise.all([
    window.bronomCredentials.status(),
    window.bronomCredentials.list(),
    window.bronom.getState()
  ]).then(([status, credentials, browser]) => ({ status, credentials, browser }))`) as {
    status: CredentialStorageStatus
    credentials: CredentialSummary[]
    browser: BrowserState
  }
  expect(state.credentials).toEqual([])
  expect(Object.keys(state.status).sort()).toEqual(expect.arrayContaining(['available']))
  await expect(appWindow.getByRole('button', { name: 'No saved password for this site' })).toHaveCount(0)
  await appWindow.getByRole('button', { name: 'New tab' }).click()
  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  const pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
  await expect(pageTools.getByRole('button', { name: 'No saved password for this site' })).toBeDisabled()
  await pageTools.getByRole('button', { name: 'Close page tools' }).click()
  expect(await appWindow.evaluate(`window.bronomCredentials.fill(${JSON.stringify(state.browser.activeTabId)}, 'missing-credential')`)).toBe(false)

  await appWindow.getByRole('button', { name: 'Settings' }).click()
  await appWindow.getByRole('button', { name: 'Passwords' }).click()
  await expect(appWindow.getByRole('button', { name: 'Reset to default' })).toHaveCount(0)
  if (state.status.available) {
    await expect(appWindow.getByText('No saved passwords')).toBeVisible()
    await expect(appWindow.getByText(new RegExp(`Encrypted by ${state.status.backend}`))).toBeVisible()
  } else {
    await expect(appWindow.getByText(state.status.reason!)).toBeVisible()
  }
})
