import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { BrowserState } from '../../src/shared/types.js'
import { useMcpWorkspace } from '../../scripts/mcp-workspace.js'
import { closeBronom, expect, launchBronom, test } from './fixtures.js'

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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

async function createWorkspace(client: Client, name: string, color?: string): Promise<string> {
  const result = await client.callTool({
    name: 'browser_workspaces',
    arguments: { action: 'create', name, ...(color ? { color } : {}) }
  }) as CallToolResult
  expect(result.isError, text(result)).not.toBe(true)
  return (JSON.parse(text(result)) as { id: string }).id
}

test('uses UUIDv7 for tabs and puts the last-tab replacement in Default', async ({ appWindow }) => {
  const initial = await appWindow.evaluate(`window.bronom.getState()`) as BrowserState
  expect(initial.tabs).toHaveLength(1)
  expect(initial.tabs[0]!.id).toMatch(UUID_V7_PATTERN)
  await appWindow.evaluate(`window.bronom.closeTab(${JSON.stringify(initial.tabs[0]!.id)})`)
  const replacement = await appWindow.evaluate(`window.bronom.getState()`) as BrowserState
  const defaultWorkspace = replacement.mcpTabGroups.find((workspace) => workspace.isDefault)
  expect(defaultWorkspace?.id).toMatch(UUID_V7_PATTERN)
  expect(replacement.tabs).toEqual([
    expect.objectContaining({
      id: expect.stringMatching(UUID_V7_PATTERN),
      url: 'about:blank',
      mcpGroupId: defaultWorkspace?.id
    })
  ])
})

test('keeps empty workspaces visible and opens a tab from each workspace action', async ({
  appWindow,
  mcpPort,
  mcpToken
}) => {
  const client = await connectClient('empty-workspace-ui', mcpPort, mcpToken)
  try {
    const workspaceId = await createWorkspace(client, 'Empty investigation', 'cyan')
    const workspaceControl = appWindow.locator('.tab-group-label', { hasText: 'Empty investigation' })
    await expect(workspaceControl).toBeVisible()
    await expect(workspaceControl).toHaveAccessibleName('Collapse workspace Empty investigation, 0 tabs')
    await expect(appWindow.getByRole('tab')).toHaveCount(0)

    const workspaceNewTab = appWindow.getByRole('button', { name: 'New tab in Empty investigation workspace' })
    const createWorkspaceButton = appWindow.getByRole('button', { name: 'Create workspace' })
    const [workspaceBounds, newTabBounds, createBounds] = await Promise.all([
      workspaceControl.boundingBox(),
      workspaceNewTab.boundingBox(),
      createWorkspaceButton.boundingBox()
    ])
    expect(Math.round(workspaceBounds?.height ?? 0)).toBe(28)
    expect(Math.round(newTabBounds?.height ?? 0)).toBe(28)
    expect(Math.round(createBounds?.height ?? 0)).toBe(28)
    expect(Math.round(newTabBounds?.y ?? 0)).toBe(Math.round(workspaceBounds?.y ?? -1))
    expect(Math.round(createBounds?.y ?? 0)).toBe(Math.round(workspaceBounds?.y ?? -1))
    expect(Math.abs((workspaceBounds?.x ?? 0) + (workspaceBounds?.width ?? 0) - (newTabBounds?.x ?? 0))).toBeLessThanOrEqual(1)
    await expect(createWorkspaceButton).toHaveText('Workspace')

    await workspaceNewTab.click()
    await expect.poll(() => appWindow.evaluate(`window.bronom.getState().then((state) => ({
      activeTabId: state.activeTabId,
      workspaceTabIds: state.tabs
        .filter((tab) => tab.mcpGroupId === ${JSON.stringify(workspaceId)})
        .map((tab) => tab.id)
    }))`)).toEqual({
      activeTabId: expect.stringMatching(UUID_V7_PATTERN),
      workspaceTabIds: [expect.stringMatching(UUID_V7_PATTERN)]
    })
    await expect(workspaceControl).toHaveAccessibleName('Collapse workspace Empty investigation, 1 tab')
    await expect(appWindow.getByRole('button', { name: 'New tab in Default workspace' })).toBeVisible()
  } finally {
    await client.close()
  }
})

test('requires visible workspaces and keeps each tool inside its selected workspace', async ({
  appWindow,
  mcpPort,
  mcpToken
}) => {
  const first = await connectClient('group-test-first', mcpPort, mcpToken)
  const second = await connectClient('group-test-second', mcpPort, mcpToken)
  try {
    const availableTools = await first.listTools()
    const groupsTool = availableTools.tools.find((tool) => tool.name === 'browser_workspaces')
    expect(groupsTool?.description).toContain('Use only the id returned by your own create call, or the fresh id returned when you reopen your own archive')
    expect(groupsTool?.description).toContain('never touch the human Default workspace')
    expect(groupsTool?.inputSchema).toMatchObject({
      properties: {
        storage: { enum: ['scratch', 'fork-default'] },
        origins: { type: 'array' }
      }
    })
    const initialWorkspaces = await first.callTool({ name: 'browser_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(initialWorkspaces))).toEqual([
      expect.objectContaining({ name: 'Default', isDefault: true, storageKind: 'default', tabCount: 0 })
    ])
    const defaultWorkspaceId = (JSON.parse(text(initialWorkspaces)) as Array<{ id: string }>)[0]!.id
    expect(defaultWorkspaceId).toMatch(UUID_V7_PATTERN)
    const defaultStatus = await first.callTool({
      name: 'browser_status',
      arguments: { workspaceId: defaultWorkspaceId }
    }) as CallToolResult
    expect(defaultStatus.isError).toBe(true)
    expect(text(defaultStatus)).toContain('Default workspace is not available through MCP')
    const defaultRename = await first.callTool({
      name: 'browser_workspaces',
      arguments: { action: 'rename', workspaceId: defaultWorkspaceId, name: 'Agent profile' }
    }) as CallToolResult
    expect(defaultRename.isError).toBe(true)
    expect(text(defaultRename)).toContain('Default workspace is not available through MCP')

    const unscoped = await first.callTool({ name: 'browser_status', arguments: {} }) as CallToolResult
    expect(unscoped.isError).toBe(true)
    expect(text(unscoped)).toContain('workspaceId')

    const firstGroupId = await createWorkspace(first, 'Checkout agent', 'blue')
    const secondGroupId = await createWorkspace(second, 'Documentation agent', 'cyan')
    expect(firstGroupId).toMatch(UUID_V7_PATTERN)
    expect(secondGroupId).toMatch(UUID_V7_PATTERN)
    const listed = await first.callTool({ name: 'browser_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(listed))).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: firstGroupId, name: 'Checkout agent', color: 'blue', tabCount: 0 }),
      expect.objectContaining({ id: secondGroupId, name: 'Documentation agent', color: 'cyan', tabCount: 0 })
    ]))

    const renamed = await first.callTool({
      name: 'browser_workspaces',
      arguments: { action: 'rename', workspaceId: firstGroupId, name: 'Checkout debugging' }
    }) as CallToolResult
    expect(renamed.isError, text(renamed)).not.toBe(true)
    expect(JSON.parse(text(renamed))).toMatchObject({ id: firstGroupId, name: 'Checkout debugging' })
    const afterRename = await first.callTool({ name: 'browser_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(afterRename))).toContainEqual(expect.objectContaining({
      id: firstGroupId,
      name: 'Checkout debugging',
      color: 'blue'
    }))
    const duplicateRename = await second.callTool({
      name: 'browser_workspaces',
      arguments: { action: 'rename', workspaceId: secondGroupId, name: ' checkout debugging ' }
    }) as CallToolResult
    expect(duplicateRename.isError).toBe(true)
    expect(text(duplicateRename)).toContain('already exists')
    const recolored = await first.callTool({
      name: 'browser_workspaces',
      arguments: { action: 'update', workspaceId: firstGroupId, color: 'orange' }
    }) as CallToolResult
    expect(recolored.isError, text(recolored)).not.toBe(true)
    expect(JSON.parse(text(recolored))).toMatchObject({ id: firstGroupId, name: 'Checkout debugging', color: 'orange' })
    const listedOrigins = await first.callTool({
      name: 'browser_workspaces',
      arguments: { action: 'list-origins', workspaceId: firstGroupId }
    }) as CallToolResult
    expect(listedOrigins.isError, text(listedOrigins)).not.toBe(true)
    expect(JSON.parse(text(listedOrigins))).toEqual([])
    const imported = await first.callTool({
      name: 'browser_workspaces',
      arguments: { action: 'import-default', workspaceId: firstGroupId, origins: [] }
    }) as CallToolResult
    expect(imported.isError, text(imported)).not.toBe(true)
    expect(JSON.parse(text(imported))).toMatchObject({
      workspaceId: firstGroupId,
      direction: 'from-default',
      cookieCount: 0,
      localStorageItemCount: 0
    })

    const firstOpened = await first.callTool({
      name: 'browser_new_tab',
      arguments: { workspaceId: firstGroupId, url: 'data:text/html,<title>Checkout workspace</title><h1>Checkout</h1>' }
    }) as CallToolResult
    const firstState = JSON.parse(text(firstOpened)) as { activeTabId: string; tabs: Array<{ id: string; workspaceId: string }> }
    const firstTabId = firstState.activeTabId
    expect(firstTabId).toMatch(UUID_V7_PATTERN)
    expect(firstState.tabs).toEqual([expect.objectContaining({ id: firstTabId, workspaceId: firstGroupId })])
    const malformedTabId = await first.callTool({
      name: 'browser_select_tab',
      arguments: { workspaceId: firstGroupId, tabId: 'not-a-uuid-v7' }
    }) as CallToolResult
    expect(malformedTabId.isError).toBe(true)
    expect(text(malformedTabId)).toContain('Tab ID must be a UUIDv7')

    const secondOpened = await second.callTool({
      name: 'browser_new_tab',
      arguments: { workspaceId: secondGroupId, url: 'data:text/html,<title>Docs workspace</title><h1>Docs</h1>' }
    }) as CallToolResult
    const secondTabId = (JSON.parse(text(secondOpened)) as { activeTabId: string }).activeTabId

    await appWindow.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Human default tab</title><h1>Human</h1>', active: true })`)
    await appWindow.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Another human tab</title><h1>Human two</h1>', active: false })`)
    const humanState = await appWindow.evaluate(`window.bronom.getState()`) as BrowserState
    const defaultGroup = humanState.mcpTabGroups.find((group) => group.isDefault)
    expect(defaultGroup).toMatchObject({ name: 'Default', color: 'gray', isDefault: true, tabCount: 2 })
    expect(humanState.tabs.filter((tab) => tab.mcpGroupId === defaultGroup?.id)).toHaveLength(2)
    await expect(appWindow.locator('.tab-group-label', { hasText: 'Default' })).toContainText('Default')

    const firstTabs = await first.callTool({ name: 'browser_tabs', arguments: { workspaceId: firstGroupId } }) as CallToolResult
    expect(JSON.parse(text(firstTabs))).toEqual([expect.objectContaining({ id: firstTabId })])
    expect(text(firstTabs)).not.toContain(secondTabId)

    const crossGroupSnapshot = await second.callTool({
      name: 'browser_snapshot',
      arguments: { workspaceId: secondGroupId, tabId: firstTabId }
    }) as CallToolResult
    expect(crossGroupSnapshot.isError).toBe(true)
    expect(text(crossGroupSnapshot)).toContain('does not belong to workspace')

    await expect(appWindow.locator('.tab-group-label', { hasText: 'Checkout debugging' })).toBeVisible()
    await expect(appWindow.locator('.tab-group-label', { hasText: 'Documentation agent' })).toBeVisible()

    await first.callTool({
      name: 'browser_evaluate',
      arguments: {
        workspaceId: firstGroupId,
        tabId: firstTabId,
        script: "window.open('data:text/html,<title>Checkout popup</title><h1>Popup</h1>'); true"
      }
    })
    await expect.poll(async () => {
      const result = await first.callTool({ name: 'browser_tabs', arguments: { workspaceId: firstGroupId } }) as CallToolResult
      return (JSON.parse(text(result)) as unknown[]).length
    }).toBe(2)
  } finally {
    await first.close()
    await second.close()
  }
})

test('rejects duplicate human names instead of reusing another workspace identity', async ({ mcpPort, mcpToken }) => {
  const first = await connectClient('same-name-first', mcpPort, mcpToken)
  const second = await connectClient('same-name-second', mcpPort, mcpToken)
  try {
    const firstWorkspaceId = await useMcpWorkspace(first, 'Shared test label', false)
    await expect(useMcpWorkspace(second, '  shared TEST label  ', false)).rejects.toThrow('already exists')
    const listed = await first.callTool({ name: 'browser_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect((JSON.parse(text(listed)) as Array<{ id: string; name: string }>).filter((workspace) => workspace.name === 'Shared test label')).toEqual([
      expect.objectContaining({ id: firstWorkspaceId })
    ])
  } finally {
    await first.close()
    await second.close()
  }
})

test('caps new and restored workspaces so profiles cannot grow without bound', async ({ mcpPort, mcpToken }) => {
  const client = await connectClient('workspace-limit', mcpPort, mcpToken)
  try {
    const archivedWorkspaceId = await createWorkspace(client, 'Archived at the limit')
    await client.callTool({
      name: 'browser_new_tab',
      arguments: { workspaceId: archivedWorkspaceId, url: 'data:text/html,<title>Archived limit tab</title>' }
    })
    const archiveResult = await client.callTool({
      name: 'browser_saved_workspaces',
      arguments: { action: 'save', workspaceId: archivedWorkspaceId }
    }) as CallToolResult
    expect(archiveResult.isError, text(archiveResult)).not.toBe(true)
    const archivedWorkspace = JSON.parse(text(archiveResult)) as { id: string }

    for (let index = 1; index < 50; index += 1) {
      const result = await client.callTool({
        name: 'browser_workspaces',
        arguments: { action: 'create', name: `Bounded workspace ${index}` }
      }) as CallToolResult
      expect(result.isError, text(result)).not.toBe(true)
    }
    const overflow = await client.callTool({
      name: 'browser_workspaces',
      arguments: { action: 'create', name: 'Workspace over the limit' }
    }) as CallToolResult
    expect(overflow.isError).toBe(true)
    expect(text(overflow)).toContain('up to 50 active workspaces')

    const restoredOverflow = await client.callTool({
      name: 'browser_saved_workspaces',
      arguments: { action: 'open', savedWorkspaceId: archivedWorkspace.id }
    }) as CallToolResult
    expect(restoredOverflow.isError).toBe(true)
    expect(text(restoredOverflow)).toContain('up to 50 active workspaces')
    const savedAfterRejectedRestore = await client.callTool({
      name: 'browser_saved_workspaces',
      arguments: { action: 'list' }
    }) as CallToolResult
    expect(JSON.parse(text(savedAfterRejectedRestore))).toContainEqual(expect.objectContaining({ id: archivedWorkspace.id }))
  } finally {
    await client.close()
  }
})

test('archives an agent workspace and reopens it with a fresh workspace id', async ({ mcpPort, mcpToken }) => {
  const client = await connectClient('saved-group-test', mcpPort, mcpToken)
  try {
    const workspaceId = await createWorkspace(client, 'Deferred investigation', 'pink')
    await client.callTool({
      name: 'browser_new_tab',
      arguments: { workspaceId, url: 'data:text/html,<title>Deferred tab</title><h1>Later</h1>' }
    })
    const savedResult = await client.callTool({
      name: 'browser_saved_workspaces',
      arguments: { action: 'save', workspaceId }
    }) as CallToolResult
    expect(savedResult.isError, text(savedResult)).not.toBe(true)
    const saved = JSON.parse(text(savedResult)) as { id: string; name: string; color: string; tabs: Array<{ url: string }> }
    expect(saved.id).toMatch(UUID_V7_PATTERN)
    expect(saved).toMatchObject({ name: 'Deferred investigation', color: 'pink' })
    expect(saved.tabs).toEqual([expect.objectContaining({ url: expect.stringContaining('<title>Deferred tab</title>') })])

    const activeGroups = await client.callTool({ name: 'browser_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(activeGroups))).not.toContainEqual(expect.objectContaining({ id: workspaceId }))
    const listedSaved = await client.callTool({ name: 'browser_saved_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(listedSaved))).toContainEqual(expect.objectContaining({ id: saved.id, name: 'Deferred investigation' }))

    const openedResult = await client.callTool({
      name: 'browser_saved_workspaces',
      arguments: { action: 'open', savedWorkspaceId: saved.id }
    }) as CallToolResult
    expect(openedResult.isError, text(openedResult)).not.toBe(true)
    const opened = JSON.parse(text(openedResult)) as { id: string; name: string; color: string; tabCount: number }
    expect(opened).toMatchObject({ name: 'Deferred investigation', color: 'pink', tabCount: 1 })
    expect(opened.id).toMatch(UUID_V7_PATTERN)
    expect(opened.id).not.toBe(workspaceId)
    const emptySaved = await client.callTool({ name: 'browser_saved_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(emptySaved))).toEqual([])
  } finally {
    await client.close()
  }
})

test('restores workspace identity and tabs after an application restart', async ({ profileDirectory, mcpPort }) => {
  let instance = await launchBronom(profileDirectory, mcpPort)
  const token = (await readFile(join(profileDirectory, 'mcp-token'), 'utf8')).trim()
  const firstClient = await connectClient('group-restart-before', mcpPort, token)
  const workspaceId = await createWorkspace(firstClient, 'Persistent investigation', 'green')
  const opened = await firstClient.callTool({
    name: 'browser_new_tab',
    arguments: { workspaceId, url: 'data:text/html,<title>Persistent grouped tab</title><h1>Still here</h1>' }
  }) as CallToolResult
  const tabId = (JSON.parse(text(opened)) as { activeTabId: string }).activeTabId
  await instance.window.evaluate(`window.bronom.newTab({ url: 'data:text/html,<title>Persistent human tab</title><h1>Mine</h1>', active: false })`)
  const defaultGroupId = await instance.window.evaluate(`window.bronom.getState().then((state) => state.mcpTabGroups.find((group) => group.isDefault)?.id)`) as string
  const groupControl = instance.window.locator('.tab-group-label', { hasText: 'Persistent investigation' })
  await expect(groupControl).toHaveAttribute('aria-expanded', 'true')
  await expect(groupControl).toHaveAccessibleName('Collapse workspace Persistent investigation, 1 tab')
  await groupControl.click()
  await expect(groupControl).toHaveAttribute('aria-expanded', 'false')
  await expect(instance.window.getByRole('tab', { name: /^Persistent grouped tab/ })).toBeHidden()
  expect(await instance.window.evaluate('JSON.parse(localStorage.getItem("bronom:collapsed-tab-groups"))')).toEqual([workspaceId])
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
    await expect(restoredGroupControl).toHaveAccessibleName('Expand workspace Persistent investigation, 1 tab')
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
    const listed = await secondClient.callTool({ name: 'browser_workspaces', arguments: { action: 'list' } }) as CallToolResult
    expect(JSON.parse(text(listed))).toContainEqual(expect.objectContaining({
      id: workspaceId,
      name: 'Persistent investigation',
      color: 'green',
      tabCount: 1,
      activeTabId: tabId
    }))
    const status = await secondClient.callTool({ name: 'browser_status', arguments: { workspaceId } }) as CallToolResult
    expect(JSON.parse(text(status))).toMatchObject({
      activeTabId: tabId,
      tabs: [expect.objectContaining({ id: tabId, workspaceId })]
    })
  } finally {
    await secondClient.close()
    await closeBronom(instance.app)
  }
})

test('drops legacy tab state and starts with a fresh UUIDv7 workspace format', async ({ profileDirectory, mcpPort }) => {
  await writeFile(join(profileDirectory, 'tabs.json'), `${JSON.stringify({
    activeTabId: 'legacy-human-tab',
    splitView: {
      firstTabId: 'legacy-human-tab',
      secondTabId: 'legacy-agent-tab',
      orientation: 'vertical',
      ratio: 0.5
    },
    mcpTabGroups: [
      {
        id: '8a513dbb-7f70-451e-8e27-f6c1d92168aa',
        name: 'Legacy agent workspace',
        color: 'cyan',
        createdAt: '2026-08-14T09:00:00.000Z',
        lastUsedAt: '2026-08-14T09:01:00.000Z'
      }
    ],
    tabs: [
      {
        id: 'legacy-human-tab',
        title: 'Legacy human tab',
        url: 'data:text/html,<title>Legacy human tab</title><h1>Legacy</h1>'
      },
      {
        id: 'legacy-agent-tab',
        title: 'Legacy agent tab',
        url: 'data:text/html,<title>Legacy agent tab</title><h1>Agent</h1>',
        mcpGroupId: '8a513dbb-7f70-451e-8e27-f6c1d92168aa'
      }
    ]
  }, null, 2)}\n`, 'utf8')

  const instance = await launchBronom(profileDirectory, mcpPort)
  try {
    const fresh = await instance.window.evaluate(`window.bronom.getState().then((state) => ({
      defaultWorkspaceId: state.mcpTabGroups.find((workspace) => workspace.isDefault)?.id,
      workspaceNames: state.mcpTabGroups.map((workspace) => workspace.name),
      activeTabId: state.activeTabId,
      splitView: state.splitView,
      tabs: state.tabs.map((tab) => ({ id: tab.id, title: tab.title, url: tab.url }))
    }))`) as {
      defaultWorkspaceId?: string
      workspaceNames: string[]
      activeTabId?: string
      splitView?: { firstTabId: string; secondTabId: string }
      tabs: Array<{ id: string; title: string; url: string }>
    }
    expect(fresh.defaultWorkspaceId).toMatch(UUID_V7_PATTERN)
    expect(fresh.workspaceNames).toEqual(['Default'])
    expect(fresh.splitView).toBeUndefined()
    expect(fresh.tabs).toEqual([expect.objectContaining({
      id: expect.stringMatching(UUID_V7_PATTERN),
      title: 'Bronom Home',
      url: 'bronom://home/'
    })])
    expect(fresh.activeTabId).toBe(fresh.tabs[0]!.id)
    await expect.poll(async () => {
      const persisted = JSON.parse(await readFile(join(profileDirectory, 'tabs.json'), 'utf8')) as {
        version?: number
        tabs?: Array<{ id: string; title: string }>
        mcpTabGroups?: Array<{ id: string; name: string }>
      }
      return persisted
    }).toMatchObject({
      version: 2,
      tabs: [expect.objectContaining({ id: expect.stringMatching(UUID_V7_PATTERN), title: 'Bronom Home' })],
      mcpTabGroups: [expect.objectContaining({ id: expect.stringMatching(UUID_V7_PATTERN), name: 'Default' })]
    })
  } finally {
    await closeBronom(instance.app)
  }
})
