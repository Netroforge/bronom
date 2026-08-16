import { isReleaseAssetTarget, matchingReleaseAsset } from '../src/shared/release-assets'

interface ClientConfiguration {
  location: string
  code: string
}

interface GitHubReleaseAsset {
  name: string
  browser_download_url: string
}

interface GitHubRelease {
  assets: GitHubReleaseAsset[]
}

const endpoint = 'http://127.0.0.1:47812/mcp'
const token = '<token from Bronom Home>'
const configurations: Record<string, ClientConfiguration> = {
  codex: {
    location: 'Command line',
    code: `export BRONOM_MCP_TOKEN="${token}"\ncodex mcp add bronom --url ${endpoint} --bearer-token-env-var BRONOM_MCP_TOKEN`
  },
  claude: {
    location: 'Command line',
    code: `claude mcp add --transport http --scope user --header "Authorization: Bearer ${token}" bronom ${endpoint}`
  },
  cursor: {
    location: '~/.cursor/mcp.json',
    code: JSON.stringify({ mcpServers: { bronom: { url: endpoint, headers: { Authorization: `Bearer ${token}` } } } }, null, 2)
  },
  vscode: {
    location: '.vscode/mcp.json',
    code: JSON.stringify({ servers: { bronom: { type: 'http', url: endpoint, headers: { Authorization: `Bearer ${token}` } } } }, null, 2)
  }
}

const configCode = document.querySelector<HTMLElement>('#config-code')
const configLocation = document.querySelector<HTMLElement>('#config-location')
const copyConfig = document.querySelector<HTMLButtonElement>('#copy-config')

function selectClient(id: string): void {
  const configuration = configurations[id]
  if (!configuration || !configCode || !configLocation) return
  configCode.textContent = configuration.code
  configLocation.textContent = configuration.location
  document.querySelectorAll<HTMLButtonElement>('[data-client]').forEach((button) => {
    const active = button.dataset.client === id
    button.classList.toggle('active', active)
    button.setAttribute('aria-selected', String(active))
  })
}

document.querySelectorAll<HTMLButtonElement>('[data-client]').forEach((button) => {
  button.addEventListener('click', () => selectClient(button.dataset.client ?? 'codex'))
})

const featureGrid = document.querySelector<HTMLElement>('#feature-grid')
const featureToggle = document.querySelector<HTMLButtonElement>('#feature-toggle')

if (featureGrid && featureToggle) {
  const capabilityCount = featureGrid.querySelectorAll(':scope > article').length
  const setFeaturesExpanded = (expanded: boolean): void => {
    featureGrid.classList.toggle('features-collapsed', !expanded)
    featureToggle.setAttribute('aria-expanded', String(expanded))
    featureToggle.textContent = expanded ? 'Show fewer capabilities' : `Show all ${capabilityCount} capabilities`
  }

  featureToggle.hidden = false
  setFeaturesExpanded(false)
  featureToggle.addEventListener('click', () => {
    setFeaturesExpanded(featureToggle.getAttribute('aria-expanded') !== 'true')
  })
}

copyConfig?.addEventListener('click', async () => {
  if (!configCode) return
  await navigator.clipboard.writeText(configCode.textContent ?? '')
  const original = copyConfig.textContent
  copyConfig.textContent = 'Copied'
  window.setTimeout(() => (copyConfig.textContent = original), 1_200)
})

const releaseApi = 'https://api.github.com/repos/Netroforge/bronom/releases/latest'
document.querySelectorAll<HTMLAnchorElement>('[data-download]').forEach((link) => {
  link.addEventListener('click', async (event) => {
    event.preventDefault()
    const fallback = link.href
    const status = document.querySelector<HTMLElement>('#download-status')
    const target = link.dataset.download
    link.setAttribute('aria-busy', 'true')
    if (status) status.textContent = 'Finding the latest release asset on GitHub…'
    try {
      const response = await fetch(releaseApi, { headers: { Accept: 'application/vnd.github+json' } })
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
      const release = (await response.json()) as GitHubRelease
      const asset = isReleaseAssetTarget(target) ? matchingReleaseAsset(release.assets, target) : undefined
      if (!asset) throw new Error('No matching release asset was found')
      window.location.assign(asset.browser_download_url)
    } catch {
      window.location.assign(fallback)
    } finally {
      link.removeAttribute('aria-busy')
    }
  })
})

selectClient('codex')
