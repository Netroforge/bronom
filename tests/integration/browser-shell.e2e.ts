import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { useMcpTabGroup } from '../../scripts/mcp-tab-group.js'
import { closeBronom, expect, launchBronom, test } from './fixtures.js'

const execFileAsync = promisify(execFile)

function mcpResultText(result: CallToolResult): string {
  const content = result.content.find((item) => item.type === 'text')
  return content?.type === 'text' ? content.text : ''
}

test('launches a visible browser shell with an authenticated MCP endpoint', async ({
  appWindow,
  electronApp,
  mcpPort,
  mcpToken
}) => {
  await expect(appWindow).toHaveTitle('Bronom')
  await expect(appWindow.getByRole('button', { name: 'Settings' })).toBeVisible()
  await expect(appWindow.getByRole('button', { name: /MCP ready/ })).toBeVisible()
  await expect.poll(() => appWindow.evaluate('window.bronomMcp.getState()')).toMatchObject({ status: 'ready', paused: false })

  const windowState = await electronApp.evaluate(({ BrowserWindow }) => {
    const window = BrowserWindow.getAllWindows()[0]
    return { visible: window?.isVisible(), destroyed: window?.isDestroyed() }
  })
  expect(windowState).toEqual({ visible: true, destroyed: false })

  const unauthorized = await fetch(`http://127.0.0.1:${mcpPort}/healthz`)
  expect(unauthorized.status).toBe(401)

  await expect
    .poll(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${mcpPort}/healthz`, {
          headers: { authorization: `Bearer ${mcpToken}` }
        })
        const body = (await response.json()) as { name?: string }
        return response.ok && body.name === 'bronom'
      } catch {
        return false
      }
    })
    .toBe(true)
})

test('copies shell text through the verified native clipboard bridge', async ({ appWindow, electronApp }) => {
  const expected = 'Bronom clipboard bridge \u2713'
  await electronApp.evaluate(({ clipboard }) => clipboard.clear())

  await appWindow.evaluate(`window.bronom.copyText(${JSON.stringify(expected)})`)

  await expect.poll(() => electronApp.evaluate(({ clipboard }) => clipboard.readText())).toBe(expected)
})

test('copies Home setup natively, reports failures in shell chrome, and withholds the bridge from websites', async ({
  appWindow,
  electronApp
}) => {
  await expect.poll(() => electronApp.evaluate(({ webContents }) =>
    webContents.getAllWebContents().some((contents) => contents.getURL().startsWith('bronom://home'))
  )).toBe(true)
  await electronApp.evaluate(({ clipboard }) => clipboard.clear())
  await electronApp.evaluate(async ({ webContents }) => {
    const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
    if (!home) throw new Error('Bronom Home web contents was not found')
    await home.executeJavaScript(`document.querySelector('[data-copy-target="guide-code"]').click()`)
  })

  await expect.poll(() => electronApp.evaluate(({ clipboard }) => clipboard.readText())).toContain('codex mcp add bronom')
  await expect.poll(() => electronApp.evaluate(async ({ webContents }) => {
    const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
    return home?.executeJavaScript(`document.querySelector('[data-copy-target="guide-code"]').textContent`)
  })).toBe('Copied')

  await appWindow.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Clipboard boundary</title>', active: true })`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)'))
    .toBe('Clipboard boundary')
  const websiteBridge = await electronApp.evaluate(async ({ webContents }) => {
    const website = webContents.getAllWebContents().find((contents) => contents.getTitle() === 'Clipboard boundary')
    if (!website) throw new Error('Website web contents was not found')
    return website.executeJavaScript(`typeof window.bronomHome`)
  })
  expect(websiteBridge).toBe('undefined')

  await appWindow.getByRole('button', { name: 'Open Bronom Home' }).click()
  await electronApp.evaluate(async ({ webContents }) => {
    const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
    if (!home) throw new Error('Bronom Home web contents was not found')
    await home.executeJavaScript(`(() => {
      const button = document.querySelector('[data-copy-target="guide-code"]');
      const target = document.getElementById(button.dataset.copyTarget);
      target.textContent = 'x'.repeat(${8 * 1024 * 1024 + 1});
      button.click();
    })()`)
  })
  const toast = appWindow.getByRole('alert', { name: 'Copy failed' })
  await expect(toast).toBeVisible()
  await expect(toast).toContainText('maximum 8 MB')
})

test('shows an error status when the MCP port is already in use', async ({
  mcpPort,
  profileDirectory
}) => {
  const portOwner = createServer()
  await new Promise<void>((resolve, reject) => {
    portOwner.once('error', reject)
    portOwner.listen(mcpPort, '127.0.0.1', () => resolve())
  })

  let conflictingApp: Awaited<ReturnType<typeof launchBronom>> | undefined
  try {
    conflictingApp = await launchBronom(profileDirectory, mcpPort)
    const statusPill = conflictingApp.window.getByRole('button', { name: 'MCP error' })
    await expect(statusPill).toBeVisible()
    await expect(statusPill).toHaveAttribute('title', /EADDRINUSE/)
    await expect(conflictingApp.window.locator('.mcp-controls')).toHaveClass(/error/)
    await expect(conflictingApp.window.getByRole('button', { name: 'Pause agents' })).toBeDisabled()

    await expect
      .poll(() => conflictingApp!.window.evaluate('window.bronomMcp.getState()'))
      .toMatchObject({ status: 'error', paused: false, error: expect.stringContaining('EADDRINUSE') })

    await expect
      .poll(() => conflictingApp!.app.evaluate(async ({ webContents }) => {
        const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
        return home?.executeJavaScript(`fetch('/api/status').then((response) => response.json())`)
      }))
      .toMatchObject({ status: 'error', error: expect.stringContaining('EADDRINUSE') })
  } finally {
    if (conflictingApp) await closeBronom(conflictingApp.app)
    await new Promise<void>((resolve) => portOwner.close(() => resolve()))
  }
})

test('keeps the tab strip but removes website navigation controls on Home', async ({ appWindow, electronApp }) => {
  const browserViewBounds = (): Promise<{ x: number; y: number; width: number; height: number } | undefined> => electronApp.evaluate(({ BrowserWindow }) => (
    BrowserWindow.getAllWindows()[0]?.contentView.children[0]?.getBounds()
  ))
  const browserViewY = async (): Promise<number | undefined> => (await browserViewBounds())?.y
  const globalControlPositions = (): Promise<Record<string, { x: number; y: number }>> => appWindow.evaluate(`(() => {
    const labels = ['Search tabs', 'Downloads', 'Browsing history', 'Settings']
    return Object.fromEntries(labels.map((label) => {
      const element = document.querySelector('.topbar-actions button[aria-label="' + label + '"]')
      if (!element) throw new Error('Missing global control: ' + label)
      const bounds = element.getBoundingClientRect()
      return [label, { x: Math.round(bounds.x), y: Math.round(bounds.y) }]
    }))
  })()`) as Promise<Record<string, { x: number; y: number }>>
  await expect(appWindow.getByRole('tab')).toHaveCount(0)
  await expect(appWindow.locator('.toolbar')).toBeHidden()
  await expect.poll(browserViewY).toBe(45)
  const homeGlobalPositions = await globalControlPositions()
  const homeButton = appWindow.getByRole('button', { name: 'Open Bronom Home' })
  await expect(homeButton).toHaveAttribute('aria-current', 'page')
  await appWindow.getByRole('button', { name: 'New tab' }).click()
  await expect(appWindow.getByRole('tab')).toHaveCount(1)
  await expect(appWindow.locator('.toolbar')).toBeVisible()
  await expect.poll(browserViewY).toBe(105)
  expect(await globalControlPositions()).toEqual(homeGlobalPositions)
  for (const label of ['Downloads', 'Browsing history', 'Settings']) {
    await expect(appWindow.locator('.toolbar').getByRole('button', { name: label, exact: true })).toHaveCount(0)
  }
  for (const label of ['Back', 'Forward', 'Address', 'Find in page', 'Page zoom controls', 'Bookmarks', 'Page tools']) {
    if (label === 'Address') await expect(appWindow.locator('.toolbar').getByRole('combobox', { name: label })).toBeVisible()
    else await expect(appWindow.locator('.toolbar').getByRole('button', { name: label, exact: true })).toBeVisible()
  }
  await expect(appWindow.locator('.tab')).toContainText('New tab')
  await expect(appWindow.locator('.tab')).toHaveAttribute('aria-selected', 'true')
  await expect(homeButton).not.toHaveAttribute('aria-current', 'page')
  await homeButton.click()
  await expect(appWindow.getByRole('tab')).toHaveCount(1)
  await expect(appWindow.locator('.toolbar')).toBeHidden()
  await expect.poll(browserViewY).toBe(45)
  expect(await globalControlPositions()).toEqual(homeGlobalPositions)
  await expect(homeButton).toHaveAttribute('aria-current', 'page')

  await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.setSize(760, 600))
  await expect.poll(() => appWindow.evaluate('window.innerWidth')).toBe(760)
  const compactHomeGlobalPositions = await globalControlPositions()
  await appWindow.getByRole('tab').click()
  await expect(appWindow.locator('.toolbar')).toBeVisible()
  expect(await globalControlPositions()).toEqual(compactHomeGlobalPositions)
  const compactToolbar = await appWindow.locator('.toolbar').evaluate((toolbar) => {
    const address = toolbar.querySelector('.address-form')!.getBoundingClientRect()
    const pageTools = toolbar.querySelector('[aria-label="Page tools"]')!.getBoundingClientRect()
    return {
      clientWidth: toolbar.clientWidth,
      scrollWidth: toolbar.scrollWidth,
      addressWidth: Math.round(address.width),
      pageToolsRight: Math.round(pageTools.right),
      viewportWidth: toolbar.ownerDocument.defaultView!.innerWidth
    }
  })
  expect(compactToolbar.scrollWidth).toBeLessThanOrEqual(compactToolbar.clientWidth)
  expect(compactToolbar.addressWidth).toBeGreaterThanOrEqual(180)
  expect(compactToolbar.pageToolsRight).toBeLessThanOrEqual(compactToolbar.viewportWidth - 12)
  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  const pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
  await expect(pageTools).toBeVisible()
  const pageToolsBounds = await pageTools.boundingBox()
  expect(pageToolsBounds).not.toBeNull()
  await expect.poll(browserViewBounds).toMatchObject({
    x: 0,
    y: 105,
    width: Math.round(pageToolsBounds!.x)
  })
  for (const label of ['Site storage is unavailable', 'Responsive preview: Test phones, tablets, and desktops', 'Environment: Network, cache, service workers, CPU, animations, rendering, runtime, region, identity, and location', 'Open Console', 'Open network monitor', 'Request conditions: none active', 'Run accessibility audit', 'Measure page performance', 'Design overview: Colors, typography, and contrast', 'Page metadata: Search, social, and structured data', 'Security: TLS, certificate, and connection details', 'Code coverage: Find unused JavaScript and CSS', 'JavaScript CPU profile: Find hot JavaScript functions', 'Page memory: Heap, DOM, and allocation diagnostics', 'DOM changes: See what changed after an action', 'Visual compare: Compare the page before and after', 'Select an element to copy for agent', 'Select an element and copy its screenshot', 'Save page as PDF', 'No saved password for this site']) {
    await expect(pageTools.getByRole('button', { name: label })).toBeVisible()
  }
  const pageToolGroups = [
    ['Inspect & simulate', 6],
    ['Diagnose & reproduce', 8],
    ['Audit & optimize', 7],
    ['Export & account', 2]
  ] as const
  expect(await pageTools.getByRole('heading', { level: 3 }).allTextContents()).toEqual(pageToolGroups.map(([name]) => name))
  for (const [name, buttonCount] of pageToolGroups) {
    await expect(pageTools.getByRole('region', { name }).getByRole('button')).toHaveCount(buttonCount)
  }
  await pageTools.getByRole('button', { name: 'Close page tools' }).click()
  await expect.poll(browserViewY).toBe(105)
  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  await appWindow.getByRole('dialog', { name: 'Page tools' }).getByRole('button', { name: 'Open network monitor' }).click()
  const networkPanel = appWindow.getByRole('dialog', { name: 'Network' })
  await expect(networkPanel).toBeVisible()
  const networkPanelBounds = await networkPanel.boundingBox()
  expect(networkPanelBounds).not.toBeNull()
  await expect.poll(browserViewBounds).toMatchObject({
    x: 0,
    y: 105,
    width: Math.round(networkPanelBounds!.x)
  })
  await networkPanel.getByRole('button', { name: 'Close network monitor' }).click()
  await expect.poll(browserViewY).toBe(105)

  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  const dockPicker = appWindow.getByRole('combobox', { name: 'Dock page tools' })
  await dockPicker.selectOption('left')
  await expect.poll(browserViewBounds).toMatchObject({ x: expect.any(Number), y: 105 })
  const leftPanelBounds = await pageTools.boundingBox()
  expect((await browserViewBounds())?.x).toBe(Math.round(leftPanelBounds!.width))
  await dockPicker.selectOption('bottom')
  const bottomPanelBounds = await pageTools.boundingBox()
  await expect.poll(browserViewBounds).toMatchObject({ x: 0, y: 105 })
  expect((await browserViewBounds())?.height).toBe(Math.round(bottomPanelBounds!.y - 105))
  await dockPicker.selectOption('top')
  const topPanelBounds = await pageTools.boundingBox()
  await expect.poll(browserViewBounds).toMatchObject({
    x: 0,
    y: Math.round(topPanelBounds!.y + topPanelBounds!.height)
  })
  await dockPicker.selectOption('right')
  await pageTools.getByRole('button', { name: 'Close page tools' }).click()
  await appWindow.getByRole('button', { name: 'Bookmarks', exact: true }).click()
  const bookmarksPanel = appWindow.getByRole('dialog', { name: 'Bookmarks' })
  await expect(bookmarksPanel).toBeVisible()
  const bookmarksPanelBounds = await bookmarksPanel.boundingBox()
  expect(bookmarksPanelBounds).not.toBeNull()
  await expect.poll(browserViewBounds).toMatchObject({
    x: 0,
    y: 105,
    width: Math.round(bookmarksPanelBounds!.x)
  })
  await bookmarksPanel.getByRole('button', { name: 'Close bookmarks' }).click()
  await expect.poll(browserViewBounds).toMatchObject({ x: 0, y: 105, width: 760 })
  await homeButton.click()
  await expect(appWindow.locator('.toolbar')).toBeHidden()
  expect(await globalControlPositions()).toEqual(compactHomeGlobalPositions)
})

test('detaches tool panels into a hardened window and redocks them', async ({ appWindow, electronApp }) => {
  const browserViewBounds = (): Promise<{ x: number; y: number; width: number; height: number } | undefined> => electronApp.evaluate(({ BrowserWindow }) => {
    const main = BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Bronom')
    return main?.contentView.children[0]?.getBounds()
  })

  await appWindow.getByRole('button', { name: 'New tab' }).click()
  await expect(appWindow.locator('.toolbar')).toBeVisible()
  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  const dockedPageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
  await expect(dockedPageTools).toBeVisible()
  const dockedBounds = await dockedPageTools.boundingBox()
  expect(dockedBounds).not.toBeNull()
  await expect.poll(browserViewBounds).toMatchObject({ width: Math.round(dockedBounds!.x) })

  const detachedPagePromise = electronApp.waitForEvent('window')
  await dockedPageTools.getByRole('combobox', { name: 'Dock page tools' }).selectOption('window')
  const detachedPage = await detachedPagePromise
  await detachedPage.waitForLoadState('domcontentloaded')
  detachedPage.on('pageerror', (error) => console.error(`[detached renderer] ${error.message}`))
  await expect(detachedPage).toHaveTitle('Page tools — Bronom')
  await expect(detachedPage.getByRole('dialog', { name: 'Page tools' })).toBeVisible()
  await expect(dockedPageTools).toBeHidden()
  await expect.poll(browserViewBounds).toMatchObject({ x: 0, y: 105, width: await appWindow.evaluate('window.innerWidth') })
  await expect(detachedPage.getByRole('combobox', { name: 'Dock page tools' })).toHaveValue('window')

  const detachedSecurity = await electronApp.evaluate(({ BrowserWindow }) => {
    const panel = BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Page tools — Bronom')
    const preferences = (panel?.webContents as unknown as {
      getLastWebPreferences?: () => { contextIsolation?: boolean; nodeIntegration?: boolean; sandbox?: boolean }
    } | undefined)?.getLastWebPreferences?.()
    return {
      windows: BrowserWindow.getAllWindows().length,
      url: panel?.webContents.getURL(),
      contextIsolation: preferences?.contextIsolation,
      nodeIntegration: preferences?.nodeIntegration,
      sandbox: preferences?.sandbox
    }
  })
  expect(detachedSecurity).toMatchObject({
    windows: 2,
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true
  })
  expect(detachedSecurity.url).toContain('bronomPanel=page-tools')

  const detachedTargetState = await appWindow.evaluate(`window.bronom.newTab({
    url: 'data:text/html,<title>Detached panel target</title>',
    active: true
  })`) as { activeTabId: string | null }
  await expect.poll(() => detachedPage.evaluate('window.bronom.getState().then((state) => state.activeTabId)'))
    .toBe(detachedTargetState.activeTabId)
  await expect(detachedPage.getByRole('dialog', { name: 'Page tools' })).toBeVisible()

  const homeTabId = await appWindow.evaluate(`window.bronom.getState().then((state) => {
    const home = state.tabs.find((tab) => tab.url.startsWith('bronom://home'))
    if (!home) throw new Error('Missing Home tab')
    return home.id
  })`) as string
  await appWindow.evaluate(`window.bronom.selectTab(${JSON.stringify(homeTabId)})`)
  const detachedWebsiteRequired = detachedPage.getByRole('dialog', { name: 'Page tools' })
  await expect(detachedWebsiteRequired.getByRole('heading', { name: 'Open a website tab' })).toBeVisible()
  await expect(detachedWebsiteRequired).toContainText('This panel will refresh automatically.')

  await appWindow.evaluate(`window.bronom.selectTab(${JSON.stringify(detachedTargetState.activeTabId)})`)
  await expect(detachedPage.getByRole('heading', { name: 'Open a website tab' })).toBeHidden()
  await expect(detachedPage.getByRole('dialog', { name: 'Page tools' })).toBeVisible()

  const trustedPanelUrl = detachedPage.url()
  await detachedPage.evaluate("location.assign('https://example.com/blocked-panel-navigation')")
  await expect.poll(() => detachedPage.url()).toBe(trustedPanelUrl)
  expect(await detachedPage.evaluate("window.open('https://example.com/blocked-panel-popup') === null")).toBe(true)
  await expect.poll(() => electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().length)).toBe(2)
  const rememberedPanelSize = await electronApp.evaluate(({ BrowserWindow }) => {
    const panel = BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Page tools — Bronom')
    panel?.setSize(610, 650)
    const bounds = panel?.getNormalBounds()
    return { width: bounds?.width, height: bounds?.height }
  })
  expect(rememberedPanelSize).toEqual({ width: 610, height: 650 })

  const detachedClosed = detachedPage.waitForEvent('close')
  await detachedPage.evaluate(`setTimeout(() => {
    const select = document.querySelector('select[aria-label="Dock page tools"]')
    if (!(select instanceof HTMLSelectElement)) throw new Error('Missing page-tools dock selector')
    select.value = 'left'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }, 0)`)
  await detachedClosed
  await expect(dockedPageTools).toBeVisible()
  await expect(dockedPageTools.getByRole('combobox', { name: 'Dock page tools' })).toHaveValue('left')
  const leftBounds = await dockedPageTools.boundingBox()
  await expect.poll(browserViewBounds).toMatchObject({ x: Math.round(leftBounds!.width), y: 105 })

  await dockedPageTools.getByRole('combobox', { name: 'Dock page tools' }).selectOption('right')
  await dockedPageTools.getByRole('button', { name: 'Close page tools' }).click()
  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  await appWindow.getByRole('dialog', { name: 'Page tools' })
    .getByRole('button', { name: 'Responsive preview: Test phones, tablets, and desktops' }).click()
  const dockedResponsive = appWindow.getByRole('dialog', { name: 'Responsive preview' })
  const detachedResponsivePromise = electronApp.waitForEvent('window')
  await dockedResponsive.getByRole('combobox', { name: 'Dock responsive preview' }).selectOption('window')
  const detachedResponsive = await detachedResponsivePromise
  await detachedResponsive.waitForLoadState('domcontentloaded')
  await expect(detachedResponsive).toHaveTitle('Responsive preview — Bronom')
  await expect(detachedResponsive.getByRole('dialog', { name: 'Responsive preview' })).toBeVisible()

  const previousTabId = await appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')
  await appWindow.getByRole('button', { name: 'New tab' }).click()
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).not.toBe(previousTabId)
  const nextTabId = await appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')
  await expect.poll(() => detachedResponsive.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).toBe(nextTabId)
  await expect(detachedResponsive.getByRole('dialog', { name: 'Responsive preview' })).toBeVisible()

  const detachedResponsiveClosed = detachedResponsive.waitForEvent('close')
  await detachedResponsive.evaluate(`setTimeout(() => {
    const select = document.querySelector('select[aria-label="Dock responsive preview"]')
    if (!(select instanceof HTMLSelectElement)) throw new Error('Missing responsive-preview dock selector')
    select.value = 'right'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }, 0)`)
  await detachedResponsiveClosed
  await expect(dockedResponsive).toBeVisible()
  await dockedResponsive.getByRole('button', { name: 'Close responsive preview' }).click()
  await appWindow.getByRole('button', { name: 'Bookmarks', exact: true }).click()
  const dockedBookmarks = appWindow.getByRole('dialog', { name: 'Bookmarks' })
  const detachedBookmarksPromise = electronApp.waitForEvent('window')
  await dockedBookmarks.getByRole('combobox', { name: 'Dock bookmarks' }).selectOption('window')
  const detachedBookmarks = await detachedBookmarksPromise
  await detachedBookmarks.waitForLoadState('domcontentloaded')
  await expect(detachedBookmarks).toHaveTitle('Bookmarks — Bronom')
  await expect(detachedBookmarks.getByRole('dialog', { name: 'Bookmarks' })).toBeVisible()
  await expect.poll(() => electronApp.evaluate(({ BrowserWindow }) => {
    const panel = BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Bookmarks — Bronom')
    const bounds = panel?.getNormalBounds()
    return { width: bounds?.width, height: bounds?.height }
  })).toEqual(rememberedPanelSize)
  await detachedBookmarks.evaluate(`setTimeout(() => {
    const button = document.querySelector('button[aria-label="Close bookmarks"]')
    if (!(button instanceof HTMLButtonElement)) throw new Error('Missing bookmarks close button')
    button.click()
  }, 0)`)
  await expect.poll(() => detachedBookmarks.isClosed()).toBe(true)
  await expect(dockedBookmarks).toBeHidden()
  await expect.poll(browserViewBounds).toMatchObject({ x: 0, y: 105, width: await appWindow.evaluate('window.innerWidth') })
})

test('resizes docked panels by pointer and keyboard while preserving page space', async ({ appWindow, electronApp }) => {
  await electronApp.evaluate(({ BrowserWindow }) => {
    BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Bronom')?.setContentSize(1200, 800)
  })
  await expect.poll(() => appWindow.evaluate('({ width: window.innerWidth, height: window.innerHeight })')).toEqual({ width: 1200, height: 800 })
  const browserViewBounds = (): Promise<{ x: number; y: number; width: number; height: number } | undefined> => electronApp.evaluate(({ BrowserWindow }) => {
    const main = BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Bronom')
    return main?.contentView.children[0]?.getBounds()
  })

  await appWindow.getByRole('button', { name: 'New tab' }).click()
  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  const panel = appWindow.getByRole('dialog', { name: 'Page tools' })
  const handle = appWindow.getByRole('separator', { name: 'Resize docked panel' })
  await expect(handle).toHaveAttribute('aria-orientation', 'vertical')
  const initialPanelBounds = await panel.boundingBox()
  const handleBounds = await handle.boundingBox()
  expect(initialPanelBounds).not.toBeNull()
  expect(handleBounds).not.toBeNull()

  const dragStartX = handleBounds!.x + handleBounds!.width / 2
  const dragEndX = handleBounds!.x - 80
  await appWindow.mouse.move(dragStartX, handleBounds!.y + 80)
  await appWindow.mouse.down()
  await appWindow.mouse.move(dragEndX, handleBounds!.y + 80, { steps: 5 })
  await appWindow.mouse.up()
  await expect.poll(async () => Math.round((await panel.boundingBox())!.width)).toBe(Math.round(initialPanelBounds!.width + dragStartX - dragEndX))
  const pointerSize = Math.round((await panel.boundingBox())!.width)
  expect(await appWindow.evaluate("localStorage.getItem('bronom:panel-dock-size-horizontal')")).toBe(String(pointerSize))

  await handle.focus()
  await handle.press('ArrowRight')
  await expect.poll(async () => Math.round((await panel.boundingBox())!.width)).toBe(pointerSize - 16)
  await handle.press('Shift+ArrowLeft')
  await expect.poll(async () => Math.round((await panel.boundingBox())!.width)).toBe(pointerSize + 32)
  const keyboardSize = Math.round((await panel.boundingBox())!.width)
  await panel.getByRole('button', { name: 'Close page tools' }).click()
  await appWindow.getByRole('button', { name: 'Page tools' }).click()
  await expect.poll(async () => Math.round((await panel.boundingBox())!.width)).toBe(keyboardSize)

  await panel.getByRole('combobox', { name: 'Dock page tools' }).selectOption('bottom')
  await expect(handle).toHaveAttribute('aria-orientation', 'horizontal')
  await handle.focus()
  await handle.press('Home')
  await expect.poll(async () => Math.round((await panel.boundingBox())!.height)).toBe(240)
  await handle.press('End')
  const maximumBottomSize = Number(await handle.getAttribute('aria-valuemax'))
  await expect.poll(async () => Math.round((await panel.boundingBox())!.height)).toBe(maximumBottomSize)
  const pageBoundsAtMaximum = await browserViewBounds()
  expect(pageBoundsAtMaximum!.height).toBeGreaterThanOrEqual(220)
  await handle.dblclick()
  expect(await appWindow.evaluate("localStorage.getItem('bronom:panel-dock-size-vertical')")).toBeNull()
  await expect.poll(async () => Math.round((await panel.boundingBox())!.height)).toBe(Math.round(800 * 0.45))
  await panel.getByRole('combobox', { name: 'Dock page tools' }).selectOption('left')
  await handle.focus()
  await handle.press('Home')
  await handle.press('ArrowRight')
  await expect.poll(async () => Math.round((await panel.boundingBox())!.width)).toBe(336)
  await panel.getByRole('combobox', { name: 'Dock page tools' }).selectOption('top')
  await handle.focus()
  await handle.press('Home')
  await handle.press('ArrowDown')
  await expect.poll(async () => Math.round((await panel.boundingBox())!.height)).toBe(256)
})

test('restores horizontal and vertical dock sizes after restart', async ({ profileDirectory, mcpPort }) => {
  const first = await launchBronom(profileDirectory, mcpPort)
  let second: Awaited<ReturnType<typeof launchBronom>> | undefined
  try {
    await first.app.evaluate(({ BrowserWindow }) => {
      BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Bronom')?.setContentSize(1200, 800)
    })
    await expect.poll(() => first.window.evaluate('({ width: window.innerWidth, height: window.innerHeight })')).toEqual({ width: 1200, height: 800 })
    await first.window.getByRole('button', { name: 'New tab' }).click()
    await first.window.getByRole('button', { name: 'Page tools' }).click()
    const firstPanel = first.window.getByRole('dialog', { name: 'Page tools' })
    const firstHandle = first.window.getByRole('separator', { name: 'Resize docked panel' })
    await firstHandle.focus()
    await firstHandle.press('Shift+ArrowLeft')
    const horizontalSize = Math.round((await firstPanel.boundingBox())!.width)
    await firstPanel.getByRole('combobox', { name: 'Dock page tools' }).selectOption('bottom')
    await firstHandle.focus()
    await firstHandle.press('Shift+ArrowUp')
    const verticalSize = Math.round((await firstPanel.boundingBox())!.height)
    await closeBronom(first.app)

    second = await launchBronom(profileDirectory, mcpPort)
    await second.app.evaluate(({ BrowserWindow }) => {
      BrowserWindow.getAllWindows().find((window) => window.getTitle() === 'Bronom')?.setContentSize(1200, 800)
    })
    await expect.poll(() => second!.window.evaluate('({ width: window.innerWidth, height: window.innerHeight })')).toEqual({ width: 1200, height: 800 })
    await second.window.getByRole('button', { name: 'Page tools' }).click()
    const restoredPanel = second.window.getByRole('dialog', { name: 'Page tools' })
    await expect(restoredPanel.getByRole('combobox', { name: 'Dock page tools' })).toHaveValue('bottom')
    await expect.poll(async () => Math.round((await restoredPanel.boundingBox())!.height)).toBe(verticalSize)
    await restoredPanel.getByRole('combobox', { name: 'Dock page tools' }).selectOption('right')
    await expect.poll(async () => Math.round((await restoredPanel.boundingBox())!.width)).toBe(horizontalSize)
  } finally {
    if (second) await closeBronom(second.app)
    else await closeBronom(first.app)
  }
})

test('keeps per-site controls above the website view', async ({ appWindow, electronApp }) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Site controls fixture</title><main>Website content</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/site-controls`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.url)')).toBe(url)

    const browserViewBounds = (): Promise<{ x: number; y: number; width: number; height: number } | undefined> => electronApp.evaluate(({ BrowserWindow }) => (
      BrowserWindow.getAllWindows()[0]?.contentView.children[0]?.getBounds()
    ))
    const browserViewY = async (): Promise<number | undefined> => (await browserViewBounds())?.y
    await expect.poll(browserViewY).toBe(105)
    await appWindow.getByRole('button', { name: /Site controls for 127\.0\.0\.1/ }).click()
    const siteControls = appWindow.getByRole('dialog', { name: '127.0.0.1' })
    await expect(siteControls).toBeVisible()
    const panelBounds = await siteControls.boundingBox()
    expect(panelBounds).not.toBeNull()
    await expect.poll(browserViewBounds).toMatchObject({ x: 0, y: 105, width: Math.round(panelBounds!.x) })

    await siteControls.getByRole('button', { name: 'Close site controls' }).click()
    await expect.poll(browserViewY).toBe(105)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('shows a recoverable site error and retries the failed address', async ({ appWindow, electronApp }) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Recovered website</title><main>Connection restored</main>')
  })
  const listen = (port = 0): Promise<number> => new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => {
      server.removeListener('error', reject)
      const address = server.address()
      if (!address || typeof address === 'string') reject(new Error('Recovery fixture did not expose a port'))
      else resolve(address.port)
    })
  })
  const close = (): Promise<void> => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve())
  })
  const browserViewY = (): Promise<number | undefined> => electronApp.evaluate(({ BrowserWindow }) => (
    BrowserWindow.getAllWindows()[0]?.contentView.children[0]?.getBounds().y
  ))

  const port = await listen()
  await close()
  const failedUrl = `http://127.0.0.1:${port}/temporarily-unavailable`
  try {
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(failedUrl)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.pageProblem)')).toMatchObject({
      kind: 'load-error',
      title: 'This site could not be reached',
      url: failedUrl,
      errorDescription: 'ERR_CONNECTION_REFUSED'
    })

    const recovery = appWindow.getByRole('alert')
    await expect(recovery).toContainText('The website refused the connection.')
    await expect(recovery).toContainText('ERR_CONNECTION_REFUSED')
    await expect(appWindow.getByRole('tab')).toHaveAttribute('aria-label', /This site could not be reached/)
    await expect.poll(browserViewY).toBeGreaterThan(105)

    await listen(port)
    await recovery.getByRole('button', { name: 'Try again' }).click()
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active))')).toMatchObject({
      title: 'Recovered website',
      url: failedUrl
    })
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.pageProblem ?? null)')).toBeNull()
    await expect(recovery).toBeHidden()
    await expect.poll(browserViewY).toBe(105)
    await expect.poll(() => electronApp.evaluate(({ webContents }, url) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === url)
      return page?.executeJavaScript('document.body.innerText')
    }, failedUrl)).toContain('Connection restored')
  } finally {
    if (server.listening) await close()
  }
})

test('recovers a crashed website renderer in a fresh process', async ({ appWindow, electronApp }) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Crash recovery fixture</title><main>Renderer recovered</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Crash recovery fixture did not expose a port')
    const url = `http://127.0.0.1:${address.port}/crash-recovery`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Crash recovery fixture')
    const firstProcessId = await electronApp.evaluate(({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      if (!page) throw new Error('Crash recovery web contents was not found')
      const processId = page.getOSProcessId()
      if (processId <= 0) throw new Error('Crash recovery renderer did not expose an OS process')
      process.kill(processId, 'SIGKILL')
      return processId
    }, url)

    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.pageProblem)')).toMatchObject({
      kind: 'renderer-gone',
      title: 'This page stopped working',
      url
    })
    const recovery = appWindow.getByRole('alert')
    await expect(recovery).toContainText(/The page process (crashed|was terminated)\./)
    await recovery.getByRole('button', { name: 'Try again' }).click()
    const recoveredShellState = async (): Promise<{ pageProblem: unknown; title?: string }> => {
      // Killing a child renderer can briefly invalidate Playwright's cached
      // target handle even though the BrowserWindow renderer remains healthy.
      // Reacquire the shell page so the assertion observes Bronom recovery,
      // while a genuinely crashed shell still times out and fails the test.
      const shell = await electronApp.firstWindow()
      return shell.evaluate(`window.bronom.getState().then((state) => {
        const active = state.tabs.find((tab) => tab.active)
        return { pageProblem: active?.pageProblem ?? null, title: active?.title }
      })`)
    }
    await expect.poll(async () => (await recoveredShellState()).pageProblem).toBeNull()
    await expect.poll(async () => (await recoveredShellState()).title).toBe('Crash recovery fixture')
    const recoveredProcessId = await electronApp.evaluate(({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      return page?.getOSProcessId()
    }, url)
    expect(recoveredProcessId).toBeTruthy()
    expect(recoveredProcessId).not.toBe(firstProcessId)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('puts Help in the native application menu and opens shell dialogs above every page', async ({ appWindow, electronApp }) => {
  const menuItems = await electronApp.evaluate(({ Menu }) => {
    const menu = Menu.getApplicationMenu()
    return Object.fromEntries((menu?.items ?? []).map((item) => [
      item.label,
      item.submenu?.items.map((child) => child.type === 'separator' ? 'separator' : child.label) ?? []
    ]))
  })
  expect(menuItems.Help).toEqual([
    'Keyboard Shortcuts',
    'About Bronom',
    'Commercial Licensing',
    'separator',
    'GitHub Repository',
    'Check for Updates'
  ])
  expect(menuItems.View).toEqual([
    'Command Palette…',
    'Pick Element for Agent',
    'separator',
    'Reload Tab',
    'Reload Tab Without Cache',
    'Developer Tools',
    'separator',
    'Actual Size',
    'Zoom In',
    'Zoom Out',
    'Toggle Full Screen'
  ])
  await expect(appWindow.getByRole('button', { name: 'Help', exact: true })).toHaveCount(0)
  expect(await appWindow.evaluate('window.bronom.toggleDevTools()')).toBe(false)

  const clickMenuItem = (menuLabel: string, itemLabel: string): Promise<void> => electronApp.evaluate(
    ({ BrowserWindow, Menu }, labels) => {
      const menu = Menu.getApplicationMenu()?.items.find((item) => item.label === labels.menuLabel)
      const item = menu?.submenu?.items.find((candidate) => candidate.label === labels.itemLabel)
      if (!item?.click) throw new Error(`Missing menu item: ${labels.menuLabel} → ${labels.itemLabel}`)
      item.click(item, BrowserWindow.getAllWindows()[0], {} as Electron.KeyboardEvent)
    },
    { menuLabel, itemLabel }
  )

  await clickMenuItem('Help', 'Keyboard Shortcuts')
  const shortcutsDialog = appWindow.getByRole('dialog', { name: 'Keyboard shortcuts' })
  await expect(shortcutsDialog).toBeVisible()
  await expect(shortcutsDialog).toContainText('Focus the address bar')
  await expect(shortcutsDialog).toContainText('Reload without cached files')
  await expect(shortcutsDialog).toContainText('Clear browsing data')
  await expect(shortcutsDialog).toContainText('Pick an element for agent context')
  await expect(shortcutsDialog).toContainText('Toggle developer tools')
  await appWindow.keyboard.press('Escape')
  await expect(shortcutsDialog).toBeHidden()

  await clickMenuItem('Help', 'About Bronom')
  const aboutDialog = appWindow.getByRole('dialog', { name: 'About Bronom' })
  await expect(aboutDialog).toBeVisible()
  await expect(aboutDialog).toContainText('A persistent, visible browser')
  await expect(aboutDialog.getByRole('button', { name: 'PolyForm license' })).toBeVisible()
  await expect(aboutDialog.getByRole('button', { name: 'Contribute' })).toBeVisible()
  await aboutDialog.getByRole('button', { name: 'Close help' }).click()

  await clickMenuItem('Help', 'Commercial Licensing')
  await expect(appWindow.locator('.settings-dialog')).toContainText('Commercial licensing')
  await appWindow.locator('.settings-dialog').getByRole('button', { name: 'Close', exact: true }).click()

  await appWindow.getByRole('button', { name: 'New tab' }).click()
  await expect(appWindow.locator('.toolbar')).toBeVisible()
  await clickMenuItem('View', 'Pick Element for Agent')
  await expect(appWindow.getByRole('button', { name: 'Cancel element selection' })).toBeVisible()
  await clickMenuItem('View', 'Pick Element for Agent')
  await expect(appWindow.getByRole('button', { name: 'Select an element to copy for agent' })).toBeVisible()
  await clickMenuItem('View', 'Developer Tools')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.devToolsOpen)')).toBe(true)
  await clickMenuItem('View', 'Developer Tools')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.devToolsOpen)')).toBe(false)

  await clickMenuItem('Help', 'GitHub Repository')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.url)')).toBe('https://github.com/Netroforge/bronom')
})

test('reloads the active website from View and bypasses cached subresources on demand', async ({ appWindow, electronApp }) => {
  let scriptRequests = 0
  const server = createServer((request, response) => {
    if (request.url === '/version.js') {
      scriptRequests += 1
      response.writeHead(200, {
        'content-type': 'application/javascript',
        'cache-control': 'public, max-age=3600'
      })
      response.end(`window.cachedReloadVersion = ${scriptRequests}`)
      return
    }
    response.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' })
    response.end(`<!doctype html><title>Loading reload fixture</title><script src="/version.js"></script><script>
      const loads = Number(sessionStorage.getItem('reload-loads') || 0) + 1
      sessionStorage.setItem('reload-loads', String(loads))
      document.title = 'Reload ' + window.cachedReloadVersion + ' / ' + loads
    </script>`)
  })
  const address = await new Promise<{ port: number }>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server.address() as { port: number }))
  })
  const url = `http://127.0.0.1:${address.port}/`
  const activeTitle = (): Promise<string | undefined> => appWindow.evaluate(
    'window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)'
  )
  const clickViewItem = (label: string): Promise<void> => electronApp.evaluate(({ BrowserWindow, Menu }, itemLabel) => {
    const item = Menu.getApplicationMenu()?.items.find((candidate) => candidate.label === 'View')
      ?.submenu?.items.find((candidate) => candidate.label === itemLabel)
    if (!item?.click) throw new Error(`Missing View menu item: ${itemLabel}`)
    item.click(item, BrowserWindow.getAllWindows()[0], {} as Electron.KeyboardEvent)
  }, label)

  try {
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(activeTitle).toBe('Reload 1 / 1')

    await clickViewItem('Reload Tab')
    await expect.poll(activeTitle).toBe('Reload 1 / 2')
    expect(scriptRequests).toBe(1)

    await clickViewItem('Reload Tab Without Cache')
    await expect.poll(activeTitle).toBe('Reload 2 / 3')
    expect(scriptRequests).toBe(2)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('supports standard tab and address shortcuts from the shell and websites', async ({ appWindow, electronApp }) => {
  const primary = process.platform === 'darwin' ? 'Meta' : 'Control'
  const address = appWindow.getByRole('combobox', { name: 'Address' })
  const homeButton = appWindow.getByRole('button', { name: 'Open Bronom Home' })

  await expect(homeButton).toHaveAttribute('aria-current', 'page')
  await homeButton.focus()
  await appWindow.keyboard.press(`${primary}+L`)
  await expect(address).toBeFocused()
  await expect(appWindow.getByRole('tab')).toHaveCount(1)

  await appWindow.keyboard.press(`${primary}+T`)
  await expect(appWindow.getByRole('tab')).toHaveCount(2)
  await expect(address).toBeFocused()

  const fixtureUrl = 'data:text/html,<title>Shortcut fixture</title><main>Recovered tab</main>'
  await appWindow.evaluate(`window.bronom.navigate({ url: ${JSON.stringify(fixtureUrl)} })`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Shortcut fixture')

  await appWindow.keyboard.press(`${primary}+T`)
  await expect(appWindow.getByRole('tab')).toHaveCount(3)
  await appWindow.keyboard.press('Control+Shift+Tab')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Shortcut fixture')
  await appWindow.keyboard.press('Control+Tab')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.url)')).toBe('about:blank')

  await appWindow.keyboard.press(`${primary}+W`)
  await expect(appWindow.getByRole('tab')).toHaveCount(2)
  await appWindow.keyboard.press(`${primary}+W`)
  await expect(appWindow.getByRole('tab')).toHaveCount(1)
  await appWindow.keyboard.press(`${primary}+Shift+T`)
  await expect(appWindow.getByRole('tab')).toHaveCount(2)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Shortcut fixture')

  const reopenedUrl = await appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.url)') as string
  await electronApp.evaluate(({ webContents }, requestedUrl) => {
    const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
    if (!page) throw new Error('Shortcut fixture web contents was not found')
    page.focus()
    const modifiers = process.platform === 'darwin' ? ['meta'] as const : ['control'] as const
    page.sendInputEvent({ type: 'keyDown', keyCode: 'L', modifiers: [...modifiers] })
    page.sendInputEvent({ type: 'keyUp', keyCode: 'L', modifiers: [...modifiers] })
  }, reopenedUrl)
  await expect(address).toBeFocused()

  await electronApp.evaluate(({ webContents }, requestedUrl) => {
    const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
    if (!page) throw new Error('Shortcut fixture web contents was not found')
    page.focus()
    const modifiers = process.platform === 'darwin' ? ['meta'] as const : ['control'] as const
    page.sendInputEvent({ type: 'keyDown', keyCode: 'T', modifiers: [...modifiers] })
    page.sendInputEvent({ type: 'keyUp', keyCode: 'T', modifiers: [...modifiers] })
  }, reopenedUrl)
  await expect(appWindow.getByRole('tab')).toHaveCount(3)
})

test('suggests local tabs, bookmarks, and history from the address bar', async ({ appWindow, electronApp }) => {
  const requests: string[] = []
  const server = createServer((request, response) => {
    requests.push(request.url ?? '/')
    const title = request.url === '/bookmark' ? 'Suggestion bookmark' : 'Suggestion history'
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html><title>${title}</title><main>${title}</main>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  try {
    const serverAddress = server.address()
    if (!serverAddress || typeof serverAddress === 'string') throw new Error('Address-suggestion fixture did not expose a port')
    const historyUrl = `http://127.0.0.1:${serverAddress.port}/history`
    const bookmarkUrl = `http://127.0.0.1:${serverAddress.port}/bookmark`
    const tabUrl = 'data:text/html,<title>Suggestion open tab</title><main>Already open</main>'
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(historyUrl)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronomHistory.list()')).toEqual([
      expect.objectContaining({ url: historyUrl, title: 'Suggestion history' })
    ])
    await appWindow.evaluate(`window.bronom.getState().then((state) => window.bronom.closeTab(state.tabs.find((tab) => tab.url === ${JSON.stringify(historyUrl)}).id))`)
    await appWindow.evaluate('window.bronom.newTab({ active: true })')
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(tabUrl)}, active: false })`)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.url === ${JSON.stringify(tabUrl)})?.title)`)).toBe('Suggestion open tab')
    await appWindow.evaluate(`window.bronomBookmarks.add(${JSON.stringify(bookmarkUrl)}, 'Suggestion bookmark')`)

    const browserViewY = (): Promise<number | undefined> => electronApp.evaluate(({ BrowserWindow }) => (
      BrowserWindow.getAllWindows()[0]?.contentView.children[0]?.getBounds().y
    ))
    const address = appWindow.getByRole('combobox', { name: 'Address' })
    const requestCountBeforeTyping = requests.length
    await address.fill('Suggestion')
    const popup = appWindow.locator('.address-suggestions')
    const listbox = appWindow.getByRole('listbox', { name: 'Local address suggestions' })
    await expect(popup).toBeVisible()
    await expect(address).toHaveAttribute('aria-expanded', 'true')
    await expect(listbox.getByRole('option')).toHaveCount(3)
    await expect(listbox.getByRole('option').nth(0)).toContainText('Switch to tab')
    await expect(listbox.getByRole('option').nth(1)).toContainText('Bookmark')
    await expect(listbox.getByRole('option').nth(2)).toContainText('History')
    await expect(popup).toContainText('Local only')
    await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.setSize(760, 600))
    await expect.poll(() => appWindow.evaluate('window.innerWidth')).toBe(760)
    await expect(popup).toBeVisible()
    const compactPopupBounds = await popup.boundingBox()
    expect(compactPopupBounds).not.toBeNull()
    expect(compactPopupBounds!.width).toBeGreaterThanOrEqual(550)
    expect(compactPopupBounds!.x + compactPopupBounds!.width).toBeLessThanOrEqual(760)
    expect(requests).toHaveLength(requestCountBeforeTyping)
    await expect.poll(browserViewY).toBeGreaterThanOrEqual(Math.ceil(compactPopupBounds!.y + compactPopupBounds!.height))

    await listbox.getByRole('option').nth(0).click()
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Suggestion open tab')

    await address.fill('@bookmarks')
    await expect(listbox.getByRole('option')).toHaveCount(1)
    await expect(listbox).toContainText('Suggestion bookmark')
    await address.press('Enter')
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Suggestion bookmark')

    await address.fill('@history Suggestion history')
    await expect(listbox.getByRole('option')).toHaveCount(1)
    await address.press('ArrowDown')
    await address.press('Enter')
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Suggestion history')
    await expect(address).toHaveAttribute('aria-expanded', 'false')
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('searches open and recently closed tabs, then restores any selected page', async ({ appWindow, electronApp }) => {
  const browserViewBounds = (): Promise<{ x: number; y: number; width: number; height: number } | undefined> => electronApp.evaluate(({ BrowserWindow }) => (
    BrowserWindow.getAllWindows()[0]?.contentView.children[0]?.getBounds()
  ))
  const alphaUrl = 'data:text/html,<title>Tab search alpha</title><main>Alpha</main>'
  const betaUrl = 'data:text/html,<title>Tab search beta</title><main>Beta</main>'
  await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(alphaUrl)}, active: true })`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Tab search alpha')
  await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(betaUrl)}, active: true })`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Tab search beta')

  await electronApp.evaluate(({ webContents }, requestedUrl) => {
    const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
    if (!page) throw new Error('Tab-search fixture web contents was not found')
    page.focus()
    const modifiers = process.platform === 'darwin' ? ['meta', 'shift'] as const : ['control', 'shift'] as const
    page.sendInputEvent({ type: 'keyDown', keyCode: 'A', modifiers: [...modifiers] })
    page.sendInputEvent({ type: 'keyUp', keyCode: 'A', modifiers: [...modifiers] })
  }, betaUrl)

  const panel = appWindow.getByRole('dialog', { name: 'Tabs' })
  const search = panel.getByRole('searchbox', { name: 'Search tabs' })
  await expect(panel).toBeVisible()
  const panelBounds = await panel.boundingBox()
  expect(panelBounds).not.toBeNull()
  await expect.poll(browserViewBounds).toMatchObject({
    x: 0,
    y: 105,
    width: Math.round(panelBounds!.x)
  })
  expect((await browserViewBounds())?.height).toBeGreaterThan(500)
  await expect(search).toBeFocused()
  await expect(panel).toContainText('2 open')
  await search.fill('alpha')
  await expect(panel.locator('.tab-search-item')).toHaveCount(1)
  await expect(panel).toContainText('Tab search alpha')
  await search.press('Enter')
  await expect(panel).toBeHidden()
  await expect.poll(browserViewBounds).toMatchObject({ x: 0, y: 105, width: await appWindow.evaluate('window.innerWidth') })
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Tab search alpha')

  await appWindow.getByRole('button', { name: 'Search tabs' }).click()
  await panel.getByRole('button', { name: 'Close Tab search beta' }).click()
  await expect(panel).toContainText('1 open · 1 closed')
  await expect(panel.getByRole('list', { name: 'Recently closed tabs' })).toContainText('Tab search beta')
  await panel.getByRole('button', { name: 'Close Tab search alpha' }).click()
  await expect(panel).toContainText('0 open · 2 closed')
  await expect(appWindow.locator('.toolbar')).toBeHidden()
  await expect(panel.getByRole('list', { name: 'Recently closed tabs' }).getByRole('listitem')).toHaveCount(2)
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.closedTabs.map(({ id, title, url, pinned, closedAt }) => ({
    hasId: typeof id === 'string' && id.length > 0,
    title,
    url,
    pinned,
    validClosedAt: Number.isFinite(Date.parse(closedAt))
  })))`)).toEqual([
    { hasId: true, title: 'Tab search alpha', url: alphaUrl, pinned: false, validClosedAt: true },
    { hasId: true, title: 'Tab search beta', url: betaUrl, pinned: false, validClosedAt: true }
  ])
  await search.fill('beta')
  await expect(panel.locator('.tab-search-item')).toHaveCount(1)
  await search.press('Enter')
  await expect(panel).toBeHidden()
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Tab search beta')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.closedTabs.map((tab) => tab.title))')).toEqual(['Tab search alpha'])

  await appWindow.getByRole('button', { name: 'Search tabs' }).click()
  await panel.getByRole('button', { name: 'Restore Tab search alpha' }).click()
  await expect(panel).toBeHidden()
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => ({ active: state.tabs.find((tab) => tab.active)?.title, closed: state.closedTabs.length }))')).toEqual({
    active: 'Tab search alpha',
    closed: 0
  })
})

test('duplicates navigation history and safely bulk-manages tabs from the native menu', async ({
  appWindow,
  electronApp
}) => {
  const firstUrl = 'data:text/html,<title>Context first</title><main>First</main>'
  const secondUrl = 'data:text/html,<title>Context second</title><main>Second</main>'
  const sourceId = await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(firstUrl)}, active: true })
    .then((state) => state.tabs.find((tab) => tab.active).id)`) as string
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Context first')
  await appWindow.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(sourceId)}, url: ${JSON.stringify(secondUrl)} })`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Context second')

  await electronApp.evaluate(({ Menu }) => {
    ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = undefined
    Menu.prototype.popup = function (): void {
      ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = this
    }
  })
  const openSourceMenu = async (): Promise<void> => {
    await appWindow.locator('.tab:not(.pinned)', { hasText: 'Context second' }).first().click({ button: 'right' })
  }
  const clickMenuItem = (id: string): Promise<void> => electronApp.evaluate((_electron, menuId) => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const item = menu?.getMenuItemById(menuId)
    if (!item?.click || !item.enabled) throw new Error(`Enabled ${menuId} context action was not found`)
    ;(item.click as unknown as () => void)()
  }, id)

  await openSourceMenu()
  await clickMenuItem('duplicate-tab')
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => tab.url === ${JSON.stringify(secondUrl)}).length)`)).toBe(2)
  const duplicateId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active && tab.id !== ${JSON.stringify(sourceId)})?.id)`) as string
  expect(await electronApp.evaluate(({ webContents }, url) => webContents.getAllWebContents()
    .filter((contents) => contents.getURL() === url)
    .map((contents) => contents.navigationHistory.canGoBack()), secondUrl)).toEqual([true, true])
  await appWindow.evaluate(`window.bronom.back(${JSON.stringify(duplicateId)})`)
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(duplicateId)})?.url)`)).toBe(firstUrl)

  const pinnedId = await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(secondUrl)}, active: false })
    .then((state) => state.tabs.findLast((tab) => tab.url === ${JSON.stringify(secondUrl)}).id)`) as string
  await appWindow.evaluate(`window.bronom.setTabPinned(${JSON.stringify(pinnedId)}, true)`)
  await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(secondUrl)}, active: false })`)
  await openSourceMenu()
  await clickMenuItem('close-duplicate-tabs')
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => tab.url === ${JSON.stringify(secondUrl)}).map((tab) => tab.pinned))`)).toEqual([true, false])

  for (const title of ['Context right one', 'Context right two']) {
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(`data:text/html,<title>${title}</title>`)}, active: false })`)
  }
  await openSourceMenu()
  await clickMenuItem('close-tabs-to-right')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith("bronom://")).map((tab) => tab.title))')).toEqual([
    'Context second',
    'Context second'
  ])

  await openSourceMenu()
  await clickMenuItem('reopen-closed-tab')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.some((tab) => tab.title === "Context right two"))')).toBe(true)
  await openSourceMenu()
  await clickMenuItem('close-other-tabs')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith("bronom://")).map(({ title, pinned }) => ({ title, pinned })))')).toEqual([
    { title: 'Context second', pinned: true },
    { title: 'Context second', pinned: false }
  ])
})

test('pins tabs from the native menu and tab search while preserving closed-tab state', async ({
  appWindow,
  electronApp,
  profileDirectory
}) => {
  const alphaUrl = 'data:text/html,<title>Pin alpha</title><main>Alpha</main>'
  const betaUrl = 'data:text/html,<title>Pin beta</title><main>Beta</main>'
  await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(alphaUrl)}, active: true })`)
  await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(betaUrl)}, active: true })`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Pin beta')

  await electronApp.evaluate(({ Menu }) => {
    ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = undefined
    Menu.prototype.popup = function (): void {
      ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = this
    }
  })
  await appWindow.getByRole('tab', { name: /^Pin beta/ }).click({ button: 'right' })
  const tabMenuItems = (): Promise<Array<{ id: string; label: string; enabled: boolean }>> => electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    return menu?.items.filter((item) => item.type !== 'separator').map(({ id, label, enabled }) => ({ id, label, enabled })) ?? []
  })
  await expect.poll(tabMenuItems).toEqual([
    { id: 'new-tab', label: 'New Tab', enabled: true },
    { id: 'reload-tab', label: 'Reload Tab', enabled: true },
    { id: 'reload-tab-ignoring-cache', label: 'Reload Tab Without Cache', enabled: true },
    { id: 'duplicate-tab', label: 'Duplicate Tab', enabled: true },
    { id: 'open-in-split-view', label: 'Open Tab Beside', enabled: true },
    { id: 'mute-tab', label: 'Mute Tab', enabled: true },
    { id: 'pin-tab', label: 'Pin Tab', enabled: true },
    { id: 'sleep-tab', label: 'Put Tab to Sleep', enabled: false },
    { id: 'tab-group', label: 'Tab Group: Default', enabled: true },
    { id: 'move-tab-left', label: 'Move Tab Left', enabled: true },
    { id: 'move-tab-right', label: 'Move Tab Right', enabled: false },
    { id: 'close-tab', label: 'Close Tab', enabled: true },
    { id: 'close-other-tabs', label: 'Close Other Tabs', enabled: true },
    { id: 'close-tabs-to-right', label: 'Close Tabs to the Right', enabled: false },
    { id: 'close-duplicate-tabs', label: 'Close Duplicate Tabs', enabled: false },
    { id: 'reopen-closed-tab', label: 'Reopen Closed Tab', enabled: false }
  ])
  await expect.poll(() => electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    return menu?.getMenuItemById('tab-group')?.submenu?.items
      .filter((item) => item.type !== 'separator')
      .map(({ id, label }) => ({ id, label })) ?? []
  })).toEqual([
    { id: 'rename-tab-group', label: 'Edit Group…' },
    { id: 'move-tab-to-group', label: 'Move Tab to Group' },
    { id: 'save-close-tab-group', label: 'Save & Close Group' },
    { id: 'remove-tab-from-group', label: 'Remove Tab from Group' }
  ])
  await electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const item = menu?.getMenuItemById('move-tab-left')
    if (!item?.click) throw new Error('Move Tab Left context action was not found')
    ;(item.click as unknown as () => void)()
  })
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith('bronom://')).map((tab) => tab.title))`)).toEqual([
    'Pin beta',
    'Pin alpha'
  ])
  await electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const item = menu?.getMenuItemById('pin-tab')
    if (!item?.click) throw new Error('Pin Tab context action was not found')
    ;(item.click as unknown as () => void)()
  })

  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith('bronom://')).map(({ title, pinned }) => ({ title, pinned })))`)).toEqual([
    { title: 'Pin beta', pinned: true },
    { title: 'Pin alpha', pinned: false }
  ])
  const pinnedTab = appWindow.locator('.tab.pinned')
  await expect(pinnedTab).toHaveCount(1)
  await expect(pinnedTab).toHaveAttribute('aria-label', /Pin beta — pinned/)
  expect(Math.round((await pinnedTab.boundingBox())!.width)).toBe(40)

  await appWindow.getByRole('button', { name: 'Search tabs' }).click()
  const panel = appWindow.getByRole('dialog', { name: 'Tabs' })
  await panel.getByRole('button', { name: 'Unpin Pin beta' }).click()
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.title === 'Pin beta')?.pinned)`)).toBe(false)
  await panel.getByRole('button', { name: 'Pin Pin beta' }).click()
  await expect(panel.getByRole('button', { name: 'Unpin Pin beta' })).toHaveAttribute('aria-pressed', 'true')
  await appWindow.keyboard.press('Escape')

  const betaId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.title === 'Pin beta')?.id)`) as string
  await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(betaId)})`)
  await appWindow.evaluate('window.bronom.reopenClosedTab()')
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith('bronom://')).map(({ title, pinned }) => ({ title, pinned })))`)).toEqual([
    { title: 'Pin beta', pinned: true },
    { title: 'Pin alpha', pinned: false }
  ])
  await expect.poll(async () => {
    const saved = await readFile(join(profileDirectory, 'tabs.json'), 'utf8').catch(() => '')
    if (!saved) return []
    const value = JSON.parse(saved)
    return value.tabs.filter((tab: { url: string }) => !tab.url.startsWith('bronom://')).map(({ title, pinned }: { title: string; pinned: boolean }) => ({ title, pinned }))
  }).toEqual([
    { title: 'Pin beta', pinned: true },
    { title: 'Pin alpha', pinned: false }
  ])
})

test('creates, renames, and removes a human tab group from the tab context menu', async ({ appWindow, electronApp }) => {
  await appWindow.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Human group tab</title><main>Grouped</main>', active: true })`)
  await electronApp.evaluate(({ Menu }) => {
    ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = undefined
    Menu.prototype.popup = function (): void {
      ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = this
    }
  })
  const tab = appWindow.getByRole('tab', { name: /^Human group tab/ })
  await tab.click({ button: 'right' })
  await electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const item = menu?.getMenuItemById('new-tab-group')
    if (!item?.click) throw new Error('New Group context action was not found')
    ;(item.click as unknown as () => void)()
  })
  const editor = appWindow.getByRole('dialog', { name: 'Edit group' })
  await expect(editor).toBeVisible()
  await editor.getByLabel('Group name').fill('Human debugging')
  await expect(editor.getByRole('radio')).toHaveCount(9)
  await editor.getByRole('radio', { name: 'Orange' }).click()
  await editor.getByRole('button', { name: 'Save changes' }).click()
  await expect(editor).toBeHidden()
  await expect(appWindow.locator('.tab-group-label', { hasText: 'Human debugging' })).toBeVisible()
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((candidate) => candidate.title === 'Human group tab')?.mcpGroupName)`)).toBe('Human debugging')
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((group) => group.name === 'Human debugging')?.color)`)).toBe('orange')
  await expect(appWindow.locator('.tab-group-label', { hasText: 'Human debugging' })).toHaveAttribute('style', /#e08b3e/)

  await tab.click({ button: 'right' })
  await expect.poll(() => electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const group = menu?.getMenuItemById('tab-group')
    return {
      label: group?.label,
      actions: group?.submenu?.items.filter((item) => item.type !== 'separator').map(({ id }) => id)
    }
  })).toEqual({
    label: 'Tab Group: Human debugging',
    actions: ['rename-tab-group', 'move-tab-to-group', 'save-close-tab-group', 'remove-tab-from-group']
  })
  await electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const item = menu?.getMenuItemById('remove-tab-from-group')
    if (!item?.click) throw new Error('Remove Tab from Group context action was not found')
    ;(item.click as unknown as () => void)()
  })
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((candidate) => candidate.title === 'Human group tab')?.mcpGroupId ?? null)`)).toBeNull()
  await expect(appWindow.locator('.tab-group-label', { hasText: 'Human debugging' })).toBeHidden()
})

test('saves a tab group from its context menu and restores it with a fresh group id', async ({ appWindow, electronApp }) => {
  await appWindow.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Saved research</title><main>Grouped</main>', active: true })`)
  await electronApp.evaluate(({ Menu }) => {
    ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = undefined
    Menu.prototype.popup = function (): void {
      ;(globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu = this
    }
  })
  const originalTab = appWindow.getByRole('tab', { name: /^Saved research/ })
  await originalTab.click({ button: 'right' })
  await electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const item = menu?.getMenuItemById('new-tab-group')
    if (!item?.click) throw new Error('New Group context action was not found')
    ;(item.click as unknown as () => void)()
  })
  const editor = appWindow.getByRole('dialog', { name: 'Edit group' })
  await editor.getByLabel('Group name').fill('Saved investigation')
  await editor.getByRole('button', { name: 'Save changes' }).click()
  const originalGroupId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((group) => group.name === 'Saved investigation')?.id)`) as string

  await originalTab.click({ button: 'right' })
  await electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomTabMenu?: Electron.Menu }).__bronomTabMenu
    const item = menu?.getMenuItemById('save-close-tab-group')
    if (!item?.click) throw new Error('Save & Close Group context action was not found')
    ;(item.click as unknown as () => void)()
  })
  await expect(originalTab).toBeHidden()
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => ({ open: state.mcpTabGroups.some((group) => group.id === ${JSON.stringify(originalGroupId)}), saved: state.savedTabGroups.map((group) => ({ name: group.name, tabs: group.tabs.length })) }))`)).toEqual({
    open: false,
    saved: [{ name: 'Saved investigation', tabs: 1 }]
  })

  await appWindow.getByRole('button', { name: 'Search tabs' }).click()
  const panel = appWindow.getByRole('dialog', { name: 'Tabs' })
  await expect(panel.getByText('Saved groups')).toBeVisible()
  await panel.getByRole('button', { name: 'Restore saved group Saved investigation' }).click()
  await expect(appWindow.getByRole('tab', { name: /^Saved research/ })).toBeVisible()
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => ({ saved: state.savedTabGroups.length, restored: state.mcpTabGroups.find((group) => group.name === 'Saved investigation')?.id }))`)).toEqual({
    saved: 0,
    restored: expect.not.stringMatching(originalGroupId)
  })
})

test('reorders pinned and regular tabs by dragging and saves the new order', async ({ appWindow, profileDirectory }) => {
  for (const title of ['Drag alpha', 'Drag beta', 'Drag gamma']) {
    const url = `data:text/html,<title>${title}</title><main>${title}</main>`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
  }
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith('bronom://')).map((tab) => tab.title))`)).toEqual([
    'Drag alpha',
    'Drag beta',
    'Drag gamma'
  ])

  const alphaTab = appWindow.getByRole('tab', { name: /^Drag alpha/ })
  const betaTab = appWindow.getByRole('tab', { name: /^Drag beta/ })
  const gammaTab = appWindow.getByRole('tab', { name: /^Drag gamma/ })
  await gammaTab.dragTo(alphaTab, { targetPosition: { x: 3, y: 18 } })
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith('bronom://')).map((tab) => tab.title))`)).toEqual([
    'Drag gamma',
    'Drag alpha',
    'Drag beta'
  ])

  await appWindow.evaluate(`window.bronom.getState().then(async (state) => {
    const gamma = state.tabs.find((tab) => tab.title === 'Drag gamma')
    const alpha = state.tabs.find((tab) => tab.title === 'Drag alpha')
    await window.bronom.setTabPinned(gamma.id, true)
    await window.bronom.setTabPinned(alpha.id, true)
  })`)
  await alphaTab.dragTo(gammaTab, { targetPosition: { x: 3, y: 18 } })
  await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith('bronom://')).map(({ title, pinned }) => ({ title, pinned })))`)).toEqual([
    { title: 'Drag alpha', pinned: true },
    { title: 'Drag gamma', pinned: true },
    { title: 'Drag beta', pinned: false }
  ])
  await expect(appWindow.locator('.tab.pinned')).toHaveCount(2)
  await expect.poll(async () => {
    const saved = await readFile(join(profileDirectory, 'tabs.json'), 'utf8').catch(() => '')
    if (!saved) return []
    const value = JSON.parse(saved)
    return value.tabs.filter((tab: { url: string }) => !tab.url.startsWith('bronom://')).map(({ title, pinned }: { title: string; pinned: boolean }) => ({ title, pinned }))
  }).toEqual([
    { title: 'Drag alpha', pinned: true },
    { title: 'Drag gamma', pinned: true },
    { title: 'Drag beta', pinned: false }
  ])
})

test('restores pinned tabs ahead of regular tabs after restart', async ({ profileDirectory, mcpPort }) => {
  const alphaUrl = 'data:text/html,<title>Restored pin alpha</title><main>Alpha</main>'
  const betaUrl = 'data:text/html,<title>Restored pin beta</title><main>Beta</main>'
  let first: Awaited<ReturnType<typeof launchBronom>> | undefined
  let second: Awaited<ReturnType<typeof launchBronom>> | undefined
  try {
    first = await launchBronom(profileDirectory, mcpPort)
    await first.window.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(alphaUrl)}, active: true })`)
    await first.window.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(betaUrl)}, active: true })`)
    await expect.poll(() => first!.window.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Restored pin beta')
    await first.window.evaluate(`window.bronom.getState().then((state) => window.bronom.setTabPinned(state.tabs.find((tab) => tab.title === 'Restored pin beta').id, true))`)
    await expect.poll(async () => {
      const saved = await readFile(join(profileDirectory, 'tabs.json'), 'utf8').catch(() => '')
      if (!saved) return undefined
      const value = JSON.parse(saved)
      return value.tabs.find((tab: { title: string }) => tab.title === 'Restored pin beta')?.pinned
    }).toBe(true)
    await closeBronom(first.app)
    first = undefined

    second = await launchBronom(profileDirectory, mcpPort)
    await expect.poll(() => second!.window.evaluate(`window.bronom.getState().then((state) => state.tabs.filter((tab) => !tab.url.startsWith('bronom://')).map(({ title, pinned }) => ({ title, pinned })))`)).toEqual([
      { title: 'Restored pin beta', pinned: true },
      { title: 'Restored pin alpha', pinned: false }
    ])
    await expect(second.window.locator('.tab.pinned')).toHaveCount(1)
  } finally {
    if (first) await closeBronom(first.app)
    if (second) await closeBronom(second.app)
  }
})

test('saves, searches, renames, and removes local bookmarks', async ({ appWindow, profileDirectory }) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Bookmark fixture</title><main>Saved page</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Bookmark fixture did not expose a port')
    const url = `http://127.0.0.1:${address.port}/`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Bookmark fixture')

    const bookmarksButton = appWindow.getByRole('button', { name: 'Bookmarks', exact: true })
    await bookmarksButton.focus()
    await appWindow.keyboard.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+D`)
    const panel = appWindow.getByRole('dialog', { name: 'Bookmarks' })
    await expect(panel).toBeVisible()
    await expect(panel).toContainText('Bookmark fixture')
    await expect(bookmarksButton).toHaveAttribute('title', /current page saved/)
    await expect.poll(async () => {
      const value = JSON.parse(await readFile(join(profileDirectory, 'bookmarks.json'), 'utf8'))
      return value.bookmarks?.[0]
    }).toMatchObject({ url, title: 'Bookmark fixture' })

    await panel.getByRole('searchbox', { name: 'Search bookmarks' }).fill('does not match')
    await expect(panel).toContainText('No matching bookmarks')
    await panel.getByRole('searchbox', { name: 'Search bookmarks' }).fill('Bookmark')
    await panel.getByRole('button', { name: 'Rename Bookmark fixture' }).click()
    await panel.getByRole('textbox', { name: 'Rename Bookmark fixture' }).fill('Renamed bookmark')
    await panel.getByRole('button', { name: 'Save name for Bookmark fixture' }).click()
    await expect(panel).toContainText('Renamed bookmark')
    await panel.getByRole('button', { name: 'Remove Renamed bookmark' }).click()
    await expect(panel).toContainText('No bookmarks yet')
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('records, searches, removes, and clears local browsing history', async ({ appWindow, electronApp, profileDirectory }) => {
  const browserViewBounds = (): Promise<{ x: number; y: number; width: number; height: number } | undefined> => electronApp.evaluate(({ BrowserWindow }) => (
    BrowserWindow.getAllWindows()[0]?.contentView.children[0]?.getBounds()
  ))
  const server = createServer((request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    const title = request.url?.startsWith('/beta') ? 'History beta' : 'History alpha'
    response.end(`<!doctype html><title>${title}</title><main>${title}</main>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('History fixture did not expose a port')
    const alphaUrl = `http://127.0.0.1:${address.port}/alpha`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(alphaUrl)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronomHistory.list()')).toEqual([
      expect.objectContaining({ url: alphaUrl, title: 'History alpha', visitCount: 1 })
    ])

    await appWindow.evaluate(`window.bronom.navigate({ url: ${JSON.stringify(`${alphaUrl}#details`)} })`)
    await expect.poll(() => appWindow.evaluate('window.bronomHistory.list()')).toEqual([
      expect.objectContaining({ url: alphaUrl, title: 'History alpha', visitCount: 2 })
    ])

    await appWindow.getByRole('button', { name: 'Browsing history' }).focus()
    await appWindow.keyboard.press(process.platform === 'darwin' ? 'Meta+Y' : 'Control+H')
    const panel = appWindow.getByRole('dialog', { name: 'Browsing history' })
    await expect(panel).toBeVisible()
    const panelBounds = await panel.boundingBox()
    expect(panelBounds).not.toBeNull()
    await expect.poll(browserViewBounds).toMatchObject({
      x: 0,
      y: 105,
      width: Math.round(panelBounds!.x)
    })
    await expect(panel).toContainText('2 visits')
    await panel.getByRole('searchbox', { name: 'Search browsing history' }).fill('does not match')
    await expect(panel).toContainText('No matching visits')
    await panel.getByRole('searchbox', { name: 'Search browsing history' }).fill('alpha')
    await panel.getByRole('button', { name: 'Remove History alpha from history' }).click()
    await expect(panel).toContainText('No browsing history yet')

    const betaUrl = `http://127.0.0.1:${address.port}/beta`
    await appWindow.evaluate(`window.bronom.navigate({ url: ${JSON.stringify(betaUrl)} })`)
    await expect.poll(() => appWindow.evaluate('window.bronomHistory.list()')).toEqual([
      expect.objectContaining({ url: betaUrl, title: 'History beta' })
    ])
    appWindow.once('dialog', (dialog) => void dialog.accept())
    await panel.getByRole('button', { name: 'Clear all' }).click()
    await expect(panel).toContainText('No browsing history yet')
    await expect.poll(async () => {
      const value = JSON.parse(await readFile(join(profileDirectory, 'history.json'), 'utf8'))
      return value.entries
    }).toEqual([])
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('does not count restored tabs as new browsing-history visits', async ({ profileDirectory, mcpPort }) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Restored history fixture</title><main>Restored page</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  let first: Awaited<ReturnType<typeof launchBronom>> | undefined
  let second: Awaited<ReturnType<typeof launchBronom>> | undefined
  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Restored-history fixture did not expose a port')
    const url = `http://127.0.0.1:${address.port}/restored`
    first = await launchBronom(profileDirectory, mcpPort)
    await first.window.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => first!.window.evaluate('window.bronomHistory.list()')).toEqual([
      expect.objectContaining({ url, visitCount: 1 })
    ])
    await closeBronom(first.app)
    first = undefined

    second = await launchBronom(profileDirectory, mcpPort)
    await expect.poll(() => second!.window.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.url === ${JSON.stringify(url)}))`)).toMatchObject({
      title: 'Restored history fixture',
      loading: false
    })
    expect(await second.window.evaluate('window.bronomHistory.list()')).toEqual([
      expect.objectContaining({ url, visitCount: 1 })
    ])
  } finally {
    if (first) await closeBronom(first.app)
    if (second) await closeBronom(second.app)
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('renders a sanitized page favicon and exposes per-tab audio controls', async ({ appWindow, electronApp }) => {
  const favicon = await readFile(new URL('../../build/icons/24x24.png', import.meta.url))
  const server = createServer((request, response) => {
    if (request.url === '/favicon.png') {
      response.writeHead(200, { 'content-length': String(favicon.length), 'content-type': 'image/png' })
      response.end(favicon)
      return
    }
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Favicon fixture</title><link rel="icon" href="/favicon.png"><main>Tab identity fixture</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/favicon`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.faviconDataUrl)')).toMatch(/^data:image\/png;base64,/)
    await expect(appWindow.locator('.tab.active .favicon-image')).toHaveAttribute('src', /^data:image\/png;base64,/)

    await electronApp.evaluate(({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      if (!page) throw new Error('Favicon fixture web contents was not found')
      page.emit('audio-state-changed', { audible: true } as Electron.Event<Electron.WebContentsAudioStateChangedEventParams>)
    }, url)
    const muteButton = appWindow.getByRole('button', { name: 'Mute Favicon fixture' })
    await expect(muteButton).toBeVisible()
    await muteButton.click()
    await expect(appWindow.getByRole('button', { name: 'Unmute Favicon fixture' })).toBeVisible()
    await expect.poll(() => electronApp.evaluate(({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      return page?.isAudioMuted()
    }, url)).toBe(true)
    await appWindow.getByRole('button', { name: 'Unmute Favicon fixture' }).click()
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.muted)')).toBe(false)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('finds text from a website shortcut and navigates page matches', async ({ appWindow, electronApp }) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html>
      <title>Find fixture</title>
      <main>
        <p>First needle result.</p>
        <p>Second needle result.</p>
        <p>Third needle result.</p>
      </main>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/find`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Find fixture')

    await electronApp.evaluate(async ({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      if (!page) throw new Error('Find fixture web contents was not found')
      page.focus()
      const modifiers = process.platform === 'darwin' ? ['meta'] as const : ['control'] as const
      page.sendInputEvent({ type: 'keyDown', keyCode: 'F', modifiers: [...modifiers] })
      page.sendInputEvent({ type: 'keyUp', keyCode: 'F', modifiers: [...modifiers] })
    }, url)

    const findBar = appWindow.getByRole('search', { name: 'Find in page' })
    await expect(findBar).toBeVisible()
    await findBar.getByRole('searchbox', { name: 'Find text' }).fill('needle')
    await expect(findBar.locator('.find-count')).toHaveText('1 / 3')
    await findBar.getByRole('button', { name: 'Next match' }).click()
    await expect(findBar.locator('.find-count')).toHaveText('2 / 3')
    await findBar.getByRole('button', { name: 'Previous match' }).click()
    await expect(findBar.locator('.find-count')).toHaveText('1 / 3')

    await appWindow.keyboard.press('Escape')
    await expect(findBar).toBeHidden()
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('zooms website content with familiar shortcuts and visible controls', async ({ appWindow, electronApp }) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Zoom fixture</title><main>Zoom this page</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/zoom`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Zoom fixture')

    await electronApp.evaluate(async ({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      if (!page) throw new Error('Zoom fixture web contents was not found')
      page.focus()
      const modifiers = process.platform === 'darwin' ? ['meta', 'shift'] as const : ['control', 'shift'] as const
      page.sendInputEvent({ type: 'keyDown', keyCode: '=', modifiers: [...modifiers] })
      page.sendInputEvent({ type: 'keyUp', keyCode: '=', modifiers: [...modifiers] })
    }, url)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.zoomPercent)')).toBe(110)

    await appWindow.getByRole('button', { name: 'Page zoom controls' }).click()
    const controls = appWindow.getByRole('group', { name: 'Page zoom controls' })
    await expect(controls).toBeVisible()
    await expect(controls.locator('output')).toHaveText('110%')
    await controls.getByRole('button', { name: 'Zoom out' }).click()
    await expect(controls.locator('output')).toHaveText('100%')
    await controls.getByRole('button', { name: 'Zoom in' }).click()
    await expect(controls.locator('output')).toHaveText('110%')
    await controls.getByRole('button', { name: 'Reset' }).click()
    await expect(controls.locator('output')).toHaveText('100%')
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('shows a native webpage context menu and suppresses it while human interaction is locked', async ({
  appWindow,
  electronApp
}) => {
  const server = createServer((request, response) => {
    if (request.url === '/image.png') {
      response.writeHead(200, { 'content-type': 'image/png' })
      response.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+4X2WAAAAAElFTkSuQmCC', 'base64'))
      return
    }
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html>
      <title>Context menu fixture</title>
      <a id="link" href="/target">Open target</a>
      <textarea id="editor">Editable text</textarea>
      <img id="image" src="/image.png" alt="Fixture image" width="40" height="40">`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/context`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Context menu fixture')

    await electronApp.evaluate(({ Menu }) => {
      ;(globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu = undefined
      Menu.prototype.popup = function (): void {
        ;(globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu = this
      }
    })
    const rightClick = async (selector: string): Promise<void> => {
      await electronApp.evaluate(async ({ webContents }, input: { requestedUrl: string; selector: string }) => {
        ;(globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu = undefined
        const page = webContents.getAllWebContents().find((contents) => contents.getURL() === input.requestedUrl)
        if (!page) throw new Error('Context menu fixture web contents was not found')
        const point = await page.executeJavaScript(`(() => {
          const bounds = document.querySelector(${JSON.stringify(input.selector)}).getBoundingClientRect()
          return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
        })()`)
        page.focus()
        page.sendInputEvent({ type: 'mouseDown', button: 'right', clickCount: 1, ...point })
        page.sendInputEvent({ type: 'mouseUp', button: 'right', clickCount: 1, ...point })
      }, { requestedUrl: url, selector })
    }
    const contextMenuItems = (): Promise<Array<{ id: string; label: string; enabled: boolean }>> => electronApp.evaluate(() => {
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      return menu?.items.map(({ id, label, enabled }) => ({ id, label, enabled })) ?? []
    })

    await rightClick('#link')
    await expect.poll(contextMenuItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'open-link-new-tab', label: 'Open Link in New Tab', enabled: true }),
      expect.objectContaining({ id: 'copy-link-address', label: 'Copy Link Address' }),
      expect.objectContaining({ id: 'save-link', label: 'Save Link', enabled: true }),
      expect.objectContaining({ id: 'reload', label: 'Reload' }),
      expect.objectContaining({ id: 'reload-ignoring-cache', label: 'Reload Without Cache' }),
      expect.objectContaining({ id: 'inspect-element', label: 'Inspect' })
    ]))

    await electronApp.evaluate(({ clipboard }) => {
      clipboard.clear()
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('copy-link-address')
      if (!item?.click) throw new Error('Copy Link Address context action was not found')
      ;(item.click as unknown as () => void)()
    })
    await expect.poll(() => electronApp.evaluate(({ clipboard }) => clipboard.readText()))
      .toBe(`http://127.0.0.1:${address.port}/target`)

    await electronApp.evaluate(({ clipboard }) => {
      clipboard.clear()
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('copy-page-address')
      if (!item?.click) throw new Error('Copy Page Address context action was not found')
      ;(item.click as unknown as () => void)()
    })
    await expect.poll(() => electronApp.evaluate(({ clipboard }) => clipboard.readText())).toBe(url)

    await rightClick('#link')
    await expect.poll(contextMenuItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'copy-link-address', label: 'Copy Link Address' })
    ]))
    await electronApp.evaluate(({ clipboard }) => {
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('copy-link-address')
      if (!item?.click) throw new Error('Copy Link Address context action was not found')
      const originalReadText = clipboard.readText
      clipboard.readText = () => ''
      ;(item.click as unknown as () => void)()
      setTimeout(() => { clipboard.readText = originalReadText }, 500)
    })
    const copyFailure = appWindow.getByRole('alert', { name: 'Copy failed' })
    await expect(copyFailure).toBeVisible()
    await expect(copyFailure).toContainText('system clipboard did not accept it')
    await new Promise((resolve) => setTimeout(resolve, 600))

    await electronApp.evaluate(() => {
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('open-link-new-tab')
      if (!item?.click) throw new Error('Open Link in New Tab context action was not found')
      ;(item.click as unknown as () => void)()
    })
    await expect.poll(() => appWindow.evaluate('window.bronom.getState()')).toMatchObject({
      tabs: expect.arrayContaining([expect.objectContaining({ url: `http://127.0.0.1:${address.port}/target`, active: false })])
    })

    await rightClick('#editor')
    await expect.poll(contextMenuItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'undo', label: 'Undo' }),
      expect.objectContaining({ id: 'paste', label: 'Paste' }),
      expect.objectContaining({ id: 'select-all', label: 'Select All' })
    ]))

    await rightClick('#image')
    await expect.poll(contextMenuItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'copy-image', label: 'Copy Image' }),
      expect.objectContaining({ id: 'copy-image-address', label: 'Copy Image Address' }),
      expect.objectContaining({ id: 'save-image', label: 'Save Image', enabled: true })
    ]))
    await electronApp.evaluate(({ clipboard }) => {
      clipboard.clear()
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('copy-image-address')
      if (!item?.click) throw new Error('Copy Image Address context action was not found')
      ;(item.click as unknown as () => void)()
    })
    await expect.poll(() => electronApp.evaluate(({ clipboard }) => clipboard.readText()))
      .toBe(`http://127.0.0.1:${address.port}/image.png`)

    await electronApp.evaluate(({ clipboard }) => {
      clipboard.clear()
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('copy-image')
      if (!item?.click) throw new Error('Copy Image context action was not found')
      ;(item.click as unknown as () => void)()
    })
    await expect.poll(() => electronApp.evaluate(({ clipboard }) => {
      const image = clipboard.readImage()
      return { empty: image.isEmpty(), size: image.getSize(), pngBytes: image.toPNG().byteLength }
    })).toEqual({ empty: false, size: { width: 1, height: 1 }, pngBytes: expect.any(Number) })

    await rightClick('#image')
    await expect.poll(contextMenuItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'copy-image', label: 'Copy Image' })
    ]))
    await electronApp.evaluate(({ clipboard, nativeImage }) => {
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('copy-image')
      if (!item?.click) throw new Error('Copy Image context action was not found')
      const originalReadImage = clipboard.readImage
      clipboard.readImage = () => nativeImage.createEmpty()
      ;(item.click as unknown as () => void)()
      setTimeout(() => { clipboard.readImage = originalReadImage }, 700)
    })
    const imageCopyFailure = appWindow.getByRole('alert', { name: 'Copy failed' })
    await expect(imageCopyFailure).toBeVisible()
    await expect(imageCopyFailure).toContainText('system clipboard did not accept it')
    await new Promise((resolve) => setTimeout(resolve, 800))

    await rightClick('#link')
    const staleTabId = await appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)') as string
    await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(staleTabId)})`)
    await electronApp.evaluate(() => {
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('reload')
      if (!item?.click) throw new Error('Reload context action was not found')
      ;(item.click as unknown as () => void)()
    })
    const actionFailure = appWindow.getByRole('alert', { name: 'Reload failed' })
    await expect(actionFailure).toBeVisible()
    await expect(actionFailure).toContainText('The tab is no longer available')
    await expect(actionFailure).not.toContainText(staleTabId)

    await electronApp.evaluate(() => {
      const menu = (globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu
      const item = menu?.getMenuItemById('save-link')
      if (!item?.click) throw new Error('Save Link context action was not found')
      ;(item.click as unknown as () => void)()
    })
    const saveFailure = appWindow.getByRole('alert', { name: 'Save link failed' })
    await expect(saveFailure).toBeVisible()
    await expect(saveFailure).toContainText('The tab is no longer available')
    await expect(saveFailure).not.toContainText(staleTabId)

    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Context menu fixture')

    const activeTabId = await appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)') as string
    await appWindow.evaluate(`window.bronom.setTabHumanInteractionLocked(${JSON.stringify(activeTabId)}, true)`)
    await electronApp.evaluate(() => {
      ;(globalThis as typeof globalThis & { __bronomContextMenu?: Electron.Menu }).__bronomContextMenu = undefined
    })
    await rightClick('#link')
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(await contextMenuItems()).toEqual([])
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('preserves intercepted new-tab requests and background disposition', async ({ appWindow, electronApp }) => {
  let received: { method?: string; body: string; contentType?: string; referrer?: string } | undefined
  let backgroundReferrer: string | undefined
  const server = createServer((request, response) => {
    if (request.url === '/submit') {
      const chunks: Buffer[] = []
      request.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      request.on('end', () => {
        received = {
          method: request.method,
          body: Buffer.concat(chunks).toString('utf8'),
          contentType: request.headers['content-type'],
          referrer: request.headers.referer
        }
        response.writeHead(200, { 'content-type': 'text/html' })
        response.end('<!doctype html><title>POST received</title><h1>Submitted</h1>')
      })
      return
    }
    if (request.url === '/background') {
      backgroundReferrer = request.headers.referer
      response.writeHead(200, { 'content-type': 'text/html' })
      response.end('<!doctype html><title>Background opened</title><h1>Background tab</h1>')
      return
    }
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html>
      <title>Target blank form</title>
      <form id="post-form" method="post" action="/submit" target="_blank">
        <input name="message" value="agent workspace">
        <input name="count" value="2">
        <button type="submit">Submit in new tab</button>
      </form>
      <a id="background-link" href="/background" target="_blank">Open in background</a>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/form`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)'))
      .toBe('Target blank form')

    await electronApp.evaluate(async ({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      if (!page) throw new Error('Form fixture web contents was not found')
      await page.executeJavaScript(`document.querySelector('#post-form').requestSubmit()`)
    }, url)

    await expect.poll(() => received).toMatchObject({
      method: 'POST',
      body: 'message=agent+workspace&count=2',
      contentType: expect.stringContaining('application/x-www-form-urlencoded'),
      referrer: url
    })
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)'))
      .toBe('POST received')

    const formTabId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.url === ${JSON.stringify(url)})?.id)`) as string
    await appWindow.evaluate(`window.bronom.selectTab(${JSON.stringify(formTabId)})`)
    await electronApp.evaluate(async ({ webContents }, requestedUrl) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === requestedUrl)
      if (!page) throw new Error('Form fixture web contents was not found')
      const point = await page.executeJavaScript(`(() => {
        const bounds = document.querySelector('#background-link').getBoundingClientRect()
        return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
      })()`)
      page.focus()
      page.sendInputEvent({ type: 'mouseDown', button: 'middle', clickCount: 1, ...point })
      page.sendInputEvent({ type: 'mouseUp', button: 'middle', clickCount: 1, ...point })
    }, url)

    const backgroundUrl = `http://127.0.0.1:${address.port}/background`
    await expect.poll(() => appWindow.evaluate('window.bronom.getState()')).toMatchObject({
      activeTabId: formTabId,
      tabs: expect.arrayContaining([
        expect.objectContaining({ url: backgroundUrl, title: 'Background opened', active: false })
      ])
    })
    expect(backgroundReferrer).toBe(url)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('shows live download progress with cancel, clear, and reveal-in-folder actions', async ({
  appWindow,
  electronApp,
  profileDirectory
}) => {
  const server = createServer((request, response) => {
    if (request.url === '/slow.bin') {
      response.writeHead(200, {
        'content-disposition': 'attachment; filename="slow.bin"',
        'content-length': '65536',
        'content-type': 'application/octet-stream'
      })
      response.write(Buffer.alloc(1024, 1))
      return
    }
    if (request.url === '/complete.txt') {
      const body = Buffer.from('completed download fixture')
      response.writeHead(200, {
        'content-disposition': 'attachment; filename="complete.txt"',
        'content-length': String(body.length),
        'content-type': 'text/plain'
      })
      response.end(body)
      return
    }
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html>
      <title>Download fixture</title>
      <a id="slow" href="/slow.bin" download>Slow download</a>
      <a id="complete" href="/complete.txt" download>Complete download</a>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/downloads`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.title)')).toBe('Download fixture')

    const clickPageLink = (selector: string): Promise<void> => electronApp.evaluate(async ({ webContents }, input: { url: string; selector: string }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL() === input.url)
      if (!page) throw new Error('Download fixture web contents was not found')
      await page.executeJavaScript(`document.querySelector(${JSON.stringify(input.selector)}).click()`)
    }, { url, selector })

    const customDownloadDirectory = join(profileDirectory, 'chosen-downloads')
    await mkdir(customDownloadDirectory)
    await electronApp.evaluate(({ dialog, shell }, directory) => {
      dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [directory] })
      shell.openPath = async (path): Promise<string> => {
        ;(globalThis as typeof globalThis & { __bronomOpenedDownloadDirectory?: string }).__bronomOpenedDownloadDirectory = path
        return ''
      }
    }, customDownloadDirectory)
    await appWindow.getByRole('button', { name: 'Settings' }).click()
    const settingsDialog = appWindow.getByRole('dialog', { name: 'Settings' })
    await settingsDialog.getByRole('button', { name: /Downloads Location and prompts/ }).click()
    await expect(settingsDialog.getByText(profileDirectory, { exact: true })).toBeVisible()
    await settingsDialog.getByRole('button', { name: 'Change…' }).click()
    await expect(settingsDialog.getByText(customDownloadDirectory, { exact: true })).toBeVisible()
    await expect(settingsDialog).toContainText('New website downloads will use this folder.')
    await settingsDialog.getByRole('button', { name: 'Open folder' }).click()
    await expect.poll(() => electronApp.evaluate(() => (
      globalThis as typeof globalThis & { __bronomOpenedDownloadDirectory?: string }
    ).__bronomOpenedDownloadDirectory)).toBe(customDownloadDirectory)

    const askWhere = settingsDialog.getByRole('checkbox', { name: 'Ask where to save each file' })
    await askWhere.check()
    await expect(askWhere).toBeChecked()
    await electronApp.evaluate(({ session }) => {
      session.fromPartition('persist:bronom').once('will-download', (_event, item) => {
        ;(globalThis as typeof globalThis & {
          __bronomDownloadDialog?: { savePath: string; defaultPath?: string }
        }).__bronomDownloadDialog = {
          savePath: item.getSavePath(),
          defaultPath: item.getSaveDialogOptions().defaultPath
        }
        item.cancel()
      })
    })
    await clickPageLink('#complete')
    await expect.poll(() => electronApp.evaluate(() => (
      globalThis as typeof globalThis & {
        __bronomDownloadDialog?: { savePath: string; defaultPath?: string }
      }
    ).__bronomDownloadDialog)).toEqual({
      savePath: '',
      defaultPath: join(customDownloadDirectory, 'complete.txt')
    })
    await expect.poll(() => appWindow.evaluate('window.bronomDownloads.list()')).toEqual([
      expect.objectContaining({ filename: 'complete.txt', state: 'cancelled' })
    ])
    await appWindow.evaluate('window.bronomDownloads.clearFinished()')
    await askWhere.uncheck()
    await expect(askWhere).not.toBeChecked()
    await settingsDialog.getByRole('button', { name: 'Close', exact: true }).click()

    const panel = appWindow.getByRole('dialog', { name: 'Downloads' })

    await clickPageLink('#slow')
    await expect(panel).toBeVisible()
    const panelBounds = await panel.boundingBox()
    expect(panelBounds).not.toBeNull()
    await expect.poll(() => electronApp.evaluate(({ BrowserWindow }) => (
      BrowserWindow.getAllWindows()[0]?.contentView.children[0]?.getBounds()
    ))).toMatchObject({
      x: 0,
      y: 105,
      width: Math.round(panelBounds!.x)
    })
    await expect(panel.getByText('slow.bin', { exact: true })).toBeVisible()
    await expect(panel.getByRole('progressbar', { name: 'Downloading slow.bin' })).toBeVisible()
    await panel.getByRole('button', { name: 'Cancel slow.bin' }).click()
    await expect(panel.getByText('Cancelled', { exact: true })).toBeVisible()
    await panel.getByRole('button', { name: 'Clear finished' }).click()
    await expect(panel.getByText('No downloads yet')).toBeVisible()

    await electronApp.evaluate(({ shell }) => {
      shell.showItemInFolder = (path): void => {
        ;(globalThis as typeof globalThis & { __bronomRevealedDownload?: string }).__bronomRevealedDownload = path
      }
    })
    await clickPageLink('#complete')
    await expect(panel.getByText('complete.txt', { exact: true })).toBeVisible()
    await expect(panel.getByText(/Complete/)).toBeVisible()
    await panel.getByRole('button', { name: 'Show complete.txt in folder' }).click()
    await expect.poll(() => electronApp.evaluate(() => (
      globalThis as typeof globalThis & { __bronomRevealedDownload?: string }
    ).__bronomRevealedDownload)).toBe(join(customDownloadDirectory, 'complete.txt'))
    await panel.getByRole('button', { name: 'Clear finished' }).click()
    await expect(panel.getByText('No downloads yet')).toBeVisible()

    await appWindow.getByRole('button', { name: 'Settings' }).click()
    await settingsDialog.getByRole('button', { name: /Downloads Location and prompts/ }).click()
    await settingsDialog.getByRole('button', { name: 'Reset to default' }).click()
    await expect(settingsDialog.getByText(profileDirectory, { exact: true })).toBeVisible()
    await expect(settingsDialog.getByRole('checkbox', { name: 'Ask where to save each file' })).not.toBeChecked()
    const persisted = JSON.parse(await readFile(join(profileDirectory, 'settings.json'), 'utf8')) as {
      downloadDirectory?: string | null
      askWhereToSaveDownloads?: boolean
    }
    expect(persisted).toMatchObject({ downloadDirectory: null, askWhereToSaveDownloads: false })
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('blocks human page clicks per tab or across Bronom while preserving agent actions', async ({
  appWindow,
  electronApp
}) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html>
      <title>Interaction lock fixture</title>
      <button id="action" style="position:fixed;left:20px;top:20px;width:160px;height:48px">Take action</button>
      <output id="count">0</output>
      <script>
        window.fixtureClicks = 0
        document.querySelector('#action').addEventListener('click', () => {
          window.fixtureClicks += 1
          document.querySelector('#count').textContent = String(window.fixtureClicks)
        })
      </script>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const clickFixture = async (path: string): Promise<void> => {
    await electronApp.evaluate(async ({ webContents }, requestedPath) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes(requestedPath))
      if (!page) throw new Error(`Fixture web contents was not found: ${requestedPath}`)
      const point = await page.executeJavaScript(`(() => {
        const bounds = document.querySelector('#action').getBoundingClientRect()
        return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
      })()`)
      page.sendInputEvent({ type: 'mouseDown', button: 'left', clickCount: 1, ...point })
      page.sendInputEvent({ type: 'mouseUp', button: 'left', clickCount: 1, ...point })
      await new Promise<void>((resolve) => setImmediate(resolve))
    }, path)
  }
  const fixtureClicks = (path: string): Promise<number> => electronApp.evaluate(
    async ({ webContents }, requestedPath) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes(requestedPath))
      if (!page) return -1
      return page.executeJavaScript('window.fixtureClicks')
    },
    path
  )

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const firstPath = '/interaction-lock-first'
    const secondPath = '/interaction-lock-second'
    const baseUrl = `http://127.0.0.1:${address.port}`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(`${baseUrl}${firstPath}`)}, active: true })`)
    await expect.poll(() => fixtureClicks(firstPath)).toBe(0)

    await clickFixture(firstPath)
    await expect.poll(() => fixtureClicks(firstPath)).toBe(1)

    await appWindow.getByRole('button', { name: 'Block human interaction in this tab' }).click()
    await expect(appWindow.getByRole('button', { name: 'Allow human interaction in this tab' })).toHaveAttribute('aria-pressed', 'true')
    await clickFixture(firstPath)
    await expect.poll(() => fixtureClicks(firstPath)).toBe(1)

    await electronApp.evaluate(async ({ webContents }, requestedPath) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes(requestedPath))
      await page?.executeJavaScript(`document.querySelector('#action').click()`)
    }, firstPath)
    await expect.poll(() => fixtureClicks(firstPath)).toBe(2)

    await appWindow.getByRole('button', { name: 'Allow human interaction in this tab' }).click()
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(`${baseUrl}${secondPath}`)}, active: true })`)
    await expect.poll(() => fixtureClicks(secondPath)).toBe(0)
    const browserLock = appWindow.getByRole('button', { name: 'Block human interaction in Bronom' })
    const tabLock = appWindow.getByRole('button', { name: 'Block human interaction in this tab' })
    const [browserLockBounds, tabLockBounds] = await Promise.all([browserLock.boundingBox(), tabLock.boundingBox()])
    expect(browserLockBounds?.y).toBeLessThan(tabLockBounds?.y ?? 0)
    await browserLock.click()
    await expect(appWindow.getByRole('button', { name: 'Allow human interaction in Bronom' })).toHaveAttribute('aria-pressed', 'true')
    await appWindow.getByTitle('New tab').click({ force: true })
    await expect(appWindow.getByRole('tab')).toHaveCount(2)

    await clickFixture(secondPath)
    await expect.poll(() => fixtureClicks(secondPath)).toBe(0)
    const firstTabId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.url.includes(${JSON.stringify(firstPath)})).id)`)
    await appWindow.evaluate(`window.bronom.selectTab(${JSON.stringify(firstTabId)})`)
    await clickFixture(firstPath)
    await expect.poll(() => fixtureClicks(firstPath)).toBe(2)
    await appWindow.getByRole('button', { name: 'Allow human interaction in Bronom' }).click()
    await expect(appWindow.getByRole('button', { name: 'Block human interaction in Bronom' })).toHaveAttribute('aria-pressed', 'false')
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('picks a page element and copies safe agent-ready DOM context from an MCP-created tab', async ({
  appWindow,
  electronApp,
  mcpPort,
  mcpToken
}) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html>
      <title>Picker fixture</title>
      <main><button id="save-profile" class="primary action" value="internal-secret" style="box-sizing:border-box;width:140px;height:44px;color:rgb(255,255,255);background:rgb(60,40,180)">Save profile</button><input id="password" type="password" value="snapshot-password-secret"></main>
      <script>window.fixtureClicks = 0; document.querySelector('button').addEventListener('click', () => window.fixtureClicks += 1)</script>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const client = new Client({ name: 'bronom-human-element-picker-test', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${mcpPort}/mcp`), {
    requestInit: { headers: { authorization: `Bearer ${mcpToken}` } }
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/picker?mode=test&created=mcp&token=snapshot-url-secret#fragment`
    await expect.poll(async () => {
      try {
        return (await fetch(`http://127.0.0.1:${mcpPort}/healthz`, {
          headers: { authorization: `Bearer ${mcpToken}` }
        })).ok
      } catch {
        return false
      }
    }).toBe(true)
    await client.connect(transport)
    await useMcpTabGroup(client, 'Human element picker tests', false)
    const opened = await client.callTool({ name: 'browser_new_tab', arguments: { url, active: true } }) as CallToolResult
    expect(opened.isError, mcpResultText(opened)).not.toBe(true)
    const mcpTabId = (JSON.parse(mcpResultText(opened)) as { activeTabId: string }).activeTabId
    const ready = await client.callTool({ name: 'browser_wait', arguments: { tabId: mcpTabId } }) as CallToolResult
    expect(ready.isError, mcpResultText(ready)).not.toBe(true)
    await expect
      .poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.url)'))
      .toContain('/picker?mode=test&created=mcp&token=snapshot-url-secret#fragment')

    await electronApp.evaluate(({ clipboard }) => clipboard.clear())
    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    let pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
    await pageTools.getByRole('button', { name: 'Copy page snapshot for agent' }).click()
    await expect(appWindow.getByRole('status', { name: 'Page snapshot copied' })).toBeVisible()
    const copiedSnapshot = await electronApp.evaluate(({ clipboard }) => clipboard.readText())
    expect(copiedSnapshot).toContain('TITLE: Picker fixture')
    expect(copiedSnapshot).toContain('[e1] button "Save profile"')
    expect(copiedSnapshot).toContain('TEXT: Save profile')
    expect(copiedSnapshot).toContain('token=%5BREDACTED%5D')
    expect(copiedSnapshot).not.toContain('snapshot-password-secret')
    expect(copiedSnapshot).not.toContain('snapshot-url-secret')
    expect(copiedSnapshot).not.toContain('#fragment')
    await pageTools.getByRole('button', { name: 'Close page tools' }).click()

    const picker = appWindow.getByRole('button', { name: 'Select an element to copy for agent' })
    await expect(picker).toBeEnabled()
    await picker.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel element selection' })).toBeVisible()
    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
    await expect(pageTools.getByRole('button', { name: 'Cancel element selection' })).toBeVisible()
    await pageTools.getByRole('button', { name: 'Close page tools' }).click()

    await expect
      .poll(() => electronApp.evaluate(async ({ webContents }) => {
        const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
        return page?.executeJavaScript(`Boolean(document.querySelector('[data-bronom-element-picker="overlay"]'))`)
      }))
      .toBe(true)

    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      if (!page) throw new Error('Picker fixture web contents was not found')
      await page.executeJavaScript(`document.querySelector('#save-profile').dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        composed: true,
        clientX: 40,
        clientY: 30
      }))`)
    })
    await expect
      .poll(() => electronApp.evaluate(async ({ webContents }) => {
        const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
        return page?.executeJavaScript(`(() => ({
          layers: ['margin', 'overlay', 'padding', 'content'].map((name) => ({
            name,
            display: getComputedStyle(document.querySelector('[data-bronom-element-picker="' + name + '"]')).display
          })),
          label: document.querySelector('[data-bronom-element-picker="label"]')?.textContent || ''
        }))()`)
      }))
      .toEqual({
        layers: [
          { name: 'margin', display: 'block' },
          { name: 'overlay', display: 'block' },
          { name: 'padding', display: 'block' },
          { name: 'content', display: 'block' }
        ],
        label: expect.stringContaining('#save-profile · 140 × 44 px')
      })
    const pickerTooltip = await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      return page?.executeJavaScript(`document.querySelector('[data-bronom-element-picker="label"]')?.textContent || ''`)
    })
    expect(pickerTooltip).toContain('padding ')
    expect(pickerTooltip).toContain('margin ')
    expect(pickerTooltip).toContain('button "Save profile" · keyboard focusable')
    expect(pickerTooltip).toContain('Click to copy · Esc to cancel')

    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      if (!page) throw new Error('Picker fixture web contents was not found')
      page.focus()
      page.sendInputEvent({ type: 'mouseMove', x: 40, y: 30, movementX: 0, movementY: 0 })
      page.sendInputEvent({ type: 'mouseDown', x: 40, y: 30, button: 'left', clickCount: 1 })
      page.sendInputEvent({ type: 'mouseUp', x: 40, y: 30, button: 'left', clickCount: 1 })
    })

    await expect(appWindow.getByRole('button', { name: 'Element copied for agent' })).toBeVisible()
    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
    await expect(pageTools.getByRole('button', { name: 'Element copied for agent' })).toBeVisible()
    await pageTools.getByRole('button', { name: 'Close page tools' }).click()
    const clipboardText = await electronApp.evaluate(({ clipboard }) => clipboard.readText())
    expect(clipboardText).toContain('Selected DOM element')
    expect(clipboardText).toContain('Page: Picker fixture')
    expect(clipboardText).toContain('Selector: #save-profile')
    expect(clipboardText).toContain('Element: <button id="save-profile" class="primary action">Save profile</button>')
    expect(clipboardText).toContain('Text: "Save profile"')
    expect(clipboardText).toContain('Box model:')
    expect(clipboardText).toContain('Layout: display=')
    expect(clipboardText).toContain('Typography: color=rgb(255, 255, 255)')
    expect(clipboardText).toContain('Accessibility: role=button; name="Save profile"; focusable=true; disabled=false')
    expect(clipboardText).toContain('Privacy: form values, event handlers, page markup, and stylesheet source are excluded')
    expect(clipboardText).toContain('?mode=test')
    expect(clipboardText).not.toContain('#fragment')
    expect(clipboardText).not.toContain('internal-secret')

    const fixtureClicks = await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      return page?.executeJavaScript('window.fixtureClicks')
    })
    expect(fixtureClicks).toBe(0)

    await new Promise((resolve) => setTimeout(resolve, 1_600))
    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
    await pageTools.getByRole('button', { name: 'Select an element to copy for agent' }).click()
    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
    await expect(pageTools.getByRole('button', { name: 'Cancel element selection' })).toBeVisible()
    await pageTools.getByRole('button', { name: 'Close page tools' }).click()
    const agentClickWhilePicking = await client.callTool({
      name: 'browser_click',
      arguments: { tabId: mcpTabId, selector: '#save-profile' }
    }) as CallToolResult
    expect(agentClickWhilePicking.isError, mcpResultText(agentClickWhilePicking)).not.toBe(true)
    await expect(appWindow.getByRole('button', { name: 'Cancel element selection' })).toBeVisible()
    await expect.poll(() => electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      return page?.executeJavaScript('window.fixtureClicks')
    })).toBe(1)
    await appWindow.keyboard.press('Escape')
    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
    await expect(pageTools.getByRole('button', { name: 'Select an element to copy for agent' })).toBeVisible()
    await pageTools.getByRole('button', { name: 'Close page tools' }).click()
    await expect
      .poll(() => electronApp.evaluate(async ({ webContents }) => {
        const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
        return page?.executeJavaScript(`Boolean(document.querySelector('[data-bronom-element-picker="overlay"]'))`)
      }))
      .toBe(false)
    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      await page?.executeJavaScript('window.fixtureClicks = 0')
    })

    const activeTabId = await appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active).id)')
    await appWindow.evaluate(`window.bronom.setTabHumanInteractionLocked(${JSON.stringify(activeTabId)}, true)`)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(activeTabId)})?.humanInteractionLocked)`)).toBe(true)
    await electronApp.evaluate(({ clipboard }) => clipboard.clear())

    const lockedPicker = appWindow.getByRole('button', { name: 'Select an element to copy for agent' })
    await lockedPicker.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel element selection' })).toBeVisible()
    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      if (!page) throw new Error('Locked picker fixture web contents was not found')
      await page.executeJavaScript('window.__bronomElementPicker.nativeInput = () => false; true')
      page.focus()
      page.sendInputEvent({ type: 'mouseMove', x: 40, y: 30, movementX: 0, movementY: 0 })
      page.sendInputEvent({ type: 'mouseDown', x: 40, y: 30, button: 'left', clickCount: 1 })
      page.sendInputEvent({ type: 'mouseUp', x: 40, y: 30, button: 'left', clickCount: 1 })
    })
    await expect(appWindow.getByRole('button', { name: 'Element copied for agent' })).toBeVisible()
    expect(await electronApp.evaluate(({ clipboard }) => clipboard.readText())).toContain('Selector: #save-profile')
    expect(await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      return page?.executeJavaScript('window.fixtureClicks')
    })).toBe(0)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(activeTabId)})?.humanInteractionLocked)`)).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 1_600))
    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    pageTools = appWindow.getByRole('dialog', { name: 'Page tools' })
    await pageTools.getByRole('button', { name: 'Select an element and copy its screenshot' }).click()
    await expect(appWindow.getByRole('button', { name: 'Cancel element screenshot selection' })).toBeVisible()
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      if (!page) throw new Error('Locked element screenshot fixture web contents was not found')
      page.focus()
      page.sendInputEvent({ type: 'mouseMove', x: 40, y: 30, movementX: 0, movementY: 0 })
      page.sendInputEvent({ type: 'mouseDown', x: 40, y: 30, button: 'left', clickCount: 1 })
      page.sendInputEvent({ type: 'mouseUp', x: 40, y: 30, button: 'left', clickCount: 1 })
    })
    await expect(appWindow.getByRole('button', { name: 'Element screenshot copied — paste it into agent chat' })).toBeVisible()
    expect(await electronApp.evaluate(({ clipboard }) => clipboard.readImage().getSize())).toEqual({ width: 140, height: 44 })
    expect(await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      return page?.executeJavaScript('window.fixtureClicks')
    })).toBe(0)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(activeTabId)})?.humanInteractionLocked)`)).toBe(true)
    await appWindow.evaluate(`window.bronom.setTabHumanInteractionLocked(${JSON.stringify(activeTabId)}, false)`)

    await new Promise((resolve) => setTimeout(resolve, 1_600))
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      if (!page) throw new Error('Picker shortcut fixture web contents was not found')
      page.focus()
      const modifiers = process.platform === 'darwin' ? ['meta', 'alt'] as const : ['control', 'shift'] as const
      page.sendInputEvent({ type: 'keyDown', keyCode: 'C', modifiers: [...modifiers] })
      page.sendInputEvent({ type: 'keyUp', keyCode: 'C', modifiers: [...modifiers] })
    })
    await expect(appWindow.getByRole('button', { name: 'Cancel element selection' })).toBeVisible()
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/picker?mode=test'))
      if (!page) throw new Error('Picker shortcut fixture web contents disappeared before cancellation')
      page.focus()
      const modifiers = process.platform === 'darwin' ? ['meta', 'alt'] as const : ['control', 'shift'] as const
      page.sendInputEvent({ type: 'keyDown', keyCode: 'C', modifiers: [...modifiers] })
      page.sendInputEvent({ type: 'keyUp', keyCode: 'C', modifiers: [...modifiers] })
    })
    await expect(appWindow.getByRole('button', { name: 'Select an element to copy for agent' })).toBeVisible()
  } finally {
    await client.close().catch(() => undefined)
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('drags a page area and copies the screenshot image for agent chat', async ({
  appWindow,
  electronApp,
  mcpPort,
  mcpToken
}) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(`<!doctype html>
      <title>Area capture fixture</title>
      <style>html,body{margin:0;width:100%;min-height:1800px;background:#16324f} #target{margin:40px;width:240px;height:120px;background:#ffcc66}</style>
      <div id="target" onclick="window.fixtureClicks += 1">Capture this issue</div>
      <script>
        window.fixtureClicks = 0;
        window.fixtureKeys = 0;
        window.blockPointerEvents = false;
        window.changePageAfterSelection = false;
        document.addEventListener('keydown', () => window.fixtureKeys += 1);
        document.addEventListener('pointerup', () => {
          if (!window.changePageAfterSelection) return;
          window.changePageAfterSelection = false;
          queueMicrotask(() => {
            history.pushState({}, '', '/area-capture?changed=during-selection');
            document.querySelector('#target').textContent = 'Changed while capturing';
            document.querySelector('#target').style.background = '#7ce3b1';
          });
        }, true);
        for (const type of ['pointerdown', 'pointermove', 'pointerup']) {
          document.addEventListener(type, (event) => {
            if (!window.blockPointerEvents) return;
            event.preventDefault();
            event.stopImmediatePropagation();
          }, true);
        }
      </script>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const client = new Client({ name: 'bronom-human-area-capture-test', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${mcpPort}/mcp`), {
    requestInit: { headers: { authorization: `Bearer ${mcpToken}` } }
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Area capture fixture did not expose a TCP port')
    const url = `http://127.0.0.1:${address.port}/area-capture`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(url)}, active: true })`)
    await expect
      .poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.find((tab) => tab.active)?.url)'))
      .toContain('/area-capture')

    const capture = appWindow.getByRole('button', { name: 'Capture an area to the clipboard' })
    await expect(capture).toBeEnabled()
    await capture.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel area screenshot' })).toBeVisible()
    await expect
      .poll(() => electronApp.evaluate(async ({ webContents }) => {
        const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
        return page?.executeJavaScript(`Boolean(document.querySelector('[data-bronom-screenshot-area="shade"]'))`)
      }))
      .toBe(true)

    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('Area capture fixture web contents was not found')
      await page.executeJavaScript(`(() => {
        const fire = (type, x, y, buttons) => document.querySelector('#target').dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: 'mouse', button: 0, buttons,
          clientX: x, clientY: y
        }));
        fire('pointerdown', 50, 50, 1);
        fire('pointermove', 230, 140, 1);
        fire('pointerup', 230, 140, 0);
      })()`)
    })

    await expect(appWindow.getByRole('button', { name: 'Area screenshot copied — paste it into agent chat' })).toBeVisible()
    const captureToast = appWindow.getByRole('status', { name: 'Area screenshot copied' })
    await expect(captureToast).toContainText('Paste the PNG into your agent chat.')
    const captureFeedbackPlacement = await appWindow.locator('.address-form').evaluate((address) => {
      const toast = address.ownerDocument.querySelector('.app-toast')
      const shell = address.ownerDocument.querySelector('.shell')
      const toastBounds = toast?.getBoundingClientRect()
      const shellBounds = shell?.getBoundingClientRect()
      return {
        insideAddress: Boolean(toast && address.contains(toast)),
        toolbarOverflow: address.closest('.toolbar')!.scrollWidth - address.closest('.toolbar')!.clientWidth,
        topWindowOverlay: Boolean(toastBounds && shellBounds
          && toastBounds.top <= 8
          && toastBounds.bottom <= shellBounds.bottom)
      }
    })
    expect(captureFeedbackPlacement).toEqual({ insideAddress: false, toolbarOverflow: 0, topWindowOverlay: true })
    const clipboardImage = await electronApp.evaluate(({ clipboard }) => {
      const image = clipboard.readImage()
      return { empty: image.isEmpty(), size: image.getSize(), pngBytes: image.toPNG().byteLength }
    })
    expect(clipboardImage).toEqual({ empty: false, size: { width: 180, height: 90 }, pngBytes: expect.any(Number) })
    expect(clipboardImage.pngBytes).toBeGreaterThan(100)

    await expect
      .poll(() => electronApp.evaluate(async ({ webContents }) => {
        const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
        return page?.executeJavaScript(`Boolean(document.querySelector('[data-bronom-screenshot-area]'))`)
      }))
      .toBe(false)

    await expect(capture).toBeVisible({ timeout: 4_000 })
    await electronApp.evaluate(async ({ clipboard, webContents }) => {
      clipboard.clear()
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('Changing area capture fixture web contents was not found')
      await page.executeJavaScript('window.changePageAfterSelection = true')
    })
    await capture.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel area screenshot' })).toBeVisible()
    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('Changing area capture fixture web contents disappeared')
      await page.executeJavaScript(`(() => {
        const fire = (type, x, y, buttons) => document.querySelector('#target').dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, composed: true, pointerId: 2, pointerType: 'mouse', button: 0, buttons,
          clientX: x, clientY: y
        }));
        fire('pointerdown', 55, 55, 1);
        fire('pointermove', 225, 135, 1);
        fire('pointerup', 225, 135, 0);
      })()`)
    })
    await expect(appWindow.getByRole('button', { name: 'Area screenshot copied — paste it into agent chat' })).toBeVisible()
    await expect.poll(() => electronApp.evaluate(({ webContents }) => (
      webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))?.getURL()
    ))).toContain('changed=during-selection')
    expect(await electronApp.evaluate(({ clipboard }) => clipboard.readImage().getSize())).toEqual({ width: 170, height: 80 })

    await expect(appWindow.getByRole('button', { name: 'Capture an area to the clipboard' })).toBeVisible({ timeout: 4_000 })
    const activeTabId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.activeTabId)`)
    if (typeof activeTabId !== 'string') throw new Error('Area capture fixture did not have an active tab')
    await appWindow.evaluate(`window.bronom.setTabHumanInteractionLocked(${JSON.stringify(activeTabId)}, true)`)
    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      await page?.executeJavaScript('window.blockPointerEvents = true')
    })

    await capture.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel area screenshot' })).toBeVisible()
    await expect
      .poll(() => electronApp.evaluate(async ({ webContents }) => {
        const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
        return page?.executeJavaScript(`Boolean(document.querySelector('[data-bronom-screenshot-area="shade"]'))`)
      }))
      .toBe(true)
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('Locked area capture fixture web contents was not found')
      page.focus()
      page.sendInputEvent({ type: 'mouseMove', x: 60, y: 60, movementX: 0, movementY: 0 })
      page.sendInputEvent({ type: 'mouseDown', x: 60, y: 60, button: 'left', clickCount: 1 })
      page.sendInputEvent({ type: 'mouseMove', x: 220, y: 140, movementX: 160, movementY: 80 })
      page.sendInputEvent({ type: 'mouseWheel', x: 220, y: 140, deltaY: 320, canScroll: true })
    })
    await expect.poll(() => electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) return null
      return page.executeJavaScript(`(() => {
        const selection = document.querySelector('[data-bronom-screenshot-area="selection"]');
        return selection ? { display: getComputedStyle(selection).display, width: selection.style.width, height: selection.style.height } : null;
      })()`)
    })).toEqual({ display: 'block', width: '160px', height: '80px' })
    expect(await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      return page?.executeJavaScript('scrollY')
    })).toBe(0)
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('Locked area capture fixture web contents disappeared before release')
      page.sendInputEvent({ type: 'mouseUp', x: 220, y: 140, button: 'left', clickCount: 1 })
    })

    await expect(appWindow.getByRole('button', { name: 'Area screenshot copied — paste it into agent chat' })).toBeVisible()
    expect(await electronApp.evaluate(({ clipboard }) => clipboard.readImage().getSize())).toEqual({ width: 160, height: 80 })
    expect(await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      return page?.executeJavaScript('window.fixtureClicks')
    })).toBe(0)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(activeTabId)})?.humanInteractionLocked)`)).toBe(true)

    await expect(appWindow.getByRole('button', { name: 'Capture an area to the clipboard' })).toBeVisible({ timeout: 4_000 })
    await capture.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel area screenshot' })).toBeVisible()
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('Locked area capture fixture web contents was not found for cancellation')
      page.focus()
      page.sendInputEvent({ type: 'keyDown', keyCode: 'Escape' })
      page.sendInputEvent({ type: 'keyUp', keyCode: 'Escape' })
    })
    await expect(appWindow.getByRole('button', { name: 'Capture an area to the clipboard' })).toBeVisible()
    expect(await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      return page?.executeJavaScript('window.fixtureKeys')
    })).toBe(0)

    await appWindow.evaluate(`window.bronom.setTabHumanInteractionLocked(${JSON.stringify(activeTabId)}, false)`)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(activeTabId)})?.humanInteractionLocked)`)).toBe(false)
    await electronApp.evaluate(({ clipboard }) => clipboard.clear())

    await capture.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel area screenshot' })).toBeVisible()
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('Unlocked area capture fixture web contents was not found')
      page.focus()
      page.sendInputEvent({ type: 'mouseMove', x: 70, y: 65, movementX: 0, movementY: 0 })
      page.sendInputEvent({ type: 'mouseDown', x: 70, y: 65, button: 'left', clickCount: 1 })
      page.sendInputEvent({ type: 'mouseMove', x: 250, y: 155, movementX: 180, movementY: 90 })
      page.sendInputEvent({ type: 'mouseUp', x: 250, y: 155, button: 'left', clickCount: 1 })
    })

    await expect(appWindow.getByRole('button', { name: 'Area screenshot copied — paste it into agent chat' })).toBeVisible()
    await new Promise((resolve) => setTimeout(resolve, 250))
    expect(await electronApp.evaluate(({ clipboard }) => {
      const image = clipboard.readImage()
      return { empty: image.isEmpty(), size: image.getSize(), formats: clipboard.availableFormats() }
    })).toEqual({
      empty: false,
      size: { width: 180, height: 90 },
      formats: expect.arrayContaining(['image/png'])
    })
    const externalClipboard = await execFileAsync(
      join(process.cwd(), 'node_modules/electron/dist/electron'),
      ['--no-sandbox', join(process.cwd(), 'tests/integration/clipboard-reader.cjs')],
      { env: process.env, timeout: 8_000 }
    )
    expect(JSON.parse(externalClipboard.stdout.trim())).toMatchObject({
      empty: false,
      width: 180,
      height: 90,
      hasPng: true
    })

    await expect(appWindow.getByRole('button', { name: 'Capture an area to the clipboard' })).toBeVisible({ timeout: 4_000 })
    await appWindow.evaluate(`window.bronom.toggleDevTools(${JSON.stringify(activeTabId)})`)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(activeTabId)})?.devToolsOpen)`)).toBe(true)
    await electronApp.evaluate(({ clipboard }) => clipboard.clear())
    await capture.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel area screenshot' })).toBeVisible()
    await electronApp.evaluate(({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture'))
      if (!page) throw new Error('DevTools area capture fixture web contents was not found')
      page.focus()
      page.sendInputEvent({ type: 'mouseMove', x: 80, y: 70, movementX: 0, movementY: 0 })
      page.sendInputEvent({ type: 'mouseDown', x: 80, y: 70, button: 'left', clickCount: 1 })
      page.sendInputEvent({ type: 'mouseMove', x: 220, y: 140, movementX: 140, movementY: 70 })
      page.sendInputEvent({ type: 'mouseUp', x: 220, y: 140, button: 'left', clickCount: 1 })
    })
    await expect(appWindow.getByRole('button', { name: 'Area screenshot copied — paste it into agent chat' })).toBeVisible()
    expect(await electronApp.evaluate(({ clipboard }) => clipboard.readImage().getSize())).toEqual({ width: 140, height: 70 })
    await appWindow.evaluate(`window.bronom.toggleDevTools(${JSON.stringify(activeTabId)})`)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(activeTabId)})?.devToolsOpen)`)).toBe(false)

    await client.connect(transport)
    await useMcpTabGroup(client, 'Human area capture tests', false)
    const mcpUrl = `${url}?created=mcp`
    const opened = await client.callTool({
      name: 'browser_new_tab',
      arguments: { url: mcpUrl, active: true }
    }) as CallToolResult
    expect(opened.isError, mcpResultText(opened)).not.toBe(true)
    const mcpTabId = (JSON.parse(mcpResultText(opened)) as { activeTabId: string }).activeTabId
    const ready = await client.callTool({ name: 'browser_wait', arguments: { tabId: mcpTabId } }) as CallToolResult
    expect(ready.isError, mcpResultText(ready)).not.toBe(true)
    await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).toBe(mcpTabId)
    await appWindow.evaluate(`window.bronom.setTabHumanInteractionLocked(${JSON.stringify(mcpTabId)}, true)`)
    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture?created=mcp'))
      if (!page) throw new Error('MCP-created area capture fixture web contents was not found')
      await page.executeJavaScript('window.blockPointerEvents = true')
    })

    await expect(capture).toBeEnabled()
    await electronApp.evaluate(({ clipboard }) => clipboard.clear())
    await capture.click()
    await expect(appWindow.getByRole('button', { name: 'Cancel area screenshot' })).toBeVisible()
    await electronApp.evaluate(async ({ webContents }) => {
      const page = webContents.getAllWebContents().find((contents) => contents.getURL().includes('/area-capture?created=mcp'))
      if (!page) throw new Error('MCP-created area capture fixture disappeared')
      await page.executeJavaScript(`(() => {
        document.querySelector('#target').textContent = 'Changed while selecting';
        document.querySelector('#target').style.background = '#7ce3b1';
        window.__bronomScreenshotArea.nativeInput = () => false;
      })()`)
      page.focus()
      page.sendInputEvent({ type: 'mouseMove', x: 90, y: 75, movementX: 0, movementY: 0 })
      page.sendInputEvent({ type: 'mouseDown', x: 90, y: 75, button: 'left', clickCount: 1 })
      page.sendInputEvent({ type: 'mouseMove', x: 240, y: 150, movementX: 150, movementY: 75 })
      page.sendInputEvent({ type: 'mouseUp', x: 240, y: 150, button: 'left', clickCount: 1 })
    })
    await expect(appWindow.getByRole('button', { name: 'Area screenshot copied — paste it into agent chat' })).toBeVisible()
    expect(await electronApp.evaluate(({ clipboard }) => clipboard.readImage().getSize())).toEqual({ width: 150, height: 75 })
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(mcpTabId)})?.humanInteractionLocked)`)).toBe(true)

    await appWindow.getByRole('button', { name: 'Open command palette' }).click()
    const palette = appWindow.getByRole('dialog', { name: 'Commands' })
    await palette.getByRole('combobox', { name: 'Search commands' }).fill('entire long screenshot')
    await palette.getByRole('option', { name: /Capture full-page screenshot/ }).click()
    await expect(appWindow.getByRole('button', { name: 'Full-page screenshot copied — paste it into agent chat' })).toBeVisible()
    const fullPageSize = await electronApp.evaluate(({ clipboard }) => clipboard.readImage().getSize())
    expect(fullPageSize.height).toBeGreaterThanOrEqual(1_800)
    expect(fullPageSize.width).toBeGreaterThan(0)
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(mcpTabId)})?.humanInteractionLocked)`)).toBe(true)
  } finally {
    await client.close().catch(() => undefined)
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('shows typed agent setup, connection activity, and the live tool catalog on Home', async ({
  appWindow,
  electronApp,
  mcpPort,
  mcpToken
}) => {
  await expect
    .poll(() =>
      electronApp.evaluate(async ({ webContents }) => {
        const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
        return home?.getTitle()
      })
    )
    .toBe('Bronom Home')

  const homeContent = await electronApp.evaluate(async ({ webContents }) => {
    const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
    if (!home) throw new Error('Bronom Home web contents was not found')
    return home.executeJavaScript(`({
      heading: document.querySelector('h1')?.textContent,
      agents: [...document.querySelectorAll('[data-guide]')].map((node) => node.textContent),
      tools: document.querySelectorAll('.tool').length
    })`)
  }) as { heading: string; agents: string[]; tools: number }
  expect(homeContent.heading).toBe('Your browser, ready for coding agents.')
  expect(homeContent.agents).toEqual(['Codex', 'Claude Code', 'Cursor', 'VS Code / Copilot', 'Generic MCP client'])
  expect(homeContent.tools).toBe(62)

  const initial = await fetch(`http://127.0.0.1:${mcpPort}/mcp`, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      authorization: `Bearer ${mcpToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: { name: 'bronom-integration', version: '1.0.0' }
      }
    })
  })
  expect(initial.ok).toBe(true)

  await expect
    .poll(() =>
      electronApp.evaluate(async ({ webContents }) => {
        const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
        if (!home) return null
        return home.executeJavaScript(`fetch('/api/status').then((response) => response.json())`)
      })
    )
    .toMatchObject({
      name: 'bronom',
      totalRequests: 1,
      tools: expect.arrayContaining([expect.objectContaining({ name: 'browser_navigate' })]),
      clients: expect.arrayContaining([expect.objectContaining({ name: 'bronom-integration', version: '1.0.0' })])
    })

  await appWindow.getByRole('button', { name: 'Pause agents' }).click()
  await expect(appWindow.getByRole('button', { name: 'Resume agents' })).toBeVisible()
  const pausedResponse = await fetch(`http://127.0.0.1:${mcpPort}/mcp`, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      authorization: `Bearer ${mcpToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'paused-test', version: '1.0.0' } } })
  })
  expect(pausedResponse.status).toBe(503)
  await expect(pausedResponse.json()).resolves.toEqual({
    error: 'Bronom is paused by the user. Resume agents from the Bronom window.'
  })
  const pausedDashboard = await electronApp.evaluate(async ({ webContents }) => {
    const home = webContents.getAllWebContents().find((contents) => contents.getURL().startsWith('bronom://home'))
    return home?.executeJavaScript(`fetch('/api/status').then((response) => response.json())`)
  }) as { paused: boolean; status: string }
  expect(pausedDashboard.paused).toBe(true)
  expect(pausedDashboard.status).toBe('paused')

  await appWindow.getByRole('button', { name: 'Resume agents' }).click()
  await expect(appWindow.getByRole('button', { name: 'Pause agents' })).toBeVisible()
  await expect.poll(() => appWindow.evaluate('window.bronomMcp.getState()')).toMatchObject({ status: 'ready', paused: false })
  const resumed = await fetch(`http://127.0.0.1:${mcpPort}/mcp`, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      authorization: `Bearer ${mcpToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'resumed-test', version: '1.0.0' } } })
  })
  expect(resumed.ok).toBe(true)
})

test('controls whether bounded diagnostic logs survive page navigation', async ({ appWindow }) => {
  const server = createServer((request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    const marker = request.url === '/first' ? 'before-navigation-marker' : request.url === '/second' ? 'after-navigation-marker' : 'preserved-navigation-marker'
    response.end(`<!doctype html><title>${marker}</title><script>console.error(${JSON.stringify(marker)})</script>`)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Diagnostic log test server did not expose a port')
    const baseUrl = `http://127.0.0.1:${address.port}`
    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(`${baseUrl}/first`)}, active: true })`)
    const tabId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.activeTabId)`) as string
    await expect.poll(() => appWindow.evaluate(`window.bronom.createDebugReport({ tabId: ${JSON.stringify(tabId)}, includeSuccessfulRequests: true })`)).toMatchObject({
      console: expect.arrayContaining([expect.objectContaining({ message: 'before-navigation-marker' })])
    })

    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    await appWindow.getByRole('dialog', { name: 'Page tools' }).getByRole('button', { name: 'Open network monitor' }).click()
    const networkPanel = appWindow.getByRole('dialog', { name: 'Network' })
    const preserveToggle = networkPanel.getByLabel('Preserve logs')
    await expect(preserveToggle).toBeChecked()
    await preserveToggle.uncheck()
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(tabId)})?.preserveDiagnosticLogs)`)).toBe(false)

    await appWindow.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(tabId)}, url: ${JSON.stringify(`${baseUrl}/second`)} })`)
    await expect.poll(() => appWindow.evaluate(`window.bronom.createDebugReport({ tabId: ${JSON.stringify(tabId)}, includeSuccessfulRequests: true })`)).toMatchObject({
      console: expect.arrayContaining([expect.objectContaining({ message: 'after-navigation-marker' })])
    })
    const isolatedReport = await appWindow.evaluate(`window.bronom.createDebugReport({ tabId: ${JSON.stringify(tabId)}, includeSuccessfulRequests: true })`) as { console: Array<{ message: string }>; network: Array<{ url: string }> }
    expect(isolatedReport.console.some((message) => message.message.includes('before-navigation-marker'))).toBe(false)
    expect(isolatedReport.network.some((request) => request.url.includes('/first'))).toBe(false)
    expect(isolatedReport.network.some((request) => request.url.includes('/second'))).toBe(true)

    await appWindow.getByRole('button', { name: 'Page tools' }).click()
    await appWindow.getByRole('dialog', { name: 'Page tools' }).getByRole('button', { name: 'Open network monitor' }).click()
    await appWindow.getByRole('dialog', { name: 'Network' }).getByLabel('Preserve logs').check()
    await appWindow.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(tabId)}, url: ${JSON.stringify(`${baseUrl}/third`)} })`)
    await expect.poll(() => appWindow.evaluate(`window.bronom.createDebugReport({ tabId: ${JSON.stringify(tabId)}, includeSuccessfulRequests: true })`)).toMatchObject({
      console: expect.arrayContaining([
        expect.objectContaining({ message: 'after-navigation-marker' }),
        expect.objectContaining({ message: 'preserved-navigation-marker' })
      ])
    })
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('quits cleanly while a tab navigation is still active', async ({ appWindow, electronApp }) => {
  const server = createServer((_request, response) => {
    setTimeout(() => {
      response.writeHead(200, { 'content-type': 'text/html' })
      response.end('<!doctype html><title>Delayed page</title>')
    }, 500)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP port')
    await appWindow.evaluate(
      `window.bronom.newTab({ url: ${JSON.stringify(`http://127.0.0.1:${address.port}/slow`)}, active: true })`
    )
    await expect
      .poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.tabs.some((tab) => tab.loading))'))
      .toBe(true)

    const child = electronApp.process()
    const exited = new Promise<number | null>((resolve) => child.once('exit', resolve))
    await appWindow.evaluate('setTimeout(() => window.bronom.quit(), 0)')
    await expect(exited).resolves.toBe(0)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})
