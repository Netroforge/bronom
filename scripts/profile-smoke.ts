import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { useMcpTabGroup } from './mcp-tab-group.js'

type ProfilePhase = 'write' | 'read' | 'cleanup'

interface ProfileResult {
  storage: string | null
  cookie: string
}

interface BrowserTabResult {
  id: string
}

interface BrowserStateResult {
  activeTabId: string | null
  tabs: BrowserTabResult[]
}

const phase = process.argv[2]
if (phase !== 'write' && phase !== 'read' && phase !== 'cleanup') {
  throw new Error('Use phase "write", "read", or "cleanup".')
}
const typedPhase: ProfilePhase = phase

const endpoint = new URL(process.env.BRONOM_MCP_URL || 'http://127.0.0.1:47812/mcp')
const pageUrl = process.env.BRONOM_PROFILE_SMOKE_URL || 'http://127.0.0.1:47813/'
const token = process.env.BRONOM_MCP_TOKEN
if (!token) throw new Error('Set BRONOM_MCP_TOKEN to the token for the running Bronom profile.')
const client = new Client({ name: 'bronom-profile-smoke', version: '1.0.0' })
await client.connect(new StreamableHTTPClientTransport(endpoint, {
  requestInit: { headers: { authorization: `Bearer ${token}` } }
}))
const groupId = await useMcpTabGroup(client, 'Profile smoke')

function text(result: CallToolResult): string {
  const content = result.content.find((item) => item.type === 'text')
  return content?.type === 'text' ? content.text : ''
}

try {
  const navigation = await client.callTool({ name: 'browser_navigate', arguments: { url: pageUrl } }) as CallToolResult
  if (navigation.isError) throw new Error(text(navigation))

  const script =
    typedPhase === 'write'
      ? `(() => {
          localStorage.setItem('bronom.profile-smoke', 'persisted');
          document.cookie = 'bronom_profile_smoke=persisted; Path=/; Max-Age=3600; SameSite=Lax';
          return { storage: localStorage.getItem('bronom.profile-smoke'), cookie: document.cookie };
        })()`
      : typedPhase === 'read'
        ? `(() => ({
          storage: localStorage.getItem('bronom.profile-smoke'),
          cookie: document.cookie
        }))()`
        : `(() => {
            localStorage.removeItem('bronom.profile-smoke');
            document.cookie = 'bronom_profile_smoke=; Path=/; Max-Age=0; SameSite=Lax';
            return { storage: localStorage.getItem('bronom.profile-smoke'), cookie: document.cookie };
          })()`
  const evaluated = await client.callTool({ name: 'browser_evaluate', arguments: { script } }) as CallToolResult
  if (evaluated.isError) throw new Error(text(evaluated))
  const result = JSON.parse(text(evaluated)) as ProfileResult
  if (typedPhase !== 'cleanup' && (result.storage !== 'persisted' || !result.cookie.includes('bronom_profile_smoke=persisted'))) {
    throw new Error(`Persistent profile check failed: ${JSON.stringify(result)}`)
  }
  if (typedPhase === 'cleanup') {
    const closed = await client.callTool({
      name: 'browser_tab_groups',
      arguments: { action: 'close', groupId }
    }) as CallToolResult
    if (closed.isError) throw new Error(text(closed))
    console.log('Persistent profile smoke data and its tab group were removed.')
  } else {
    console.log(`Persistent profile ${typedPhase} phase passed: localStorage and cookie are present.`)
  }
} finally {
  await client.close()
}
