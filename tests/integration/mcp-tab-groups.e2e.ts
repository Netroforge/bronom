import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { BrowserState } from '../../src/shared/types.js'
import { closeBronom, expect, launchBronom, test } from './fixtures.js'

function text(result: CallToolResult): string {
  const content = result.content.find((item) => item.type === 'text')
  return content?.type === 'text' ? content.text : ''
}

async function connectClient(name: string, port: number, token: string): Promise<Client> {
  await expect.poll(async () => {
    try {
      return (await fetch(`http://127.0.0.1:${port}/healthz`, {
        headers: { authorization: `Bearer ${token}` }
      })).ok
    } catch {
      return false
    }
  }).toBe(true)
  const client = new Client({ name, version: '1.0.0' })
  await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`), {
    requestInit: { headers: { authorization: `Bearer ${token}` } }
  }))
  return client
}

async function createGroup(client: Client, name: string, color?: string): Promise<string> {
  const result = await client.callTool({
    name: 'browser_tab_groups',
    arguments: { action: 'create', name, ...(color ? { color } : {}) }
  }) as CallToolResult
  expect(result.isError, text(result)).not.toBe(true)
  return (JSON.parse(text(result)) as { id: string }).id
}

test('requires visible tab groups and keeps each tool inside its selected group', async ({
  appWindow,
  mcpPort,
  mcpToken
}) => {
  const first = await connectClient('group-test-first', mcpPort, mcpToken)
  const second = await connectClient('group-test-second', mcpPort, mcpToken)
  try {
    const availableTools = await first.listTools()
    const groupsTool = availableTools.tools.find((tool) => tool.name === 'browser_tab_groups')
    expect(groupsTool?.description).toContain('Use only the groupId returned by your own create call')
    expect(groupsTool?.description).toContain('never touch the human Default group')

    const unscoped = await first.callTool({ name: 'browser_status', arguments: {} }) as CallToolResult
    expect(unscoped.isError).toBe(true)
    expect(text(unscoped)).toContain('groupId')

    const firstGroupId = await createGroup(first, 'Checkout agent', 'blue')
    const secondGroupId = await createGroup(second, 'Documentation agent', 'cyan')
    const listed = await first.callTool({ name: 'browser_tab_groups', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(listed))).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: firstGroupId, name: 'Checkout agent', color: 'blue', tabCount: 0 }),
      expect.objectContaining({ id: secondGroupId, name: 'Documentation agent', color: 'cyan', tabCount: 0 })
    ]))

    const renamed = await first.callTool({
      name: 'browser_tab_groups',
      arguments: { action: 'rename', groupId: firstGroupId, name: 'Checkout debugging' }
    }) as CallToolResult
    expect(renamed.isError, text(renamed)).not.toBe(true)
    expect(JSON.parse(text(renamed))).toMatchObject({ id: firstGroupId, name: 'Checkout debugging' })
    const afterRename = await first.callTool({ name: 'browser_tab_groups', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(afterRename))).toContainEqual(expect.objectContaining({
      id: firstGroupId,
      name: 'Checkout debugging',
      color: 'blue'
    }))
    const recolored = await first.callTool({
      name: 'browser_tab_groups',
      arguments: { action: 'update', groupId: firstGroupId, color: 'orange' }
    }) as CallToolResult
    expect(recolored.isError, text(recolored)).not.toBe(true)
    expect(JSON.parse(text(recolored))).toMatchObject({ id: firstGroupId, name: 'Checkout debugging', color: 'orange' })

    const firstOpened = await first.callTool({
      name: 'browser_new_tab',
      arguments: { groupId: firstGroupId, url: 'data:text/html,<title>Checkout workspace</title><h1>Checkout</h1>' }
    }) as CallToolResult
    const firstState = JSON.parse(text(firstOpened)) as { activeTabId: string; tabs: Array<{ id: string; mcpGroupId: string }> }
    const firstTabId = firstState.activeTabId
    expect(firstState.tabs).toEqual([expect.objectContaining({ id: firstTabId, mcpGroupId: firstGroupId })])

    const secondOpened = await second.callTool({
      name: 'browser_new_tab',
      arguments: { groupId: secondGroupId, url: 'data:text/html,<title>Docs workspace</title><h1>Docs</h1>' }
    }) as CallToolResult
    const secondTabId = (JSON.parse(text(secondOpened)) as { activeTabId: string }).activeTabId

    await appWindow.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Human default tab</title><h1>Human</h1>', active: true })`)
    await appWindow.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Another human tab</title><h1>Human two</h1>', active: false })`)
    const humanState = await appWindow.evaluate(`window.bronom.getState()`) as BrowserState
    const defaultGroup = humanState.mcpTabGroups.find((group) => group.isDefault)
    expect(defaultGroup).toMatchObject({ name: 'Default', color: 'gray', isDefault: true, tabCount: 2 })
    expect(humanState.tabs.filter((tab) => tab.mcpGroupId === defaultGroup?.id)).toHaveLength(2)
    await expect(appWindow.locator('.tab-group-label', { hasText: 'Default' })).toContainText('Default')

    const firstTabs = await first.callTool({ name: 'browser_tabs', arguments: { groupId: firstGroupId } }) as CallToolResult
    expect(JSON.parse(text(firstTabs))).toEqual([expect.objectContaining({ id: firstTabId })])
    expect(text(firstTabs)).not.toContain(secondTabId)

    const crossGroupSnapshot = await second.callTool({
      name: 'browser_snapshot',
      arguments: { groupId: secondGroupId, tabId: firstTabId }
    }) as CallToolResult
    expect(crossGroupSnapshot.isError).toBe(true)
    expect(text(crossGroupSnapshot)).toContain('does not belong to tab group')

    await expect(appWindow.locator('.tab-group-label', { hasText: 'Checkout debugging' })).toBeVisible()
    await expect(appWindow.locator('.tab-group-label', { hasText: 'Documentation agent' })).toBeVisible()

    await first.callTool({
      name: 'browser_evaluate',
      arguments: {
        groupId: firstGroupId,
        tabId: firstTabId,
        script: "window.open('data:text/html,<title>Checkout popup</title><h1>Popup</h1>'); true"
      }
    })
    await expect.poll(async () => {
      const result = await first.callTool({ name: 'browser_tabs', arguments: { groupId: firstGroupId } }) as CallToolResult
      return (JSON.parse(text(result)) as unknown[]).length
    }).toBe(2)
  } finally {
    await first.close()
    await second.close()
  }
})

test('archives an agent group and reopens it with a fresh group id', async ({ mcpPort, mcpToken }) => {
  const client = await connectClient('saved-group-test', mcpPort, mcpToken)
  try {
    const groupId = await createGroup(client, 'Deferred investigation', 'pink')
    await client.callTool({
      name: 'browser_new_tab',
      arguments: { groupId, url: 'data:text/html,<title>Deferred tab</title><h1>Later</h1>' }
    })
    const savedResult = await client.callTool({
      name: 'browser_saved_tab_groups',
      arguments: { action: 'save', groupId }
    }) as CallToolResult
    expect(savedResult.isError, text(savedResult)).not.toBe(true)
    const saved = JSON.parse(text(savedResult)) as { id: string; name: string; color: string; tabs: Array<{ url: string }> }
    expect(saved).toMatchObject({ name: 'Deferred investigation', color: 'pink' })
    expect(saved.tabs).toEqual([expect.objectContaining({ url: expect.stringContaining('<title>Deferred tab</title>') })])

    const activeGroups = await client.callTool({ name: 'browser_tab_groups', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(activeGroups))).not.toContainEqual(expect.objectContaining({ id: groupId }))
    const listedSaved = await client.callTool({ name: 'browser_saved_tab_groups', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(listedSaved))).toContainEqual(expect.objectContaining({ id: saved.id, name: 'Deferred investigation' }))

    const openedResult = await client.callTool({
      name: 'browser_saved_tab_groups',
      arguments: { action: 'open', savedGroupId: saved.id }
    }) as CallToolResult
    expect(openedResult.isError, text(openedResult)).not.toBe(true)
    const opened = JSON.parse(text(openedResult)) as { id: string; name: string; color: string; tabCount: number }
    expect(opened).toMatchObject({ name: 'Deferred investigation', color: 'pink', tabCount: 1 })
    expect(opened.id).not.toBe(groupId)
    const emptySaved = await client.callTool({ name: 'browser_saved_tab_groups', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(emptySaved))).toEqual([])
  } finally {
    await client.close()
  }
})

test('restores group identity and tabs after an application restart', async ({ profileDirectory, mcpPort }) => {
  let instance = await launchBronom(profileDirectory, mcpPort)
  const token = (await readFile(join(profileDirectory, 'mcp-token'), 'utf8')).trim()
  const firstClient = await connectClient('group-restart-before', mcpPort, token)
  const groupId = await createGroup(firstClient, 'Persistent investigation', 'green')
  const opened = await firstClient.callTool({
    name: 'browser_new_tab',
    arguments: { groupId, url: 'data:text/html,<title>Persistent grouped tab</title><h1>Still here</h1>' }
  }) as CallToolResult
  const tabId = (JSON.parse(text(opened)) as { activeTabId: string }).activeTabId
  await instance.window.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Persistent human tab</title><h1>Mine</h1>', active: false })`)
  const defaultGroupId = await instance.window.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((group) => group.isDefault)?.id)`) as string
  const groupControl = instance.window.locator('.tab-group-label', { hasText: 'Persistent investigation' })
  await expect(groupControl).toHaveAttribute('aria-expanded', 'true')
  await expect(groupControl).toHaveAccessibleName('Collapse group Persistent investigation, 1 tab')
  await groupControl.click()
  await expect(groupControl).toHaveAttribute('aria-expanded', 'false')
  await expect(instance.window.getByRole('tab', { name: /^Persistent grouped tab/ })).toBeHidden()
  expect(await instance.window.evaluate('JSON.parse(localStorage.getItem("bronom:collapsed-tab-groups"))')).toEqual([groupId])
  await firstClient.close()
  await closeBronom(instance.app)

  instance = await launchBronom(profileDirectory, mcpPort)
  const secondClient = await connectClient('group-restart-after', mcpPort, token)
  try {
    const restoredGroupControl = instance.window.locator('.tab-group-label', { hasText: 'Persistent investigation' })
    await expect.poll(() => instance.window.evaluate(`window.bronom.getState().then((state) => ({
      defaultGroup: state.mcpTabGroups.find((group) => group.isDefault),
      humanGroupId: state.tabs.find((tab) => tab.title === 'Persistent human tab')?.mcpGroupId
    }))`)).toMatchObject({
      defaultGroup: { id: defaultGroupId, name: 'Default', isDefault: true },
      humanGroupId: defaultGroupId
    })
    await expect(restoredGroupControl).toHaveAttribute('aria-expanded', 'false')
    await expect(restoredGroupControl).toHaveAccessibleName('Expand group Persistent investigation, 1 tab')
    await expect(instance.window.getByRole('tab', { name: /^Persistent grouped tab/ })).toBeHidden()
    await restoredGroupControl.press('Enter')
    await expect(restoredGroupControl).toHaveAttribute('aria-expanded', 'true')
    await expect(instance.window.getByRole('tab', { name: /^Persistent grouped tab/ })).toBeVisible()
    await restoredGroupControl.press('Space')
    await expect(restoredGroupControl).toHaveAttribute('aria-expanded', 'false')
    await instance.window.getByRole('button', { name: 'Search tabs' }).click()
    await instance.window.getByRole('dialog', { name: 'Tabs' }).locator('.tab-search-open', { hasText: 'Persistent grouped tab' }).click()
    await expect(restoredGroupControl).toHaveAttribute('aria-expanded', 'true')
    await expect(instance.window.getByRole('tab', { name: /^Persistent grouped tab/ })).toBeVisible()
    const listed = await secondClient.callTool({ name: 'browser_tab_groups', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(listed))).toContainEqual(expect.objectContaining({
      id: groupId,
      name: 'Persistent investigation',
      color: 'green',
      tabCount: 1,
      activeTabId: tabId
    }))
    const status = await secondClient.callTool({ name: 'browser_status', arguments: { groupId } }) as CallToolResult
    expect(JSON.parse(text(status))).toMatchObject({
      activeTabId: tabId,
      tabs: [expect.objectContaining({ id: tabId, mcpGroupId: groupId })]
    })
  } finally {
    await secondClient.close()
    await closeBronom(instance.app)
  }
})
