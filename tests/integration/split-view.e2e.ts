import { closeBronom, expect, launchBronom, test, type BronomInstance } from './fixtures.js'
import type { BrowserState } from '../../src/shared/types.js'

test('shows two live tabs, changes their layout, and exits split view', async ({ appWindow, electronApp }) => {
  const firstUrl = 'data:text/html,<title>Split Alpha</title><h1>Alpha pane</h1>'
  const secondUrl = 'data:text/html,<title>Split Beta</title><h1>Beta pane</h1>'
  const firstState = await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(firstUrl)}, active: true })`) as BrowserState
  const firstTabId = firstState.activeTabId!
  const secondState = await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(secondUrl)}, active: false })`) as BrowserState
  const secondTabId = secondState.tabs.find((tab) => tab.id !== firstTabId && !tab.url.startsWith('bronom://home'))!.id

  await expect(appWindow.getByRole('tab', { name: /^Split Beta/ })).toBeVisible()
  await electronApp.evaluate(({ Menu }) => {
    ;(globalThis as typeof globalThis & { __bronomSplitMenu?: Electron.Menu }).__bronomSplitMenu = undefined
    Menu.prototype.popup = function (): void {
      ;(globalThis as typeof globalThis & { __bronomSplitMenu?: Electron.Menu }).__bronomSplitMenu = this
    }
  })
  await appWindow.getByRole('tab', { name: /^Split Beta/ }).click({ button: 'right' })
  await expect.poll(() => electronApp.evaluate(() => {
    const menu = (globalThis as typeof globalThis & { __bronomSplitMenu?: Electron.Menu }).__bronomSplitMenu
    const item = menu?.getMenuItemById('open-in-split-view')
    return { label: item?.label, enabled: item?.enabled }
  })).toEqual({ label: 'Open in Split View', enabled: true })

  await expect(appWindow.getByRole('button', { name: 'Split view', exact: true })).toBeVisible()
  await appWindow.getByRole('button', { name: 'Split view', exact: true }).click()
  await appWindow.locator('.split-candidate-list').getByRole('button', { name: /Split Beta/ }).click()

  await expect.poll(() => appWindow.evaluate('window.bronom.getState()')).toMatchObject({
    activeTabId: firstTabId,
    splitView: {
      firstTabId,
      secondTabId,
      orientation: 'vertical',
      ratio: 0.5
    }
  })
  const visibleViews = () => electronApp.evaluate(({ BrowserWindow, WebContentsView }) => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    return (mainWindow?.contentView.children ?? [])
      .filter((view): view is InstanceType<typeof WebContentsView> => view instanceof WebContentsView)
      .map((view) => ({ title: view.webContents.getTitle(), bounds: view.getBounds() }))
  })
  await expect.poll(visibleViews).toEqual(expect.arrayContaining([
    expect.objectContaining({ title: 'Split Alpha' }),
    expect.objectContaining({ title: 'Split Beta' })
  ]))
  const sideBySide = await visibleViews()
  const alphaSide = sideBySide.find((view) => view.title === 'Split Alpha')!.bounds
  const betaSide = sideBySide.find((view) => view.title === 'Split Beta')!.bounds
  expect(alphaSide.x).toBeLessThan(betaSide.x)
  expect(alphaSide.y).toBe(betaSide.y)
  expect(Math.abs(alphaSide.width - betaSide.width)).toBeLessThanOrEqual(1)

  await electronApp.evaluate(({ BrowserWindow, WebContentsView }) => {
    const beta = BrowserWindow.getAllWindows()[0]?.contentView.children
      .find((view): view is InstanceType<typeof WebContentsView> => view instanceof WebContentsView && view.webContents.getTitle() === 'Split Beta')
    if (!beta) throw new Error('Split Beta view was not found')
    beta.webContents.focus()
    beta.webContents.sendInputEvent({ type: 'mouseDown', x: 10, y: 10, button: 'left', clickCount: 1 })
    beta.webContents.sendInputEvent({ type: 'mouseUp', x: 10, y: 10, button: 'left', clickCount: 1 })
  })
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).toBe(secondTabId)
  await expect(appWindow.locator('.tab.split-visible')).toHaveCount(2)

  await appWindow.getByRole('button', { name: 'Split view', exact: true }).click()
  await appWindow.getByRole('button', { name: 'Stacked', exact: true }).click()
  await expect.poll(async () => (await visibleViews()).find((view) => view.title === 'Split Beta')?.bounds.y).toBeGreaterThan(
    (await visibleViews()).find((view) => view.title === 'Split Alpha')!.bounds.y
  )

  await appWindow.locator('.split-ratio-control input').evaluate((input) => {
    Reflect.set(input, 'value', '25')
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.splitView?.ratio)')).toBe(0.25)

  await appWindow.getByRole('button', { name: 'Swap panes' }).click()
  await expect.poll(async () => {
    const views = await visibleViews()
    return views.find((view) => view.title === 'Split Beta')!.bounds.y < views.find((view) => view.title === 'Split Alpha')!.bounds.y
  }).toBe(true)

  await appWindow.getByRole('button', { name: 'Exit split view' }).click()
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.splitView)')).toBeUndefined()
  await expect.poll(async () => (await visibleViews()).length).toBe(1)

  await appWindow.evaluate(`window.bronom.openSplitView(${JSON.stringify(firstTabId)})`)
  await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(secondTabId)})`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).toBe(firstTabId)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.splitView)')).toBeUndefined()
  await expect.poll(async () => (await visibleViews()).map((view) => view.title)).toEqual(['Split Alpha'])
})

test('restores both split panes and their layout after restart', async ({ profileDirectory, mcpPort }) => {
  let first: BronomInstance | undefined
  let second: BronomInstance | undefined
  try {
    first = await launchBronom(profileDirectory, mcpPort)
    const firstState = await first.window.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Persistent Alpha</title>', active: true })`) as BrowserState
    const firstTabId = firstState.activeTabId!
    const nextState = await first.window.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Persistent Beta</title>', active: false })`) as BrowserState
    const secondTabId = nextState.tabs.find((tab) => tab.id !== firstTabId && !tab.url.startsWith('bronom://home'))!.id
    await first.window.evaluate(`window.bronom.openSplitView(${JSON.stringify(secondTabId)})`)
    await first.window.evaluate(`window.bronom.updateSplitView({ orientation: 'horizontal', ratio: 0.4 })`)
    await closeBronom(first.app)
    first = undefined

    second = await launchBronom(profileDirectory, mcpPort)
    await expect.poll(() => second!.window.evaluate('window.bronom.getState()')).toMatchObject({
      activeTabId: firstTabId,
      splitView: {
        firstTabId,
        secondTabId,
        orientation: 'horizontal',
        ratio: 0.4
      }
    })
    await expect.poll(() => second!.app.evaluate(({ BrowserWindow }) => (
      BrowserWindow.getAllWindows()[0]?.contentView.children.length
    ))).toBe(2)
  } finally {
    if (first) await closeBronom(first.app)
    if (second) await closeBronom(second.app)
  }
})

test('rejects a destroyed split target without corrupting the active tab or later close operations', async ({
  appWindow,
  electronApp
}) => {
  const activeUrl = 'data:text/html,<title>Live split source</title><h1>Live source</h1>'
  const destroyedUrl = 'data:text/html,<title>Destroyed split target</title><h1>Destroyed target</h1>'
  const activeState = await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(activeUrl)}, active: true })`) as BrowserState
  const activeTabId = activeState.activeTabId!
  const targetState = await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(destroyedUrl)}, active: false })`) as BrowserState
  const targetTabId = targetState.tabs.find((tab) => tab.url === destroyedUrl)!.id

  await expect.poll(() => electronApp.evaluate(({ webContents }, url) => (
    webContents.getAllWebContents().some((contents) => contents.getURL() === url)
  ), destroyedUrl)).toBe(true)
  await electronApp.evaluate(({ webContents }, url) => {
    const target = webContents.getAllWebContents().find((contents) => contents.getURL() === url)
    if (!target) throw new Error('Destroyed split target was not found')
    target.close()
  }, destroyedUrl)

  await appWindow.getByRole('button', { name: 'Split view', exact: true }).click()
  await appWindow.locator('.split-candidate-list').getByRole('button', { name: /Destroyed split target/ }).click()
  await expect(appWindow.getByRole('alert', { name: 'Split view failed' })).toContainText(
    'selected tab renderer is no longer available'
  )
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).toBe(activeTabId)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.splitView)')).toBeUndefined()

  await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(targetTabId)})`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).toBe(activeTabId)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.splitView)')).toBeUndefined()

  const recoveryUrl = 'data:text/html,<title>Live split recovery</title><h1>Live recovery</h1>'
  const recoveryState = await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(recoveryUrl)}, active: false })`) as BrowserState
  const recoveryTabId = recoveryState.tabs.find((tab) => tab.url === recoveryUrl)!.id
  await electronApp.evaluate(({ webContents }, url) => {
    const active = webContents.getAllWebContents().find((contents) => contents.getURL() === url)
    if (!active) throw new Error('Live split source was not found')
    active.close()
  }, activeUrl)

  const currentError = await appWindow.evaluate(`window.bronom.openSplitView(${JSON.stringify(recoveryTabId)}).then(() => 'opened', (error) => String(error.message ?? error))`)
  expect(currentError).toContain('current tab renderer is no longer available')
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.splitView)')).toBeUndefined()

  await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(activeTabId)})`)
  await expect.poll(() => appWindow.evaluate('window.bronom.getState().then((state) => state.activeTabId)')).toBe(recoveryTabId)
})
