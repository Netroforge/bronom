import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { expect, test } from './fixtures.js'
import { useMcpWorkspace } from '../../scripts/mcp-workspace.js'

function text(result: CallToolResult): string {
  const content = result.content.find((item) => item.type === 'text')
  return content?.type === 'text' ? content.text : ''
}

test('captures screenshots and saves a PDF while Bronom is hidden in the tray', async ({
  electronApp,
  mcpToken,
  mcpPort,
  profileDirectory
}) => {
  const authorization = `Bearer ${mcpToken}`
  const client = new Client({ name: 'bronom-tray-screenshot-test', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${mcpPort}/mcp`), {
    requestInit: { headers: { authorization } }
  })

  try {
    await expect.poll(async () => {
      try {
        return (await fetch(`http://127.0.0.1:${mcpPort}/healthz`, { headers: { authorization } })).ok
      } catch {
        return false
      }
    }).toBe(true)
    await client.connect(transport)
    await useMcpWorkspace(client, 'Screenshot tray tests')
    const status = await client.callTool({ name: 'browser_status', arguments: {} }) as CallToolResult
    const tabId = JSON.parse(text(status)).activeTabId as string

    await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.close())
    await expect.poll(() => electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.isVisible())).toBe(false)

    for (const fullPage of [false, true]) {
      const screenshot = await client.callTool({
        name: 'browser_screenshot',
        arguments: { tabId, fullPage }
      }) as CallToolResult
      expect(screenshot.isError, `${fullPage ? 'full page' : 'viewport'}: ${text(screenshot)}`).not.toBe(true)
      const image = screenshot.content.find((item) => item.type === 'image')
      expect(image?.type).toBe('image')
      if (image?.type === 'image') {
        const png = Buffer.from(image.data, 'base64')
        expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        expect(png.readUInt32BE(16)).toBeGreaterThan(0)
        expect(png.readUInt32BE(20)).toBeGreaterThan(0)
      }
    }
    for (const fullPage of [false, true]) {
      const screenshot = await client.callTool({
        name: 'browser_screenshot',
        arguments: { tabId, fullPage, format: 'jpeg', quality: 65, maxWidth: 480, maxHeight: 320 }
      }) as CallToolResult
      expect(screenshot.isError, `${fullPage ? 'full page' : 'viewport'} JPEG: ${text(screenshot)}`).not.toBe(true)
      const image = screenshot.content.find((item) => item.type === 'image')
      expect(image).toMatchObject({ type: 'image', mimeType: 'image/jpeg' })
      if (image?.type === 'image') {
        const jpeg = Buffer.from(image.data, 'base64')
        expect(jpeg.subarray(0, 3)).toEqual(Buffer.from([0xff, 0xd8, 0xff]))
        const size = await electronApp.evaluate(({ nativeImage }, data) => (
          nativeImage.createFromBuffer(Buffer.from(data, 'base64')).getSize()
        ), image.data)
        expect(size.width).toBeGreaterThan(0)
        expect(size.height).toBeGreaterThan(0)
        expect(size.width).toBeLessThanOrEqual(480)
        expect(size.height).toBeLessThanOrEqual(320)
      }
    }
    const cropped = await client.callTool({
      name: 'browser_screenshot',
      arguments: { tabId, clip: { x: 0, y: 0, width: 128, height: 64 } }
    }) as CallToolResult
    expect(cropped.isError, `hidden cropped PNG: ${text(cropped)}`).not.toBe(true)
    const croppedImage = cropped.content.find((item) => item.type === 'image')
    expect(croppedImage).toMatchObject({ type: 'image', mimeType: 'image/png' })
    if (croppedImage?.type === 'image') {
      const png = Buffer.from(croppedImage.data, 'base64')
      expect(png.readUInt32BE(16)).toBe(128)
      expect(png.readUInt32BE(20)).toBe(64)
    }
    const invalidQuality = await client.callTool({
      name: 'browser_screenshot',
      arguments: { tabId, format: 'png', quality: 50 }
    }) as CallToolResult
    expect(invalidQuality.isError).toBe(true)
    expect(text(invalidQuality)).toContain('supported only for JPEG')
    const pdf = await client.callTool({
      name: 'browser_pdf_save',
      arguments: { tabId, filename: 'tray-hidden.pdf' }
    }) as CallToolResult
    expect(pdf.isError, text(pdf)).not.toBe(true)
    expect(JSON.parse(text(pdf))).toMatchObject({
      filename: 'tray-hidden.pdf',
      path: join(profileDirectory, 'tray-hidden.pdf')
    })
    expect((await readFile(join(profileDirectory, 'tray-hidden.pdf'))).subarray(0, 5).toString()).toBe('%PDF-')
    await expect.poll(() => electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.isVisible())).toBe(false)
  } finally {
    await client.close().catch(() => undefined)
  }
})
