import type { Client } from '@modelcontextprotocol/sdk/client/index.js'

export function useMcpTabGroup(client: Client, name: string, ensureTab?: boolean): Promise<string>
