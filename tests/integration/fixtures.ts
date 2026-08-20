import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import {
  _electron as electron,
  test as base,
  type ElectronApplication,
  type Page
} from '@playwright/test'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))

export interface BronomInstance {
  app: ElectronApplication
  window: Page
}

interface BronomFixtures {
  appWindow: Page
  electronApp: ElectronApplication
  mcpToken: string
  mcpPort: number
  profileDirectory: string
}

export async function launchBronom(
  profileDirectory: string,
  mcpPort?: number,
  interfaceScale = 1
): Promise<BronomInstance> {
  const settingsPath = join(profileDirectory, 'settings.json')
  try {
    await readFile(settingsPath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    await writeFile(settingsPath, `${JSON.stringify({ interfaceScale }, null, 2)}\n`, 'utf8')
  }
  const environment = { ...process.env }
  if (mcpPort === undefined) delete environment.BRONOM_MCP_PORT
  else environment.BRONOM_MCP_PORT = String(mcpPort)
  const app = await electron.launch({
    args: ['.'],
    cwd: repositoryRoot,
    env: {
      ...environment,
      BRONOM_MCP_HOST: '127.0.0.1',
      BRONOM_USER_DATA_DIR: profileDirectory,
      BRONOM_DOWNLOAD_DIR: profileDirectory
    }
  })
  const window = await app.firstWindow()
  window.on('pageerror', (error) => console.error(`[renderer] ${error.message}`))
  window.on('console', (message) => {
    if (message.type() === 'error') console.error(`[renderer] ${message.text()}`)
  })
  await window.waitForLoadState('domcontentloaded')
  return { app, window }
}

export async function closeBronom(app: ElectronApplication): Promise<void> {
  let child: ReturnType<ElectronApplication['process']>
  try {
    child = app.process()
  } catch {
    return
  }
  const closePromise = app.close().catch(() => undefined)
  await settleWithin(closePromise, 3_000)
  if (child.exitCode === null) {
    child.kill('SIGTERM')
    await waitForExit(child, 2_000)
  }
  if (child.exitCode === null) {
    child.kill('SIGKILL')
    await waitForExit(child, 2_000)
  }
  await settleWithin(closePromise, 1_000)
}

async function settleWithin(promise: Promise<unknown>, timeoutMs: number): Promise<void> {
  let timer: NodeJS.Timeout | undefined
  await Promise.race([
    promise,
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, timeoutMs)
    })
  ])
  if (timer) clearTimeout(timer)
}

async function waitForExit(
  child: ReturnType<ElectronApplication['process']>,
  timeoutMs: number
): Promise<void> {
  if (child.exitCode !== null) return
  await new Promise<void>((resolve) => {
    const finish = (): void => {
      clearTimeout(timer)
      child.off('exit', finish)
      resolve()
    }
    const timer = setTimeout(finish, timeoutMs)
    child.once('exit', finish)
  })
}

export const test = base.extend<BronomFixtures>({
  profileDirectory: async ({}, use) => {
    const directory = await mkdtemp(join(tmpdir(), 'bronom-integration-'))
    await use(directory)
    await rm(directory, { recursive: true, force: true })
  },

  mcpPort: async ({}, use, testInfo) => {
    await use(48_700 + testInfo.workerIndex)
  },

  electronApp: async ({ profileDirectory, mcpPort }, use) => {
    const instance = await launchBronom(profileDirectory, mcpPort)
    await use(instance.app)
    await closeBronom(instance.app)
  },

  mcpToken: async ({ electronApp: _electronApp, profileDirectory }, use) => {
    const token = (await readFile(join(profileDirectory, 'mcp-token'), 'utf8')).trim()
    await use(token)
  },

  appWindow: async ({ electronApp }, use) => {
    const window = await electronApp.firstWindow()
    await window.waitForLoadState('domcontentloaded')
    await use(window)
  }
})

export { expect } from '@playwright/test'
