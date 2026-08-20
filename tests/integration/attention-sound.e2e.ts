import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { expect, test } from './fixtures.js'
import { useMcpWorkspace } from '../../scripts/mcp-workspace.js'

test('previews and plays the selected Foley cue for user attention', async ({
  appWindow,
  mcpPort,
  mcpToken
}) => {
  const authorization = `Bearer ${mcpToken}`
  await expect
    .poll(async () => {
      try {
        return (await fetch(`http://127.0.0.1:${mcpPort}/healthz`, { headers: { authorization } })).ok
      } catch {
        return false
      }
    })
    .toBe(true)

  await appWindow.evaluate(`(() => {
    const audioContext = window.AudioContext
    const originalCreateOscillator = audioContext.prototype.createOscillator
    Object.defineProperty(window, '__bronomFoleyOscillators', { value: 0, writable: true })
    audioContext.prototype.createOscillator = function () {
      window.__bronomFoleyOscillators += 1
      return originalCreateOscillator.call(this)
    }
  })()`)
  await appWindow.getByRole('button', { name: 'Settings' }).click()
  await appWindow.getByRole('combobox', { name: 'Attention sound' }).selectOption('bell')
  await appWindow.getByRole('button', { name: 'Test sound' }).click()
  await expect.poll(() => appWindow.evaluate('window.__bronomFoleyOscillators')).toBeGreaterThan(0)
  const previewOscillators = await appWindow.evaluate('window.__bronomFoleyOscillators') as number
  await appWindow.waitForTimeout(100)

  const client = new Client({ name: 'bronom-attention-sound-test', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${mcpPort}/mcp`), {
    requestInit: { headers: { authorization } }
  })
  try {
    await client.connect(transport)
    await useMcpWorkspace(client, 'Attention sound tests')
    await client.callTool({
      name: 'browser_request_user_attention',
      arguments: { reason: 'Please complete this manual step.' }
    })
    await expect.poll(() => appWindow.evaluate('window.__bronomFoleyOscillators')).toBeGreaterThan(previewOscillators)
  } finally {
    await client.close()
  }
})
