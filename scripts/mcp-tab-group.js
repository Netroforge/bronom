function text(result) {
  const content = result.content.find((item) => item.type === 'text')
  return content?.type === 'text' ? content.text : ''
}

export async function useMcpTabGroup(client, name, ensureTab = true) {
  const callTool = client.callTool.bind(client)
  const listed = await callTool({ name: 'browser_tab_groups', arguments: { action: 'list' } })
  if (listed.isError) throw new Error(text(listed))
  const groups = JSON.parse(text(listed))
  let group = groups.find((candidate) => candidate.name === name)
  if (!group) {
    const created = await callTool({ name: 'browser_tab_groups', arguments: { action: 'create', name } })
    if (created.isError) throw new Error(text(created))
    group = JSON.parse(text(created))
  }

  const groupId = group.id
  client.callTool = (request, ...rest) => callTool(
    request.name === 'browser_tab_groups'
      ? request
      : { ...request, arguments: { ...(request.arguments ?? {}), groupId } },
    ...rest
  )

  if (ensureTab && group.tabCount === 0) {
    const opened = await client.callTool({ name: 'browser_new_tab', arguments: { active: true } })
    if (opened.isError) throw new Error(text(opened))
    const ready = await client.callTool({ name: 'browser_wait', arguments: { timeoutMs: 5_000 } })
    if (ready.isError) throw new Error(text(ready))
  }
  return groupId
}
