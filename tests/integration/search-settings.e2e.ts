import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { expect, test } from './fixtures.js'
import { useMcpTabGroup } from '../../scripts/mcp-tab-group.js'

test('uses the selected search engine for address-bar and MCP searches', async ({
  appWindow,
  electronApp,
  mcpPort,
  mcpToken,
  profileDirectory
}) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end('<!doctype html><title>Search redirect fixture</title><main>Search redirected locally</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Search fixture server did not expose a port')
  const redirectUrl = `http://127.0.0.1:${address.port}/`

  const client = new Client({ name: 'bronom-search-settings-test', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${mcpPort}/mcp`), {
    requestInit: { headers: { authorization: `Bearer ${mcpToken}` } }
  })

  try {
    await appWindow.getByRole('button', { name: 'Settings' }).click()
    await appWindow.getByRole('button', { name: /Search engine/ }).click()
    const searchSettings = appWindow.getByRole('main')
    await expect(searchSettings.getByRole('radio')).toHaveCount(5)
    await searchSettings.getByTestId('search-engine-duckduckgo').click()
    await expect(searchSettings.getByTestId('search-engine-duckduckgo')).toHaveAttribute('aria-checked', 'true')
    await expect.poll(async () => JSON.parse(await readFile(join(profileDirectory, 'settings.json'), 'utf8')).searchEngine).toBe('duckduckgo')

    await electronApp.evaluate(({ session }, localRedirectUrl) => {
      const globalState = globalThis as typeof globalThis & { __bronomCapturedSearchUrls?: string[] }
      globalState.__bronomCapturedSearchUrls = []
      session.fromPartition('persist:bronom').webRequest.onBeforeRequest(
        { urls: ['https://duckduckgo.com/*'] },
        (details, callback) => {
          globalState.__bronomCapturedSearchUrls?.push(details.url)
          callback({ redirectURL: localRedirectUrl })
        }
      )
    }, redirectUrl)

    await appWindow.getByRole('button', { name: 'Close settings' }).click()
    await appWindow.getByRole('button', { name: 'New tab' }).click()
    const addressBar = appWindow.getByRole('combobox', { name: 'Address' })
    await addressBar.fill('human search phrase')
    await addressBar.press('Enter')
    await expect.poll(() => electronApp.evaluate(() => (
      (globalThis as typeof globalThis & { __bronomCapturedSearchUrls?: string[] }).__bronomCapturedSearchUrls
    ))).toEqual(['https://duckduckgo.com/?q=human%20search%20phrase'])

    await client.connect(transport)
    await useMcpTabGroup(client, 'Search settings tests')
    await client.callTool({ name: 'browser_navigate', arguments: { url: 'agent search phrase' } })
    await expect.poll(() => electronApp.evaluate(() => (
      (globalThis as typeof globalThis & { __bronomCapturedSearchUrls?: string[] }).__bronomCapturedSearchUrls
    ))).toEqual([
      'https://duckduckgo.com/?q=human%20search%20phrase',
      'https://duckduckgo.com/?q=agent%20search%20phrase'
    ])
  } finally {
    await client.close().catch(() => undefined)
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})
