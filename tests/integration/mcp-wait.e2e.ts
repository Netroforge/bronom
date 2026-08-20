import { createServer, type ServerResponse } from 'node:http'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { useMcpWorkspace } from '../../scripts/mcp-workspace.js'
import { expect, test } from './fixtures.js'

function text(result: CallToolResult): string {
  const content = result.content.find((item) => item.type === 'text')
  return content?.type === 'text' ? content.text : ''
}

test('fails MCP page and text waits promptly on tab close or timeout', async ({
  appWindow,
  mcpPort,
  mcpToken
}) => {
  const pendingResponses = new Set<ServerResponse>()
  const server = createServer((_request, response) => {
    pendingResponses.add(response)
    response.once('close', () => pendingResponses.delete(response))
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.write('<!doctype html><title>Never finished</title><main>Still loading</main>')
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const client = new Client({ name: 'bronom-wait-close-test', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${mcpPort}/mcp`), {
    requestInit: { headers: { authorization: `Bearer ${mcpToken}` } }
  })
  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Wait fixture did not expose a port')
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
    await useMcpWorkspace(client, 'Wait cancellation test', false)
    const opened = await client.callTool({
      name: 'browser_new_tab',
      arguments: { url: `http://127.0.0.1:${address.port}/never-finishes`, active: true }
    }) as CallToolResult
    const tabId = (JSON.parse(text(opened)) as { activeTabId: string }).activeTabId
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => state.tabs.find((tab) => tab.id === ${JSON.stringify(tabId)})?.loading)`)).toBe(true)

    const waiting = client.callTool({
      name: 'browser_wait',
      arguments: { tabId, timeoutMs: 10_000 }
    }) as Promise<CallToolResult>
    await expect(appWindow.locator('[role="tab"][data-mcp-command="browser_wait"]')).toBeVisible()
    await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(tabId)})`)
    const result = await Promise.race([
      waiting,
      new Promise<never>((_resolve, reject) => {
        setTimeout(() => reject(new Error('browser_wait stayed active after its tab closed')), 2_000)
      })
    ])
    expect(result.isError).toBe(true)
    expect(text(result)).toContain('tab closed while waiting for the page')

    const openedTextTab = await client.callTool({
      name: 'browser_new_tab',
      arguments: { url: `http://127.0.0.1:${address.port}/never-finds-text`, active: true }
    }) as CallToolResult
    const textTabId = (JSON.parse(text(openedTextTab)) as { activeTabId: string }).activeTabId
    const waitingForText = client.callTool({
      name: 'browser_wait',
      arguments: { tabId: textTabId, text: 'This text never appears', timeoutMs: 10_000 }
    }) as Promise<CallToolResult>
    await expect(appWindow.locator('[role="tab"][data-mcp-command="browser_wait"]')).toBeVisible()
    await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(textTabId)})`)
    const textResult = await Promise.race([
      waitingForText,
      new Promise<never>((_resolve, reject) => {
        setTimeout(() => reject(new Error('text browser_wait stayed active after its tab closed')), 2_000)
      })
    ])
    expect(textResult.isError).toBe(true)
    expect(text(textResult)).toContain('tab closed while waiting for page text')

    const openedTimeoutTab = await client.callTool({
      name: 'browser_new_tab',
      arguments: { url: `http://127.0.0.1:${address.port}/never-finishes-before-timeout`, active: true }
    }) as CallToolResult
    const timeoutTabId = (JSON.parse(text(openedTimeoutTab)) as { activeTabId: string }).activeTabId
    const timeoutResult = await client.callTool({
      name: 'browser_wait',
      arguments: { tabId: timeoutTabId, timeoutMs: 100 }
    }) as CallToolResult
    expect(timeoutResult.isError).toBe(true)
    expect(text(timeoutResult)).toContain('Timed out waiting for the page to finish loading')
    await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(timeoutTabId)})`)

    const openedTextTimeoutTab = await client.callTool({
      name: 'browser_new_tab',
      arguments: { url: `http://127.0.0.1:${address.port}/text-never-finishes-before-timeout`, active: true }
    }) as CallToolResult
    const textTimeoutTabId = (JSON.parse(text(openedTextTimeoutTab)) as { activeTabId: string }).activeTabId
    const textTimeoutResult = await client.callTool({
      name: 'browser_wait',
      arguments: { tabId: textTimeoutTabId, text: 'Absent forever', timeoutMs: 100 }
    }) as CallToolResult
    expect(textTimeoutResult.isError).toBe(true)
    expect(text(textTimeoutResult)).toContain('Timed out waiting for text: Absent forever')
    await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(textTimeoutTabId)})`)
  } finally {
    await client.close().catch(() => undefined)
    for (const response of pendingResponses) response.destroy()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})
