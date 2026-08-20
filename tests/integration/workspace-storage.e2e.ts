import { createServer } from 'node:http'
import { closeBronom, expect, launchBronom, test } from './fixtures.js'

test('isolates workspace profiles and explicitly forks or saves data through Default', async ({
  appWindow,
  electronApp
}) => {
  let internalTransferRequests = 0
  const requestCookies = new Map<string, string>()
  const server = createServer((request, response) => {
    if (request.url?.includes('.well-known/bronom-workspace-storage')) internalTransferRequests += 1
    requestCookies.set(request.url ?? '/', request.headers.cookie ?? '')
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      ...(request.url === '/seed-default'
        ? { 'set-cookie': [
            'workspace-cookie=default; HttpOnly; Path=/; SameSite=Lax',
            'path-cookie=default-private; HttpOnly; Path=/private; SameSite=Lax'
          ] }
        : request.url === '/seed-secondary'
          ? { 'set-cookie': 'secondary-cookie=default; HttpOnly; Path=/; SameSite=Lax' }
        : {})
    })
    response.end('<!doctype html><title>Workspace storage fixture</title><main>Ready</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Workspace storage fixture did not expose a port')
    const origin = `http://127.0.0.1:${address.port}`
    const secondaryOrigin = `http://localhost:${address.port}`
    const defaultUrl = `${origin}/seed-default`
    const secondaryDefaultUrl = `${secondaryOrigin}/seed-secondary`
    const scratchUrl = `${origin}/inspect-scratch`
    const forkUrl = `${origin}/inspect-fork`
    const freshUrl = `${origin}/inspect-fresh`

    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(defaultUrl)}, active: true })`)
    await expect.poll(() => electronApp.evaluate(({ webContents }, url) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === url)
    ), defaultUrl)).toBe(true)
    await electronApp.evaluate(async ({ webContents }, url) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === url)
      if (!contents) throw new Error('Default workspace page was not found')
      await contents.executeJavaScript("localStorage.setItem('workspace-key', 'default-value')")
    }, defaultUrl)

    await appWindow.evaluate(`window.bronom.newTab({ url: ${JSON.stringify(secondaryDefaultUrl)}, active: true })`)
    await expect.poll(() => electronApp.evaluate(({ webContents }, url) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === url)
    ), secondaryDefaultUrl)).toBe(true)
    await electronApp.evaluate(async ({ webContents }, url) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === url)
      if (!contents) throw new Error('Secondary Default workspace page was not found')
      await contents.executeJavaScript("localStorage.setItem('secondary-key', 'secondary-default')")
    }, secondaryDefaultUrl)

    const defaultWorkspaceId = await appWindow.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((workspace) => workspace.isDefault)?.id)`) as string
    const scratchState = await appWindow.evaluate(`window.bronom.createWorkspace({ name: 'Scratch isolation', storage: 'scratch' })`) as {
      activeTabId: string
      mcpTabGroups: Array<{ id: string; name: string; storageKind: string }>
    }
    const scratchWorkspace = scratchState.mcpTabGroups.find((workspace) => workspace.name === 'Scratch isolation')
    expect(scratchWorkspace).toMatchObject({ storageKind: 'isolated' })
    await appWindow.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(scratchState.activeTabId)}, url: ${JSON.stringify(scratchUrl)} })`)
    await expect.poll(() => electronApp.evaluate(({ webContents }, url) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === url)
    ), scratchUrl)).toBe(true)
    const scratchData = await electronApp.evaluate(async ({ webContents }, input) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === input.url)
      if (!contents) throw new Error('Scratch workspace page was not found')
      ;(globalThis as typeof globalThis & { __scratchWorkspaceSession?: Electron.Session }).__scratchWorkspaceSession = contents.session
      return {
        localStorage: await contents.executeJavaScript("localStorage.getItem('workspace-key')"),
        cookies: (await contents.session.cookies.get({})).map((cookie) => `${cookie.name}=${cookie.value}`)
      }
    }, { url: scratchUrl, origin })
    expect(scratchData).toEqual({ localStorage: null, cookies: [] })
    expect(requestCookies.get('/inspect-scratch')).not.toContain('workspace-cookie=default')

    await electronApp.evaluate(async ({ webContents }, url) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === url)
      if (!contents) throw new Error('Scratch workspace page was not found')
      await contents.executeJavaScript("localStorage.setItem('scratch-only', 'temporary')")
      await contents.session.cookies.set({ url, name: 'scratch-only', value: 'temporary', path: '/' })
    }, scratchUrl)
    expect(await electronApp.evaluate(async (_electron, input) => {
      const heldSession = (globalThis as typeof globalThis & { __scratchWorkspaceSession?: Electron.Session }).__scratchWorkspaceSession!
      return (await heldSession.cookies.get({ url: `${input.origin}/` })).length
    }, { origin })).toBe(1)

    await electronApp.evaluate(async () => {
      const heldSession = (globalThis as typeof globalThis & { __scratchWorkspaceSession?: Electron.Session }).__scratchWorkspaceSession
      if (!heldSession) throw new Error('Scratch workspace session was not retained for the destruction failure check')
      const originalClearData = heldSession.clearData.bind(heldSession)
      heldSession.clearData = async (...args: Parameters<Electron.Session['clearData']>) => {
        heldSession.clearData = originalClearData
        throw new Error('simulated workspace storage deletion failure')
      }
    })
    const failedClose = await appWindow.evaluate(`window.bronom.closeWorkspace(${JSON.stringify(scratchWorkspace!.id)}).then(() => 'closed', (error) => String(error.message ?? error))`)
    expect(failedClose).toContain('simulated workspace storage deletion failure')
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((workspace) => workspace.id === ${JSON.stringify(scratchWorkspace!.id)}))`)).toMatchObject({
      name: 'Scratch isolation',
      tabCount: 0,
      storageKind: 'isolated'
    })
    await appWindow.evaluate(`window.bronom.closeWorkspace(${JSON.stringify(scratchWorkspace!.id)})`)
    await expect.poll(() => electronApp.evaluate(async (_electron, input) => {
      const heldSession = (globalThis as typeof globalThis & { __scratchWorkspaceSession?: Electron.Session }).__scratchWorkspaceSession
      if (!heldSession) throw new Error('Scratch workspace session was not retained for the destruction check')
      return (await heldSession.cookies.get({ url: `${input.origin}/` })).length
    }, { origin })).toBe(0)

    const partialState = await appWindow.evaluate(`window.bronom.createWorkspace({ name: 'Partial fork', storage: 'fork-default', origins: [${JSON.stringify(origin)}] })`) as {
      activeTabId: string
      mcpTabGroups: Array<{ id: string; name: string }>
    }
    const partialWorkspace = partialState.mcpTabGroups.find((workspace) => workspace.name === 'Partial fork')!
    const partialSecondaryUrl = `${secondaryOrigin}/inspect-partial-secondary`
    await appWindow.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(partialState.activeTabId)}, url: ${JSON.stringify(partialSecondaryUrl)} })`)
    await expect.poll(() => electronApp.evaluate(({ webContents }, url) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === url)
    ), partialSecondaryUrl)).toBe(true)
    const excludedData = await electronApp.evaluate(async ({ webContents }, input) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === input.url)
      if (!contents) throw new Error('Partial workspace page was not found')
      return {
        localStorage: await contents.executeJavaScript("localStorage.getItem('secondary-key')"),
        cookies: (await contents.session.cookies.get({ url: `${input.origin}/` })).map((cookie) => cookie.name)
      }
    }, { url: partialSecondaryUrl, origin: secondaryOrigin })
    expect(excludedData).toEqual({ localStorage: null, cookies: [] })
    await appWindow.evaluate(`window.bronom.closeWorkspace(${JSON.stringify(partialWorkspace.id)})`)

    const forkState = await appWindow.evaluate(`window.bronom.createWorkspace({ name: 'Forked default', storage: 'fork-default' })`) as {
      activeTabId: string
      mcpTabGroups: Array<{ id: string; name: string; storageKind: string }>
    }
    const forkWorkspace = forkState.mcpTabGroups.find((workspace) => workspace.name === 'Forked default')!
    await appWindow.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(forkState.activeTabId)}, url: ${JSON.stringify(forkUrl)} })`)
    await expect.poll(() => electronApp.evaluate(({ webContents }, url) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === url)
    ), forkUrl)).toBe(true)
    const forkData = await electronApp.evaluate(async ({ webContents }, input) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === input.url)
      if (!contents) throw new Error('Forked workspace page was not found')
      return {
        localStorage: await contents.executeJavaScript("localStorage.getItem('workspace-key')"),
        cookies: (await contents.session.cookies.get({})).map((cookie) => `${cookie.name}=${cookie.value}`)
      }
    }, { url: forkUrl, origin })
    expect(forkData.localStorage).toBe('default-value')
    expect(forkData.cookies).toContain('workspace-cookie=default')
    expect(forkData.cookies).toContain('path-cookie=default-private')
    expect(requestCookies.get('/inspect-fork')).toContain('workspace-cookie=default')

    await electronApp.evaluate(({ webContents }, url) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === url)
      if (!contents) throw new Error('Forked workspace page was not found for the concurrency check')
      const globals = globalThis as typeof globalThis & {
        __workspaceTransferStarted?: boolean
        __releaseWorkspaceTransfer?: () => void
      }
      let releaseTransfer = (): void => undefined
      const transferGate = new Promise<void>((resolve) => { releaseTransfer = resolve })
      globals.__workspaceTransferStarted = false
      globals.__releaseWorkspaceTransfer = releaseTransfer
      const originalSet = contents.session.cookies.set.bind(contents.session.cookies)
      contents.session.cookies.set = async (...args: Parameters<Electron.Cookies['set']>) => {
        contents.session.cookies.set = originalSet
        globals.__workspaceTransferStarted = true
        await transferGate
        return originalSet(...args)
      }
    }, forkUrl)
    const pendingImport = appWindow.evaluate(`window.bronom.transferWorkspaceStorage({ workspaceId: ${JSON.stringify(forkWorkspace.id)}, direction: 'from-default' })`) as Promise<{
      cookieCount: number
    }>
    try {
      await expect.poll(() => electronApp.evaluate(() => (
        (globalThis as typeof globalThis & { __workspaceTransferStarted?: boolean }).__workspaceTransferStarted
      ))).toBe(true)
      const closeWhileCopying = await appWindow.evaluate(`window.bronom.closeWorkspace(${JSON.stringify(forkWorkspace.id)}).then(() => 'closed', (error) => String(error.message ?? error))`)
      expect(closeWhileCopying).toContain('is busy copying workspace storage')
      const secondCopy = await appWindow.evaluate(`window.bronom.transferWorkspaceStorage({ workspaceId: ${JSON.stringify(forkWorkspace.id)}, direction: 'to-default' }).then(() => 'copied', (error) => String(error.message ?? error))`)
      expect(secondCopy).toContain('Workspace storage is busy copying workspace storage')
      const tabOpenedWhileCopying = await appWindow.evaluate(`window.bronom.newTab({ url: 'about:blank', active: false, mcpGroupId: ${JSON.stringify(forkWorkspace.id)} })`) as {
        mcpTabGroups: Array<{ id: string; tabCount: number }>
      }
      expect(tabOpenedWhileCopying.mcpTabGroups.find((workspace) => workspace.id === forkWorkspace.id)?.tabCount).toBe(2)
      await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((workspace) => workspace.id === ${JSON.stringify(forkWorkspace.id)}))`)).toMatchObject({
        name: 'Forked default',
        tabCount: 2
      })
    } finally {
      await electronApp.evaluate(() => {
        const globals = globalThis as typeof globalThis & { __releaseWorkspaceTransfer?: () => void }
        globals.__releaseWorkspaceTransfer?.()
        delete globals.__releaseWorkspaceTransfer
      })
    }
    expect((await pendingImport).cookieCount).toBeGreaterThan(0)

    await electronApp.evaluate(async ({ webContents }, url) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === url)
      if (!contents) throw new Error('Forked workspace page was not found')
      await contents.executeJavaScript("localStorage.setItem('workspace-key', 'saved-from-fork')")
      await contents.session.cookies.set({ url, name: 'fork-only', value: 'saved', path: '/' })
    }, forkUrl)
    const transfer = await appWindow.evaluate(`window.bronom.transferWorkspaceStorage({ workspaceId: ${JSON.stringify(forkWorkspace.id)}, direction: 'to-default' })`) as {
      cookieCount: number
      localStorageItemCount: number
    }
    expect(transfer.cookieCount).toBeGreaterThanOrEqual(2)
    expect(transfer.localStorageItemCount).toBeGreaterThanOrEqual(1)
    const defaultData = await electronApp.evaluate(async ({ webContents }, input) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === input.url)
      if (!contents) throw new Error('Default workspace page was not found')
      return {
        localStorage: await contents.executeJavaScript("localStorage.getItem('workspace-key')"),
        cookies: (await contents.session.cookies.get({ url: `${input.origin}/` })).map((cookie) => `${cookie.name}=${cookie.value}`)
      }
    }, { url: defaultUrl, origin })
    expect(defaultData.localStorage).toBe('saved-from-fork')
    expect(defaultData.cookies).toContain('fork-only=saved')

    const defaultClose = await appWindow.evaluate(`window.bronom.closeWorkspace(${JSON.stringify(defaultWorkspaceId)}).then(() => 'closed', (error) => String(error.message ?? error))`)
    expect(defaultClose).toContain('Default workspace cannot be closed or deleted')

    await appWindow.evaluate(`window.bronom.closeWorkspace(${JSON.stringify(forkWorkspace.id)})`)
    const freshState = await appWindow.evaluate(`window.bronom.createWorkspace({ name: 'Fresh after close', storage: 'scratch' })`) as { activeTabId: string }
    await appWindow.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(freshState.activeTabId)}, url: ${JSON.stringify(freshUrl)} })`)
    await expect.poll(() => electronApp.evaluate(({ webContents }, url) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === url)
    ), freshUrl)).toBe(true)
    const freshData = await electronApp.evaluate(async ({ webContents }, input) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === input.url)
      if (!contents) throw new Error('Fresh workspace page was not found')
      return {
        localStorage: await contents.executeJavaScript("localStorage.getItem('workspace-key')"),
        cookies: (await contents.session.cookies.get({ url: `${input.origin}/` })).map((cookie) => `${cookie.name}=${cookie.value}`)
      }
    }, { url: freshUrl, origin })
    expect(freshData).toEqual({ localStorage: null, cookies: [] })
    expect(internalTransferRequests).toBe(0)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})

test('keeps an isolated workspace profile across restart until the workspace is closed', async ({
  profileDirectory,
  mcpPort
}) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.end('<!doctype html><title>Persistent workspace fixture</title>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  let instance = await launchBronom(profileDirectory, mcpPort)
  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Persistent workspace fixture did not expose a port')
    const url = `http://127.0.0.1:${address.port}/persistent`
    const created = await instance.window.evaluate(`window.bronom.createWorkspace({ name: 'Persistent isolated', storage: 'scratch' })`) as {
      activeTabId: string
      mcpTabGroups: Array<{ id: string; name: string }>
    }
    const workspaceId = created.mcpTabGroups.find((workspace) => workspace.name === 'Persistent isolated')!.id
    await instance.window.evaluate(`window.bronom.navigate({ tabId: ${JSON.stringify(created.activeTabId)}, url: ${JSON.stringify(url)} })`)
    await expect.poll(() => instance.app.evaluate(({ webContents }, targetUrl) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === targetUrl)
    ), url)).toBe(true)
    await instance.app.evaluate(async ({ webContents }, targetUrl) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === targetUrl)
      if (!contents) throw new Error('Persistent workspace page was not found')
      await contents.executeJavaScript("localStorage.setItem('persistent-workspace-key', 'survived')")
      await contents.session.cookies.set({
        url: targetUrl,
        name: 'persistent-workspace-cookie',
        value: 'survived',
        path: '/',
        expirationDate: Date.now() / 1_000 + 3_600
      })
      await contents.session.flushStorageData()
    }, url)
    await closeBronom(instance.app)

    instance = await launchBronom(profileDirectory, mcpPort)
    await expect.poll(() => instance.window.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((workspace) => workspace.id === ${JSON.stringify(workspaceId)}))`)).toMatchObject({
      name: 'Persistent isolated',
      storageKind: 'isolated'
    })
    await expect.poll(() => instance.app.evaluate(({ webContents }, targetUrl) => (
      webContents.getAllWebContents().some((contents) => contents.getURL() === targetUrl)
    ), url)).toBe(true)
    const restored = await instance.app.evaluate(async ({ webContents }, targetUrl) => {
      const contents = webContents.getAllWebContents().find((candidate) => candidate.getURL() === targetUrl)
      if (!contents) throw new Error('Restored workspace page was not found')
      return {
        localStorage: await contents.executeJavaScript("localStorage.getItem('persistent-workspace-key')"),
        cookies: (await contents.session.cookies.get({ url: targetUrl })).map((cookie) => `${cookie.name}=${cookie.value}`)
      }
    }, url)
    expect(restored.localStorage).toBe('survived')
    expect(restored.cookies).toContain('persistent-workspace-cookie=survived')
    await instance.window.evaluate(`window.bronom.closeWorkspace(${JSON.stringify(workspaceId)})`)
    await expect.poll(() => instance.window.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.some((workspace) => workspace.id === ${JSON.stringify(workspaceId)}))`)).toBe(false)
  } finally {
    await closeBronom(instance.app)
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})
