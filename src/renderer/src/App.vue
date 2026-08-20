<script setup lang="ts">
import { bind as bindFoley, play as playFoley, set as setFoley } from '@foleyjs/core'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatReproAsPlaywright } from '../../shared/repro-export'
import IconAdd from '~icons/material-symbols/add-rounded'
import IconAdsClick from '~icons/material-symbols/ads-click-rounded'
import IconAccountTree from '~icons/material-symbols/account-tree-rounded'
import IconAccessibility from '~icons/material-symbols/accessibility-new-rounded'
import IconArrowBack from '~icons/material-symbols/arrow-back-rounded'
import IconArrowForward from '~icons/material-symbols/arrow-forward-rounded'
import IconBugReport from '~icons/material-symbols/bug-report-rounded'
import IconBedtime from '~icons/material-symbols/bedtime-rounded'
import IconCheck from '~icons/material-symbols/check-rounded'
import IconClose from '~icons/material-symbols/close-rounded'
import IconContrast from '~icons/material-symbols/contrast-rounded'
import IconCopy from '~icons/material-symbols/content-copy-rounded'
import IconCookie from '~icons/material-symbols/cookie-rounded'
import IconDatabase from '~icons/material-symbols/database-rounded'
import IconDelete from '~icons/material-symbols/delete-outline-rounded'
import IconDashboard from '~icons/material-symbols/space-dashboard-rounded'
import IconDevices from '~icons/material-symbols/devices-rounded'
import IconDifference from '~icons/material-symbols/difference-rounded'
import IconDownload from '~icons/material-symbols/download-rounded'
import IconDownloadDone from '~icons/material-symbols/download-done-rounded'
import IconEdit from '~icons/material-symbols/edit-rounded'
import IconError from '~icons/material-symbols/error-outline-rounded'
import IconFavorite from '~icons/material-symbols/favorite-rounded'
import IconFactCheck from '~icons/material-symbols/fact-check-rounded'
import IconFolderOpen from '~icons/material-symbols/folder-open-rounded'
import IconInfo from '~icons/material-symbols/info-rounded'
import IconHistory from '~icons/material-symbols/history-rounded'
import IconHandyman from '~icons/material-symbols/handyman-rounded'
import IconHorizontalSplit from '~icons/material-symbols/horizontal-split-rounded'
import IconKeyboardArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded'
import IconKeyboardArrowRight from '~icons/material-symbols/keyboard-arrow-right-rounded'
import IconKeyboardArrowUp from '~icons/material-symbols/keyboard-arrow-up-rounded'
import IconKeyboardCommandKey from '~icons/material-symbols/keyboard-command-key-rounded'
import IconCleaning from '~icons/material-symbols/cleaning-services-rounded'
import IconCode from '~icons/material-symbols/code-rounded'
import IconKeep from '~icons/material-symbols/keep-rounded'
import IconLanguage from '~icons/material-symbols/language-rounded'
import IconMonitoring from '~icons/material-symbols/monitoring-rounded'
import IconMemory from '~icons/material-symbols/memory-rounded'
import IconNetworkCheck from '~icons/material-symbols/network-check-rounded'
import IconOffline from '~icons/material-symbols/offline-bolt-rounded'
import IconKey from '~icons/material-symbols/key-rounded'
import IconLock from '~icons/material-symbols/lock-rounded'
import IconLockOpen from '~icons/material-symbols/lock-open-rounded'
import IconRemove from '~icons/material-symbols/remove-rounded'
import IconPassword from '~icons/material-symbols/password-rounded'
import IconPalette from '~icons/material-symbols/palette-rounded'
import IconPieChart from '~icons/material-symbols/pie-chart-rounded'
import IconPause from '~icons/material-symbols/pause-rounded'
import IconPdf from '~icons/material-symbols/picture-as-pdf-rounded'
import IconPlay from '~icons/material-symbols/play-arrow-rounded'
import IconProgress from '~icons/material-symbols/progress-activity-rounded'
import IconPrivacy from '~icons/material-symbols/privacy-tip-rounded'
import IconRefresh from '~icons/material-symbols/refresh-rounded'
import IconRestore from '~icons/material-symbols/restore-page-rounded'
import IconRecord from '~icons/material-symbols/fiber-manual-record-rounded'
import IconReplay from '~icons/material-symbols/replay-rounded'
import IconRoute from '~icons/material-symbols/route-rounded'
import IconSearch from '~icons/material-symbols/search-rounded'
import IconScreenshotRegion from '~icons/material-symbols/screenshot-region-rounded'
import IconScreenRotation from '~icons/material-symbols/screen-rotation-alt-rounded'
import IconSettings from '~icons/material-symbols/settings-rounded'
import IconSpeed from '~icons/material-symbols/speed-rounded'
import IconStar from '~icons/material-symbols/star-rounded'
import IconStarOutline from '~icons/material-symbols/star-outline-rounded'
import IconShieldLock from '~icons/material-symbols/shield-lock-rounded'
import IconTune from '~icons/material-symbols/tune-rounded'
import IconStop from '~icons/material-symbols/stop-rounded'
import IconSystemUpdate from '~icons/material-symbols/system-update-alt-rounded'
import IconTabSearch from '~icons/material-symbols/tab-search-rounded'
import IconWorkspaces from '~icons/material-symbols/workspaces-rounded'
import IconTerminal from '~icons/material-symbols/terminal-rounded'
import IconSwapHoriz from '~icons/material-symbols/swap-horiz-rounded'
import IconVerticalSplit from '~icons/material-symbols/vertical-split-rounded'
import IconWarning from '~icons/material-symbols/warning-rounded'
import IconVolumeOff from '~icons/material-symbols/volume-off-rounded'
import IconVolumeUp from '~icons/material-symbols/volume-up-rounded'
import IconZoomIn from '~icons/material-symbols/zoom-in-rounded'
import {
  ATTENTION_SOUND_CUES,
  BROWSER_NETWORK_ABORT_REASONS,
  DETACHABLE_PANEL_IDS,
  PANEL_DOCKS,
  type AttentionSoundCue,
  AppSettings,
  AppUpdateState,
  BrowserAccessibilityAudit,
  BrowserAccessibilityImpact,
  BrowserQualityAudit,
  BrowserPerformanceMetric,
  BrowserPerformanceMetricName,
  BrowserPerformanceAction,
  BrowserPerformanceComparisonMetric,
  BrowserPerformanceComparisonMetricName,
  BrowserPerformanceReport,
  BrowserPerformanceScriptContributor,
  BrowserDesignOverviewReport,
  BrowserPageMetadataReport,
  BrowserSecurityReport,
  BrowserCodeCoverageMode,
  BrowserCodeCoverageResult,
  BrowserCpuProfileResult,
  BrowserMemoryReport,
  BrowserReproRecording,
  BrowserDomChangeEntry,
  BrowserDomChangesReport,
  BrowserVisualCompareView,
  BrowserDebugReport,
  BrowserConsoleMessage,
  BrowserEnvironmentSettings,
  BrowserInspectorIssuesReport,
  BrowserNetworkHar,
  BrowserNetworkHarExport,
  BrowserNetworkSearchMatch,
  BrowserNetworkSearchResult,
  BrowserNetworkAbortReason,
  BrowserNetworkRouteInput,
  BrowserNetworkRouteSummary,
  BrowserNetworkRequest,
  BrowserNetworkRequestDetails,
  BrowserNetworkRequestSortBy,
  BrowserNetworkRequestSortDirection,
  BrowserState,
  BrowserEmulationState,
  BrowserViewportEmulation,
  BrowserViewportOrientation,
  BrowserViewportPresetId,
  BrowserClosedTabState,
  BrowserSavedTabGroupState,
  BrowserTabState,
  BrowserTabGroupColor,
  BrowserFindResult,
  BrowserPdfExport,
  BrowserDownloadState,
  BrowserBookmark,
  BrowserHistoryEntry,
  BrowserStorageItem,
  BrowserStorageKind,
  BrowserStorageResult,
  BrowserStorageUsageReport,
  BrowserIndexedDbReport,
  BrowserPwaReport,
  BrowserStorageChange,
  BrowserStorageChangesAction,
  BrowserStorageChangesReport,
  BrowsingDataClearOptions,
  BrowsingDataSiteSummary,
  BrowsingDataSummary,
  BrowsingDataWebsiteSummary,
  HelpMenuAction,
  McpTabActivity,
  McpControlState,
  CredentialStorageStatus,
  CredentialSummary,
  CommercialLicenseState,
  DetachablePanelId,
  PanelDock,
  SitePermissionDecision,
  SitePermissionEntry,
  SearchEngineName,
  ThemeName
} from '../../shared/types'
import {
  BROWSER_TAB_GROUP_COLORS,
  BROWSER_TAB_GROUP_COLOR_HEX,
  defaultTabGroupColor,
  tabGroupColorLabel
} from '../../shared/tab-groups'
import {
  canFormatNetworkRequestCopy,
  formatNetworkRequestCopy,
  type BrowserNetworkRequestCopyFormat
} from '../../shared/network-request-copy'
import { sortNetworkRequests } from '../../shared/network-request-sort'
import { networkReplayRequiresConfirmation } from '../../shared/network-replay'
import {
  networkResponseSourceLabel,
  serviceWorkerResponseSourceLabel
} from '../../shared/network-response-source'
import {
  buildNetworkWaterfallRange,
  networkWaterfallPosition
} from '../../shared/network-waterfall'
import UpdateNotification from './components/UpdateNotification.vue'
import {
  shellHeightForBrowserContent,
  shouldShowUpdateStatusPill,
  shouldAutoDismissUpdateStatus,
  UPDATE_STATUS_DISMISS_MS
} from '../../shared/update-presentation'
import { browserShortcutAction, type BrowserShortcutAction } from '../../shared/browser-shortcuts'
import {
  filterCommandPaletteCommands,
  type CommandPaletteCommand,
  type CommandPaletteCommandId
} from '../../shared/command-palette'
import {
  DEFAULT_MEMORY_SAVER_TIMEOUT_MINUTES,
  MEMORY_SAVER_TIMEOUT_MINUTES,
  type MemorySaverTimeoutMinutes
} from '../../shared/memory-saver'
import {
  buildLocalAddressSuggestions,
  type AddressSuggestion,
  type AddressSuggestionOverlayRequest,
  type AddressSuggestionOverlayTheme
} from '../../shared/address-suggestions'
import { DEFAULT_MCP_PORT, MAX_MCP_PORT, MIN_MCP_PORT, isValidMcpPort } from '../../shared/mcp-port'
import { SEARCH_ENGINE_OPTIONS } from '../../shared/search-engine'
import {
  DEFAULT_INTERFACE_SCALE,
  INTERFACE_SCALE_OPTIONS,
  type InterfaceScale
} from '../../shared/interface-scale'
import type { BrowserSplitOrientation } from '../../shared/split-view'
import {
  BROWSER_VIEWPORT_PRESETS,
  matchingViewportPreset,
  resolveViewportPreset
} from '../../shared/viewport-presets'
import {
  filterNetworkRequests,
  isNetworkRequestFailure,
  networkResourceCategory,
  normalizeNetworkHarOptions
} from '../../shared/network-har'
import {
  browserConsoleLevel,
  countConsoleEvents,
  countConsoleMessages,
  filterConsoleMessages,
  type BrowserConsoleLevelFilter
} from '../../shared/console-messages'
import {
  browserEnvironmentFromEmulation,
  browserEnvironmentOverrideCount,
  isBrowserEnvironmentSettings
} from '../../shared/browser-environment'

function isPanelDock(value: string | null): value is PanelDock {
  return value !== null && (PANEL_DOCKS as readonly string[]).includes(value)
}

function isDetachablePanelId(value: string | null): value is DetachablePanelId {
  return value !== null && (DETACHABLE_PANEL_IDS as readonly string[]).includes(value)
}

function detachedPanelLabel(panel: DetachablePanelId): string {
  const labels: Record<DetachablePanelId, string> = {
    'site-controls': 'Site controls',
    'site-storage': 'Site storage',
    'page-tools': 'Page tools',
    'responsive-preview': 'Responsive preview',
    environment: 'Environment',
    accessibility: 'Accessibility',
    'quality-audit': 'Quality audit',
    performance: 'Performance',
    'design-overview': 'Design overview',
    'page-metadata': 'Page metadata',
    security: 'Security',
    coverage: 'Code coverage',
    'cpu-profile': 'JavaScript CPU profile',
    memory: 'Memory',
    console: 'Console',
    network: 'Network monitor',
    'debug-report': 'Debug report',
    'repro-recorder': 'Repro recorder',
    'dom-changes': 'DOM changes',
    'visual-compare': 'Visual compare',
    issues: 'Issues',
    bookmarks: 'Bookmarks'
  }
  return labels[panel]
}

function detachedPanelTitle(panel: DetachablePanelId): string {
  return `${detachedPanelLabel(panel)} — Bronom`
}

const PanelDockPicker = defineComponent({
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, required: true }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('label', { class: 'panel-dock-picker' }, [
      h('span', 'Dock'),
      h('select', {
        value: props.modelValue,
        'aria-label': props.label,
        onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLSelectElement).value)
      }, [
        h('option', { value: 'right' }, 'Right'),
        h('option', { value: 'left' }, 'Left'),
        h('option', { value: 'bottom' }, 'Bottom'),
        h('option', { value: 'top' }, 'Top'),
        h('option', { value: 'window' }, 'Separate window')
      ])
    ])
  }
})

const emptyState: BrowserState = {
  tabs: [],
  closedTabs: [],
  activeTabId: null,
  allHumanInteractionLocked: false,
  mcpUrl: '',
  profilePath: '',
  mcpTabGroups: [],
  savedTabGroups: []
}
const browser = window.bronom
const detachedPanelParameter = new URLSearchParams(window.location.search).get('bronomPanel')
const detachedPanelId = isDetachablePanelId(detachedPanelParameter) ? detachedPanelParameter : null
const isDetachedPanelWindow = detachedPanelId !== null
if (detachedPanelId) {
  document.documentElement.dataset.panelWindow = 'true'
  document.title = detachedPanelTitle(detachedPanelId)
}
const savedPanelDock = window.localStorage.getItem('bronom:panel-dock')
const panelDock = ref<PanelDock>(isDetachedPanelWindow ? 'window' : isPanelDock(savedPanelDock) ? savedPanelDock : 'right')
const panelDockSize = ref(480)
const savedHorizontalPanelSize = Number(window.localStorage.getItem('bronom:panel-dock-size-horizontal'))
const savedVerticalPanelSize = Number(window.localStorage.getItem('bronom:panel-dock-size-vertical'))
const panelDockHorizontalSize = ref<number | null>(Number.isFinite(savedHorizontalPanelSize) && savedHorizontalPanelSize > 0 ? savedHorizontalPanelSize : null)
const panelDockVerticalSize = ref<number | null>(Number.isFinite(savedVerticalPanelSize) && savedVerticalPanelSize > 0 ? savedVerticalPanelSize : null)
const panelResizeGesture = ref<{ pointerId: number; coordinate: number; size: number; handle: HTMLElement } | null>(null)

function keepsSeparatePanelOpen(): boolean {
  return isDetachedPanelWindow || panelDock.value === 'window'
}
const collapsedTabGroupIds = ref(new Set<string>(loadCollapsedTabGroupIds()))
const shellContentTop = ref(105)
const state = ref<BrowserState>(emptyState)
const settings = ref<AppSettings>({
  theme: 'system',
  interfaceScale: DEFAULT_INTERFACE_SCALE,
  searchEngine: 'google',
  hideInTray: true,
  attentionSound: true,
  attentionSoundCue: 'warning',
  mcpAuthentication: false,
  mcpPort: DEFAULT_MCP_PORT,
  downloadDirectory: null,
  askWhereToSaveDownloads: false,
  memorySaverEnabled: true,
  memorySaverTimeoutMinutes: DEFAULT_MEMORY_SAVER_TIMEOUT_MINUTES,
  checkForUpdatesOnStartup: true
})
const systemTheme = ref<'light' | 'dark'>('light')
const sitePermissions = ref<SitePermissionEntry[]>([])
const credentials = ref<CredentialSummary[]>([])
const credentialStorage = ref<CredentialStorageStatus>({ available: false, reason: 'Secure storage is initializing.' })
const credentialPickerOpen = ref(false)
const credentialPickerQuery = ref('')
const credentialPickerSelection = ref(0)
const credentialPickerInput = ref<HTMLInputElement | null>(null)
const credentialFillState = ref<'idle' | 'filling'>('idle')
const commercialLicense = ref<CommercialLicenseState>({
  status: 'not-activated',
  active: false,
  secureStorageAvailable: false
})
const commercialLicenseKey = ref('')
const commercialLicenseAction = ref<'idle' | 'activating' | 'refreshing' | 'deactivating'>('idle')
const commercialLicenseError = ref('')
const updateState = ref<AppUpdateState>({ status: 'idle', currentVersion: '' })
const mcpControl = ref<McpControlState>({ status: 'starting', paused: false })
const address = ref('')
const addressInput = ref<HTMLInputElement | null>(null)
const addressForm = ref<HTMLFormElement | null>(null)
const siteControlsButton = ref<HTMLButtonElement | null>(null)
const addressSuggestionsOpen = ref(false)
// Suggestions stay unselected until the user explicitly points at one or uses
// the arrow keys. Enter therefore preserves normal address-bar navigation.
const addressSuggestionSelection = ref(-1)
const shell = ref<HTMLElement | null>(null)
const findInput = ref<HTMLInputElement | null>(null)
const findOpen = ref(false)
const zoomOpen = ref(false)
const splitMenuOpen = ref(false)
const findQuery = ref('')
const findResult = ref<BrowserFindResult>({ activeMatchOrdinal: 0, matches: 0 })
const pdfExportState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const pdfExport = ref<BrowserPdfExport | null>(null)
const downloads = ref<BrowserDownloadState[]>([])
const downloadsOpen = ref(false)
const downloadActionError = ref('')
const bookmarks = ref<BrowserBookmark[]>([])
const bookmarksOpen = ref(false)
const bookmarkSearch = ref('')
const bookmarkError = ref('')
const editingBookmarkId = ref<string | null>(null)
const editingBookmarkTitle = ref('')
const visitHistory = ref<BrowserHistoryEntry[]>([])
const historyOpen = ref(false)
const historySearch = ref('')
const historyError = ref('')
const siteStorageOpen = ref(false)
const siteStorageKind = ref<BrowserStorageKind>('local-storage')
const siteStorageResult = ref<BrowserStorageResult | null>(null)
const siteStorageState = ref<'idle' | 'loading' | 'saving' | 'error'>('idle')
const siteStorageError = ref('')
const siteStorageSearch = ref('')
const siteStorageKey = ref('')
const siteStorageValue = ref('')
const siteStorageChangesOpen = ref(false)
const siteStorageChangesReport = ref<BrowserStorageChangesReport | null>(null)
const siteStorageChangesState = ref<'idle' | 'loading' | 'error'>('idle')
const siteStorageChangesError = ref('')
const siteStorageChangesCopied = ref(false)
const siteStorageUsageOpen = ref(false)
const siteStorageUsageReport = ref<BrowserStorageUsageReport | null>(null)
const siteStorageUsageState = ref<'idle' | 'loading' | 'error'>('idle')
const siteStorageUsageError = ref('')
const siteStorageUsageCopied = ref(false)
const siteStorageIndexedDbOpen = ref(false)
const siteStorageIndexedDbReport = ref<BrowserIndexedDbReport | null>(null)
const siteStorageIndexedDbState = ref<'idle' | 'loading' | 'error'>('idle')
const siteStorageIndexedDbError = ref('')
const siteStorageIndexedDbDatabase = ref('')
const siteStorageIndexedDbStore = ref('')
const siteStorageIndexedDbOffset = ref(0)
const siteStorageIndexedDbSearch = ref('')
const siteStorageIndexedDbCopied = ref(false)
const siteStoragePwaOpen = ref(false)
const siteStoragePwaReport = ref<BrowserPwaReport | null>(null)
const siteStoragePwaState = ref<'idle' | 'loading' | 'error'>('idle')
const siteStoragePwaError = ref('')
const siteStoragePwaCache = ref('')
const siteStoragePwaQuery = ref('')
const siteStoragePwaOffset = ref(0)
const siteStoragePwaCopied = ref(false)
const pageToolsOpen = ref(false)
const responsivePanelOpen = ref(false)
const responsivePresetId = ref<BrowserViewportPresetId | 'custom'>('phone')
const responsiveOrientation = ref<BrowserViewportOrientation>('portrait')
const responsiveWidth = ref(390)
const responsiveHeight = ref(844)
const responsiveDeviceScaleFactor = ref(3)
const responsiveMobile = ref(true)
const responsiveTouch = ref(true)
const responsiveState = ref<'idle' | 'applying' | 'applied' | 'error'>('idle')
const responsiveError = ref('')
const environmentPanelOpen = ref(false)
const environmentDraft = ref<BrowserEnvironmentSettings>(browserEnvironmentFromEmulation())
const environmentLocationEnabled = ref(false)
const environmentLatitude = ref(50.4501)
const environmentLongitude = ref(30.5234)
const environmentAccuracy = ref(100)
const environmentState = ref<'idle' | 'applying' | 'applied' | 'error'>('idle')
const environmentError = ref('')
const tabGroupEditorId = ref<string | null>(null)
const workspaceEditorOpen = ref(false)
const workspaceEditorMode = ref<'create' | 'edit'>('edit')
const tabGroupEditorName = ref('')
const tabGroupEditorColor = ref<BrowserTabGroupColor>('purple')
const tabGroupEditorError = ref('')
const workspaceStorageMode = ref<'scratch' | 'fork-default'>('scratch')
const workspaceTransferDirection = ref<'from-default' | 'to-default'>('from-default')
const workspaceOriginOptions = ref<string[]>([])
const workspaceSelectedOrigins = ref<string[]>([])
const workspaceStorageState = ref<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle')
const workspaceStorageMessage = ref('')
const browsingDataSummary = ref<BrowsingDataSummary | null>(null)
const browsingDataOptions = ref<BrowsingDataClearOptions>({ history: true, cookiesAndSiteData: false, cache: true })
const browsingDataState = ref<'idle' | 'loading' | 'clearing' | 'cleared' | 'error'>('idle')
const browsingDataMessage = ref('')
const janitorWebsites = ref<BrowsingDataWebsiteSummary[]>([])
const janitorSearch = ref('')
const janitorState = ref<'idle' | 'loading' | 'clearing' | 'cleared' | 'error'>('idle')
const janitorClearingOrigin = ref<string | null>(null)
const janitorMessage = ref('')
const siteControlsOpen = ref(false)
const siteDataSummary = ref<BrowsingDataSiteSummary | null>(null)
const siteDataState = ref<'idle' | 'loading' | 'error'>('idle')
const siteDataMessage = ref('')
const tabSearchOpen = ref(false)
const tabSearchQuery = ref('')
const tabSearchInput = ref<HTMLInputElement | null>(null)
const tabSearchSelection = ref(0)
const commandPaletteOpen = ref(false)
const commandPaletteQuery = ref('')
const commandPaletteInput = ref<HTMLInputElement | null>(null)
const commandPaletteSelection = ref(0)
const draggedTabId = ref<string | null>(null)
const tabDropTargetId = ref<string | null>(null)
const tabDropPlacement = ref<'before' | 'after' | null>(null)
const lastWebTabId = ref<string | null>(null)
const allInteractionLockButton = ref<HTMLButtonElement | null>(null)
const settingsPanel = ref<HTMLElement | null>(null)
const settingsOpen = ref(false)
const settingsSection = ref<'appearance' | 'search' | 'downloads' | 'performance' | 'mcp' | 'privacy' | 'permissions' | 'credentials' | 'updates' | 'support'>('appearance')
const helpDialog = ref<'shortcuts' | 'about' | null>(null)
const helpDialogPanel = ref<HTMLElement | null>(null)
const fullModalOpen = computed(() => settingsOpen.value
  || commandPaletteOpen.value
  || helpDialog.value !== null
  || workspaceEditorOpen.value
  || credentialPickerOpen.value)
const updateNoticeOpen = ref(false)
const mcpCopied = ref(false)
const mcpPortDraft = ref(String(DEFAULT_MCP_PORT))
const mcpPortState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const mcpPortMessage = ref('')
const defaultDownloadDirectory = ref('')
const downloadSettingsState = ref<'idle' | 'working' | 'saved' | 'error'>('idle')
const downloadSettingsMessage = ref('')
type ElementPickerMode = 'context' | 'screenshot'
type ScreenshotCaptureMode = 'area' | 'viewport' | 'full-page'
type AppToastTone = 'error' | 'success' | 'info'
interface AppToast {
  id: number
  tone: AppToastTone
  title: string
  message: string
}
const elementPickerState = ref<'idle' | 'picking' | 'copied' | 'error'>('idle')
const elementPickerMode = ref<ElementPickerMode>('context')
const pageSnapshotState = ref<'idle' | 'copying' | 'copied' | 'error'>('idle')
const areaCaptureState = ref<'idle' | 'picking' | 'capturing' | 'copied' | 'error'>('idle')
const screenshotCaptureMode = ref<ScreenshotCaptureMode>('area')
const areaCaptureError = ref('')
const appToasts = ref<AppToast[]>([])
const accessibilityAuditState = ref<'idle' | 'running' | 'complete' | 'error'>('idle')
const accessibilityAudit = ref<BrowserAccessibilityAudit | null>(null)
const accessibilityAuditError = ref('')
const accessibilityPanelOpen = ref(false)
const qualityAuditState = ref<'idle' | 'running' | 'complete' | 'error'>('idle')
const qualityAuditReport = ref<BrowserQualityAudit | null>(null)
const qualityAuditError = ref('')
const qualityAuditPanelOpen = ref(false)
const qualityAuditCopied = ref(false)
const performanceState = ref<'idle' | 'running' | 'complete' | 'error'>('idle')
const performanceReport = ref<BrowserPerformanceReport | null>(null)
const performanceError = ref('')
const performancePanelOpen = ref(false)
const designOverviewPanelOpen = ref(false)
const designOverviewReport = ref<BrowserDesignOverviewReport | null>(null)
const designOverviewState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const designOverviewError = ref('')
const pageMetadataPanelOpen = ref(false)
const pageMetadataReport = ref<BrowserPageMetadataReport | null>(null)
const pageMetadataState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const pageMetadataError = ref('')
const securityPanelOpen = ref(false)
const securityReport = ref<BrowserSecurityReport | null>(null)
const securityReportState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const securityReportError = ref('')
const coveragePanelOpen = ref(false)
const coverageResult = ref<BrowserCodeCoverageResult | null>(null)
const coverageState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const coverageError = ref('')
const coverageMode = ref<BrowserCodeCoverageMode>('function')
const cpuProfilePanelOpen = ref(false)
const cpuProfileResult = ref<BrowserCpuProfileResult | null>(null)
const cpuProfileState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const cpuProfileError = ref('')
const memoryState = ref<'idle' | 'running' | 'complete' | 'error'>('idle')
const memoryReport = ref<BrowserMemoryReport | null>(null)
const memoryError = ref('')
const memoryPanelOpen = ref(false)
const debugReportState = ref<'idle' | 'running' | 'complete' | 'error'>('idle')
const debugReport = ref<BrowserDebugReport | null>(null)
const debugReportError = ref('')
const debugReportPanelOpen = ref(false)
const debugReportCopied = ref(false)
const reproPanelOpen = ref(false)
const reproRecording = ref<BrowserReproRecording | null>(null)
const reproState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const reproError = ref('')
const reproCopied = ref(false)
const reproPlaywrightCopied = ref(false)
const domChangesPanelOpen = ref(false)
const domChangesReport = ref<BrowserDomChangesReport | null>(null)
const domChangesState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const domChangesError = ref('')
const domChangesCopied = ref(false)
const visualComparePanelOpen = ref(false)
const visualCompareReport = ref<BrowserVisualCompareView | null>(null)
const visualCompareState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const visualCompareError = ref('')
const visualCompareCopied = ref(false)
const inspectorIssuesOpen = ref(false)
const inspectorIssuesState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const inspectorIssuesReport = ref<BrowserInspectorIssuesReport | null>(null)
const inspectorIssuesError = ref('')
const inspectorIssuesCopied = ref(false)
const consolePanelOpen = ref(false)
const consoleState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const consoleMessages = ref<BrowserConsoleMessage[]>([])
const consoleError = ref('')
const consoleSearch = ref('')
const consoleLevel = ref<BrowserConsoleLevelFilter>('all')
const consoleCopied = ref<'filtered' | 'all' | null>(null)
const consoleCopiedEntryKey = ref<string | null>(null)
const networkMonitorOpen = ref(false)
const networkMonitorState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const networkRequests = ref<BrowserNetworkRequest[]>([])
const networkRequestDetails = ref<BrowserNetworkRequestDetails | null>(null)
const networkSelectedRequestId = ref<string | null>(null)
const networkRequestDetailsLoading = ref(false)
const networkMonitorError = ref('')
const networkDetailsCopied = ref<'json' | BrowserNetworkRequestCopyFormat | null>(null)
const networkReplayState = ref<'idle' | 'confirming' | 'replaying' | 'replayed' | 'error'>('idle')
const networkReplayMessage = ref('')
const networkSearch = ref('')
const networkContentSearchOpen = ref(false)
const networkContentSearchQuery = ref('')
const networkContentSearchCaseSensitive = ref(false)
const networkContentSearchState = ref<'idle' | 'searching' | 'complete' | 'error'>('idle')
const networkContentSearchResult = ref<BrowserNetworkSearchResult | null>(null)
const networkContentSearchError = ref('')
const networkContentSearchInput = ref<HTMLInputElement | null>(null)
const networkResourceFilter = ref('')
const networkFailuresOnly = ref(false)
const networkSortBy = ref<BrowserNetworkRequestSortBy>('start-time')
const networkSortDirection = ref<BrowserNetworkRequestSortDirection>('asc')
const networkHarCopied = ref(false)
const networkHarSaveState = ref<'idle' | 'saving' | 'saved'>('idle')
const networkHarExport = ref<BrowserNetworkHarExport | null>(null)
const requestConditionsExpanded = ref(false)
const networkRoutes = ref<BrowserNetworkRouteSummary[]>([])
const networkRouteState = ref<'idle' | 'loading' | 'ready' | 'saving' | 'error'>('idle')
const networkRouteError = ref('')
const networkRouteMode = ref<'abort' | 'fulfill' | 'throttle'>('abort')
const networkRoutePattern = ref('')
const networkRouteMethod = ref('')
const networkRouteTimes = ref(1)
const networkRouteAbort = ref<BrowserNetworkAbortReason>('BlockedByClient')
const networkRouteThrottle = ref<'fast-4g' | 'slow-4g' | 'slow-3g'>('slow-4g')
const networkRouteStatus = ref(200)
const networkRouteHeaders = ref('')
const networkRouteBody = ref('')
let networkContentSearchSequence = 0
let networkMonitorRequestSequence = 0
let networkRouteRequestSequence = 0
let networkRouteMutationSequence = 0
let networkRequestDetailsSequence = 0
if (detachedPanelId === 'site-controls') siteControlsOpen.value = true
else if (detachedPanelId === 'site-storage') siteStorageOpen.value = true
else if (detachedPanelId === 'page-tools') pageToolsOpen.value = true
else if (detachedPanelId === 'responsive-preview') responsivePanelOpen.value = true
else if (detachedPanelId === 'environment') environmentPanelOpen.value = true
else if (detachedPanelId === 'accessibility') accessibilityPanelOpen.value = true
else if (detachedPanelId === 'quality-audit') qualityAuditPanelOpen.value = true
else if (detachedPanelId === 'performance') performancePanelOpen.value = true
else if (detachedPanelId === 'design-overview') designOverviewPanelOpen.value = true
else if (detachedPanelId === 'page-metadata') pageMetadataPanelOpen.value = true
else if (detachedPanelId === 'security') securityPanelOpen.value = true
else if (detachedPanelId === 'coverage') coveragePanelOpen.value = true
else if (detachedPanelId === 'cpu-profile') cpuProfilePanelOpen.value = true
else if (detachedPanelId === 'memory') memoryPanelOpen.value = true
else if (detachedPanelId === 'console') consolePanelOpen.value = true
else if (detachedPanelId === 'network') networkMonitorOpen.value = true
else if (detachedPanelId === 'debug-report') debugReportPanelOpen.value = true
else if (detachedPanelId === 'repro-recorder') reproPanelOpen.value = true
else if (detachedPanelId === 'dom-changes') domChangesPanelOpen.value = true
else if (detachedPanelId === 'visual-compare') visualComparePanelOpen.value = true
else if (detachedPanelId === 'issues') inspectorIssuesOpen.value = true
else if (detachedPanelId === 'bookmarks') bookmarksOpen.value = true
const mcpActivityByTab = ref<Record<string, McpTabActivity>>({})
const activeMcpRequestsByTab = new Map<string, Map<string, McpTabActivity>>()
let unsubscribe: (() => void) | undefined
let unsubscribeMcpActivity: (() => void) | undefined
let unsubscribeDownloads: (() => void) | undefined
let unsubscribeBookmarks: (() => void) | undefined
let unsubscribeHistory: (() => void) | undefined
let unsubscribeMcpControl: (() => void) | undefined
let unsubscribeUserAttention: (() => void) | undefined
let unsubscribeShortcutRequested: (() => void) | undefined
let unsubscribeSettings: (() => void) | undefined
let unsubscribeSystemTheme: (() => void) | undefined
let unsubscribePermissions: (() => void) | undefined
let unsubscribeCredentials: (() => void) | undefined
let unsubscribeLicense: (() => void) | undefined
let unsubscribeUpdates: (() => void) | undefined
let unsubscribePanelRequested: (() => void) | undefined
let unsubscribePanelActive: (() => void) | undefined
let unsubscribePanelRedock: (() => void) | undefined
let unsubscribePanelClosed: (() => void) | undefined
let syncingDetachedPanelState = false
let unsubscribeUpdateOpen: (() => void) | undefined
let unsubscribeHelp: (() => void) | undefined
let unsubscribeClipboardFailed: (() => void) | undefined
let unsubscribeActionFailed: (() => void) | undefined
let unsubscribeTabGroupEdit: (() => void) | undefined
let unsubscribeAddressOverlay: (() => void) | undefined
let resizeObserver: ResizeObserver | undefined
let updateNoticeDismissTimer: number | undefined
let elementPickerResetTimer: number | undefined
let pageSnapshotResetTimer: number | undefined
let areaCaptureResetTimer: number | undefined
let nextAppToastId = 1
const appToastTimers = new Map<number, number>()
let pdfExportResetTimer: number | undefined
let pdfExportRequestSequence = 0
let emulationMutationSequence = 0
let consoleRefreshTimer: number | undefined
let domChangesRefreshTimer: number | undefined
let networkReplayConfirmTimer: number | undefined
let domChangesRequestSequence = 0
let consoleRequestSequence = 0
let elementPickerTabId: string | undefined
let areaCaptureTabId: string | undefined
let findTabId: string | undefined
let findRequestSequence = 0
const mcpActivityTimers = new Map<string, number>()
const MCP_TAB_ACTIVITY_LINGER_MS = 900
const knownDownloadIds = new Set<string>()
const themes: Array<{ name: ThemeName; label: string; description: string }> = [
  { name: 'system', label: 'System', description: 'Match this device' },
  { name: 'light', label: 'Light', description: 'Bright and focused' },
  { name: 'dark', label: 'Dark', description: 'Easy on the eyes' },
  { name: 'cyberpunk', label: 'Cyberpunk', description: 'Neon after midnight' }
]
const attentionSoundLabels: Record<AttentionSoundCue, string> = {
  warning: 'Warning',
  bell: 'Bell',
  chime: 'Chime',
  ping: 'Ping',
  bubble: 'Bubble',
  pop: 'Pop',
  ready: 'Ready',
  complete: 'Complete',
  sparkle: 'Sparkle',
  success: 'Success',
  error: 'Error'
}
const attentionSoundOptions = ATTENTION_SOUND_CUES.map((cue) => ({ cue, label: attentionSoundLabels[cue] }))
const keyboardShortcuts = [
  { label: 'Focus the address bar', keys: ['Ctrl/Cmd', 'L'] },
  { label: 'Reload the current website', keys: ['Ctrl/Cmd', 'R'] },
  { label: 'Reload without cached files', keys: ['Ctrl/Cmd', 'Shift', 'R'] },
  { label: 'Open a new tab', keys: ['Ctrl/Cmd', 'T'] },
  { label: 'Close the current tab', keys: ['Ctrl/Cmd', 'W'] },
  { label: 'Reopen the last closed tab', keys: ['Ctrl/Cmd', 'Shift', 'T'] },
  { label: 'Search open tabs', keys: ['Ctrl/Cmd', 'Shift', 'A'] },
  { label: 'Open the command palette', keys: ['Ctrl/Cmd', 'Shift', 'P'] },
  { label: 'Pick an element for agent context', keys: ['Ctrl+Shift+C', 'Cmd+Option+C'] },
  { label: 'Find on the current page', keys: ['Ctrl/Cmd', 'F'] },
  { label: 'Bookmark the current page', keys: ['Ctrl/Cmd', 'D'] },
  { label: 'Open browsing history', keys: ['Ctrl+H', 'Cmd+Y'] },
  { label: 'Clear browsing data', keys: ['Ctrl/Cmd', 'Shift', 'Delete'] },
  { label: 'Toggle developer tools', keys: ['F12', 'Ctrl+Shift+I', 'Cmd+Option+I'] },
  { label: 'Move to the next tab', keys: ['Ctrl', 'Tab'] },
  { label: 'Move to the previous tab', keys: ['Ctrl', 'Shift', 'Tab'] },
  { label: 'Reset page zoom', keys: ['Ctrl/Cmd', '0'] }
]
const networkResourceFilters = [
  { value: '', label: 'All' },
  { value: 'fetch/xhr', label: 'Fetch/XHR' },
  { value: 'document', label: 'Doc' },
  { value: 'script', label: 'JS' },
  { value: 'stylesheet', label: 'CSS' },
  { value: 'image', label: 'Img' },
  { value: 'eventsource', label: 'SSE' },
  { value: 'websocket', label: 'WS' },
  { value: 'other', label: 'Other' }
]
const networkSortOptions: Array<{ value: BrowserNetworkRequestSortBy; label: string }> = [
  { value: 'start-time', label: 'Start time' },
  { value: 'end-time', label: 'End time' },
  { value: 'duration', label: 'Duration' },
  { value: 'waiting', label: 'Waiting (TTFB)' },
  { value: 'size', label: 'Size' },
  { value: 'status', label: 'Status' }
]

const activeTab = computed(() => state.value.tabs.find((tab) => tab.id === state.value.activeTabId))
const splitViewTabs = computed(() => state.value.splitView
  ? [
      state.value.tabs.find((tab) => tab.id === state.value.splitView!.firstTabId),
      state.value.tabs.find((tab) => tab.id === state.value.splitView!.secondTabId)
    ].filter((tab): tab is BrowserTabState => Boolean(tab))
  : [])
const splitCandidates = computed(() => regularTabs.value.filter((tab) => tab.id !== state.value.activeTabId))
const splitPartner = computed(() => splitViewTabs.value.find((tab) => tab.id !== state.value.activeTabId))
const dockedPanelOpen = computed(() => bookmarksOpen.value
  || siteControlsOpen.value
  || siteStorageOpen.value
  || pageToolsOpen.value
  || responsivePanelOpen.value
  || environmentPanelOpen.value
  || accessibilityPanelOpen.value
  || qualityAuditPanelOpen.value
  || performancePanelOpen.value
  || designOverviewPanelOpen.value
  || pageMetadataPanelOpen.value
  || securityPanelOpen.value
  || coveragePanelOpen.value
  || cpuProfilePanelOpen.value
  || memoryPanelOpen.value
  || consolePanelOpen.value
  || debugReportPanelOpen.value
  || reproPanelOpen.value
  || domChangesPanelOpen.value
  || visualComparePanelOpen.value
  || inspectorIssuesOpen.value
  || networkMonitorOpen.value)
const activePanelId = computed<DetachablePanelId | null>(() => {
  if (siteControlsOpen.value) return 'site-controls'
  if (siteStorageOpen.value) return 'site-storage'
  if (pageToolsOpen.value) return 'page-tools'
  if (responsivePanelOpen.value) return 'responsive-preview'
  if (environmentPanelOpen.value) return 'environment'
  if (accessibilityPanelOpen.value) return 'accessibility'
  if (qualityAuditPanelOpen.value) return 'quality-audit'
  if (performancePanelOpen.value) return 'performance'
  if (designOverviewPanelOpen.value) return 'design-overview'
  if (pageMetadataPanelOpen.value) return 'page-metadata'
  if (securityPanelOpen.value) return 'security'
  if (coveragePanelOpen.value) return 'coverage'
  if (cpuProfilePanelOpen.value) return 'cpu-profile'
  if (memoryPanelOpen.value) return 'memory'
  if (consolePanelOpen.value) return 'console'
  if (networkMonitorOpen.value) return 'network'
  if (debugReportPanelOpen.value) return 'debug-report'
  if (reproPanelOpen.value) return 'repro-recorder'
  if (domChangesPanelOpen.value) return 'dom-changes'
  if (visualComparePanelOpen.value) return 'visual-compare'
  if (inspectorIssuesOpen.value) return 'issues'
  if (bookmarksOpen.value) return 'bookmarks'
  return null
})
const activeEmulation = computed(() => activeTab.value?.emulation)
const responsiveViewport = computed<BrowserViewportEmulation | null>(() => {
  if (responsivePresetId.value !== 'custom') {
    return resolveViewportPreset(responsivePresetId.value, responsiveOrientation.value)
  }
  if (!Number.isInteger(responsiveWidth.value)
    || responsiveWidth.value < 200
    || responsiveWidth.value > 3840
    || !Number.isInteger(responsiveHeight.value)
    || responsiveHeight.value < 200
    || responsiveHeight.value > 3840
    || !Number.isFinite(responsiveDeviceScaleFactor.value)
    || responsiveDeviceScaleFactor.value < 0.5
    || responsiveDeviceScaleFactor.value > 5) return null
  return {
    width: responsiveWidth.value,
    height: responsiveHeight.value,
    deviceScaleFactor: responsiveDeviceScaleFactor.value,
    mobile: responsiveMobile.value,
    touch: responsiveTouch.value,
    orientation: responsiveOrientation.value
  }
})
const responsivePreviewLabel = computed(() => {
  const viewport = activeEmulation.value?.viewport
  return viewport ? `${viewport.width}×${viewport.height} at ${viewport.deviceScaleFactor}×` : 'Test phones, tablets, and desktops'
})
const responsiveSummary = computed(() => {
  const viewport = responsiveViewport.value
  if (!viewport) return 'Enter a width and height from 200 to 3840, with DPR from 0.5 to 5.'
  return `${viewport.width}×${viewport.height} CSS px · ${viewport.deviceScaleFactor}× DPR · ${viewport.mobile ? 'mobile' : 'desktop'} rendering · ${viewport.touch ? 'touch' : 'pointer'}`
})
const environmentSettingsDraft = computed<BrowserEnvironmentSettings | null>(() => {
  const candidate: BrowserEnvironmentSettings = {
    ...environmentDraft.value,
    renderingDebug: { ...environmentDraft.value.renderingDebug },
    geolocation: environmentLocationEnabled.value ? {
      latitude: environmentLatitude.value,
      longitude: environmentLongitude.value,
      accuracy: environmentAccuracy.value
    } : null
  }
  return isBrowserEnvironmentSettings(candidate) ? candidate : null
})
const activeEnvironmentOverrideCount = computed(() => browserEnvironmentOverrideCount(
  browserEnvironmentFromEmulation(activeEmulation.value)
))
const environmentLabel = computed(() => {
  if (environmentState.value === 'applying') return 'Applying browser conditions'
  if (environmentState.value === 'error') return 'Environment needs attention'
  if (activeEnvironmentOverrideCount.value) {
    return `${activeEnvironmentOverrideCount.value} active ${activeEnvironmentOverrideCount.value === 1 ? 'condition' : 'conditions'}`
  }
  return 'Network, cache, service workers, CPU, animations, rendering, runtime, region, identity, and location'
})
const activeNetworkRouteCount = computed(() => activeTab.value?.networkRouteCount ?? 0)
const accessibilityAuditLabel = computed(() => {
  if (accessibilityAuditState.value === 'running') return 'Running accessibility audit'
  if (accessibilityAuditState.value === 'error') return 'Accessibility audit needs attention'
  if (accessibilityAuditState.value === 'complete' && accessibilityAudit.value) {
    const count = accessibilityAudit.value.violationCount
    return `Accessibility audit: ${count} ${count === 1 ? 'violation' : 'violations'}`
  }
  return 'Run accessibility audit'
})
const qualityAuditLabel = computed(() => {
  if (qualityAuditState.value === 'running') return 'Checking six evidence categories'
  if (qualityAuditState.value === 'error') return 'Quality audit needs attention'
  if (qualityAuditReport.value) {
    if (qualityAuditReport.value.status === 'pass') return 'All applicable categories clear'
    const { errors, warnings } = qualityAuditReport.value.totals
    return `${errors} ${errors === 1 ? 'error' : 'errors'} · ${warnings} ${warnings === 1 ? 'warning' : 'warnings'}`
  }
  return 'Accessibility, speed, SEO, security, PWA, and browser issues'
})
const performanceLabel = computed(() => {
  if (performanceState.value === 'running') return 'Measuring page performance'
  if (performanceState.value === 'error') return 'Performance report needs attention'
  if (performanceState.value === 'complete') return 'View page performance'
  return 'Measure page performance'
})
const designOverviewLabel = computed(() => {
  if (designOverviewState.value === 'loading') return 'Capturing computed page styles'
  if (designOverviewState.value === 'error') return 'Design overview needs attention'
  if (designOverviewReport.value) {
    const issues = designOverviewReport.value.summary.contrastIssueCount
    return issues ? `${issues} likely contrast ${issues === 1 ? 'issue' : 'issues'}` : 'View colors and typography'
  }
  return 'Colors, typography, and contrast'
})
const pageMetadataLabel = computed(() => {
  if (pageMetadataState.value === 'loading') return 'Inspecting page metadata'
  if (pageMetadataState.value === 'error') return 'Page metadata needs attention'
  if (pageMetadataReport.value) {
    const actionable = pageMetadataReport.value.issues.filter((issue) => issue.severity !== 'info').length
    return actionable ? `${actionable} metadata ${actionable === 1 ? 'warning' : 'warnings'}` : 'Search and social metadata ready'
  }
  return 'Search, social, and structured data'
})
const securityLabel = computed(() => {
  if (securityReportState.value === 'loading') return 'Inspecting connection security'
  if (securityReportState.value === 'error') return 'Security report needs attention'
  if (securityReport.value?.state === 'secure') return 'Secure connection'
  if (securityReport.value?.state === 'insecure' || securityReport.value?.state === 'insecure-broken') return 'Connection is not secure'
  if (securityReport.value) return `Connection state: ${securityReport.value.state}`
  return 'TLS, certificate, and connection details'
})
const coverageLabel = computed(() => {
  if (coverageState.value === 'loading') return 'Updating code coverage'
  if (coverageState.value === 'error') return 'Code coverage needs attention'
  if (activeTab.value?.codeCoverageRecording) return `Recording ${activeTab.value.codeCoverageRecording.mode} coverage`
  if (coverageResult.value?.status === 'complete') return `${coverageResult.value.report?.usedPercent ?? 0}% code used`
  return 'Find unused JavaScript and CSS'
})
const cpuProfileLabel = computed(() => {
  if (cpuProfileState.value === 'loading') return 'Updating JavaScript CPU profile'
  if (cpuProfileState.value === 'error') return 'JavaScript CPU profile needs attention'
  if (activeTab.value?.cpuProfileRecording) return 'Recording JavaScript CPU activity'
  if (cpuProfileResult.value?.status === 'complete') {
    const hotspot = cpuProfileResult.value.report?.hotspots[0]
    return hotspot ? `${hotspot.functionName}: ${hotspot.selfPercent}% self time` : 'CPU profile complete'
  }
  return 'Find hot JavaScript functions'
})
const memoryLabel = computed(() => {
  if (memoryState.value === 'running') return 'Measuring page memory'
  if (memoryState.value === 'error') return 'Memory report needs attention'
  if (activeTab.value?.memoryAllocationRecording) return 'Sampling live JavaScript allocations'
  if (memoryReport.value?.allocationProfile) {
    const hotspot = memoryReport.value.allocationProfile.hotspots[0]
    return hotspot ? `${hotspot.functionName}: ${formatBytes(hotspot.selfBytes)} retained` : 'Allocation profile complete'
  }
  if (memoryPanelOpen.value) return 'Close page memory report'
  return 'Heap, DOM, and allocation diagnostics'
})
const debugReportLabel = computed(() => {
  if (debugReportState.value === 'running') return 'Collecting debug evidence'
  if (debugReportState.value === 'error') return 'Debug report needs attention'
  if (debugReportState.value === 'complete' && debugReport.value) {
    const issues = debugReport.value.summary.consoleErrors
      + debugReport.value.summary.consoleWarnings
      + debugReport.value.summary.failedRequests
    return issues ? `Debug report: ${issues} ${issues === 1 ? 'signal' : 'signals'}` : 'Debug report: no obvious issues'
  }
  return 'Create debug report'
})
const debugReportSignalCount = computed(() => debugReport.value
  ? debugReport.value.summary.consoleErrors
    + debugReport.value.summary.consoleWarnings
    + debugReport.value.summary.failedRequests
  : 0)
const reproLabel = computed(() => {
  const recording = activeTab.value?.reproRecording
  if (recording?.active) return `Recording · ${recording.stepCount} ${recording.stepCount === 1 ? 'step' : 'steps'}`
  if (reproRecording.value?.stepCount) return `${reproRecording.value.stepCount} ${reproRecording.value.stepCount === 1 ? 'step' : 'steps'} ready to share`
  return 'Record safe steps for an agent'
})
const domChangesLabel = computed(() => {
  const recording = activeTab.value?.domChangesRecording
  if (recording?.active) return `Recording · ${recording.changeCount} ${recording.changeCount === 1 ? 'change' : 'changes'}`
  if (domChangesReport.value?.changeCount) {
    return `${domChangesReport.value.changeCount} ${domChangesReport.value.changeCount === 1 ? 'change' : 'changes'} ready to share`
  }
  return 'See what changed after an action'
})
const visualCompareLabel = computed(() => {
  if (visualCompareState.value === 'loading') return 'Capturing visible page'
  if (visualCompareState.value === 'error') return 'Visual comparison needs attention'
  if (visualCompareReport.value?.status === 'compared') {
    return visualCompareReport.value.identical
      ? 'No changed pixels'
      : `${visualCompareReport.value.changedPercent ?? 0}% changed`
  }
  if (visualCompareReport.value?.status === 'baseline') return 'Baseline ready'
  return 'Compare the page before and after'
})
const activeInspectorIssueCount = computed(() => activeTab.value?.inspectorIssueCount ?? 0)
const inspectorIssuesLabel = computed(() => {
  const count = activeInspectorIssueCount.value
  return count ? `${count} browser ${count === 1 ? 'issue' : 'issues'}` : 'CORS, CSP, cookies, and compatibility'
})
const filteredConsoleMessages = computed(() => filterConsoleMessages(
  consoleMessages.value,
  consoleSearch.value,
  consoleLevel.value
))
const consoleMessageCounts = computed(() => countConsoleMessages(consoleMessages.value))
const consoleEventCount = computed(() => countConsoleEvents(consoleMessages.value))
const filteredConsoleEventCount = computed(() => countConsoleEvents(filteredConsoleMessages.value))
const filteredNetworkRequests = computed(() => sortNetworkRequests(
  filterNetworkRequests(
    networkRequests.value,
    normalizeNetworkHarOptions({
      query: networkSearch.value,
      resourceType: networkResourceFilter.value || undefined,
      errorsOnly: networkFailuresOnly.value,
      maxRequests: 200
    })
  ),
  networkSortBy.value,
  networkSortDirection.value
))
const networkWaterfallRange = computed(() => buildNetworkWaterfallRange(filteredNetworkRequests.value))
const networkFailureCount = computed(() => networkRequests.value.filter(isNetworkRequestFailure).length)
const networkResponseBytes = computed(() => networkRequests.value.reduce(
  (total, request) => total + (request.responseSizeBytes ?? 0),
  0
))
const homeTab = computed(() => state.value.tabs.find((tab) => tab.url.startsWith('bronom://home')))
const regularTabs = computed(() => state.value.tabs.filter((tab) => !tab.url.startsWith('bronom://home')))
const sleepingTabsCount = computed(() => regularTabs.value.filter((tab) => tab.sleeping).length)
function tabGroupStyle(tab: BrowserTabState): Record<string, string> | undefined {
  if (!tab.mcpGroupId) return undefined
  const color = state.value.mcpTabGroups.find((group) => group.id === tab.mcpGroupId)?.color ?? defaultTabGroupColor(tab.mcpGroupId)
  return { '--tab-group-color': BROWSER_TAB_GROUP_COLOR_HEX[color] }
}
function tabGroupColorStyle(color: BrowserTabGroupColor): Record<string, string> {
  return { '--tab-group-color': BROWSER_TAB_GROUP_COLOR_HEX[color] }
}
function beginsTabGroup(tab: BrowserTabState, index: number): boolean {
  return Boolean(tab.mcpGroupId && regularTabs.value[index - 1]?.mcpGroupId !== tab.mcpGroupId)
}
function loadCollapsedTabGroupIds(): string[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem('bronom:collapsed-tab-groups') ?? '[]')
    return Array.isArray(stored) ? stored.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}
function tabGroupTabs(groupId: string): BrowserTabState[] {
  return regularTabs.value.filter((tab) => tab.mcpGroupId === groupId)
}
function tabGroupTabCount(groupId: string): number {
  return tabGroupTabs(groupId).length
}
function tabGroupContainsActiveTab(groupId: string): boolean {
  return tabGroupTabs(groupId).some((tab) => tab.active)
}
function isTabGroupCollapsed(groupId: string): boolean {
  return collapsedTabGroupIds.value.has(groupId)
}
function persistCollapsedTabGroups(): void {
  window.localStorage.setItem('bronom:collapsed-tab-groups', JSON.stringify([...collapsedTabGroupIds.value]))
}
function toggleTabGroup(groupId: string): void {
  const next = new Set(collapsedTabGroupIds.value)
  if (next.has(groupId)) next.delete(groupId)
  else next.add(groupId)
  collapsedTabGroupIds.value = next
  persistCollapsedTabGroups()
}
function expandTabGroupForTab(tab: BrowserTabState): void {
  if (!tab.mcpGroupId || !collapsedTabGroupIds.value.has(tab.mcpGroupId)) return
  const next = new Set(collapsedTabGroupIds.value)
  next.delete(tab.mcpGroupId)
  collapsedTabGroupIds.value = next
  persistCollapsedTabGroups()
}
watch(() => state.value.mcpTabGroups.map((group) => group.id).join(','), () => {
  const validGroupIds = new Set(state.value.mcpTabGroups.map((group) => group.id))
  const next = new Set([...collapsedTabGroupIds.value].filter((groupId) => validGroupIds.has(groupId)))
  if (next.size === collapsedTabGroupIds.value.size) return
  collapsedTabGroupIds.value = next
  persistCollapsedTabGroups()
})
const activeIsHome = computed(() => !state.value.activeTabId || activeTab.value?.url.startsWith('bronom://home') === true)
const detachedPanelUnavailable = computed(() => (
  isDetachedPanelWindow
  && activeIsHome.value
  && activePanelId.value !== 'bookmarks'
))
const detachedPanelLabelText = computed(() => (
  activePanelId.value ? detachedPanelLabel(activePanelId.value) : 'Page tools'
))
const showUpdateStatusPill = computed(() => (
  updateNoticeOpen.value
  && !settingsOpen.value
  && shouldShowUpdateStatusPill(updateState.value.status)
))
const permissionsByOrigin = computed(() => {
  const groups = new Map<string, SitePermissionEntry[]>()
  for (const entry of sitePermissions.value) {
    const permissions = groups.get(entry.origin) ?? []
    permissions.push(entry)
    groups.set(entry.origin, permissions)
  }
  return [...groups].map(([origin, permissions]) => ({ origin, permissions }))
})
const activeOrigin = computed(() => {
  try {
    const url = new URL(activeTab.value?.url ?? '')
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : null
  } catch {
    return null
  }
})
const activeHostname = computed(() => {
  try {
    return new URL(activeWebUrl.value ?? '').hostname
  } catch {
    return ''
  }
})
const activeSitePermissions = computed(() => (
  activeOrigin.value
    ? sitePermissions.value.filter((entry) => entry.origin === activeOrigin.value)
    : []
))
const activeAddressKind = computed(() => activeWebUrl.value?.startsWith('https:') ? 'HTTPS address' : 'HTTP address')
const activeCredentials = computed(() => credentials.value.filter((credential) => credential.origin === activeOrigin.value))
const filteredActiveCredentials = computed(() => {
  const query = credentialPickerQuery.value.trim().toLocaleLowerCase()
  if (!query) return activeCredentials.value
  return activeCredentials.value.filter((credential) => (
    (credential.username || 'Unnamed account').toLocaleLowerCase().includes(query)
    || credential.origin.toLocaleLowerCase().includes(query)
  ))
})
const selectedActiveCredential = computed(() => filteredActiveCredentials.value[credentialPickerSelection.value])
const activeDownloads = computed(() => downloads.value.filter((download) => download.state === 'progressing'))
const finishedDownloads = computed(() => downloads.value.filter((download) => download.state !== 'progressing'))
const effectiveDownloadDirectory = computed(() => settings.value.downloadDirectory || defaultDownloadDirectory.value || 'System Downloads folder')
const activeWebUrl = computed(() => {
  try {
    const url = new URL(activeTab.value?.url ?? '')
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
})
const currentBookmark = computed(() => bookmarks.value.find((bookmark) => bookmark.url === activeWebUrl.value))
const filteredBookmarks = computed(() => {
  const query = bookmarkSearch.value.trim().toLocaleLowerCase()
  if (!query) return bookmarks.value
  return bookmarks.value.filter((bookmark) => (
    bookmark.title.toLocaleLowerCase().includes(query) || bookmark.url.toLocaleLowerCase().includes(query)
  ))
})
const filteredVisitHistory = computed(() => {
  const query = historySearch.value.trim().toLocaleLowerCase()
  if (!query) return visitHistory.value
  return visitHistory.value.filter((entry) => (
    entry.title.toLocaleLowerCase().includes(query) || entry.url.toLocaleLowerCase().includes(query)
  ))
})
const filteredSiteStorageItems = computed(() => {
  const query = siteStorageSearch.value.trim().toLocaleLowerCase()
  const items = siteStorageResult.value?.items ?? []
  if (!query) return items
  return items.filter((item) => (
    item.key.toLocaleLowerCase().includes(query)
    || item.value?.toLocaleLowerCase().includes(query)
    || item.domain?.toLocaleLowerCase().includes(query)
  ))
})
const siteStorageKindLabel = computed(() => ({
  'local-storage': 'Local storage',
  'session-storage': 'Session storage',
  cookies: 'Cookies'
}[siteStorageKind.value]))
const filteredSiteStorageIndexedDbEntries = computed(() => {
  const query = siteStorageIndexedDbSearch.value.trim().toLocaleLowerCase()
  const entries = siteStorageIndexedDbReport.value?.entries ?? []
  if (!query) return entries
  return entries.filter((entry) => (
    entry.key.toLocaleLowerCase().includes(query)
    || entry.primaryKey.toLocaleLowerCase().includes(query)
    || entry.valueType.toLocaleLowerCase().includes(query)
    || entry.valuePreview?.toLocaleLowerCase().includes(query)
  ))
})
const filteredTabs = computed(() => {
  const query = tabSearchQuery.value.trim().toLocaleLowerCase()
  if (!query) return regularTabs.value
  return regularTabs.value.filter((tab) => (
    (tab.title || 'New tab').toLocaleLowerCase().includes(query)
    || tab.url.toLocaleLowerCase().includes(query)
    || tab.mcpGroupName?.toLocaleLowerCase().includes(query)
  ))
})
const filteredClosedTabs = computed(() => {
  const query = tabSearchQuery.value.trim().toLocaleLowerCase()
  if (!query) return state.value.closedTabs
  return state.value.closedTabs.filter((tab) => (
    tab.title.toLocaleLowerCase().includes(query) || tab.url.toLocaleLowerCase().includes(query)
  ))
})
const filteredSavedTabGroups = computed(() => {
  const query = tabSearchQuery.value.trim().toLocaleLowerCase()
  if (!query) return state.value.savedTabGroups
  return state.value.savedTabGroups.filter((group) => (
    group.name.toLocaleLowerCase().includes(query)
    || group.tabs.some((tab) => tab.title.toLocaleLowerCase().includes(query) || tab.url.toLocaleLowerCase().includes(query))
  ))
})
type TabSearchResult =
  | { kind: 'open'; tab: BrowserTabState }
  | { kind: 'closed'; tab: BrowserClosedTabState }
  | { kind: 'saved'; tab: BrowserSavedTabGroupState }
const tabSearchResults = computed<TabSearchResult[]>(() => [
  ...filteredSavedTabGroups.value.map((tab): TabSearchResult => ({ kind: 'saved', tab })),
  ...filteredTabs.value.map((tab): TabSearchResult => ({ kind: 'open', tab })),
  ...filteredClosedTabs.value.map((tab): TabSearchResult => ({ kind: 'closed', tab }))
])
const selectedTabSearchResult = computed(() => tabSearchResults.value[tabSearchSelection.value])
const commandPaletteCommands = computed(() => filterCommandPaletteCommands(
  commandPaletteQuery.value,
  Boolean(activeTab.value && !activeIsHome.value)
))
const selectedCommandPaletteCommand = computed(() => commandPaletteCommands.value[commandPaletteSelection.value])
const addressSuggestions = computed(() => buildLocalAddressSuggestions({
  query: address.value,
  bookmarks: bookmarks.value,
  history: visitHistory.value
}))
const addressSuggestionsVisible = computed(() => addressSuggestionsOpen.value && addressSuggestions.value.length > 0)
const addressSuggestionTheme = computed<AddressSuggestionOverlayTheme>(() => (
  settings.value.theme === 'system' ? systemTheme.value : settings.value.theme
))
const selectedAddressSuggestion = computed(() => (
  addressSuggestionSelection.value >= 0
    ? addressSuggestions.value[addressSuggestionSelection.value]
    : undefined
))
const selectedBrowsingDataCount = computed(() => [
  browsingDataOptions.value.history,
  browsingDataOptions.value.cookiesAndSiteData,
  browsingDataOptions.value.cache
].filter(Boolean).length)
const canClearBrowsingData = computed(() => (
  selectedBrowsingDataCount.value > 0
  && browsingDataState.value !== 'loading'
  && browsingDataState.value !== 'clearing'
  && janitorState.value !== 'clearing'
))
const filteredJanitorWebsites = computed(() => {
  const query = janitorSearch.value.trim().toLocaleLowerCase()
  if (!query) return janitorWebsites.value
  return janitorWebsites.value.filter((site) => (
    site.hostname.toLocaleLowerCase().includes(query)
    || site.origin.toLocaleLowerCase().includes(query)
    || site.title.toLocaleLowerCase().includes(query)
  ))
})
const downloadButtonLabel = computed(() => {
  if (activeDownloads.value.length) return `${activeDownloads.value.length} download${activeDownloads.value.length === 1 ? '' : 's'} in progress`
  if (downloads.value[0]?.state === 'completed') return `Download complete: ${downloads.value[0].filename}`
  if (downloads.value.length) return 'Recent downloads'
  return 'Downloads'
})
const mcpStatusLabel = computed(() => {
  if (mcpCopied.value) return 'MCP URL copied'
  if (mcpControl.value.status === 'starting') return 'MCP starting'
  if (mcpControl.value.status === 'paused') return 'Agents paused'
  if (mcpControl.value.status === 'error') return 'MCP error'
  return 'MCP ready'
})
const mcpStatusTitle = computed(() => {
  if (mcpControl.value.status === 'error') return `MCP failed: ${mcpControl.value.error ?? 'Unknown startup error'}`
  if (mcpControl.value.status === 'starting') return `MCP is starting at ${state.value.mcpUrl}`
  return `MCP: ${state.value.mcpUrl}`
})
const canToggleMcpPaused = computed(() => mcpControl.value.status === 'ready' || mcpControl.value.status === 'paused')
const parsedMcpPort = computed(() => Number(mcpPortDraft.value))
const mcpPortValid = computed(() => isValidMcpPort(parsedMcpPort.value))
const mcpPortChanged = computed(() => mcpPortValid.value && parsedMcpPort.value !== settings.value.mcpPort)
const canApplyMcpPort = computed(() => mcpPortValid.value && (mcpPortChanged.value || mcpControl.value.status === 'error'))
const elementPickerLabel = computed(() => {
  if (elementPickerState.value === 'picking') return elementPickerMode.value === 'screenshot'
    ? 'Cancel element screenshot selection'
    : 'Cancel element selection'
  if (elementPickerState.value === 'copied') return elementPickerMode.value === 'screenshot'
    ? 'Element screenshot copied — paste it into agent chat'
    : 'Element copied for agent'
  if (elementPickerState.value === 'error') return elementPickerMode.value === 'screenshot'
    ? 'Could not copy the element screenshot'
    : 'Could not select an element'
  return 'Select an element to copy for agent'
})
const contextPickerLabel = computed(() => elementPickerMode.value === 'context'
  ? elementPickerLabel.value
  : 'Select an element to copy for agent')
const elementScreenshotLabel = computed(() => elementPickerMode.value === 'screenshot'
  ? elementPickerLabel.value
  : 'Select an element and copy its screenshot')
const elementPickerTitle = computed(() => elementPickerState.value === 'idle'
  ? `${elementPickerLabel.value} (Ctrl+Shift+C / Cmd+Option+C)`
  : elementPickerLabel.value)
const areaCaptureLabel = computed(() => {
  if (areaCaptureState.value === 'picking') return 'Cancel area screenshot'
  if (areaCaptureState.value === 'capturing') return screenshotCaptureMode.value === 'full-page'
    ? 'Capturing full-page screenshot'
    : 'Capturing viewport screenshot'
  if (areaCaptureState.value === 'copied') {
    if (screenshotCaptureMode.value === 'viewport') return 'Viewport screenshot copied — paste it into agent chat'
    if (screenshotCaptureMode.value === 'full-page') return 'Full-page screenshot copied — paste it into agent chat'
    return 'Area screenshot copied — paste it into agent chat'
  }
  if (areaCaptureState.value === 'error') return areaCaptureError.value || 'Could not capture this screenshot'
  return 'Capture an area to the clipboard'
})
const tabHumanInteractionLocked = computed(() => activeTab.value?.humanInteractionLocked === true)
const effectiveHumanInteractionLocked = computed(() => (
  state.value.allHumanInteractionLocked || tabHumanInteractionLocked.value
))
const tabInteractionLockLabel = computed(() => {
  if (activeIsHome.value) return 'Tab lock is available on websites'
  if (state.value.allHumanInteractionLocked) return 'All tabs are locked'
  return tabHumanInteractionLocked.value
    ? 'Allow human interaction in this tab'
    : 'Block human interaction in this tab'
})
const allInteractionLockLabel = computed(() => (
  state.value.allHumanInteractionLocked
    ? 'Allow human interaction in Bronom'
    : 'Block human interaction in Bronom'
))
const pdfExportLabel = computed(() => {
  if (pdfExportState.value === 'saving') return 'Saving page as PDF'
  if (pdfExportState.value === 'saved') return `PDF saved to ${pdfExport.value?.path ?? 'the download directory'}`
  if (pdfExportState.value === 'error') return 'Could not save page as PDF'
  return 'Save page as PDF'
})

function downloadProgress(download: BrowserDownloadState): number {
  if (download.state === 'completed') return 100
  if (download.totalBytes <= 0) return 0
  return Math.min(100, Math.max(0, Math.round(download.receivedBytes / download.totalBytes * 100)))
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** unit
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}

function downloadMeta(download: BrowserDownloadState): string {
  if (download.state === 'progressing') {
    const received = formatBytes(download.receivedBytes)
    return download.totalBytes > 0
      ? `${downloadProgress(download)}% · ${received} of ${formatBytes(download.totalBytes)}`
      : `${received} downloaded`
  }
  if (download.state === 'completed') return `${formatBytes(download.receivedBytes)} · Complete`
  if (download.state === 'cancelled') return 'Cancelled'
  return 'Interrupted'
}

function applyDownloads(next: BrowserDownloadState[]): void {
  const hasNewDownload = next.some((download) => !knownDownloadIds.has(download.id))
  downloads.value = next
  for (const download of next) knownDownloadIds.add(download.id)
  if (hasNewDownload && !settingsOpen.value) downloadsOpen.value = true
}

async function toggleDownloads(): Promise<void> {
  settingsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  downloadActionError.value = ''
  if (!downloadsOpen.value) downloads.value = await window.bronomDownloads.list()
  downloadsOpen.value = !downloadsOpen.value
}

async function toggleBookmarks(): Promise<void> {
  settingsOpen.value = false
  downloadsOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  bookmarkError.value = ''
  if (!bookmarksOpen.value) bookmarks.value = await window.bronomBookmarks.list()
  bookmarksOpen.value = !bookmarksOpen.value
}

async function toggleCurrentBookmark(): Promise<void> {
  bookmarkError.value = ''
  bookmarksOpen.value = true
  downloadsOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  if (!activeTab.value || !activeWebUrl.value) return
  try {
    bookmarks.value = currentBookmark.value
      ? await window.bronomBookmarks.remove(currentBookmark.value.id)
      : await window.bronomBookmarks.add(activeWebUrl.value, activeTab.value.title || new URL(activeWebUrl.value).hostname)
  } catch (error) {
    bookmarkError.value = error instanceof Error ? error.message : String(error)
  }
}

async function openBookmark(bookmark: BrowserBookmark): Promise<void> {
  bookmarksOpen.value = false
  settingsOpen.value = false
  await syncState(browser.newTab({ url: bookmark.url, active: true }))
}

function preferredWebTab(): BrowserTabState | undefined {
  return regularTabs.value.find((tab) => tab.id === lastWebTabId.value) ?? regularTabs.value.at(-1)
}

async function openApplicationHome(): Promise<void> {
  if (activeTab.value && !activeIsHome.value) lastWebTabId.value = activeTab.value.id
  settingsOpen.value = false
  updateNoticeOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  zoomOpen.value = false
  if (findOpen.value) await closeFind()
  await syncState(browser.openHome())
}

function beginRenameBookmark(bookmark: BrowserBookmark): void {
  editingBookmarkId.value = bookmark.id
  editingBookmarkTitle.value = bookmark.title
}

function cancelRenameBookmark(): void {
  editingBookmarkId.value = null
  editingBookmarkTitle.value = ''
}

async function commitBookmarkRename(bookmarkId: string): Promise<void> {
  if (editingBookmarkId.value !== bookmarkId) return
  bookmarkError.value = ''
  try {
    bookmarks.value = await window.bronomBookmarks.rename(bookmarkId, editingBookmarkTitle.value)
    cancelRenameBookmark()
  } catch (error) {
    bookmarkError.value = error instanceof Error ? error.message : String(error)
  }
}

async function removeBookmark(bookmarkId: string): Promise<void> {
  bookmarkError.value = ''
  if (editingBookmarkId.value === bookmarkId) cancelRenameBookmark()
  bookmarks.value = await window.bronomBookmarks.remove(bookmarkId)
}

async function toggleVisitHistory(): Promise<void> {
  settingsOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  tabSearchOpen.value = false
  historyError.value = ''
  if (!historyOpen.value) visitHistory.value = await window.bronomHistory.list()
  historyOpen.value = !historyOpen.value
}

function resetSiteStorageView(closePanel = false): void {
  if (closePanel && !keepsSeparatePanelOpen()) siteStorageOpen.value = false
  siteStorageResult.value = null
  siteStorageState.value = 'idle'
  siteStorageError.value = ''
  siteStorageSearch.value = ''
  siteStorageKey.value = ''
  siteStorageValue.value = ''
  siteStorageChangesOpen.value = false
  siteStorageChangesReport.value = null
  siteStorageChangesState.value = 'idle'
  siteStorageChangesError.value = ''
  siteStorageChangesCopied.value = false
  siteStorageUsageOpen.value = false
  siteStorageUsageReport.value = null
  siteStorageUsageState.value = 'idle'
  siteStorageUsageError.value = ''
  siteStorageUsageCopied.value = false
  siteStorageIndexedDbOpen.value = false
  siteStorageIndexedDbReport.value = null
  siteStorageIndexedDbState.value = 'idle'
  siteStorageIndexedDbError.value = ''
  siteStorageIndexedDbDatabase.value = ''
  siteStorageIndexedDbStore.value = ''
  siteStorageIndexedDbOffset.value = 0
  siteStorageIndexedDbSearch.value = ''
  siteStorageIndexedDbCopied.value = false
  siteStoragePwaOpen.value = false
  siteStoragePwaReport.value = null
  siteStoragePwaState.value = 'idle'
  siteStoragePwaError.value = ''
  siteStoragePwaCache.value = ''
  siteStoragePwaQuery.value = ''
  siteStoragePwaOffset.value = 0
  siteStoragePwaCopied.value = false
}

async function refreshSiteStorage(): Promise<void> {
  const tab = activeTab.value
  if (!tab || !activeWebUrl.value) return
  siteStorageState.value = 'loading'
  siteStorageError.value = ''
  try {
    const result = await browser.manageStorage({
      tabId: tab.id,
      kind: siteStorageKind.value,
      action: 'list',
      includeValues: true
    })
    if (activeTab.value?.id !== tab.id) return
    siteStorageResult.value = result
    siteStorageState.value = 'idle'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    siteStorageResult.value = null
    siteStorageState.value = 'error'
    siteStorageError.value = error instanceof Error ? error.message : String(error)
  }
}

async function manageSiteStorageChanges(action: BrowserStorageChangesAction): Promise<void> {
  const tab = activeTab.value
  if (!tab || !activeWebUrl.value) return
  siteStorageChangesState.value = 'loading'
  siteStorageChangesError.value = ''
  siteStorageChangesCopied.value = false
  try {
    const report = await browser.storageChanges({ tabId: tab.id, action })
    if (activeTab.value?.id !== tab.id) return
    siteStorageChangesReport.value = report
    siteStorageChangesState.value = 'idle'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    siteStorageChangesState.value = 'error'
    siteStorageChangesError.value = error instanceof Error ? error.message : String(error)
  }
}

async function selectSiteStorageChanges(): Promise<void> {
  siteStorageUsageOpen.value = false
  siteStorageIndexedDbOpen.value = false
  siteStoragePwaOpen.value = false
  siteStorageChangesOpen.value = true
  siteStorageError.value = ''
  siteStorageKey.value = ''
  siteStorageValue.value = ''
  await manageSiteStorageChanges('get')
}

function storageChangeKindLabel(kind: BrowserStorageKind): string {
  if (kind === 'local-storage') return 'Local storage'
  if (kind === 'session-storage') return 'Session storage'
  return 'Cookie'
}

function inspectStorageChange(change: BrowserStorageChange): void {
  siteStorageUsageOpen.value = false
  siteStorageChangesOpen.value = false
  siteStorageIndexedDbOpen.value = false
  siteStoragePwaOpen.value = false
  siteStorageKind.value = change.kind
  siteStorageSearch.value = change.key
  void refreshSiteStorage()
}

async function loadSiteStorageUsage(): Promise<BrowserStorageUsageReport | null> {
  const tab = activeTab.value
  if (!tab || !activeWebUrl.value) return null
  siteStorageUsageState.value = 'loading'
  siteStorageUsageError.value = ''
  siteStorageUsageCopied.value = false
  try {
    const report = await browser.inspectStorageUsage(tab.id)
    if (activeTab.value?.id !== tab.id) return null
    siteStorageUsageReport.value = report
    siteStorageUsageState.value = 'idle'
    return report
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return null
    siteStorageUsageReport.value = null
    siteStorageUsageState.value = 'error'
    siteStorageUsageError.value = error instanceof Error ? error.message : String(error)
    return null
  }
}

async function selectSiteStorageUsage(): Promise<void> {
  siteStorageChangesOpen.value = false
  siteStorageIndexedDbOpen.value = false
  siteStoragePwaOpen.value = false
  siteStorageUsageOpen.value = true
  await loadSiteStorageUsage()
}

async function copySiteStorageUsage(): Promise<void> {
  if (!siteStorageUsageReport.value) return
  if (!await copyAppText(JSON.stringify(siteStorageUsageReport.value, null, 2))) return
  siteStorageUsageCopied.value = true
  window.setTimeout(() => (siteStorageUsageCopied.value = false), 1_500)
}

function storageUsageTypeLabel(storageType: string): string {
  const labels: Record<string, string> = {
    cache_storage: 'Cache Storage',
    caches: 'Cache Storage',
    indexeddb: 'IndexedDB',
    indexedDB: 'IndexedDB',
    local_storage: 'Local storage',
    service_workers: 'Service workers',
    serviceWorkerRegistrations: 'Service workers',
    shared_storage: 'Shared storage',
    storage_buckets: 'Storage buckets',
    file_systems: 'File systems',
    websql: 'Web SQL',
    shader_cache: 'Shader cache'
  }
  return labels[storageType] ?? storageType.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function storageUsageShare(bytes: number): number {
  const total = siteStorageUsageReport.value?.usage ?? 0
  return total > 0 ? Math.min(100, (bytes / total) * 100) : 0
}

function formatStorageUsagePercent(percent: number): string {
  if (percent <= 0) return '0%'
  if (percent < 0.01) return '<0.01%'
  return `${percent.toFixed(2).replace(/\.00$/, '')}%`
}

async function copySiteStorageChanges(): Promise<void> {
  if (siteStorageChangesReport.value?.status !== 'compared') return
  if (!await copyAppText(JSON.stringify(siteStorageChangesReport.value, null, 2))) return
  siteStorageChangesCopied.value = true
  window.setTimeout(() => (siteStorageChangesCopied.value = false), 1_500)
}

async function loadSiteStorageIndexedDb(
  database = siteStorageIndexedDbDatabase.value || undefined,
  objectStore = siteStorageIndexedDbStore.value || undefined,
  offset = siteStorageIndexedDbOffset.value
): Promise<BrowserIndexedDbReport | null> {
  const tab = activeTab.value
  if (!tab || !activeWebUrl.value) return null
  siteStorageIndexedDbState.value = 'loading'
  siteStorageIndexedDbError.value = ''
  siteStorageIndexedDbCopied.value = false
  try {
    const report = await browser.inspectIndexedDb({
      tabId: tab.id,
      database,
      objectStore,
      offset,
      limit: 50,
      includeValues: true
    })
    if (activeTab.value?.id !== tab.id) return null
    siteStorageIndexedDbReport.value = report
    siteStorageIndexedDbOffset.value = report.offset
    siteStorageIndexedDbState.value = 'idle'
    return report
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return null
    siteStorageIndexedDbReport.value = null
    siteStorageIndexedDbState.value = 'error'
    siteStorageIndexedDbError.value = error instanceof Error ? error.message : String(error)
    return null
  }
}

async function selectSiteStorageIndexedDb(): Promise<void> {
  siteStorageUsageOpen.value = false
  siteStorageChangesOpen.value = false
  siteStoragePwaOpen.value = false
  siteStorageIndexedDbOpen.value = true
  siteStorageError.value = ''
  siteStorageIndexedDbDatabase.value = ''
  siteStorageIndexedDbStore.value = ''
  siteStorageIndexedDbOffset.value = 0
  siteStorageIndexedDbSearch.value = ''
  const databases = await loadSiteStorageIndexedDb(undefined, undefined, 0)
  const firstDatabase = databases?.databases[0]?.name
  if (!firstDatabase) return
  siteStorageIndexedDbDatabase.value = firstDatabase
  const schema = await loadSiteStorageIndexedDb(firstDatabase, undefined, 0)
  const firstStore = schema?.selectedDatabase?.objectStores?.[0]?.name
  if (!firstStore) return
  siteStorageIndexedDbStore.value = firstStore
  await loadSiteStorageIndexedDb(firstDatabase, firstStore, 0)
}

async function selectSiteStorageIndexedDbDatabase(): Promise<void> {
  siteStorageIndexedDbStore.value = ''
  siteStorageIndexedDbOffset.value = 0
  siteStorageIndexedDbSearch.value = ''
  if (!siteStorageIndexedDbDatabase.value) {
    await loadSiteStorageIndexedDb(undefined, undefined, 0)
    return
  }
  const report = await loadSiteStorageIndexedDb(siteStorageIndexedDbDatabase.value, undefined, 0)
  const firstStore = report?.selectedDatabase?.objectStores?.[0]?.name
  if (!firstStore) return
  siteStorageIndexedDbStore.value = firstStore
  await loadSiteStorageIndexedDb(siteStorageIndexedDbDatabase.value, firstStore, 0)
}

async function selectSiteStorageIndexedDbStore(): Promise<void> {
  siteStorageIndexedDbOffset.value = 0
  siteStorageIndexedDbSearch.value = ''
  await loadSiteStorageIndexedDb()
}

async function moveSiteStorageIndexedDbPage(direction: -1 | 1): Promise<void> {
  const next = Math.max(0, siteStorageIndexedDbOffset.value + direction * 50)
  await loadSiteStorageIndexedDb(undefined, undefined, next)
}

async function copySiteStorageIndexedDb(): Promise<void> {
  const report = siteStorageIndexedDbReport.value
  if (!report) return
  if (!await copyAppText(JSON.stringify({
    ...report,
    entries: filteredSiteStorageIndexedDbEntries.value
  }, null, 2))) return
  siteStorageIndexedDbCopied.value = true
  window.setTimeout(() => (siteStorageIndexedDbCopied.value = false), 1_500)
}

async function loadSiteStoragePwa(
  cacheName = siteStoragePwaCache.value || undefined,
  offset = siteStoragePwaOffset.value
): Promise<BrowserPwaReport | null> {
  const tab = activeTab.value
  if (!tab || !activeWebUrl.value) return null
  siteStoragePwaState.value = 'loading'
  siteStoragePwaError.value = ''
  siteStoragePwaCopied.value = false
  try {
    const report = await browser.inspectPwa({
      tabId: tab.id,
      cacheName,
      query: siteStoragePwaQuery.value,
      offset,
      limit: 50
    })
    if (activeTab.value?.id !== tab.id) return null
    siteStoragePwaReport.value = report
    siteStoragePwaOffset.value = report.selectedCache?.offset ?? 0
    siteStoragePwaState.value = 'idle'
    return report
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return null
    siteStoragePwaReport.value = null
    siteStoragePwaState.value = 'error'
    siteStoragePwaError.value = error instanceof Error ? error.message : String(error)
    return null
  }
}

async function selectSiteStoragePwa(): Promise<void> {
  siteStorageUsageOpen.value = false
  siteStorageChangesOpen.value = false
  siteStorageIndexedDbOpen.value = false
  siteStoragePwaOpen.value = true
  siteStoragePwaCache.value = ''
  siteStoragePwaQuery.value = ''
  siteStoragePwaOffset.value = 0
  const report = await loadSiteStoragePwa(undefined, 0)
  const firstCache = report?.caches[0]?.name
  if (!firstCache || !report.cacheInspectionAvailable) return
  siteStoragePwaCache.value = firstCache
  await loadSiteStoragePwa(firstCache, 0)
}

async function selectSiteStoragePwaCache(): Promise<void> {
  siteStoragePwaOffset.value = 0
  await loadSiteStoragePwa(undefined, 0)
}

async function filterSiteStoragePwa(): Promise<void> {
  siteStoragePwaOffset.value = 0
  await loadSiteStoragePwa(undefined, 0)
}

async function moveSiteStoragePwaPage(direction: -1 | 1): Promise<void> {
  const next = Math.max(0, siteStoragePwaOffset.value + direction * 50)
  await loadSiteStoragePwa(undefined, next)
}

async function copySiteStoragePwa(): Promise<void> {
  if (!siteStoragePwaReport.value) return
  if (!await copyAppText(JSON.stringify(siteStoragePwaReport.value, null, 2))) return
  siteStoragePwaCopied.value = true
  window.setTimeout(() => (siteStoragePwaCopied.value = false), 1_500)
}

async function refreshActiveSiteStorageView(): Promise<void> {
  if (siteStorageUsageOpen.value) await loadSiteStorageUsage()
  else if (siteStoragePwaOpen.value) await loadSiteStoragePwa()
  else if (siteStorageIndexedDbOpen.value) await loadSiteStorageIndexedDb()
  else if (siteStorageChangesOpen.value) await manageSiteStorageChanges('get')
  else await refreshSiteStorage()
}

async function toggleSiteStorage(): Promise<void> {
  if (siteStorageOpen.value) {
    siteStorageOpen.value = false
    return
  }
  settingsOpen.value = false
  siteControlsOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  zoomOpen.value = false
  addressSuggestionsOpen.value = false
  resetSiteStorageView()
  siteStorageOpen.value = true
  await refreshSiteStorage()
}

async function selectSiteStorageKind(kind: BrowserStorageKind): Promise<void> {
  siteStorageUsageOpen.value = false
  siteStorageChangesOpen.value = false
  siteStorageIndexedDbOpen.value = false
  siteStoragePwaOpen.value = false
  siteStorageChangesError.value = ''
  siteStorageKind.value = kind
  siteStorageKey.value = ''
  siteStorageValue.value = ''
  await refreshSiteStorage()
}

function editSiteStorageItem(item: BrowserStorageItem): void {
  if (item.protected) return
  siteStorageKey.value = item.key
  siteStorageValue.value = item.value ?? ''
}

async function saveSiteStorageItem(): Promise<void> {
  const tab = activeTab.value
  if (!tab || !siteStorageKey.value.trim()) return
  siteStorageState.value = 'saving'
  siteStorageError.value = ''
  try {
    const result = await browser.manageStorage({
      tabId: tab.id,
      kind: siteStorageKind.value,
      action: 'set',
      key: siteStorageKey.value,
      value: siteStorageValue.value,
      includeValues: true
    })
    if (activeTab.value?.id !== tab.id) return
    siteStorageResult.value = result
    siteStorageKey.value = ''
    siteStorageValue.value = ''
    siteStorageState.value = 'idle'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    siteStorageState.value = 'error'
    siteStorageError.value = error instanceof Error ? error.message : String(error)
  }
}

async function deleteSiteStorageItem(item: BrowserStorageItem): Promise<void> {
  const tab = activeTab.value
  if (!tab || item.protected) return
  siteStorageState.value = 'saving'
  siteStorageError.value = ''
  try {
    const result = await browser.manageStorage({
      tabId: tab.id,
      kind: siteStorageKind.value,
      action: 'delete',
      key: item.key,
      includeValues: true
    })
    if (activeTab.value?.id !== tab.id) return
    siteStorageResult.value = result
    siteStorageState.value = 'idle'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    siteStorageState.value = 'error'
    siteStorageError.value = error instanceof Error ? error.message : String(error)
  }
}

async function clearSiteStorageKind(): Promise<void> {
  const tab = activeTab.value
  if (!tab || !siteStorageResult.value?.itemCount) return
  const protectedNote = siteStorageKind.value === 'cookies' ? ' HttpOnly cookies will remain protected.' : ''
  if (!window.confirm(`Clear ${siteStorageKindLabel.value.toLocaleLowerCase()} for ${activeHostname.value}?${protectedNote}`)) return
  siteStorageState.value = 'saving'
  siteStorageError.value = ''
  try {
    const result = await browser.manageStorage({
      tabId: tab.id,
      kind: siteStorageKind.value,
      action: 'clear',
      includeValues: true
    })
    if (activeTab.value?.id !== tab.id) return
    siteStorageResult.value = result
    siteStorageState.value = 'idle'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    siteStorageState.value = 'error'
    siteStorageError.value = error instanceof Error ? error.message : String(error)
  }
}

async function openTabGroupEditor(groupId: string): Promise<void> {
  const next = await browser.getState()
  state.value = next
  const group = next.mcpTabGroups.find((candidate) => candidate.id === groupId)
  if (!group) return
  workspaceEditorMode.value = 'edit'
  workspaceEditorOpen.value = true
  tabGroupEditorId.value = groupId
  tabGroupEditorName.value = group.name
  tabGroupEditorColor.value = group.color
  tabGroupEditorError.value = ''
  workspaceTransferDirection.value = 'from-default'
  workspaceStorageMessage.value = ''
  await loadWorkspaceStorageOrigins()
}

async function openNewWorkspaceEditor(): Promise<void> {
  workspaceEditorMode.value = 'create'
  workspaceEditorOpen.value = true
  tabGroupEditorId.value = null
  tabGroupEditorName.value = 'New workspace'
  tabGroupEditorColor.value = 'purple'
  tabGroupEditorError.value = ''
  workspaceStorageMode.value = 'scratch'
  workspaceTransferDirection.value = 'from-default'
  workspaceStorageMessage.value = ''
  await loadWorkspaceStorageOrigins()
}

function closeWorkspaceEditor(): void {
  workspaceEditorOpen.value = false
  tabGroupEditorId.value = null
  tabGroupEditorError.value = ''
  workspaceStorageState.value = 'idle'
  workspaceStorageMessage.value = ''
}

async function loadWorkspaceStorageOrigins(): Promise<void> {
  const defaultWorkspace = state.value.mcpTabGroups.find((workspace) => workspace.isDefault)
  const sourceId = workspaceEditorMode.value === 'create' || workspaceTransferDirection.value === 'from-default'
    ? defaultWorkspace?.id
    : tabGroupEditorId.value ?? undefined
  if (!sourceId) {
    workspaceOriginOptions.value = []
    workspaceSelectedOrigins.value = []
    return
  }
  workspaceStorageState.value = 'loading'
  workspaceStorageMessage.value = ''
  try {
    const origins = await browser.listWorkspaceStorageOrigins(sourceId)
    workspaceOriginOptions.value = origins
    workspaceSelectedOrigins.value = [...origins]
    workspaceStorageState.value = 'idle'
  } catch (error) {
    workspaceOriginOptions.value = []
    workspaceSelectedOrigins.value = []
    workspaceStorageState.value = 'error'
    workspaceStorageMessage.value = error instanceof Error ? error.message : String(error)
  }
}

function workspaceTransferOrigins(): string[] | undefined {
  const available = new Set(workspaceOriginOptions.value)
  const selected = [...new Set(workspaceSelectedOrigins.value.filter((origin) => available.has(origin)))]
  return selected.length === available.size && selected.every((origin) => available.has(origin))
    ? undefined
    : selected
}

async function saveWorkspaceEditor(): Promise<void> {
  if (!tabGroupEditorName.value.trim()) return
  try {
    if (workspaceEditorMode.value === 'create') {
      await syncState(browser.createWorkspace({
        name: tabGroupEditorName.value,
        color: tabGroupEditorColor.value,
        storage: workspaceStorageMode.value,
        ...(workspaceStorageMode.value === 'fork-default'
          ? { origins: workspaceTransferOrigins() }
          : {})
      }))
    } else if (tabGroupEditorId.value) {
      await syncState(browser.updateTabGroup(tabGroupEditorId.value, {
        name: tabGroupEditorName.value,
        color: tabGroupEditorColor.value
      }))
    }
    closeWorkspaceEditor()
  } catch (error) {
    tabGroupEditorError.value = error instanceof Error ? error.message : String(error)
  }
}

async function transferWorkspaceStorage(): Promise<void> {
  if (!tabGroupEditorId.value) return
  workspaceStorageState.value = 'saving'
  workspaceStorageMessage.value = ''
  try {
    const result = await browser.transferWorkspaceStorage({
      workspaceId: tabGroupEditorId.value,
      direction: workspaceTransferDirection.value,
      origins: workspaceTransferOrigins()
    })
    workspaceStorageState.value = 'saved'
    workspaceStorageMessage.value = `${result.cookieCount} cookies and ${result.localStorageItemCount} local storage items copied.`
    state.value = await browser.getState()
  } catch (error) {
    workspaceStorageState.value = 'error'
    workspaceStorageMessage.value = error instanceof Error ? error.message : String(error)
  }
}

async function closeEditedWorkspace(): Promise<void> {
  const workspace = state.value.mcpTabGroups.find((candidate) => candidate.id === tabGroupEditorId.value)
  if (!workspace || workspace.isDefault) return
  if (!window.confirm(`Close workspace "${workspace.name}"? Its tabs, cookies, local storage, cache, and other private browser data will be permanently deleted.`)) return
  try {
    await syncState(browser.closeWorkspace(workspace.id))
    closeWorkspaceEditor()
  } catch (error) {
    tabGroupEditorError.value = error instanceof Error ? error.message : String(error)
  }
}

async function openHistoryEntry(entry: BrowserHistoryEntry): Promise<void> {
  historyOpen.value = false
  await syncState(browser.newTab({ url: entry.url, active: true }))
}

async function removeHistoryEntry(id: string): Promise<void> {
  historyError.value = ''
  try {
    visitHistory.value = await window.bronomHistory.remove(id)
  } catch (error) {
    historyError.value = error instanceof Error ? error.message : String(error)
  }
}

async function clearVisitHistory(): Promise<void> {
  if (!visitHistory.value.length) return
  if (!window.confirm('Clear all browsing history? This will not remove cookies, passwords, bookmarks, or downloaded files.')) return
  historyError.value = ''
  try {
    visitHistory.value = await window.bronomHistory.clear()
  } catch (error) {
    historyError.value = error instanceof Error ? error.message : String(error)
  }
}

async function refreshBrowsingDataSummary(): Promise<void> {
  if (browsingDataState.value === 'clearing') return
  browsingDataState.value = 'loading'
  browsingDataMessage.value = ''
  try {
    browsingDataSummary.value = await window.bronomBrowsingData.summary()
    browsingDataState.value = 'idle'
  } catch (error) {
    browsingDataState.value = 'error'
    browsingDataMessage.value = error instanceof Error ? error.message : String(error)
  }
}

async function refreshJanitorWebsites(): Promise<void> {
  janitorState.value = 'loading'
  janitorMessage.value = ''
  try {
    janitorWebsites.value = await window.bronomBrowsingData.websites()
    janitorState.value = 'idle'
  } catch (error) {
    janitorState.value = 'error'
    janitorMessage.value = error instanceof Error ? error.message : String(error)
  }
}

async function clearSelectedBrowsingData(): Promise<void> {
  const selected: string[] = []
  if (browsingDataOptions.value.history) selected.push('Browsing history and its address suggestions')
  if (browsingDataOptions.value.cookiesAndSiteData) {
    selected.push('Cookies and site data (you may be signed out)')
  }
  if (browsingDataOptions.value.cache) selected.push('Cached images and files')
  if (!selected.length) return
  const confirmed = window.confirm([
    'Clear the selected browsing data for all websites?',
    '',
    ...selected.map((item) => `• ${item}`),
    '',
    'Bookmarks, downloaded files, saved passwords, and site-permission decisions will remain. Open pages will not reload automatically.'
  ].join('\n'))
  if (!confirmed) return
  browsingDataState.value = 'clearing'
  browsingDataMessage.value = ''
  try {
    browsingDataSummary.value = await window.bronomBrowsingData.clear(browsingDataOptions.value)
    janitorWebsites.value = await window.bronomBrowsingData.websites()
    browsingDataState.value = 'cleared'
    browsingDataMessage.value = `${selected.length === 1 ? 'Selected data was' : 'Selected data were'} cleared for all websites. Reload open pages when you are ready.`
  } catch (error) {
    browsingDataState.value = 'error'
    browsingDataMessage.value = error instanceof Error ? error.message : String(error)
  }
}

function janitorWebsiteMeta(site: BrowsingDataWebsiteSummary): string[] {
  const items: string[] = []
  if (site.cookieCount) items.push(`${site.cookieCount} ${site.cookieCount === 1 ? 'cookie' : 'cookies'}`)
  if (site.historyEntries) items.push(`${site.historyEntries} history ${site.historyEntries === 1 ? 'page' : 'pages'} · ${site.historyVisits} ${site.historyVisits === 1 ? 'visit' : 'visits'}`)
  if (site.openTabCount) items.push(`${site.openTabCount} open ${site.openTabCount === 1 ? 'tab' : 'tabs'}`)
  if (site.bookmarkCount) items.push(`${site.bookmarkCount} ${site.bookmarkCount === 1 ? 'bookmark' : 'bookmarks'} kept`)
  if (site.savedPasswordCount) items.push(`${site.savedPasswordCount} saved ${site.savedPasswordCount === 1 ? 'account' : 'accounts'} kept`)
  if (site.permissionDecisionCount) items.push(`${site.permissionDecisionCount} permission ${site.permissionDecisionCount === 1 ? 'decision' : 'decisions'} kept`)
  return items
}

async function clearJanitorWebsite(site: BrowsingDataWebsiteSummary): Promise<void> {
  const selected: string[] = []
  if (browsingDataOptions.value.history) selected.push('Browsing history and address suggestions')
  if (browsingDataOptions.value.cookiesAndSiteData) selected.push('Cookies and site storage (you may be signed out)')
  if (browsingDataOptions.value.cache) selected.push('Cached images and files')
  if (!selected.length) return
  const confirmed = window.confirm([
    `Clear the selected data for ${site.origin}?`,
    '',
    ...selected.map((item) => `• ${item}`),
    '',
    'Related subdomains may share cookies. Bookmarks, saved passwords, site permissions, downloads, settings, and open tabs will remain.'
  ].join('\n'))
  if (!confirmed) return
  janitorState.value = 'clearing'
  janitorClearingOrigin.value = site.origin
  janitorMessage.value = ''
  try {
    browsingDataSummary.value = await window.bronomBrowsingData.clear({ ...browsingDataOptions.value, origin: site.origin })
    janitorWebsites.value = await window.bronomBrowsingData.websites()
    janitorState.value = 'cleared'
    janitorMessage.value = `Selected data was cleared for ${site.origin}. Open pages were left in place.`
  } catch (error) {
    janitorState.value = 'error'
    janitorMessage.value = error instanceof Error ? error.message : String(error)
  } finally {
    janitorClearingOrigin.value = null
  }
}

function historyEntryMeta(entry: BrowserHistoryEntry): string {
  const visited = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(entry.visitedAt))
  return entry.visitCount > 1 ? `${visited} · ${entry.visitCount} visits` : visited
}

async function toggleTabSearch(): Promise<void> {
  if (tabSearchOpen.value) {
    tabSearchOpen.value = false
    return
  }
  settingsOpen.value = false
  updateNoticeOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  zoomOpen.value = false
  if (findOpen.value) await closeFind()
  tabSearchQuery.value = ''
  tabSearchSelection.value = Math.max(0, tabSearchResults.value.findIndex((result) => result.kind === 'open' && result.tab.active))
  tabSearchOpen.value = true
  await nextTick()
  tabSearchInput.value?.focus()
  tabSearchInput.value?.select()
  revealSelectedTabSearchResult()
}

async function toggleCommandPalette(): Promise<void> {
  if (commandPaletteOpen.value) {
    commandPaletteOpen.value = false
    return
  }
  settingsOpen.value = false
  helpDialog.value = null
  closeTransientPanels()
  commandPaletteQuery.value = ''
  commandPaletteSelection.value = 0
  commandPaletteOpen.value = true
  await nextTick()
  commandPaletteInput.value?.focus()
  revealSelectedCommandPaletteCommand()
}

function commandPaletteCommandId(command: CommandPaletteCommand): string {
  return `command-palette-${command.id}`
}

function revealSelectedCommandPaletteCommand(): void {
  const command = selectedCommandPaletteCommand.value
  if (!command) return
  document.getElementById(commandPaletteCommandId(command))?.scrollIntoView({ block: 'nearest' })
}

async function moveCommandPaletteSelection(offset: -1 | 1): Promise<void> {
  if (!commandPaletteCommands.value.length) return
  commandPaletteSelection.value = (
    commandPaletteSelection.value + offset + commandPaletteCommands.value.length
  ) % commandPaletteCommands.value.length
  await nextTick()
  revealSelectedCommandPaletteCommand()
}

function handleCommandPaletteKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    void moveCommandPaletteSelection(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    void moveCommandPaletteSelection(-1)
    return
  }
  if (event.key === 'Enter' && selectedCommandPaletteCommand.value) {
    event.preventDefault()
    void runCommandPaletteCommand(selectedCommandPaletteCommand.value.id)
  }
}

function openSettingsSection(section: typeof settingsSection.value): void {
  commandPaletteOpen.value = false
  helpDialog.value = null
  closeTransientPanels()
  settingsSection.value = section
  settingsOpen.value = true
}

async function runCommandPaletteCommand(commandId: CommandPaletteCommandId): Promise<void> {
  commandPaletteOpen.value = false
  switch (commandId) {
    case 'home': return openApplicationHome()
    case 'new-tab': return runBrowserShortcut('new-tab')
    case 'search-tabs': return toggleTabSearch()
    case 'downloads': return toggleDownloads()
    case 'bookmarks': return toggleBookmarks()
    case 'history': return toggleVisitHistory()
    case 'find': return openFind()
    case 'reload': return runBrowserShortcut('reload')
    case 'reload-ignoring-cache': return runBrowserShortcut('reload-ignoring-cache')
    case 'capture-area': return toggleAreaCapture()
    case 'capture-element': return toggleElementPicker('screenshot')
    case 'capture-viewport': return capturePageScreenshot('viewport')
    case 'capture-full-page': return capturePageScreenshot('full-page')
    case 'copy-snapshot': return copyPageSnapshot()
    case 'pick-element': return toggleElementPicker('context')
    case 'page-tools': return togglePageTools()
    case 'site-storage': return toggleSiteStorage()
    case 'responsive-preview': return toggleResponsivePreview()
    case 'environment': return toggleEnvironment()
    case 'console': return toggleConsole()
    case 'network': return toggleNetworkMonitor()
    case 'request-conditions': return openRequestConditions()
    case 'issues': return toggleInspectorIssues()
    case 'debug-report': return toggleDebugReport()
    case 'repro-recorder': return toggleReproRecorder()
    case 'dom-changes': return toggleDomChanges()
    case 'visual-compare': return toggleVisualCompare()
    case 'quality-audit': return toggleQualityAudit()
    case 'accessibility': return toggleAccessibilityAudit()
    case 'performance': return togglePerformanceReport()
    case 'design-overview': return toggleDesignOverview()
    case 'page-metadata': return togglePageMetadata()
    case 'security': return toggleSecurityReport()
    case 'coverage': return toggleCodeCoverage()
    case 'cpu-profile': return toggleCpuProfile()
    case 'memory': return toggleMemoryReport()
    case 'developer-tools': return toggleDeveloperTools()
    case 'settings': return openSettingsSection('appearance')
    case 'privacy': return openPrivacySettings()
    case 'site-permissions': return openSettingsSection('permissions')
    case 'mcp-security': return openSettingsSection('mcp')
    case 'updates': return openUpdateSettings()
    case 'keyboard-shortcuts': return openHelpDialog('shortcuts')
    case 'toggle-mcp-pause': return toggleMcpPaused()
  }
}

async function selectSearchTab(tab: BrowserTabState): Promise<void> {
  tabSearchOpen.value = false
  expandTabGroupForTab(tab)
  await selectBrowserTab(tab.id)
}

async function closeSearchTab(event: MouseEvent, tabId: string): Promise<void> {
  event.stopPropagation()
  await syncState(browser.closeTab(tabId))
  tabSearchSelection.value = Math.min(tabSearchSelection.value, Math.max(0, tabSearchResults.value.length - 1))
  await nextTick()
  tabSearchInput.value?.focus()
  revealSelectedTabSearchResult()
}

async function restoreSearchTab(tab: BrowserClosedTabState): Promise<void> {
  tabSearchOpen.value = false
  await syncState(browser.reopenClosedTab(tab.id))
}

async function togglePinnedSearchTab(event: MouseEvent, tab: BrowserTabState): Promise<void> {
  event.stopPropagation()
  await syncState(browser.setTabPinned(tab.id, !tab.pinned))
  await nextTick()
  tabSearchInput.value?.focus()
  revealSelectedTabSearchResult()
}

function clearTabDrag(): void {
  draggedTabId.value = null
  tabDropTargetId.value = null
  tabDropPlacement.value = null
}

function canDropTab(target: BrowserTabState): boolean {
  const dragged = regularTabs.value.find((tab) => tab.id === draggedTabId.value)
  return Boolean(dragged && dragged.id !== target.id && dragged.pinned === target.pinned)
}

function beginTabDrag(event: DragEvent, tab: BrowserTabState): void {
  draggedTabId.value = tab.id
  tabDropTargetId.value = null
  tabDropPlacement.value = null
  tabSearchOpen.value = false
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', tab.id)
  }
}

function updateTabDrop(event: DragEvent, tab: BrowserTabState): void {
  if (!canDropTab(tab)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
  tabDropTargetId.value = tab.id
  tabDropPlacement.value = event.clientX < bounds.left + bounds.width / 2 ? 'before' : 'after'
}

async function finishTabDrop(event: DragEvent, tab: BrowserTabState): Promise<void> {
  if (!canDropTab(tab) || !draggedTabId.value || !tabDropPlacement.value) {
    clearTabDrag()
    return
  }
  event.preventDefault()
  const tabId = draggedTabId.value
  const placement = tabDropPlacement.value
  clearTabDrag()
  await syncState(browser.reorderTab(tabId, tab.id, placement))
}

function tabSearchResultId(result: TabSearchResult): string {
  return `tab-search-${result.kind}-${result.tab.id}`
}

function tabSearchResultLabel(result: TabSearchResult): string {
  return result.kind === 'saved' ? result.tab.name : result.tab.title || 'New tab'
}

function tabSearchResultIndex(kind: TabSearchResult['kind'], id: string): number {
  return tabSearchResults.value.findIndex((result) => result.kind === kind && result.tab.id === id)
}

function revealSelectedTabSearchResult(): void {
  const result = selectedTabSearchResult.value
  if (!result) return
  document.getElementById(tabSearchResultId(result))?.scrollIntoView({ block: 'nearest' })
}

async function moveTabSearchSelection(offset: -1 | 1): Promise<void> {
  if (!tabSearchResults.value.length) return
  tabSearchSelection.value = (tabSearchSelection.value + offset + tabSearchResults.value.length) % tabSearchResults.value.length
  await nextTick()
  revealSelectedTabSearchResult()
}

function handleTabSearchKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    void moveTabSearchSelection(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    void moveTabSearchSelection(-1)
    return
  }
  if (event.key === 'Enter' && selectedTabSearchResult.value) {
    event.preventDefault()
    const result = selectedTabSearchResult.value
    if (result.kind === 'open') void selectSearchTab(result.tab)
    else if (result.kind === 'closed') void restoreSearchTab(result.tab)
    else void restoreSavedTabGroup(result.tab)
  }
}

async function restoreSavedTabGroup(group: BrowserSavedTabGroupState): Promise<void> {
  try {
    await syncState(browser.restoreSavedTabGroup(group.id))
    tabSearchOpen.value = false
  } catch (error) {
    showAppToast('error', 'Restore workspace failed', friendlyUiError(error, 'The archived workspace could not be restored.'))
  }
}

async function deleteSavedTabGroup(event: MouseEvent, group: BrowserSavedTabGroupState): Promise<void> {
  event.stopPropagation()
  if (!window.confirm(`Delete archived workspace "${group.name}" and its ${group.tabs.length} saved ${group.tabs.length === 1 ? 'tab' : 'tabs'}? Its isolated browser data will also be deleted.`)) return
  try {
    await syncState(browser.deleteSavedTabGroup(group.id))
    tabSearchSelection.value = Math.min(tabSearchSelection.value, Math.max(0, tabSearchResults.value.length - 1))
    await nextTick()
    tabSearchInput.value?.focus()
  } catch (error) {
    showAppToast('error', 'Delete workspace failed', friendlyUiError(error, 'The archived workspace could not be deleted.'))
  }
}

function tabSearchMeta(tab: BrowserTabState): string {
  const status: string[] = []
  if (tab.mcpGroupName) status.push(`Group: ${tab.mcpGroupName}`)
  if (tab.pinned) status.push('Pinned')
  if (tab.active) status.push('Current tab')
  if (state.value.allHumanInteractionLocked || tab.humanInteractionLocked) status.push('Interaction locked')
  if (tab.muted) status.push('Muted')
  else if (tab.audible) status.push('Playing audio')
  if (mcpActivityByTab.value[tab.id]) status.push('Agent active')
  if (tab.emulation) status.push(`Emulated: ${emulationDescription(tab.emulation)}`)
  if (tab.networkRouteCount) status.push(`${tab.networkRouteCount} temporary network ${tab.networkRouteCount === 1 ? 'route' : 'routes'}`)
  return status.join(' · ')
}

function networkEmulationLabel(network: BrowserEmulationState['network']): string {
  if (network === 'slow-3g') return 'Slow 3G'
  if (network === 'slow-4g') return 'Slow 4G'
  if (network === 'fast-4g') return 'Fast 4G'
  if (network === 'offline') return 'Offline'
  return 'Normal network'
}

function emulationLabel(emulation: BrowserEmulationState): string {
  if (emulation.network !== 'none') return networkEmulationLabel(emulation.network)
  if (emulation.cacheDisabled) return 'Cache disabled'
  if (emulation.bypassServiceWorker) return 'Service worker bypassed'
  if (emulation.dataSaver !== 'auto') return emulation.dataSaver === 'enabled' ? 'Data Saver on' : 'Data Saver off'
  if (emulation.javaScriptDisabled) return 'JavaScript disabled'
  if (emulation.viewport) return `${emulation.viewport.width}\u00d7${emulation.viewport.height}${emulation.viewport.mobile ? ' Mobile' : ''}`
  if (emulation.locale) return `${emulation.locale} locale`
  if (emulation.timezoneId) return emulation.timezoneId
  if (emulation.geolocation) return 'Location override'
  if (emulation.cpuThrottlingRate > 1) return `CPU ${emulation.cpuThrottlingRate}\u00d7`
  if ((emulation.animationPlaybackRate ?? 1) !== 1) return emulation.animationPlaybackRate === 0 ? 'Animations paused' : `Animations ${Math.round(emulation.animationPlaybackRate! * 100)}%`
  if (emulation.colorScheme !== 'auto') return `${emulation.colorScheme === 'dark' ? 'Dark' : 'Light'} mode`
  if (emulation.reducedMotion !== 'auto') return emulation.reducedMotion === 'reduce' ? 'Reduced motion' : 'Full motion'
  if (emulation.mediaType !== 'auto') return `${emulation.mediaType === 'print' ? 'Print' : 'Screen'} media`
  if (emulation.forcedColors !== 'auto') return emulation.forcedColors === 'active' ? 'Forced colors' : 'No forced colors'
  if (emulation.contrast !== 'auto') return `${emulation.contrast} contrast`
  if (emulation.reducedTransparency !== 'auto') return emulation.reducedTransparency === 'reduce' ? 'Reduced transparency' : 'Full transparency'
  if (emulation.visionDeficiency !== 'none') return visionDeficiencyLabel(emulation.visionDeficiency)
  if (emulation.renderingDebug?.paintFlashing) return 'Paint flashing'
  if (emulation.renderingDebug?.layoutShiftRegions) return 'Layout shifts'
  if (emulation.renderingDebug?.layerBorders) return 'Layer borders'
  if (emulation.renderingDebug?.fpsCounter) return 'Frame stats'
  if (emulation.renderingDebug?.scrollBottlenecks) return 'Scroll issues'
  if (emulation.extraHttpHeaderNames?.length) return `${emulation.extraHttpHeaderNames.length} request ${emulation.extraHttpHeaderNames.length === 1 ? 'header' : 'headers'}`
  return 'Custom browser'
}

function emulationDescription(emulation: BrowserEmulationState): string {
  const conditions: string[] = []
  if (emulation.network !== 'none') conditions.push(networkEmulationLabel(emulation.network))
  if (emulation.cacheDisabled) conditions.push('HTTP cache disabled')
  if (emulation.bypassServiceWorker) conditions.push('service worker bypassed')
  if (emulation.dataSaver !== 'auto') conditions.push(`Data Saver ${emulation.dataSaver === 'enabled' ? 'on' : 'off'}`)
  if (emulation.javaScriptDisabled) conditions.push('JavaScript disabled')
  if (emulation.viewport) {
    conditions.push(`${emulation.viewport.width}\u00d7${emulation.viewport.height} at ${emulation.viewport.deviceScaleFactor}\u00d7${emulation.viewport.mobile ? ' mobile' : ''}${emulation.viewport.touch ? ' touch' : ''} ${emulation.viewport.orientation} viewport`)
  }
  if (emulation.geolocation) conditions.push('custom geolocation')
  if (emulation.locale) conditions.push(`${emulation.locale} locale`)
  if (emulation.timezoneId) conditions.push(`${emulation.timezoneId} time zone`)
  if (emulation.cpuThrottlingRate > 1) conditions.push(`CPU ${emulation.cpuThrottlingRate}\u00d7 slower`)
  if ((emulation.animationPlaybackRate ?? 1) !== 1) conditions.push(emulation.animationPlaybackRate === 0 ? 'animations paused' : `animations at ${Math.round(emulation.animationPlaybackRate! * 100)}% speed`)
  if (emulation.colorScheme !== 'auto') conditions.push(`${emulation.colorScheme} color scheme`)
  if (emulation.reducedMotion !== 'auto') conditions.push(emulation.reducedMotion === 'reduce' ? 'reduced motion' : 'no reduced motion')
  if (emulation.mediaType !== 'auto') conditions.push(`${emulation.mediaType} media`)
  if (emulation.forcedColors !== 'auto') conditions.push(`forced colors ${emulation.forcedColors}`)
  if (emulation.contrast !== 'auto') conditions.push(`${emulation.contrast} contrast preference`)
  if (emulation.reducedTransparency !== 'auto') conditions.push(emulation.reducedTransparency === 'reduce' ? 'reduced transparency' : 'no reduced transparency')
  if (emulation.visionDeficiency !== 'none') conditions.push(`${visionDeficiencyLabel(emulation.visionDeficiency)} simulation`)
  if (emulation.renderingDebug?.paintFlashing) conditions.push('paint flashing')
  if (emulation.renderingDebug?.layoutShiftRegions) conditions.push('layout shift regions')
  if (emulation.renderingDebug?.layerBorders) conditions.push('layer borders')
  if (emulation.renderingDebug?.fpsCounter) conditions.push('frame rendering stats')
  if (emulation.renderingDebug?.scrollBottlenecks) conditions.push('scrolling performance issues')
  if (emulation.userAgent) conditions.push('custom user agent')
  if (emulation.extraHttpHeaderNames?.length) {
    conditions.push(`${emulation.extraHttpHeaderNames.length} custom request ${emulation.extraHttpHeaderNames.length === 1 ? 'header' : 'headers'}`)
  }
  return conditions.join(', ') || 'custom browser conditions'
}

function visionDeficiencyLabel(value: BrowserEmulationState['visionDeficiency']): string {
  if (value === 'blurredVision') return 'Blurred vision'
  if (value === 'reducedContrast') return 'Reduced contrast'
  if (value === 'protanopia') return 'Protanopia'
  if (value === 'deuteranopia') return 'Deuteranopia'
  if (value === 'tritanopia') return 'Tritanopia'
  if (value === 'achromatopsia') return 'Achromatopsia'
  return 'No vision simulation'
}

async function resetActiveTabEmulation(): Promise<void> {
  const tab = activeTab.value
  if (!tab?.emulation) return
  const requestSequence = ++emulationMutationSequence
  const nextState = await browser.resetTabEmulation(tab.id)
  if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
  state.value = nextState
  if (responsivePanelOpen.value) loadResponsiveDraft(activeTab.value?.emulation?.viewport)
  if (environmentPanelOpen.value) loadEnvironmentDraft(activeTab.value?.emulation)
}

function loadResponsiveDraft(viewport = activeEmulation.value?.viewport): void {
  responsiveState.value = 'idle'
  responsiveError.value = ''
  if (!viewport) {
    responsivePresetId.value = 'phone'
    responsiveOrientation.value = 'portrait'
    const fallback = resolveViewportPreset('phone')
    responsiveWidth.value = fallback.width
    responsiveHeight.value = fallback.height
    responsiveDeviceScaleFactor.value = fallback.deviceScaleFactor
    responsiveMobile.value = fallback.mobile
    responsiveTouch.value = fallback.touch
    return
  }
  const preset = matchingViewportPreset(viewport)
  responsivePresetId.value = preset?.id ?? 'custom'
  responsiveOrientation.value = viewport.orientation
  responsiveWidth.value = viewport.width
  responsiveHeight.value = viewport.height
  responsiveDeviceScaleFactor.value = viewport.deviceScaleFactor
  responsiveMobile.value = viewport.mobile
  responsiveTouch.value = viewport.touch
}

function selectResponsivePreset(presetId: BrowserViewportPresetId | 'custom'): void {
  responsivePresetId.value = presetId
  responsiveState.value = 'idle'
  responsiveError.value = ''
  if (presetId === 'custom') return
  const viewport = resolveViewportPreset(presetId, responsiveOrientation.value)
  responsiveWidth.value = viewport.width
  responsiveHeight.value = viewport.height
  responsiveDeviceScaleFactor.value = viewport.deviceScaleFactor
  responsiveMobile.value = viewport.mobile
  responsiveTouch.value = viewport.touch
}

function setResponsiveOrientation(orientation: BrowserViewportOrientation): void {
  if (responsiveOrientation.value === orientation) return
  if (responsivePresetId.value === 'custom') {
    const width = responsiveWidth.value
    responsiveWidth.value = responsiveHeight.value
    responsiveHeight.value = width
  } else {
    const viewport = resolveViewportPreset(responsivePresetId.value, orientation)
    responsiveWidth.value = viewport.width
    responsiveHeight.value = viewport.height
  }
  responsiveOrientation.value = orientation
  responsiveState.value = 'idle'
  responsiveError.value = ''
}

function toggleResponsiveOrientation(): void {
  setResponsiveOrientation(responsiveOrientation.value === 'portrait' ? 'landscape' : 'portrait')
}

function toggleResponsivePreview(): void {
  if (responsivePanelOpen.value) {
    responsivePanelOpen.value = false
    return
  }
  closeTransientPanels()
  loadResponsiveDraft()
  responsivePanelOpen.value = true
}

async function applyResponsivePreview(): Promise<void> {
  const tab = activeTab.value
  const viewport = responsiveViewport.value
  if (!tab || !viewport) return
  const requestSequence = ++emulationMutationSequence
  responsiveState.value = 'applying'
  responsiveError.value = ''
  try {
    const nextState = await browser.setTabViewport(tab.id, viewport)
    if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
    state.value = nextState
    responsiveState.value = 'applied'
  } catch (error) {
    if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
    responsiveState.value = 'error'
    responsiveError.value = error instanceof Error ? error.message : String(error)
  }
}

async function resetResponsivePreview(): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  const requestSequence = ++emulationMutationSequence
  responsiveState.value = 'applying'
  responsiveError.value = ''
  try {
    const nextState = await browser.setTabViewport(tab.id, null)
    if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
    state.value = nextState
    loadResponsiveDraft(undefined)
  } catch (error) {
    if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
    responsiveState.value = 'error'
    responsiveError.value = error instanceof Error ? error.message : String(error)
  }
}

function loadEnvironmentDraft(emulation = activeEmulation.value): void {
  const environment = browserEnvironmentFromEmulation(emulation)
  environmentDraft.value = environment
  environmentLocationEnabled.value = environment.geolocation !== null
  if (environment.geolocation) {
    environmentLatitude.value = environment.geolocation.latitude
    environmentLongitude.value = environment.geolocation.longitude
    environmentAccuracy.value = environment.geolocation.accuracy
  }
  environmentState.value = 'idle'
  environmentError.value = ''
}

function toggleEnvironment(): void {
  if (environmentPanelOpen.value) {
    environmentPanelOpen.value = false
    return
  }
  closeTransientPanels()
  loadEnvironmentDraft()
  environmentPanelOpen.value = true
}

async function applyEnvironment(reload = false): Promise<void> {
  const tab = activeTab.value
  const environment = environmentSettingsDraft.value
  if (!tab || !environment) return
  const requestSequence = ++emulationMutationSequence
  environmentState.value = 'applying'
  environmentError.value = ''
  try {
    let nextState = await browser.setTabEnvironment(tab.id, environment)
    if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
    if (reload) {
      nextState = await browser.reloadIgnoringCache(tab.id)
      if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
    }
    state.value = nextState
    loadEnvironmentDraft(activeTab.value?.emulation)
    environmentState.value = 'applied'
  } catch (error) {
    if (requestSequence !== emulationMutationSequence || activeTab.value?.id !== tab.id) return
    environmentState.value = 'error'
    environmentError.value = error instanceof Error ? error.message : String(error)
  }
}

async function resetEnvironment(): Promise<void> {
  environmentDraft.value = browserEnvironmentFromEmulation()
  environmentLocationEnabled.value = false
  await applyEnvironment(false)
}

async function clearActiveNetworkRoutes(): Promise<void> {
  const tab = activeTab.value
  if (!tab?.networkRouteCount) return
  const requestSequence = ++networkRouteMutationSequence
  const nextState = await browser.clearNetworkRoutes(tab.id)
  if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
  state.value = nextState
  networkRoutes.value = []
  networkRouteState.value = 'ready'
}

function closedTabMeta(tab: BrowserClosedTabState): string {
  const elapsed = Math.max(0, Date.now() - Date.parse(tab.closedAt))
  let closed: string
  if (elapsed < 60_000) closed = 'Closed just now'
  else if (elapsed < 60 * 60_000) {
    const minutes = Math.max(1, Math.floor(elapsed / 60_000))
    closed = `Closed ${minutes} min ago`
  } else {
    closed = `Closed ${new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(new Date(tab.closedAt))}`
  }
  return tab.pinned ? `Pinned · ${closed}` : closed
}

async function cancelDownload(downloadId: string): Promise<void> {
  downloadActionError.value = ''
  try {
    downloads.value = await window.bronomDownloads.cancel(downloadId)
  } catch (error) {
    downloadActionError.value = error instanceof Error ? error.message : String(error)
  }
}

async function clearFinishedDownloads(): Promise<void> {
  downloadActionError.value = ''
  downloads.value = await window.bronomDownloads.clearFinished()
}

async function showDownloadInFolder(downloadId: string): Promise<void> {
  downloadActionError.value = ''
  try {
    await window.bronomDownloads.showInFolder(downloadId)
  } catch (error) {
    downloadActionError.value = error instanceof Error ? error.message : String(error)
  }
}

watch(settingsOpen, async () => {
  if (!settingsOpen.value && settingsSection.value === 'privacy') janitorSearch.value = ''
  await nextTick()
  reportShellHeight()
  if (settingsOpen.value) settingsPanel.value?.focus()
})

watch(helpDialog, async () => {
  await nextTick()
  reportShellHeight()
  helpDialogPanel.value?.focus()
})

watch([settingsOpen, settingsSection], ([open, section]) => {
  if (open && section === 'privacy') {
    void refreshBrowsingDataSummary()
    void refreshJanitorWebsites()
  }
})

watch(workspaceTransferDirection, () => {
  if (workspaceEditorOpen.value && workspaceEditorMode.value === 'edit') void loadWorkspaceStorageOrigins()
})

watch(updateNoticeOpen, async () => {
  await nextTick()
  reportShellHeight()
})

watch(findOpen, async () => {
  await nextTick()
  reportShellHeight()
})

watch(zoomOpen, async () => {
  await nextTick()
  reportShellHeight()
})

watch(
  [
    siteControlsOpen,
    siteStorageOpen,
    addressSuggestionsOpen,
    pageToolsOpen,
    responsivePanelOpen,
    environmentPanelOpen,
    accessibilityPanelOpen,
    qualityAuditPanelOpen,
    performancePanelOpen,
    designOverviewPanelOpen,
    pageMetadataPanelOpen,
    securityPanelOpen,
    coveragePanelOpen,
    cpuProfilePanelOpen,
    memoryPanelOpen,
    consolePanelOpen,
    debugReportPanelOpen,
    reproPanelOpen,
    domChangesPanelOpen,
    visualComparePanelOpen,
    inspectorIssuesOpen,
    networkMonitorOpen,
    commandPaletteOpen,
    tabSearchOpen,
    downloadsOpen,
    bookmarksOpen,
    historyOpen,
    splitMenuOpen,
    workspaceEditorOpen,
    credentialPickerOpen
  ],
  async () => {
    await nextTick()
    reportShellHeight()
  }
)

watch(panelDock, async (dock) => {
  if (isDetachedPanelWindow) {
    const panel = activePanelId.value
    if (dock !== 'window' && panel) await window.bronomPanelWindow.redock(panel, dock)
    return
  }
  window.localStorage.setItem('bronom:panel-dock', dock)
  if (dock === 'window' && activePanelId.value) {
    await window.bronomPanelWindow.open(activePanelId.value)
  }
  await nextTick()
  reportShellHeight()
})

watch(activePanelId, async (panel) => {
  if (isDetachedPanelWindow) {
    if (panel) await window.bronomPanelWindow.setActive(panel)
    else await window.bronomPanelWindow.close()
    return
  }
  if (syncingDetachedPanelState) return
  if (panelDock.value !== 'window') return
  if (panel) await window.bronomPanelWindow.open(panel)
  else await window.bronomPanelWindow.close()
})

watch(
  [settingsOpen, commandPaletteOpen, helpDialog, workspaceEditorOpen, credentialPickerOpen, siteControlsOpen, siteStorageOpen, addressSuggestionsOpen, findOpen, zoomOpen, splitMenuOpen, tabSearchOpen, downloadsOpen, bookmarksOpen, historyOpen],
  (openStates) => {
    if (openStates.some(Boolean) && !keepsSeparatePanelOpen()) {
      pageToolsOpen.value = false
      environmentPanelOpen.value = false
      accessibilityPanelOpen.value = false
      qualityAuditPanelOpen.value = false
      performancePanelOpen.value = false
      designOverviewPanelOpen.value = false
      pageMetadataPanelOpen.value = false
      securityPanelOpen.value = false
      coveragePanelOpen.value = false
      cpuProfilePanelOpen.value = false
      memoryPanelOpen.value = false
      consolePanelOpen.value = false
      reproPanelOpen.value = false
      domChangesPanelOpen.value = false
      visualComparePanelOpen.value = false
      inspectorIssuesOpen.value = false
      networkMonitorOpen.value = false
    }
  }
)

// The address suggestions are rendered in a topmost native WebContentsView.
// Dismiss it synchronously before any full renderer modal opens so the native
// overlay can never cover Settings, Help, the command palette, or a picker.
watch(fullModalOpen, (open) => {
  if (open) closeAddressSuggestions()
}, { flush: 'sync' })

watch(consolePanelOpen, (open) => {
  if (consoleRefreshTimer !== undefined) {
    window.clearInterval(consoleRefreshTimer)
    consoleRefreshTimer = undefined
  }
  if (!open) return
  if (consoleState.value === 'idle') void refreshConsole()
  consoleRefreshTimer = window.setInterval(() => {
    if (consolePanelOpen.value) void refreshConsole(false, true)
  }, 1_000)
}, { immediate: true })

watch(domChangesPanelOpen, (open) => {
  if (domChangesRefreshTimer !== undefined) {
    window.clearInterval(domChangesRefreshTimer)
    domChangesRefreshTimer = undefined
  }
  if (!open) return
  void manageDomChanges('get')
  domChangesRefreshTimer = window.setInterval(() => {
    if (domChangesPanelOpen.value && domChangesReport.value?.active) void manageDomChanges('get', true)
  }, 1_000)
}, { immediate: true })

watch(tabSearchQuery, async () => {
  tabSearchSelection.value = 0
  await nextTick()
  revealSelectedTabSearchResult()
})

watch(commandPaletteQuery, async () => {
  commandPaletteSelection.value = 0
  await nextTick()
  revealSelectedCommandPaletteCommand()
})

watch(
  () => commandPaletteCommands.value.length,
  async (length) => {
    commandPaletteSelection.value = Math.min(commandPaletteSelection.value, Math.max(0, length - 1))
    await nextTick()
    revealSelectedCommandPaletteCommand()
  }
)

watch(
  () => tabSearchResults.value.length,
  async (length) => {
    tabSearchSelection.value = Math.min(tabSearchSelection.value, Math.max(0, length - 1))
    await nextTick()
    revealSelectedTabSearchResult()
  }
)

watch(
  () => addressSuggestions.value.length,
  async (length) => {
    if (addressSuggestionSelection.value >= length) addressSuggestionSelection.value = -1
    await nextTick()
    revealSelectedAddressSuggestion()
  }
)

watch(
  [addressSuggestionsVisible, addressSuggestions, addressSuggestionSelection, addressSuggestionTheme],
  async () => {
    await nextTick()
    syncAddressSuggestionOverlay()
  }
)

watch(credentialPickerQuery, async () => {
  credentialPickerSelection.value = 0
  await nextTick()
  revealSelectedCredential()
})

watch(
  () => activeTab.value?.id,
  () => {
    credentialPickerOpen.value = false
  }
)

watch(
  () => state.value.allHumanInteractionLocked,
  async (locked) => {
    if (!locked) return
    await nextTick()
    allInteractionLockButton.value?.focus()
  }
)

watch(
  [updateNoticeOpen, () => updateState.value.status],
  ([open, status]) => {
    if (updateNoticeDismissTimer !== undefined) {
      window.clearTimeout(updateNoticeDismissTimer)
      updateNoticeDismissTimer = undefined
    }
    if (open && shouldAutoDismissUpdateStatus(status)) {
      updateNoticeDismissTimer = window.setTimeout(() => {
        updateNoticeOpen.value = false
        updateNoticeDismissTimer = undefined
      }, UPDATE_STATUS_DISMISS_MS)
    }
  }
)

watch(
  () => activeTab.value?.url,
  (url) => {
    const keepPanelOpen = keepsSeparatePanelOpen()
    emulationMutationSequence += 1
    resetPdfExportFeedback()
    addressSuggestionsOpen.value = false
    if (!keepPanelOpen) {
      siteControlsOpen.value = false
      pageToolsOpen.value = false
      responsivePanelOpen.value = false
      environmentPanelOpen.value = false
      accessibilityPanelOpen.value = false
      qualityAuditPanelOpen.value = false
      performancePanelOpen.value = false
      designOverviewPanelOpen.value = false
      pageMetadataPanelOpen.value = false
      securityPanelOpen.value = false
      coveragePanelOpen.value = false
      cpuProfilePanelOpen.value = false
      memoryPanelOpen.value = false
      debugReportPanelOpen.value = false
      reproPanelOpen.value = false
      domChangesPanelOpen.value = false
      visualComparePanelOpen.value = false
      inspectorIssuesOpen.value = false
    }
    siteDataSummary.value = null
    siteDataState.value = 'idle'
    siteDataMessage.value = ''
    resetSiteStorageView(true)
    if (responsivePanelOpen.value && keepPanelOpen) loadResponsiveDraft(activeEmulation.value?.viewport)
    else {
      responsiveState.value = 'idle'
      responsiveError.value = ''
    }
    if (environmentPanelOpen.value && keepPanelOpen) loadEnvironmentDraft(activeEmulation.value)
    else {
      environmentState.value = 'idle'
      environmentError.value = ''
    }
    accessibilityAudit.value = null
    accessibilityAuditState.value = 'idle'
    accessibilityAuditError.value = ''
    qualityAuditReport.value = null
    qualityAuditState.value = 'idle'
    qualityAuditError.value = ''
    qualityAuditCopied.value = false
    performanceReport.value = null
    performanceState.value = 'idle'
    performanceError.value = ''
    designOverviewReport.value = null
    designOverviewState.value = 'idle'
    designOverviewError.value = ''
    pageMetadataReport.value = null
    pageMetadataState.value = 'idle'
    pageMetadataError.value = ''
    securityReport.value = null
    securityReportState.value = 'idle'
    securityReportError.value = ''
    coverageResult.value = null
    coverageState.value = 'idle'
    coverageError.value = ''
    cpuProfileResult.value = null
    cpuProfileState.value = 'idle'
    cpuProfileError.value = ''
    memoryReport.value = null
    memoryState.value = 'idle'
    memoryError.value = ''
    resetConsoleView(true)
    debugReport.value = null
    debugReportState.value = 'idle'
    debugReportError.value = ''
    reproRecording.value = null
    reproState.value = 'idle'
    reproError.value = ''
    domChangesReport.value = null
    domChangesState.value = 'idle'
    domChangesError.value = ''
    visualCompareReport.value = null
    visualCompareState.value = 'idle'
    visualCompareError.value = ''
    inspectorIssuesReport.value = null
    inspectorIssuesState.value = 'idle'
    inspectorIssuesError.value = ''
    resetNetworkMonitorView(true)
    address.value = url === 'about:blank' || url?.startsWith('bronom://home') ? '' : url || ''
  },
  { immediate: true }
)

watch(
  () => state.value.activeTabId,
  (tabId) => {
    const tab = state.value.tabs.find((candidate) => candidate.id === tabId)
    const keepPanelOpen = keepsSeparatePanelOpen()
    emulationMutationSequence += 1
    resetPdfExportFeedback()
    if (!keepPanelOpen) {
      siteControlsOpen.value = false
      pageToolsOpen.value = false
    }
    if (tab && !tab.url.startsWith('bronom://home')) lastWebTabId.value = tab.id
    if (elementPickerState.value === 'picking' && elementPickerTabId && tabId !== elementPickerTabId) {
      const previousPickerTabId = elementPickerTabId
      elementPickerTabId = undefined
      elementPickerState.value = 'idle'
      elementPickerMode.value = 'context'
      void browser.cancelElementPicker(previousPickerTabId).catch(() => false)
    }
    if ((areaCaptureState.value === 'picking' || areaCaptureState.value === 'capturing') && areaCaptureTabId && tabId !== areaCaptureTabId) {
      const previousCaptureTabId = areaCaptureTabId
      const wasPicking = areaCaptureState.value === 'picking'
      areaCaptureTabId = undefined
      areaCaptureState.value = 'idle'
      screenshotCaptureMode.value = 'area'
      if (wasPicking) void browser.cancelAreaCapture(previousCaptureTabId).catch(() => false)
    }
    if (findOpen.value && findTabId && tabId !== findTabId) void closeFind()
    resetSiteStorageView(true)
    if (!keepPanelOpen && accessibilityPanelOpen.value && accessibilityAudit.value?.tabId !== tabId) accessibilityPanelOpen.value = false
    accessibilityAudit.value = null
    accessibilityAuditState.value = 'idle'
    accessibilityAuditError.value = ''
    if (!keepPanelOpen && qualityAuditPanelOpen.value && qualityAuditReport.value?.tabId !== tabId) qualityAuditPanelOpen.value = false
    qualityAuditReport.value = null
    qualityAuditState.value = 'idle'
    qualityAuditError.value = ''
    qualityAuditCopied.value = false
    if (!keepPanelOpen && performancePanelOpen.value && performanceReport.value?.tabId !== tabId) performancePanelOpen.value = false
    performanceReport.value = null
    performanceState.value = 'idle'
    performanceError.value = ''
    if (!keepPanelOpen && designOverviewPanelOpen.value && designOverviewReport.value?.tabId !== tabId) designOverviewPanelOpen.value = false
    designOverviewReport.value = null
    designOverviewState.value = 'idle'
    designOverviewError.value = ''
    if (!keepPanelOpen && pageMetadataPanelOpen.value && pageMetadataReport.value?.tabId !== tabId) pageMetadataPanelOpen.value = false
    pageMetadataReport.value = null
    pageMetadataState.value = 'idle'
    pageMetadataError.value = ''
    if (!keepPanelOpen && securityPanelOpen.value && securityReport.value?.tabId !== tabId) securityPanelOpen.value = false
    securityReport.value = null
    securityReportState.value = 'idle'
    securityReportError.value = ''
    if (!keepPanelOpen && coveragePanelOpen.value && coverageResult.value?.tabId !== tabId) coveragePanelOpen.value = false
    coverageResult.value = null
    coverageState.value = 'idle'
    coverageError.value = ''
    if (!keepPanelOpen && cpuProfilePanelOpen.value && cpuProfileResult.value?.tabId !== tabId) cpuProfilePanelOpen.value = false
    cpuProfileResult.value = null
    cpuProfileState.value = 'idle'
    cpuProfileError.value = ''
    if (!keepPanelOpen && memoryPanelOpen.value && memoryReport.value?.tabId !== tabId) memoryPanelOpen.value = false
    memoryReport.value = null
    memoryState.value = 'idle'
    memoryError.value = ''
    resetConsoleView(true)
    if (!keepPanelOpen && debugReportPanelOpen.value && debugReport.value?.tabId !== tabId) debugReportPanelOpen.value = false
    debugReport.value = null
    debugReportState.value = 'idle'
    debugReportError.value = ''
    if (!keepPanelOpen && reproPanelOpen.value && reproRecording.value?.tabId !== tabId) reproPanelOpen.value = false
    reproRecording.value = null
    reproState.value = 'idle'
    reproError.value = ''
    if (!keepPanelOpen && domChangesPanelOpen.value && domChangesReport.value?.tabId !== tabId) domChangesPanelOpen.value = false
    domChangesReport.value = null
    domChangesState.value = 'idle'
    domChangesError.value = ''
    if (!keepPanelOpen && visualComparePanelOpen.value && visualCompareReport.value?.tabId !== tabId) visualComparePanelOpen.value = false
    visualCompareReport.value = null
    visualCompareState.value = 'idle'
    visualCompareError.value = ''
    if (!keepPanelOpen && inspectorIssuesOpen.value && inspectorIssuesReport.value?.tabId !== tabId) inspectorIssuesOpen.value = false
    inspectorIssuesReport.value = null
    inspectorIssuesState.value = 'idle'
    inspectorIssuesError.value = ''
    resetNetworkMonitorView(true)
    if (responsivePanelOpen.value) {
      if (!keepPanelOpen) responsivePanelOpen.value = false
      else loadResponsiveDraft(tab?.emulation?.viewport)
    } else {
      responsiveState.value = 'idle'
      responsiveError.value = ''
    }
    if (environmentPanelOpen.value) {
      if (!keepPanelOpen) environmentPanelOpen.value = false
      else loadEnvironmentDraft(tab?.emulation)
    } else {
      environmentState.value = 'idle'
      environmentError.value = ''
    }
  }
)

watch(
  () => [state.value.activeTabId, activeTab.value?.url, activeTab.value?.loading] as const,
  ([tabId, url, loading], [previousTabId, previousUrl, previousLoading]) => {
    if (!isDetachedPanelWindow || !tabId || !url || url.startsWith('bronom://home') || loading) return
    const contextChanged = tabId !== previousTabId || url !== previousUrl || previousLoading === true
    if (!contextChanged) return
    const panel = activePanelId.value
    if (panel) void refreshDetachedPanel(panel)
  }
)

watch(
  () => [activeTab.value?.id, activeTab.value?.reproRecording?.active, activeTab.value?.reproRecording?.stepCount] as const,
  ([tabId]) => {
    if (tabId && reproPanelOpen.value) void manageRepro('get')
  }
)

watch(
  () => activeTab.value?.codeCoverageRecording?.startedAt,
  (current, previous) => {
    if (!current && previous && coveragePanelOpen.value && coverageResult.value?.status === 'recording') {
      void manageCodeCoverage('get')
    }
  }
)

watch(
  () => activeTab.value?.cpuProfileRecording?.startedAt,
  (current, previous) => {
    if (!current && previous && cpuProfilePanelOpen.value && cpuProfileResult.value?.status === 'recording') {
      void manageCpuProfile('get')
    }
  }
)

watch(
  () => activeTab.value?.memoryAllocationRecording?.startedAt,
  (current, previous) => {
    if (!current && previous && memoryPanelOpen.value && memoryReport.value?.allocationStatus === 'recording') {
      memoryReport.value = {
        ...memoryReport.value,
        allocationStatus: 'idle',
        allocationRecording: undefined,
        allocationProfile: undefined
      }
    }
  }
)

watch(
  () => [activeTab.value?.id, activeTab.value?.domChangesRecording?.active, activeTab.value?.domChangesRecording?.changeCount] as const,
  ([tabId]) => {
    if (tabId && domChangesPanelOpen.value) void manageDomChanges('get', true)
  }
)

watch(
  () => [activeTab.value?.id, activeTab.value?.networkRouteCount] as const,
  ([tabId]) => {
    if (tabId && networkMonitorOpen.value) void refreshNetworkRoutes(true)
  }
)

async function syncState(next: Promise<BrowserState> | BrowserState): Promise<void> {
  state.value = await next
}

async function selectBrowserTab(tabId: string): Promise<boolean> {
  try {
    await syncState(browser.selectTab(tabId))
    return true
  } catch (error) {
    showAppToast('error', 'Open tab failed', friendlyUiError(error, 'The selected tab could not be opened.'))
    return false
  }
}

async function navigate(): Promise<void> {
  if (!address.value.trim()) return
  closeAddressSuggestions()
  try {
    await syncState(browser.navigate({ url: address.value, tabId: state.value.activeTabId ?? undefined }))
  } catch (error) {
    showAppToast('error', 'Navigation failed', friendlyUiError(error, 'The address could not be opened.'))
  }
}

function showAddressSuggestions(): void {
  addressSuggestionSelection.value = -1
  addressSuggestionsOpen.value = true
  siteControlsOpen.value = false
  settingsOpen.value = false
  updateNoticeOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  zoomOpen.value = false
  if (findOpen.value) void closeFind()
}

function closeAddressSuggestions(): void {
  addressSuggestionsOpen.value = false
  if (!isDetachedPanelWindow) window.bronomAddressOverlay.hide()
}

function handleAddressFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget
  if (!(next instanceof Node) || !(event.currentTarget as HTMLElement).contains(next)) {
    closeAddressSuggestions()
    siteControlsOpen.value = false
  }
}

async function refreshSiteDataSummary(): Promise<void> {
  if (!activeWebUrl.value) return
  siteDataState.value = 'loading'
  siteDataMessage.value = ''
  try {
    siteDataSummary.value = await window.bronomBrowsingData.siteSummary(activeWebUrl.value)
    siteDataState.value = 'idle'
  } catch (error) {
    siteDataSummary.value = null
    siteDataState.value = 'error'
    siteDataMessage.value = error instanceof Error ? error.message : String(error)
  }
}

async function toggleSiteControls(): Promise<void> {
  if (!activeWebUrl.value) return
  if (siteControlsOpen.value) {
    siteControlsOpen.value = false
    return
  }
  settingsOpen.value = false
  updateNoticeOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  zoomOpen.value = false
  addressSuggestionsOpen.value = false
  if (findOpen.value) await closeFind()
  siteControlsOpen.value = true
  await refreshSiteDataSummary()
}

async function openSitePrivacySettings(): Promise<void> {
  siteControlsOpen.value = false
  await openPrivacySettings(activeOrigin.value ?? undefined)
}

function openSitePermissionSettings(): void {
  siteControlsOpen.value = false
  settingsSection.value = 'permissions'
  settingsOpen.value = true
}

async function selectAddressSuggestion(suggestion: AddressSuggestion): Promise<void> {
  closeAddressSuggestions()
  address.value = suggestion.url
  await navigate()
}

function addressSuggestionId(suggestion: AddressSuggestion): string {
  return `address-suggestion-${suggestion.id}`
}

function revealSelectedAddressSuggestion(): void {
  const suggestion = selectedAddressSuggestion.value
  if (!suggestion) return
  document.getElementById(addressSuggestionId(suggestion))?.scrollIntoView({ block: 'nearest' })
}

function syncAddressSuggestionOverlay(): void {
  if (isDetachedPanelWindow) return
  if (!addressSuggestionsVisible.value || !addressForm.value) {
    window.bronomAddressOverlay.hide()
    return
  }
  const formBounds = addressForm.value.getBoundingClientRect()
  const viewportMargin = 12
  const availableWidth = Math.max(1, window.innerWidth - viewportMargin * 2)
  const width = Math.min(availableWidth, Math.max(formBounds.width + 2, Math.min(560, availableWidth)))
  const x = Math.max(
    viewportMargin,
    Math.min(formBounds.left - 1, window.innerWidth - width - viewportMargin)
  )
  const y = Math.ceil(formBounds.bottom + 7)
  const maxHeight = Math.max(1, Math.min(440, window.innerHeight - y - viewportMargin))
  const request: AddressSuggestionOverlayRequest = {
    bounds: { x, y, width, maxHeight },
    suggestions: addressSuggestions.value.map((suggestion) => ({ ...suggestion })),
    selectedIndex: addressSuggestionSelection.value,
    theme: addressSuggestionTheme.value
  }
  window.bronomAddressOverlay.show(request)
}

function handleWindowResize(): void {
  reportShellHeight()
  syncAddressSuggestionOverlay()
}

async function moveAddressSuggestionSelection(offset: -1 | 1): Promise<void> {
  const count = addressSuggestions.value.length
  if (!count) return
  if (addressSuggestionSelection.value < 0) {
    addressSuggestionSelection.value = offset === 1 ? 0 : count - 1
  } else {
    addressSuggestionSelection.value = (addressSuggestionSelection.value + offset + count) % count
  }
  addressSuggestionsOpen.value = true
  await nextTick()
  revealSelectedAddressSuggestion()
}

function handleAddressKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && addressSuggestionsOpen.value) {
    event.preventDefault()
    closeAddressSuggestions()
    return
  }
  if (!addressSuggestions.value.length) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    void moveAddressSuggestionSelection(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    void moveAddressSuggestionSelection(-1)
    return
  }
  if (event.key === 'Enter' && addressSuggestionsVisible.value && selectedAddressSuggestion.value) {
    event.preventDefault()
    void selectAddressSuggestion(selectedAddressSuggestion.value)
  }
}

function addressSuggestionMeta(suggestion: AddressSuggestion): string {
  if (suggestion.kind === 'bookmark') return 'Bookmark'
  return suggestion.visitCount && suggestion.visitCount > 1 ? `History · ${suggestion.visitCount} visits` : 'History'
}

async function openFind(): Promise<void> {
  if (!activeTab.value) return
  settingsOpen.value = false
  updateNoticeOpen.value = false
  zoomOpen.value = false
  tabSearchOpen.value = false
  addressSuggestionsOpen.value = false
  findTabId = activeTab.value.id
  findOpen.value = true
  await nextTick()
  findInput.value?.focus()
  findInput.value?.select()
  if (findQuery.value) await searchInPage(true, true)
}

async function focusAddress(): Promise<void> {
  if (activeIsHome.value) {
    const tab = preferredWebTab()
    if (!tab || !(await selectBrowserTab(tab.id))) await syncState(browser.newTab())
  }
  settingsOpen.value = false
  updateNoticeOpen.value = false
  if (findOpen.value) await closeFind()
  zoomOpen.value = false
  tabSearchOpen.value = false
  await nextTick()
  addressInput.value?.focus()
  addressInput.value?.select()
}

async function selectRelativeTab(offset: -1 | 1): Promise<void> {
  const tabs = state.value.tabs
  if (tabs.length < 2 || !state.value.activeTabId) return
  const current = tabs.findIndex((tab) => tab.id === state.value.activeTabId)
  const next = tabs[(current + offset + tabs.length) % tabs.length]
  if (next) await selectBrowserTab(next.id)
}

async function runBrowserShortcut(action: BrowserShortcutAction): Promise<void> {
  if (state.value.allHumanInteractionLocked) return
  switch (action) {
    case 'focus-address': return focusAddress()
    case 'find': return openFind()
    case 'reload':
      if (activeTab.value) await syncState(browser.reload(activeTab.value.id))
      return
    case 'reload-ignoring-cache':
      if (activeTab.value) await syncState(browser.reloadIgnoringCache(activeTab.value.id))
      return
    case 'new-tab':
      settingsOpen.value = false
      tabSearchOpen.value = false
      await syncState(browser.newTab())
      return focusAddress()
    case 'close-tab':
      if (activeTab.value) await syncState(browser.closeTab(activeTab.value.id))
      return
    case 'reopen-closed-tab':
      settingsOpen.value = false
      await syncState(browser.reopenClosedTab())
      return
    case 'next-tab': return selectRelativeTab(1)
    case 'previous-tab': return selectRelativeTab(-1)
    case 'zoom-in': return setActiveZoom('in')
    case 'zoom-out': return setActiveZoom('out')
    case 'zoom-reset': return setActiveZoom('reset')
    case 'bookmark': return toggleCurrentBookmark()
    case 'visit-history': return toggleVisitHistory()
    case 'search-tabs': return toggleTabSearch()
    case 'clear-browsing-data': return openPrivacySettings()
    case 'command-palette': return toggleCommandPalette()
    case 'pick-element': return toggleElementPicker()
    case 'toggle-devtools': return toggleDeveloperTools()
  }
}

async function openZoom(): Promise<void> {
  if (!activeTab.value) return
  settingsOpen.value = false
  updateNoticeOpen.value = false
  tabSearchOpen.value = false
  if (findOpen.value) await closeFind()
  zoomOpen.value = true
}

function toggleSplitMenu(): void {
  settingsOpen.value = false
  updateNoticeOpen.value = false
  tabSearchOpen.value = false
  zoomOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  addressSuggestionsOpen.value = false
  splitMenuOpen.value = !splitMenuOpen.value
}

async function openTabInSplitView(tabId: string): Promise<void> {
  splitMenuOpen.value = false
  await updateSplitState(
    browser.openSplitView(tabId),
    'The selected tab could not be opened in split view.'
  )
}

async function changeSplitLayout(orientation: BrowserSplitOrientation): Promise<void> {
  await updateSplitState(
    browser.updateSplitView({ orientation }),
    'The split-view layout could not be changed.'
  )
}

async function changeSplitRatio(event: Event): Promise<void> {
  const ratio = Number((event.target as HTMLInputElement).value) / 100
  await updateSplitState(
    browser.updateSplitView({ ratio }),
    'The split-view size could not be changed.'
  )
}

async function swapSplitTabs(): Promise<void> {
  await updateSplitState(
    browser.updateSplitView({ swap: true }),
    'The split-view panes could not be swapped.'
  )
}

async function exitSplitView(): Promise<void> {
  splitMenuOpen.value = false
  await updateSplitState(
    browser.closeSplitView(),
    'Split view could not be closed.'
  )
}

async function updateSplitState(next: Promise<BrowserState>, fallback: string): Promise<void> {
  try {
    await syncState(next)
  } catch (error) {
    showAppToast('error', 'Split view failed', friendlyUiError(error, fallback))
  }
}

async function setActiveZoom(action: 'in' | 'out' | 'reset'): Promise<void> {
  if (!activeTab.value) return
  await syncState(browser.setZoom({ tabId: activeTab.value.id, action }))
}

async function searchInPage(forward: boolean, newSearch: boolean): Promise<void> {
  const tabId = findTabId
  const query = findQuery.value
  const sequence = ++findRequestSequence
  if (!tabId) return
  if (!query) {
    findResult.value = { activeMatchOrdinal: 0, matches: 0 }
    await browser.stopFindInPage(tabId).catch(() => undefined)
    return
  }
  try {
    const result = await browser.findInPage({ tabId, query, forward, findNext: newSearch })
    if (sequence === findRequestSequence && tabId === findTabId) findResult.value = result
  } catch {
    if (sequence === findRequestSequence && tabId === findTabId) {
      findResult.value = { activeMatchOrdinal: 0, matches: 0 }
    }
  }
}

async function closeFind(): Promise<void> {
  const tabId = findTabId
  findRequestSequence += 1
  findTabId = undefined
  findOpen.value = false
  findResult.value = { activeMatchOrdinal: 0, matches: 0 }
  if (tabId) await browser.stopFindInPage(tabId).catch(() => undefined)
}

function resetPdfExportFeedback(): void {
  pdfExportRequestSequence += 1
  if (pdfExportResetTimer !== undefined) {
    window.clearTimeout(pdfExportResetTimer)
    pdfExportResetTimer = undefined
  }
  pdfExportState.value = 'idle'
  pdfExport.value = null
}

async function saveActivePdf(): Promise<void> {
  const tab = activeTab.value
  if (!tab || pdfExportState.value === 'saving') return
  if (pdfExportResetTimer !== undefined) window.clearTimeout(pdfExportResetTimer)
  const requestSequence = ++pdfExportRequestSequence
  pdfExportState.value = 'saving'
  pdfExport.value = null
  try {
    const exported = await browser.savePdf({ tabId: tab.id })
    if (requestSequence !== pdfExportRequestSequence || activeTab.value?.id !== tab.id) return
    pdfExport.value = exported
    pdfExportState.value = 'saved'
  } catch {
    if (requestSequence !== pdfExportRequestSequence || activeTab.value?.id !== tab.id) return
    pdfExportState.value = 'error'
  }
  pdfExportResetTimer = window.setTimeout(() => {
    if (requestSequence !== pdfExportRequestSequence) return
    pdfExportState.value = 'idle'
    pdfExport.value = null
    pdfExportResetTimer = undefined
  }, 2_500)
}

async function closeTab(event: MouseEvent, tabId: string): Promise<void> {
  event.stopPropagation()
  await syncState(browser.closeTab(tabId))
}

function tabTooltip(tab: BrowserTabState): string {
  const pinned = tab.pinned ? ' — pinned' : ''
  const sleeping = tab.sleeping ? ' — sleeping; reloads when selected' : ''
  const audio = tab.muted ? ' — muted' : tab.audible ? ' — playing audio' : ''
  const locked = state.value.allHumanInteractionLocked || tab.humanInteractionLocked ? ' — human interaction locked' : ''
  const problem = tab.pageProblem ? ` — ${tab.pageProblem.title}` : ''
  const emulation = tab.emulation ? ` — emulated: ${emulationDescription(tab.emulation)}` : ''
  const networkRoutes = tab.networkRouteCount ? ` — ${tab.networkRouteCount} temporary network ${tab.networkRouteCount === 1 ? 'route' : 'routes'}` : ''
  const split = state.value.splitView?.firstTabId === tab.id || state.value.splitView?.secondTabId === tab.id ? ' — visible in split view' : ''
  const workspace = tab.mcpGroupName ? ` — workspace: ${tab.mcpGroupName}` : ''
  return `${tab.title || 'New tab'}${problem}${pinned}${sleeping}${audio}${locked}${emulation}${networkRoutes}${split}${workspace}`
}

function pageProblemDetails(tab: BrowserTabState): string {
  const problem = tab.pageProblem
  if (!problem) return ''
  if (problem.kind === 'load-error' && problem.errorDescription) {
    return `${problem.errorDescription}${problem.errorCode ? ` (${problem.errorCode})` : ''}`
  }
  if (problem.kind === 'renderer-gone' && problem.reason) {
    return `${problem.reason}${problem.exitCode !== undefined ? ` · exit ${problem.exitCode}` : ''}`
  }
  return ''
}

async function toggleTabMuted(event: MouseEvent, tab: BrowserTabState): Promise<void> {
  event.stopPropagation()
  await syncState(browser.setTabMuted(tab.id, !tab.muted))
}

async function toggleTabHumanInteraction(): Promise<void> {
  if (!activeTab.value || activeIsHome.value || state.value.allHumanInteractionLocked) return
  await syncState(browser.setTabHumanInteractionLocked(activeTab.value.id, !activeTab.value.humanInteractionLocked))
}

async function toggleAllHumanInteraction(): Promise<void> {
  await syncState(browser.setAllHumanInteractionLocked(!state.value.allHumanInteractionLocked))
}

async function copyMcpUrl(): Promise<void> {
  if (!await copyAppText(state.value.mcpUrl)) return
  mcpCopied.value = true
  window.setTimeout(() => (mcpCopied.value = false), 1_500)
}

async function toggleMcpPaused(): Promise<void> {
  if (!canToggleMcpPaused.value) return
  mcpControl.value = await window.bronomMcp.setPaused(!mcpControl.value.paused)
}

function accessibilityImpactCount(impact: BrowserAccessibilityImpact): number {
  return accessibilityAudit.value?.violations.filter((violation) => violation.impact === impact).length ?? 0
}

function performanceMetric(name: BrowserPerformanceMetricName): BrowserPerformanceMetric | null {
  return performanceReport.value?.metrics[name] ?? null
}

function formatPerformanceMetric(metric: BrowserPerformanceMetric | null): string {
  if (!metric) return 'Not observed'
  return metric.unit === 'score' ? metric.value.toFixed(3) : `${Math.round(metric.value)} ms`
}

function performanceComparisonMetric(name: BrowserPerformanceComparisonMetricName): BrowserPerformanceComparisonMetric | null {
  return performanceReport.value?.comparison?.metrics.find((metric) => metric.name === name) ?? null
}

function formatPerformanceDelta(metric: BrowserPerformanceComparisonMetric | null): string {
  if (!metric || metric.delta === null) return ''
  const absolute = Math.abs(metric.delta)
  const value = metric.unit === 'bytes'
    ? formatBytes(absolute)
    : metric.unit === 'score' ? absolute.toFixed(3) : `${Math.round(absolute)} ms`
  const sign = metric.delta > 0 ? '+' : metric.delta < 0 ? '−' : '±'
  return `${sign}${value} vs baseline`
}

function performanceBaselineTime(): string {
  const measuredAt = performanceReport.value?.baseline?.measuredAt
  if (!measuredAt) return ''
  const date = new Date(measuredAt)
  return Number.isNaN(date.valueOf()) ? measuredAt : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function performanceContributorTitle(contributor: BrowserPerformanceScriptContributor): string {
  return contributor.sourceFunctionName || contributor.invoker || 'Anonymous script work'
}

function performanceContributorSource(contributor: BrowserPerformanceScriptContributor): string {
  if (!contributor.sourceUrl) return contributor.invokerType || 'Source unavailable'
  try {
    const url = new URL(contributor.sourceUrl)
    const source = `${url.host}${url.pathname}`
    return contributor.sourceCharPosition === undefined ? source : `${source} · char ${contributor.sourceCharPosition}`
  } catch {
    return contributor.sourceUrl
  }
}

async function runPerformanceReport(action: BrowserPerformanceAction = 'measure'): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  performancePanelOpen.value = true
  performanceState.value = 'running'
  performanceError.value = ''
  try {
    const report = await browser.measurePerformance({ tabId: tab.id, settleMs: 800, action })
    if (activeTab.value?.id !== tab.id) return
    performanceReport.value = report
    performanceState.value = 'complete'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    performanceState.value = 'error'
    performanceError.value = error instanceof Error ? error.message : String(error)
  }
}

function togglePerformanceReport(): void {
  if (performancePanelOpen.value) {
    performancePanelOpen.value = false
    return
  }
  void runPerformanceReport()
}

async function runDesignOverview(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  designOverviewPanelOpen.value = true
  designOverviewState.value = 'loading'
  designOverviewError.value = ''
  try {
    const report = await browser.inspectDesign(tab.id)
    if (activeTab.value?.id !== tab.id) return
    designOverviewReport.value = report
    designOverviewState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    designOverviewState.value = 'error'
    designOverviewError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleDesignOverview(): void {
  if (designOverviewPanelOpen.value) {
    designOverviewPanelOpen.value = false
    return
  }
  void runDesignOverview()
}

async function runPageMetadata(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  pageMetadataPanelOpen.value = true
  pageMetadataState.value = 'loading'
  pageMetadataError.value = ''
  try {
    const report = await browser.inspectPageMetadata(tab.id)
    if (activeTab.value?.id !== tab.id) return
    pageMetadataReport.value = report
    pageMetadataState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    pageMetadataState.value = 'error'
    pageMetadataError.value = error instanceof Error ? error.message : String(error)
  }
}

function togglePageMetadata(): void {
  if (pageMetadataPanelOpen.value) {
    pageMetadataPanelOpen.value = false
    return
  }
  void runPageMetadata()
}

async function runSecurityReport(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  securityPanelOpen.value = true
  securityReportState.value = 'loading'
  securityReportError.value = ''
  try {
    const report = await browser.inspectSecurity(tab.id)
    if (activeTab.value?.id !== tab.id) return
    securityReport.value = report
    securityReportState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    securityReportState.value = 'error'
    securityReportError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleSecurityReport(): void {
  if (securityPanelOpen.value) {
    securityPanelOpen.value = false
    return
  }
  void runSecurityReport()
}

async function manageCodeCoverage(
  action: 'get' | 'start' | 'stop' | 'clear',
  reload = true
): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  coverageState.value = 'loading'
  coverageError.value = ''
  try {
    const result = await browser.manageCodeCoverage({
      tabId: tab.id,
      action,
      mode: coverageMode.value,
      reload
    })
    if (activeTab.value?.id !== tab.id) return
    coverageResult.value = result
    coverageState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    coverageState.value = 'error'
    coverageError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleCodeCoverage(): void {
  if (coveragePanelOpen.value) {
    coveragePanelOpen.value = false
    return
  }
  closeTransientPanels()
  coveragePanelOpen.value = true
  void manageCodeCoverage('get')
}

async function manageCpuProfile(action: 'get' | 'start' | 'stop' | 'clear'): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  cpuProfileState.value = 'loading'
  cpuProfileError.value = ''
  try {
    const result = await browser.manageCpuProfile({ tabId: tab.id, action })
    if (activeTab.value?.id !== tab.id) return
    cpuProfileResult.value = result
    cpuProfileState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    cpuProfileState.value = 'error'
    cpuProfileError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleCpuProfile(): void {
  if (cpuProfilePanelOpen.value) {
    cpuProfilePanelOpen.value = false
    return
  }
  closeTransientPanels()
  cpuProfilePanelOpen.value = true
  void manageCpuProfile('get')
}

function formatSignedBytes(bytes: number): string {
  if (!bytes) return '0 B'
  return `${bytes > 0 ? '+' : '−'}${formatBytes(Math.abs(bytes))}`
}

function formatSignedCount(value: number): string {
  if (!value) return '0'
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}`
}

function memoryDeltaClass(value: number | undefined): string {
  if (!value) return 'neutral'
  return value > 0 ? 'growth' : 'reduction'
}

async function runMemoryReport(action: 'measure' | 'set-baseline' = 'measure', collectGarbage = false): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  memoryPanelOpen.value = true
  memoryState.value = 'running'
  memoryError.value = ''
  try {
    const report = await browser.measureMemory({ tabId: tab.id, action, collectGarbage })
    if (activeTab.value?.id !== tab.id) return
    memoryReport.value = report
    memoryState.value = 'complete'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    memoryState.value = 'error'
    memoryError.value = error instanceof Error ? error.message : String(error)
  }
}

async function clearMemoryBaseline(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  memoryState.value = 'running'
  memoryError.value = ''
  try {
    const previous = memoryReport.value
    const cleared = await browser.measureMemory({ tabId: tab.id, action: 'clear-baseline' })
    if (activeTab.value?.id !== tab.id) return
    const preserveCurrent = previous?.tabId === cleared.tabId
      && previous.url === cleared.url
      && previous.current
    memoryReport.value = {
      ...cleared,
      ...(preserveCurrent ? {
        current: previous.current,
        forcedGarbageCollection: previous.forcedGarbageCollection
      } : {})
    }
    memoryState.value = 'complete'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    memoryState.value = 'error'
    memoryError.value = error instanceof Error ? error.message : String(error)
  }
}

async function manageMemoryAllocation(action: 'start' | 'stop' | 'clear'): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  memoryPanelOpen.value = true
  memoryState.value = 'running'
  memoryError.value = ''
  try {
    const memoryAction = action === 'start'
      ? 'start-allocation-sampling'
      : action === 'stop'
        ? 'stop-allocation-sampling'
        : 'clear-allocation-sampling'
    let report = await browser.measureMemory({ tabId: tab.id, action: memoryAction })
    if (action === 'clear') report = await browser.measureMemory({ tabId: tab.id, action: 'measure' })
    if (activeTab.value?.id !== tab.id) return
    memoryReport.value = report
    memoryState.value = 'complete'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    memoryState.value = 'error'
    memoryError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleMemoryReport(): void {
  if (memoryPanelOpen.value) {
    memoryPanelOpen.value = false
    return
  }
  void runMemoryReport()
}

function debugTimestamp(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return value
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  }).format(date)
}

function formatSecurityDate(value: string): string {
  const date = new Date(value)
  if (!value || Number.isNaN(date.valueOf())) return 'Unavailable'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function debugRequestStatus(request: BrowserDebugReport['network'][number]): string {
  if (request.error) return request.error
  if (request.status !== undefined) return String(request.status)
  return request.completedAt ? 'Complete' : 'Pending'
}

function networkRequestStatus(request: BrowserNetworkRequest): string {
  if (request.error) return request.error.replace(/^net::/, '')
  if (request.status !== undefined) return String(request.status)
  return request.completedAt ? 'Done' : 'Pending'
}

function networkRequestDuration(request: BrowserNetworkRequest): string {
  if (request.durationMs !== undefined) return formatNetworkMilliseconds(request.durationMs)
  if (!request.completedAt) return '—'
  const duration = Date.parse(request.completedAt) - Date.parse(request.startedAt)
  return Number.isFinite(duration) ? formatNetworkMilliseconds(Math.max(0, duration)) : '—'
}

function networkWaterfallStyle(request: BrowserNetworkRequest): Record<string, string> {
  const position = networkWaterfallPosition(request, networkWaterfallRange.value)
  if (!position) return {}
  return {
    '--network-waterfall-left': `${position.leftPercent.toFixed(3)}%`,
    '--network-waterfall-width': `${position.widthPercent.toFixed(3)}%`
  }
}

function networkWaterfallLabel(request: BrowserNetworkRequest): string {
  const position = networkWaterfallPosition(request, networkWaterfallRange.value)
  if (!position) return 'Relative request timing unavailable'
  const start = position.startOffsetMs > 0
    ? `Started ${formatNetworkMilliseconds(position.startOffsetMs)} after the first visible request`
    : 'Started with the first visible request'
  const duration = position.durationMs === undefined
    ? 'still pending'
    : `${formatNetworkMilliseconds(position.durationMs)} total`
  const waiting = request.waitingForResponseMs === undefined
    ? ''
    : `, ${formatNetworkMilliseconds(request.waitingForResponseMs)} waiting for the response`
  return `${start}; ${duration}${waiting}`
}

function toggleNetworkSortDirection(): void {
  networkSortDirection.value = networkSortDirection.value === 'asc' ? 'desc' : 'asc'
}

function setNetworkSortBy(event: Event): void {
  networkSortBy.value = (event.target as HTMLSelectElement).value as BrowserNetworkRequestSortBy
  networkSortDirection.value = ['duration', 'waiting', 'size', 'status'].includes(networkSortBy.value) ? 'desc' : 'asc'
}

function networkRequestName(request: Pick<BrowserNetworkRequest, 'url'>): string {
  try {
    const url = new URL(request.url)
    return `${url.pathname.split('/').filter(Boolean).at(-1) || url.hostname}${url.search}`
  } catch {
    return request.url
  }
}

function networkRequestSourceSummary(request: BrowserNetworkRequest): string {
  if (!request.responseSource) return 'Source unavailable'
  const source = networkResponseSourceLabel(request.responseSource)
  if (request.responseSource !== 'service-worker' || !request.serviceWorkerResponseSource) return source
  return `${source} · ${serviceWorkerResponseSourceLabel(request.serviceWorkerResponseSource)}`
}

function networkInitiatorLabel(type: string): string {
  return type.replace(/[-_]/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase())
}

function networkRelationshipCount(details: BrowserNetworkRequestDetails): number {
  const relationships = details.relationships
  if (!relationships) return 0
  return Math.max(0, relationships.redirectChain.length - 1)
    + (relationships.triggeredBy ? 1 : 0)
    + relationships.dependents.length
}

function networkSourceLocation(url: string | undefined, lineNumber?: number, columnNumber?: number): string {
  const position = lineNumber !== undefined
    ? `:${lineNumber}${columnNumber !== undefined ? `:${columnNumber}` : ''}`
    : ''
  return `${url || 'inline script'}${position}`
}

function formatNetworkMilliseconds(value: number): string {
  if (value > 0 && value < 1) return '<1 ms'
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 1 : 2)} s`
  const rounded = Math.round(value * 10) / 10
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ms`
}

function networkTimingRows(timing: BrowserNetworkRequestDetails['timing']): Array<{
  key: string
  label: string
  value: number
  subphase?: boolean
}> {
  if (!timing) return []
  const rows = [
    { key: 'total', label: 'Total', value: timing.totalMs },
    { key: 'setup', label: 'Before request sent', value: timing.queuedAndConnectingMs },
    { key: 'proxy', label: 'Proxy negotiation', value: timing.proxyMs, subphase: true },
    { key: 'dns', label: 'DNS lookup', value: timing.dnsMs, subphase: true },
    { key: 'connection', label: 'Initial connection', value: timing.connectionMs, subphase: true },
    { key: 'tls', label: 'TLS handshake', value: timing.tlsMs, subphase: true },
    { key: 'service-worker', label: 'Service worker preparation', value: timing.serviceWorkerPreparationMs, subphase: true },
    { key: 'sent', label: 'Request sent', value: timing.requestSentMs },
    { key: 'waiting', label: 'Waiting (TTFB)', value: timing.waitingForResponseMs },
    { key: 'headers', label: 'Response headers', value: timing.responseHeadersMs },
    { key: 'download', label: 'Content download', value: timing.contentDownloadMs }
  ]
  return rows.filter((row): row is { key: string; label: string; value: number; subphase?: boolean } => (
    row.value !== undefined && Number.isFinite(row.value)
  ))
}

function networkTimingPercent(value: number, timing: BrowserNetworkRequestDetails['timing']): number {
  const rows = networkTimingRows(timing)
  const scale = timing?.totalMs && timing.totalMs > 0
    ? timing.totalMs
    : Math.max(...rows.map((row) => row.value), 1)
  return Math.max(value > 0 ? 2 : 0, Math.min(100, value / scale * 100))
}

function resetConsoleView(closePanel = false): void {
  consoleRequestSequence += 1
  if (closePanel && !keepsSeparatePanelOpen()) consolePanelOpen.value = false
  consoleMessages.value = []
  consoleState.value = 'idle'
  consoleError.value = ''
  consoleCopied.value = null
  consoleCopiedEntryKey.value = null
}

function resetNetworkMonitorView(closePanel = false): void {
  networkMonitorRequestSequence += 1
  networkRouteRequestSequence += 1
  networkRouteMutationSequence += 1
  networkRequestDetailsSequence += 1
  networkContentSearchSequence += 1
  if (closePanel && !keepsSeparatePanelOpen()) networkMonitorOpen.value = false
  networkRequests.value = []
  networkMonitorState.value = 'idle'
  networkMonitorError.value = ''
  networkRequestDetails.value = null
  networkSelectedRequestId.value = null
  networkRequestDetailsLoading.value = false
  networkDetailsCopied.value = null
  resetNetworkReplayFeedback()
  networkContentSearchOpen.value = false
  networkContentSearchState.value = 'idle'
  networkContentSearchResult.value = null
  networkContentSearchError.value = ''
  networkHarCopied.value = false
  networkHarSaveState.value = 'idle'
  networkHarExport.value = null
  networkRoutes.value = []
  networkRouteState.value = 'idle'
  networkRouteError.value = ''
  resetNetworkRouteDraft()
}

async function refreshNetworkMonitor(clear = false): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  const requestSequence = ++networkMonitorRequestSequence
  networkMonitorState.value = 'loading'
  networkMonitorError.value = ''
  networkHarCopied.value = false
  networkHarSaveState.value = 'idle'
  networkHarExport.value = null
  if (clear) {
    networkRequestDetails.value = null
    networkSelectedRequestId.value = null
    networkDetailsCopied.value = null
    resetNetworkReplayFeedback()
    networkContentSearchResult.value = null
    networkContentSearchState.value = 'idle'
  }
  try {
    const requests = await browser.listNetworkRequests(tab.id, clear)
    if (requestSequence !== networkMonitorRequestSequence || activeTab.value?.id !== tab.id) return
    networkRequests.value = requests
    networkMonitorState.value = 'ready'
    if (networkSelectedRequestId.value && !requests.some((request) => request.id === networkSelectedRequestId.value)) {
      networkSelectedRequestId.value = null
      networkRequestDetails.value = null
    }
  } catch (error) {
    if (requestSequence !== networkMonitorRequestSequence || activeTab.value?.id !== tab.id) return
    networkMonitorState.value = 'error'
    networkMonitorError.value = error instanceof Error ? error.message : String(error)
  }
}

async function updateDiagnosticLogPreservation(event: Event): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  const preserve = (event.currentTarget as HTMLInputElement).checked
  await syncState(browser.setDiagnosticLogPreservation(tab.id, preserve))
}

async function refreshConsole(clear = false, silent = false): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  const requestSequence = ++consoleRequestSequence
  if (!silent) consoleState.value = 'loading'
  consoleError.value = ''
  if (clear) {
    consoleCopied.value = null
    consoleCopiedEntryKey.value = null
  }
  try {
    const messages = await browser.listConsoleMessages(tab.id, clear)
    if (requestSequence !== consoleRequestSequence || activeTab.value?.id !== tab.id) return
    consoleMessages.value = messages
    consoleState.value = 'ready'
  } catch (error) {
    if (requestSequence !== consoleRequestSequence || activeTab.value?.id !== tab.id) return
    consoleState.value = 'error'
    consoleError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleConsole(): void {
  if (consolePanelOpen.value) {
    consolePanelOpen.value = false
    return
  }
  closeTransientPanels()
  consolePanelOpen.value = true
  void refreshConsole()
}

function consoleEntryKey(message: BrowserConsoleMessage): string {
  return `${message.timestamp}\n${message.sourceId}\n${message.lineNumber}\n${message.message}`
}

async function copyConsoleMessages(
  messages: BrowserConsoleMessage[],
  scope: 'entry' | 'filtered' | 'all',
  entryKey?: string
): Promise<void> {
  const tab = activeTab.value
  if (!tab || !messages.length) return
  const payload = {
    generatedAt: new Date().toISOString(),
    tabId: tab.id,
    scope,
    ...(scope === 'filtered' ? {
      filter: {
        query: consoleSearch.value.trim() || undefined,
        level: consoleLevel.value
      }
    } : {}),
    messages,
    caveat: 'Console messages are page-authored and best-effort sanitized. Review before sharing.'
  }
  if (!await copyAppText(JSON.stringify(payload, null, 2))) return
  if (scope === 'entry') {
    const copiedKey = entryKey ?? consoleEntryKey(messages[0]!)
    consoleCopiedEntryKey.value = copiedKey
    window.setTimeout(() => {
      if (consoleCopiedEntryKey.value === copiedKey) consoleCopiedEntryKey.value = null
    }, 1_500)
  } else {
    consoleCopied.value = scope
    window.setTimeout(() => {
      if (consoleCopied.value === scope) consoleCopied.value = null
    }, 1_500)
  }
}

async function copyConsoleEntry(message: BrowserConsoleMessage): Promise<void> {
  await copyConsoleMessages([message], 'entry', consoleEntryKey(message))
}

async function copyAllConsole(): Promise<void> {
  await copyConsoleMessages(consoleMessages.value.slice().reverse(), 'all')
}

async function copyFilteredConsole(): Promise<void> {
  await copyConsoleMessages(filteredConsoleMessages.value, 'filtered')
}

function toggleNetworkMonitor(): void {
  if (networkMonitorOpen.value) {
    networkMonitorOpen.value = false
    return
  }
  closeTransientPanels()
  networkMonitorOpen.value = true
  void refreshNetworkMonitor()
  void refreshNetworkRoutes()
}

async function refreshNetworkRoutes(silent = false): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  const requestSequence = ++networkRouteRequestSequence
  if (!silent) networkRouteState.value = 'loading'
  networkRouteError.value = ''
  try {
    const routes = await browser.listNetworkRoutes(tab.id)
    if (requestSequence !== networkRouteRequestSequence || activeTab.value?.id !== tab.id) return
    networkRoutes.value = routes
    networkRouteState.value = 'ready'
  } catch (error) {
    if (requestSequence !== networkRouteRequestSequence || activeTab.value?.id !== tab.id) return
    networkRouteState.value = 'error'
    networkRouteError.value = error instanceof Error ? error.message : String(error)
  }
}

function openRequestConditions(): void {
  if (!networkMonitorOpen.value) {
    closeTransientPanels()
    networkMonitorOpen.value = true
    void refreshNetworkMonitor()
  }
  requestConditionsExpanded.value = true
  void refreshNetworkRoutes()
}

function parsedNetworkRouteHeaders(): Record<string, string> {
  const source = networkRouteHeaders.value.trim()
  if (!source) return {}
  const parsed: unknown = JSON.parse(source)
  if (
    typeof parsed !== 'object'
    || parsed === null
    || Array.isArray(parsed)
    || Object.values(parsed as Record<string, unknown>).some((value) => typeof value !== 'string')
  ) throw new Error('Response headers must be a JSON object with string values.')
  return parsed as Record<string, string>
}

function resetNetworkRouteDraft(): void {
  networkRoutePattern.value = ''
  networkRouteMethod.value = ''
  networkRouteTimes.value = 1
  networkRouteAbort.value = 'BlockedByClient'
  networkRouteThrottle.value = 'slow-4g'
  networkRouteStatus.value = 200
  networkRouteHeaders.value = ''
  networkRouteBody.value = ''
}

async function addNetworkRouteFromDraft(): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  const requestSequence = ++networkRouteMutationSequence
  networkRouteState.value = 'saving'
  networkRouteError.value = ''
  try {
    const input: BrowserNetworkRouteInput = {
      urlPattern: networkRoutePattern.value.trim(),
      ...(networkRouteMode.value === 'throttle'
        ? { throttle: networkRouteThrottle.value }
        : {
            times: networkRouteTimes.value,
            ...(networkRouteMethod.value.trim() ? { method: networkRouteMethod.value.trim().toUpperCase() } : {})
          }),
      ...(networkRouteMode.value === 'abort'
        ? { abort: networkRouteAbort.value }
        : networkRouteMode.value === 'fulfill' ? {
            response: {
              status: networkRouteStatus.value,
              headers: parsedNetworkRouteHeaders(),
              body: networkRouteBody.value
            }
          } : {})
    }
    const routes = await browser.addNetworkRoute(tab.id, input)
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    const nextState = await browser.getState()
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    networkRoutes.value = routes
    state.value = nextState
    resetNetworkRouteDraft()
    networkRouteState.value = 'ready'
  } catch (error) {
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    networkRouteState.value = 'error'
    networkRouteError.value = error instanceof Error ? error.message : String(error)
  }
}

async function removeNetworkRoute(routeId: string): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  const requestSequence = ++networkRouteMutationSequence
  networkRouteState.value = 'saving'
  networkRouteError.value = ''
  try {
    const routes = await browser.removeNetworkRoute(tab.id, routeId)
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    const nextState = await browser.getState()
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    networkRoutes.value = routes
    state.value = nextState
    networkRouteState.value = 'ready'
  } catch (error) {
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    networkRouteState.value = 'error'
    networkRouteError.value = error instanceof Error ? error.message : String(error)
  }
}

async function moveNetworkRoute(routeId: string, direction: 'up' | 'down'): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  const requestSequence = ++networkRouteMutationSequence
  networkRouteState.value = 'saving'
  networkRouteError.value = ''
  try {
    const routes = await browser.moveNetworkRoute(tab.id, routeId, direction)
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    networkRoutes.value = routes
    networkRouteState.value = 'ready'
  } catch (error) {
    if (requestSequence !== networkRouteMutationSequence || activeTab.value?.id !== tab.id) return
    networkRouteState.value = 'error'
    networkRouteError.value = error instanceof Error ? error.message : String(error)
  }
}

async function selectNetworkRequest(request: BrowserNetworkRequest): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  const requestSequence = ++networkRequestDetailsSequence
  networkSelectedRequestId.value = request.id
  networkRequestDetails.value = null
  networkDetailsCopied.value = null
  resetNetworkReplayFeedback()
  networkRequestDetailsLoading.value = true
  networkMonitorError.value = ''
  try {
    const details = await browser.getNetworkRequestDetails(tab.id, request.id, 20_000)
    if (
      requestSequence === networkRequestDetailsSequence
      && activeTab.value?.id === tab.id
      && networkSelectedRequestId.value === request.id
    ) {
      networkRequestDetails.value = details
    }
  } catch (error) {
    if (requestSequence !== networkRequestDetailsSequence || activeTab.value?.id !== tab.id) return
    networkMonitorError.value = error instanceof Error ? error.message : String(error)
  } finally {
    if (requestSequence === networkRequestDetailsSequence && activeTab.value?.id === tab.id) {
      networkRequestDetailsLoading.value = false
    }
  }
}

function resetNetworkReplayFeedback(): void {
  if (networkReplayConfirmTimer !== undefined) {
    window.clearTimeout(networkReplayConfirmTimer)
    networkReplayConfirmTimer = undefined
  }
  networkReplayState.value = 'idle'
  networkReplayMessage.value = ''
}

async function replaySelectedNetworkRequest(): Promise<void> {
  const tab = activeTab.value
  const request = networkRequestDetails.value
  if (!tab || !request || request.resourceType.toLowerCase() !== 'xhr') return
  const method = request.method.trim().toUpperCase()
  const confirmationRequired = networkReplayRequiresConfirmation(method)
  if (confirmationRequired && networkReplayState.value !== 'confirming') {
    resetNetworkReplayFeedback()
    networkReplayState.value = 'confirming'
    networkReplayMessage.value = `Replaying ${method} can repeat writes or other side effects. Click again to confirm.`
    networkReplayConfirmTimer = window.setTimeout(() => resetNetworkReplayFeedback(), 6_000)
    return
  }

  if (networkReplayConfirmTimer !== undefined) {
    window.clearTimeout(networkReplayConfirmTimer)
    networkReplayConfirmTimer = undefined
  }
  networkReplayState.value = 'replaying'
  networkReplayMessage.value = `Replaying ${method} XHR inside this tab…`
  try {
    const result = await browser.replayNetworkRequest(tab.id, request.id, confirmationRequired)
    if (activeTab.value?.id !== tab.id) return
    await refreshNetworkMonitor()
    const replayed = networkRequests.value.find((candidate) => candidate.id === result.replayedRequest.id)
    if (replayed) await selectNetworkRequest(replayed)
    networkReplayState.value = 'replayed'
    networkReplayMessage.value = `Replayed ${method} XHR. The new request is selected for inspection.`
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    networkReplayState.value = 'error'
    networkReplayMessage.value = error instanceof Error ? error.message : String(error)
  }
}

async function selectRelatedNetworkRequest(request: BrowserNetworkRequest): Promise<void> {
  networkSearch.value = ''
  networkResourceFilter.value = ''
  networkFailuresOnly.value = false
  await nextTick()
  await selectNetworkRequest(request)
}

function closeNetworkContentSearch(): void {
  networkContentSearchSequence += 1
  networkContentSearchOpen.value = false
  networkContentSearchState.value = 'idle'
  networkContentSearchResult.value = null
  networkContentSearchError.value = ''
}

function toggleNetworkContentSearch(): void {
  if (networkContentSearchOpen.value) {
    closeNetworkContentSearch()
    return
  }
  networkContentSearchOpen.value = true
  void nextTick(() => networkContentSearchInput.value?.focus())
}

async function runNetworkContentSearch(): Promise<void> {
  const tab = activeTab.value
  const query = networkContentSearchQuery.value.trim()
  if (!tab || !query) return
  const sequence = ++networkContentSearchSequence
  networkContentSearchState.value = 'searching'
  networkContentSearchError.value = ''
  try {
    const result = await browser.searchNetwork({
      tabId: tab.id,
      query,
      caseSensitive: networkContentSearchCaseSensitive.value
    })
    if (sequence !== networkContentSearchSequence || activeTab.value?.id !== tab.id) return
    networkContentSearchResult.value = result
    networkContentSearchState.value = 'complete'
  } catch (error) {
    if (sequence !== networkContentSearchSequence || activeTab.value?.id !== tab.id) return
    networkContentSearchState.value = 'error'
    networkContentSearchError.value = error instanceof Error ? error.message : String(error)
  }
}

async function selectNetworkSearchMatch(match: BrowserNetworkSearchMatch): Promise<void> {
  const request = networkRequests.value.find((candidate) => candidate.id === match.requestId)
  if (!request) {
    networkContentSearchError.value = 'That request is no longer in the bounded Network log. Refresh and search again.'
    return
  }
  await selectNetworkRequest(request)
}

async function copySanitizedNetworkDetails(format: 'json' | BrowserNetworkRequestCopyFormat = 'json'): Promise<void> {
  if (!networkRequestDetails.value) return
  networkMonitorError.value = ''
  try {
    const text = format === 'json'
      ? JSON.stringify(networkRequestDetails.value, null, 2)
      : formatNetworkRequestCopy(networkRequestDetails.value, format)
    if (!await copyAppText(text)) return
    networkDetailsCopied.value = format
    window.setTimeout(() => {
      if (networkDetailsCopied.value === format) networkDetailsCopied.value = null
    }, 1_500)
  } catch (error) {
    networkMonitorError.value = error instanceof Error ? error.message : String(error)
  }
}

async function copySanitizedNetworkHar(): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  networkMonitorError.value = ''
  try {
    const har: BrowserNetworkHar = await browser.createNetworkHar({
      tabId: tab.id,
      query: networkSearch.value,
      resourceType: networkResourceFilter.value || undefined,
      errorsOnly: networkFailuresOnly.value,
      includeBodies: false,
      maxRequests: 100
    })
    if (activeTab.value?.id !== tab.id) return
    if (!await copyAppText(JSON.stringify(har, null, 2))) return
    if (activeTab.value?.id !== tab.id) return
    networkHarCopied.value = true
    window.setTimeout(() => (networkHarCopied.value = false), 1_500)
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    networkMonitorError.value = error instanceof Error ? error.message : String(error)
  }
}

async function saveSanitizedNetworkHar(): Promise<void> {
  const tab = activeTab.value
  if (!tab || networkHarSaveState.value === 'saving') return
  networkMonitorError.value = ''
  networkHarSaveState.value = 'saving'
  networkHarExport.value = null
  try {
    const exported = await browser.saveNetworkHar({
      tabId: tab.id,
      query: networkSearch.value,
      resourceType: networkResourceFilter.value || undefined,
      errorsOnly: networkFailuresOnly.value,
      includeBodies: false,
      maxRequests: 100
    })
    if (activeTab.value?.id !== tab.id) return
    networkHarExport.value = exported
    networkHarSaveState.value = 'saved'
    window.setTimeout(() => {
      if (networkHarSaveState.value === 'saved') networkHarSaveState.value = 'idle'
    }, 2_500)
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    networkHarSaveState.value = 'idle'
    networkMonitorError.value = error instanceof Error ? error.message : String(error)
  }
}

async function runDebugReport(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  debugReportPanelOpen.value = true
  debugReportState.value = 'running'
  debugReportError.value = ''
  debugReportCopied.value = false
  try {
    const report = await browser.createDebugReport({
      tabId: tab.id,
      maxConsoleMessages: 30,
      maxNetworkRequests: 30,
      includeSuccessfulRequests: false
    })
    if (activeTab.value?.id !== tab.id) return
    debugReport.value = report
    debugReportState.value = 'complete'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    debugReportState.value = 'error'
    debugReportError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleDebugReport(): void {
  if (debugReportPanelOpen.value) {
    debugReportPanelOpen.value = false
    return
  }
  void runDebugReport()
}

async function copyDebugReport(): Promise<void> {
  if (!debugReport.value) return
  if (!await copyAppText(JSON.stringify(debugReport.value, null, 2))) return
  debugReportCopied.value = true
  window.setTimeout(() => (debugReportCopied.value = false), 1_500)
}

async function manageRepro(action: 'start' | 'get' | 'stop' | 'clear'): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  reproState.value = 'loading'
  reproError.value = ''
  reproCopied.value = false
  reproPlaywrightCopied.value = false
  try {
    const recording = await browser.manageRepro(action, tab.id)
    if (activeTab.value?.id !== tab.id) return
    reproRecording.value = recording
    reproState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    reproState.value = 'error'
    reproError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleReproRecorder(): void {
  if (reproPanelOpen.value) {
    reproPanelOpen.value = false
    return
  }
  closeTransientPanels()
  reproPanelOpen.value = true
  void manageRepro('get')
}

async function startReproRecording(): Promise<void> {
  await manageRepro('start')
}

async function stopReproRecording(): Promise<void> {
  await manageRepro('stop')
}

async function clearReproRecording(): Promise<void> {
  await manageRepro('clear')
}

async function copyReproRecording(): Promise<void> {
  if (!reproRecording.value) return
  if (!await copyAppText(JSON.stringify(reproRecording.value, null, 2))) return
  reproCopied.value = true
  window.setTimeout(() => (reproCopied.value = false), 1_500)
}

async function copyReproPlaywright(): Promise<void> {
  if (!reproRecording.value) return
  if (!await copyAppText(formatReproAsPlaywright(reproRecording.value))) return
  reproPlaywrightCopied.value = true
  window.setTimeout(() => (reproPlaywrightCopied.value = false), 1_500)
}

function formatReproElapsed(elapsedMs: number): string {
  if (elapsedMs < 1_000) return `+${elapsedMs} ms`
  return `+${(elapsedMs / 1_000).toFixed(elapsedMs < 10_000 ? 1 : 0)} s`
}

async function manageDomChanges(
  action: 'start' | 'get' | 'stop' | 'clear',
  quiet = false
): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  const request = ++domChangesRequestSequence
  if (!quiet) domChangesState.value = 'loading'
  domChangesError.value = ''
  if (!quiet) domChangesCopied.value = false
  try {
    const report = await browser.manageDomChanges(action, tab.id)
    if (request !== domChangesRequestSequence || activeTab.value?.id !== tab.id) return
    domChangesReport.value = report
    domChangesState.value = 'ready'
  } catch (error) {
    if (request !== domChangesRequestSequence || activeTab.value?.id !== tab.id) return
    domChangesState.value = 'error'
    domChangesError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleDomChanges(): void {
  if (domChangesPanelOpen.value) {
    domChangesPanelOpen.value = false
    return
  }
  closeTransientPanels()
  domChangesPanelOpen.value = true
}

async function copyDomChanges(): Promise<void> {
  if (!domChangesReport.value) return
  if (!await copyAppText(JSON.stringify(domChangesReport.value, null, 2))) return
  domChangesCopied.value = true
  window.setTimeout(() => (domChangesCopied.value = false), 1_500)
}

function domChangeDescription(entry: BrowserDomChangeEntry): string {
  if (entry.kind === 'attributes') {
    return `${entry.attributeName ?? 'Attribute'} changed${entry.occurrences > 1 ? ` ${entry.occurrences} times` : ''}`
  }
  if (entry.kind === 'text') return `Text content changed${entry.occurrences > 1 ? ` ${entry.occurrences} times` : ''} (content not recorded)`
  const parts: string[] = []
  if (entry.addedNodes) parts.push(`${entry.addedNodes} added`)
  if (entry.removedNodes) parts.push(`${entry.removedNodes} removed`)
  return parts.length ? parts.join(' · ') : 'Child structure changed'
}

async function manageVisualCompare(action: 'get' | 'set-baseline' | 'compare' | 'clear'): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  visualCompareState.value = 'loading'
  visualCompareError.value = ''
  visualCompareCopied.value = false
  try {
    const report = await browser.visualCompare({ tabId: tab.id, action, settleMs: 200 })
    if (activeTab.value?.id !== tab.id) return
    visualCompareReport.value = report
    visualCompareState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    visualCompareState.value = 'error'
    visualCompareError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleVisualCompare(): void {
  if (visualComparePanelOpen.value) {
    visualComparePanelOpen.value = false
    return
  }
  closeTransientPanels()
  visualComparePanelOpen.value = true
  void manageVisualCompare('get')
}

async function copyVisualDiff(): Promise<void> {
  const tab = activeTab.value
  if (!tab || visualCompareReport.value?.status !== 'compared') return
  visualCompareError.value = ''
  try {
    await browser.copyVisualDiff(tab.id)
    visualCompareCopied.value = true
    window.setTimeout(() => (visualCompareCopied.value = false), 1_500)
  } catch (error) {
    visualCompareState.value = 'error'
    visualCompareError.value = error instanceof Error ? error.message : String(error)
  }
}

async function refreshInspectorIssues(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  inspectorIssuesState.value = 'loading'
  inspectorIssuesError.value = ''
  inspectorIssuesCopied.value = false
  try {
    const report = await browser.listInspectorIssues(tab.id)
    if (activeTab.value?.id !== tab.id) return
    inspectorIssuesReport.value = report
    inspectorIssuesState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    inspectorIssuesState.value = 'error'
    inspectorIssuesError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleInspectorIssues(): void {
  if (inspectorIssuesOpen.value) {
    inspectorIssuesOpen.value = false
    return
  }
  closeTransientPanels()
  inspectorIssuesOpen.value = true
  void refreshInspectorIssues()
}

async function clearInspectorIssues(): Promise<void> {
  const tab = activeTab.value
  if (!tab) return
  inspectorIssuesState.value = 'loading'
  inspectorIssuesError.value = ''
  try {
    const report = await browser.listInspectorIssues(tab.id, true)
    if (activeTab.value?.id !== tab.id) return
    inspectorIssuesReport.value = report
    inspectorIssuesState.value = 'ready'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    inspectorIssuesState.value = 'error'
    inspectorIssuesError.value = error instanceof Error ? error.message : String(error)
  }
}

async function copyInspectorIssues(): Promise<void> {
  if (!inspectorIssuesReport.value) return
  if (!await copyAppText(JSON.stringify(inspectorIssuesReport.value, null, 2))) return
  inspectorIssuesCopied.value = true
  window.setTimeout(() => (inspectorIssuesCopied.value = false), 1_500)
}

async function runAccessibilityAudit(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  accessibilityPanelOpen.value = true
  accessibilityAuditState.value = 'running'
  accessibilityAuditError.value = ''
  accessibilityAudit.value = null
  try {
    const audit = await browser.runAccessibilityAudit({
      tabId: tab.id,
      standard: 'wcag-aa',
      maxViolations: 50,
      maxNodesPerViolation: 3
    })
    if (activeTab.value?.id !== tab.id) return
    accessibilityAudit.value = audit
    accessibilityAuditState.value = 'complete'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    accessibilityAuditState.value = 'error'
    accessibilityAuditError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleAccessibilityAudit(): void {
  if (accessibilityPanelOpen.value) {
    accessibilityPanelOpen.value = false
    return
  }
  void runAccessibilityAudit()
}

async function runQualityAudit(): Promise<void> {
  const tab = activeTab.value
  if (!tab || tab.url.startsWith('bronom://home')) return
  closeTransientPanels()
  qualityAuditPanelOpen.value = true
  qualityAuditState.value = 'running'
  qualityAuditError.value = ''
  qualityAuditReport.value = null
  qualityAuditCopied.value = false
  try {
    const report = await browser.runQualityAudit(tab.id)
    if (activeTab.value?.id !== tab.id) return
    qualityAuditReport.value = report
    qualityAuditState.value = 'complete'
  } catch (error) {
    if (activeTab.value?.id !== tab.id) return
    qualityAuditState.value = 'error'
    qualityAuditError.value = error instanceof Error ? error.message : String(error)
  }
}

function toggleQualityAudit(): void {
  if (qualityAuditPanelOpen.value) {
    qualityAuditPanelOpen.value = false
    return
  }
  void runQualityAudit()
}

async function copyQualityAudit(): Promise<void> {
  if (!qualityAuditReport.value) return
  if (!await copyAppText(JSON.stringify(qualityAuditReport.value, null, 2))) return
  qualityAuditCopied.value = true
  window.setTimeout(() => (qualityAuditCopied.value = false), 1_500)
}

function dismissAppToast(id: number): void {
  const timer = appToastTimers.get(id)
  if (timer !== undefined) window.clearTimeout(timer)
  appToastTimers.delete(id)
  appToasts.value = appToasts.value.filter((toast) => toast.id !== id)
}

function showAppToast(tone: AppToastTone, title: string, message: string): void {
  const boundedTitle = title.trim().slice(0, 120)
  const boundedMessage = message.trim().slice(0, 1_000)
  const duplicate = appToasts.value.find((toast) => (
    toast.tone === tone && toast.title === boundedTitle && toast.message === boundedMessage
  ))
  if (duplicate) dismissAppToast(duplicate.id)
  for (const toast of [...appToasts.value]) dismissAppToast(toast.id)
  const id = nextAppToastId++
  appToasts.value = [{ id, tone, title: boundedTitle, message: boundedMessage }]
  const duration = tone === 'error' ? 8_000 : 3_600
  appToastTimers.set(id, window.setTimeout(() => dismissAppToast(id), duration))
}

function friendlyUiError(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  const message = raw
    .replace(/^Error invoking remote method '[^']+':\s*/i, '')
    .replace(/^Error:\s*/i, '')
    .trim()
  return message || fallback
}

async function copyAppText(text: string): Promise<boolean> {
  try {
    await browser.copyText(text)
    return true
  } catch (error) {
    showAppToast('error', 'Copy failed', friendlyUiError(error, 'The system clipboard did not accept the text.'))
    return false
  }
}

async function copyPageSnapshot(): Promise<void> {
  if (!activeTab.value || activeTab.value.url.startsWith('bronom://home') || pageSnapshotState.value === 'copying') return
  if (pageSnapshotResetTimer !== undefined) {
    window.clearTimeout(pageSnapshotResetTimer)
    pageSnapshotResetTimer = undefined
  }
  const tabId = activeTab.value.id
  pageSnapshotState.value = 'copying'
  try {
    const result = await browser.copySnapshot(tabId)
    pageSnapshotState.value = 'copied'
    showAppToast(
      'success',
      'Page snapshot copied',
      `${result.characters.toLocaleString()} characters of headings, controls, and visible text are ready to paste into your agent chat${result.truncated ? ' (bounded at 30,000 characters).' : '.'}`
    )
  } catch (error) {
    pageSnapshotState.value = 'error'
    showAppToast('error', 'Page snapshot failed', friendlyUiError(error, 'Could not copy the current page snapshot.'))
  }
  pageSnapshotResetTimer = window.setTimeout(() => {
    if (pageSnapshotState.value !== 'copying') pageSnapshotState.value = 'idle'
    pageSnapshotResetTimer = undefined
  }, 1_800)
}

function resetElementPickerSoon(): void {
  if (elementPickerResetTimer !== undefined) window.clearTimeout(elementPickerResetTimer)
  elementPickerResetTimer = window.setTimeout(() => {
    elementPickerState.value = 'idle'
    elementPickerMode.value = 'context'
    elementPickerResetTimer = undefined
  }, 1_500)
}

async function cancelActiveElementPicker(): Promise<void> {
  const tabId = elementPickerTabId
  elementPickerTabId = undefined
  if (tabId) await browser.cancelElementPicker(tabId).catch(() => false)
  elementPickerState.value = 'idle'
  elementPickerMode.value = 'context'
}

async function toggleElementPicker(mode: ElementPickerMode = 'context'): Promise<void> {
  if (elementPickerState.value === 'picking') {
    const restartInAnotherMode = elementPickerMode.value !== mode
    await cancelActiveElementPicker()
    if (!restartInAnotherMode) return
  }
  if (!activeTab.value || activeTab.value.url.startsWith('bronom://home')) return
  if (areaCaptureState.value === 'picking') await toggleAreaCapture()
  const tabId = activeTab.value.id
  elementPickerTabId = tabId
  elementPickerMode.value = mode
  elementPickerState.value = 'picking'
  try {
    const result = mode === 'screenshot'
      ? await browser.captureElement(tabId)
      : await browser.pickElement(tabId)
    if (elementPickerTabId !== tabId) return
    elementPickerTabId = undefined
    elementPickerState.value = result.copied ? 'copied' : 'idle'
    if (result.copied) {
      showAppToast(
        'success',
        mode === 'screenshot' ? 'Element screenshot copied' : 'Element copied',
        mode === 'screenshot' ? 'Paste the PNG into your agent chat.' : 'Safe DOM context is ready to paste into your agent chat.'
      )
      resetElementPickerSoon()
    }
  } catch (error) {
    if (elementPickerTabId !== tabId) return
    elementPickerTabId = undefined
    elementPickerState.value = 'error'
    showAppToast(
      'error',
      mode === 'screenshot' ? 'Element screenshot failed' : 'Element selection failed',
      friendlyUiError(error, mode === 'screenshot' ? 'Could not capture or copy the selected element.' : 'Could not copy the selected element context.')
    )
    resetElementPickerSoon()
  }
}

function resetAreaCaptureSoon(): void {
  if (areaCaptureResetTimer !== undefined) window.clearTimeout(areaCaptureResetTimer)
  areaCaptureResetTimer = window.setTimeout(() => {
    areaCaptureState.value = 'idle'
    screenshotCaptureMode.value = 'area'
    areaCaptureResetTimer = undefined
  }, 2_400)
}

async function toggleAreaCapture(): Promise<void> {
  if (areaCaptureState.value === 'picking') {
    const tabId = areaCaptureTabId
    areaCaptureTabId = undefined
    if (tabId) await browser.cancelAreaCapture(tabId).catch(() => false)
    areaCaptureState.value = 'idle'
    return
  }
  if (areaCaptureState.value === 'capturing') return
  if (!activeTab.value || activeTab.value.url.startsWith('bronom://home')) return
  if (elementPickerState.value === 'picking') await cancelActiveElementPicker()
  if (areaCaptureResetTimer !== undefined) {
    window.clearTimeout(areaCaptureResetTimer)
    areaCaptureResetTimer = undefined
  }
  const tabId = activeTab.value.id
  areaCaptureTabId = tabId
  screenshotCaptureMode.value = 'area'
  areaCaptureError.value = ''
  areaCaptureState.value = 'picking'
  try {
    const result = await browser.captureArea(tabId)
    if (areaCaptureTabId !== tabId) return
    areaCaptureTabId = undefined
    areaCaptureState.value = result.copied ? 'copied' : 'idle'
    if (result.copied) {
      showAppToast('success', 'Area screenshot copied', 'Paste the PNG into your agent chat.')
      resetAreaCaptureSoon()
    }
  } catch (error) {
    if (areaCaptureTabId !== tabId) return
    areaCaptureTabId = undefined
    const message = friendlyUiError(error, 'Could not capture this area.')
    areaCaptureError.value = `Could not copy area: ${message}`
    areaCaptureState.value = 'error'
    showAppToast('error', 'Screenshot failed', message)
    resetAreaCaptureSoon()
  }
}

async function capturePageScreenshot(mode: 'viewport' | 'full-page'): Promise<void> {
  if (!activeTab.value || activeTab.value.url.startsWith('bronom://home')) return
  if (elementPickerState.value === 'picking') await cancelActiveElementPicker()
  if (areaCaptureState.value === 'picking') await toggleAreaCapture()
  if (areaCaptureState.value === 'capturing') return
  if (areaCaptureResetTimer !== undefined) {
    window.clearTimeout(areaCaptureResetTimer)
    areaCaptureResetTimer = undefined
  }
  const tabId = activeTab.value.id
  areaCaptureTabId = tabId
  screenshotCaptureMode.value = mode
  areaCaptureError.value = ''
  areaCaptureState.value = 'capturing'
  try {
    const result = await browser.capturePage({ tabId, fullPage: mode === 'full-page' })
    if (areaCaptureTabId !== tabId) return
    areaCaptureTabId = undefined
    areaCaptureState.value = result.copied ? 'copied' : 'idle'
    if (result.copied) {
      showAppToast('success', mode === 'full-page' ? 'Full-page screenshot copied' : 'Viewport screenshot copied', 'Paste the PNG into your agent chat.')
      resetAreaCaptureSoon()
    }
  } catch (error) {
    if (areaCaptureTabId !== tabId) return
    areaCaptureTabId = undefined
    const captureName = mode === 'full-page' ? 'full page' : 'viewport'
    const message = friendlyUiError(error, `Could not capture the ${captureName}.`)
    areaCaptureError.value = `Could not copy ${captureName}: ${message}`
    areaCaptureState.value = 'error'
    showAppToast('error', 'Screenshot failed', message)
    resetAreaCaptureSoon()
  }
}

function applyTheme(next: AppSettings): void {
  settings.value = next
  if (mcpPortState.value !== 'saving') mcpPortDraft.value = String(next.mcpPort)
  setFoley({ muted: !next.attentionSound })
  const effectiveTheme = next.theme === 'system' ? systemTheme.value : next.theme
  document.documentElement.dataset.themePreference = next.theme
  document.documentElement.dataset.theme = effectiveTheme
  document.documentElement.style.colorScheme = effectiveTheme === 'light' ? 'light' : 'dark'
}

function handleSystemThemeChange(theme: 'light' | 'dark'): void {
  systemTheme.value = theme
  if (settings.value.theme === 'system') applyTheme(settings.value)
}

async function selectTheme(theme: ThemeName): Promise<void> {
  applyTheme(await window.bronomSettings.setTheme(theme))
}

async function selectInterfaceScale(event: Event): Promise<void> {
  const scale = Number((event.target as HTMLSelectElement).value) as InterfaceScale
  applyTheme(await window.bronomSettings.setInterfaceScale(scale))
}

async function selectSearchEngine(searchEngine: SearchEngineName): Promise<void> {
  applyTheme(await window.bronomSettings.setSearchEngine(searchEngine))
}

async function setHideInTray(event: Event): Promise<void> {
  applyTheme(await window.bronomSettings.setHideInTray((event.target as HTMLInputElement).checked))
}

async function setAttentionSound(event: Event): Promise<void> {
  applyTheme(await window.bronomSettings.setAttentionSound((event.target as HTMLInputElement).checked))
}

async function setAttentionSoundCue(event: Event): Promise<void> {
  const cue = (event.target as HTMLSelectElement).value as AttentionSoundCue
  applyTheme(await window.bronomSettings.setAttentionSoundCue(cue))
}

function downloadSettingsFailure(error: unknown): void {
  downloadSettingsState.value = 'error'
  downloadSettingsMessage.value = error instanceof Error ? error.message : String(error)
}

async function chooseDownloadDirectory(): Promise<void> {
  downloadSettingsState.value = 'working'
  downloadSettingsMessage.value = 'Opening the folder picker…'
  try {
    const result = await window.bronomSettings.chooseDownloadDirectory()
    if (result.canceled) {
      downloadSettingsState.value = 'idle'
      downloadSettingsMessage.value = ''
      return
    }
    applyTheme(result.settings)
    downloadSettingsState.value = 'saved'
    downloadSettingsMessage.value = 'New website downloads will use this folder.'
  } catch (error) {
    downloadSettingsFailure(error)
  }
}

async function setAskWhereToSaveDownloads(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  downloadSettingsState.value = 'working'
  downloadSettingsMessage.value = 'Saving download preferences…'
  try {
    applyTheme(await window.bronomSettings.setAskWhereToSaveDownloads(input.checked))
    downloadSettingsState.value = 'saved'
    downloadSettingsMessage.value = input.checked
      ? 'Bronom will ask where to save each new website download.'
      : 'New website downloads will save automatically.'
  } catch (error) {
    input.checked = settings.value.askWhereToSaveDownloads
    downloadSettingsFailure(error)
  }
}

async function openDownloadDirectory(): Promise<void> {
  downloadSettingsState.value = 'working'
  downloadSettingsMessage.value = 'Opening the download folder…'
  try {
    await window.bronomSettings.openDownloadDirectory()
    downloadSettingsState.value = 'idle'
    downloadSettingsMessage.value = ''
  } catch (error) {
    downloadSettingsFailure(error)
  }
}

async function resetDownloadSettings(): Promise<void> {
  downloadSettingsState.value = 'working'
  downloadSettingsMessage.value = 'Restoring download defaults…'
  try {
    applyTheme(await window.bronomSettings.resetDownloads())
    downloadSettingsState.value = 'saved'
    downloadSettingsMessage.value = 'Downloads will use the default folder and save automatically.'
  } catch (error) {
    downloadSettingsFailure(error)
  }
}

async function setMemorySaverEnabled(event: Event): Promise<void> {
  applyTheme(await window.bronomSettings.setMemorySaverEnabled((event.target as HTMLInputElement).checked))
}

async function setMemorySaverTimeout(event: Event): Promise<void> {
  const timeoutMinutes = Number((event.target as HTMLSelectElement).value) as MemorySaverTimeoutMinutes
  applyTheme(await window.bronomSettings.setMemorySaverTimeoutMinutes(timeoutMinutes))
}

async function sleepInactiveTabsNow(): Promise<void> {
  state.value = await browser.sleepInactiveTabs()
}

function memorySaverTimeoutLabel(timeoutMinutes: number): string {
  if (timeoutMinutes < 60) return `${timeoutMinutes} minutes`
  const hours = timeoutMinutes / 60
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
}

function testAttentionSound(): void {
  playFoley(settings.value.attentionSoundCue, { volume: 0.65 })
}

async function setMcpAuthentication(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  if (!input.checked) {
    const confirmed = window.confirm(
      'Disable MCP authentication? Any process on this computer will be able to control your logged-in browser and attach local files.'
    )
    if (!confirmed) {
      input.checked = true
      return
    }
  }
  applyTheme(await window.bronomSettings.setMcpAuthentication(input.checked))
}

async function applyMcpPort(): Promise<void> {
  if (!mcpPortValid.value) {
    mcpPortState.value = 'error'
    mcpPortMessage.value = `Choose a whole number from ${MIN_MCP_PORT} through ${MAX_MCP_PORT}.`
    return
  }
  mcpPortState.value = 'saving'
  mcpPortMessage.value = `Moving the MCP listener to port ${parsedMcpPort.value}…`
  try {
    applyTheme(await window.bronomSettings.setMcpPort(parsedMcpPort.value))
    mcpPortState.value = 'saved'
    mcpPortMessage.value = `MCP port ${parsedMcpPort.value} is active.`
  } catch (error) {
    mcpPortState.value = 'error'
    mcpPortMessage.value = error instanceof Error ? error.message : String(error)
  }
}

function editMcpPort(): void {
  mcpPortState.value = 'idle'
  mcpPortMessage.value = ''
}

async function setCheckForUpdatesOnStartup(event: Event): Promise<void> {
  applyTheme(await window.bronomSettings.setCheckForUpdatesOnStartup((event.target as HTMLInputElement).checked))
}

async function setSitePermission(entry: SitePermissionEntry, event: Event): Promise<void> {
  const decision = (event.target as HTMLSelectElement).value as SitePermissionDecision
  await window.bronomPermissions.set(entry.origin, entry.permission, decision)
}

async function removeSitePermission(entry: SitePermissionEntry): Promise<void> {
  await window.bronomPermissions.remove(entry.origin, entry.permission)
}

async function resetSitePermissionFromControls(entry: SitePermissionEntry): Promise<void> {
  await removeSitePermission(entry)
  await nextTick()
  siteControlsOpen.value = true
  await nextTick()
  siteControlsButton.value?.focus()
}

async function fillSavedPassword(): Promise<void> {
  if (!activeTab.value || !activeCredentials.value.length) return
  if (activeCredentials.value.length === 1) {
    await fillSelectedCredential(activeCredentials.value[0])
    return
  }
  credentialPickerQuery.value = ''
  credentialPickerSelection.value = 0
  credentialPickerOpen.value = true
  await nextTick()
  credentialPickerInput.value?.focus()
}

async function fillSelectedCredential(credential: CredentialSummary): Promise<void> {
  const tabId = activeTab.value?.id
  if (!tabId || credentialFillState.value === 'filling') return
  credentialPickerOpen.value = false
  credentialFillState.value = 'filling'
  try {
    const filled = await window.bronomCredentials.fill(tabId, credential.id)
    if (!filled) throw new Error('The saved account no longer matches this website.')
    showAppToast('success', 'Password filled', `${credential.username || 'Unnamed account'} was filled. Agents remain paused.`)
  } catch (error) {
    showAppToast('error', 'Password fill failed', friendlyUiError(error, 'The saved password could not be filled.'))
  } finally {
    credentialFillState.value = 'idle'
  }
}

function credentialOptionId(credential: CredentialSummary): string {
  return `credential-option-${credential.id}`
}

function revealSelectedCredential(): void {
  const credential = selectedActiveCredential.value
  if (!credential) return
  document.getElementById(credentialOptionId(credential))?.scrollIntoView({ block: 'nearest' })
}

async function moveCredentialPickerSelection(offset: -1 | 1): Promise<void> {
  const count = filteredActiveCredentials.value.length
  if (!count) return
  credentialPickerSelection.value = (credentialPickerSelection.value + offset + count) % count
  await nextTick()
  revealSelectedCredential()
}

function handleCredentialPickerKeydown(event: KeyboardEvent): void {
  const count = filteredActiveCredentials.value.length
  if (event.key === 'Escape') {
    event.preventDefault()
    credentialPickerOpen.value = false
    return
  }
  if (!count) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    void moveCredentialPickerSelection(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    void moveCredentialPickerSelection(-1)
    return
  }
  if (event.key === 'Enter' && selectedActiveCredential.value) {
    event.preventDefault()
    void fillSelectedCredential(selectedActiveCredential.value)
  }
}

async function removeSavedCredential(id: string): Promise<void> {
  await window.bronomCredentials.remove(id)
}

function permissionLabel(permission: string): string {
  const labels: Record<string, string> = {
    'clipboard-read': 'Clipboard read',
    'clipboard-sanitized-write': 'Clipboard write',
    'display-capture': 'Screen capture',
    fileSystem: 'Files and folders',
    fullscreen: 'Fullscreen',
    geolocation: 'Location',
    'idle-detection': 'Activity detection',
    media: 'Camera and microphone',
    notifications: 'Notifications',
    'storage-access': 'Third-party storage',
    'top-level-storage-access': 'Related-site storage',
    'window-management': 'Window management'
  }
  return labels[permission] ?? permission.replaceAll('-', ' ')
}

function handleUpdateState(next: AppUpdateState): void {
  updateState.value = next
  if (next.status === 'available' || next.status === 'downloading' || next.status === 'downloaded' || next.status === 'up-to-date' || next.status === 'error' || next.status === 'install-error') {
    updateNoticeOpen.value = true
  }
}

function handleMcpTabActivity(activity: McpTabActivity): void {
  const requests = activeMcpRequestsByTab.get(activity.tabId) ?? new Map<string, McpTabActivity>()
  if (activity.phase === 'started') requests.set(activity.activityId, activity)
  else requests.delete(activity.activityId)
  if (requests.size > 0) activeMcpRequestsByTab.set(activity.tabId, requests)
  else activeMcpRequestsByTab.delete(activity.tabId)

  const previousTimer = mcpActivityTimers.get(activity.tabId)
  if (previousTimer !== undefined) {
    window.clearTimeout(previousTimer)
    mcpActivityTimers.delete(activity.tabId)
  }
  if (activity.phase === 'started') {
    mcpActivityByTab.value = { ...mcpActivityByTab.value, [activity.tabId]: activity }
    return
  }
  if (requests.size > 0) {
    const latest = [...requests.values()].at(-1)
    if (latest) mcpActivityByTab.value = { ...mcpActivityByTab.value, [activity.tabId]: latest }
    return
  }
  const timer = window.setTimeout(() => {
    const next = { ...mcpActivityByTab.value }
    delete next[activity.tabId]
    mcpActivityByTab.value = next
    mcpActivityTimers.delete(activity.tabId)
  }, MCP_TAB_ACTIVITY_LINGER_MS)
  mcpActivityTimers.set(activity.tabId, timer)
}

async function checkForUpdatesInSettings(): Promise<void> {
  updateNoticeOpen.value = true
  handleUpdateState(await window.bronomUpdates.check())
}

async function downloadUpdate(): Promise<void> {
  handleUpdateState(await window.bronomUpdates.download())
}

async function installUpdate(): Promise<void> {
  await window.bronomUpdates.install()
}

function openUpdateSettings(): void {
  helpDialog.value = null
  tabSearchOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  settingsSection.value = 'updates'
  settingsOpen.value = true
}

async function openPrivacySettings(origin?: string): Promise<void> {
  updateNoticeOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  zoomOpen.value = false
  addressSuggestionsOpen.value = false
  if (findOpen.value) await closeFind()
  janitorSearch.value = origin ?? ''
  settingsSection.value = 'privacy'
  settingsOpen.value = true
}

async function openSupport(url: string): Promise<void> {
  helpDialog.value = null
  settingsOpen.value = false
  await syncState(browser.newTab({ url, active: true }))
}

function closeDockedPanels(): void {
  siteControlsOpen.value = false
  siteStorageOpen.value = false
  pageToolsOpen.value = false
  responsivePanelOpen.value = false
  environmentPanelOpen.value = false
  accessibilityPanelOpen.value = false
  qualityAuditPanelOpen.value = false
  performancePanelOpen.value = false
  designOverviewPanelOpen.value = false
  pageMetadataPanelOpen.value = false
  securityPanelOpen.value = false
  coveragePanelOpen.value = false
  cpuProfilePanelOpen.value = false
  memoryPanelOpen.value = false
  consolePanelOpen.value = false
  networkMonitorOpen.value = false
  debugReportPanelOpen.value = false
  reproPanelOpen.value = false
  domChangesPanelOpen.value = false
  visualComparePanelOpen.value = false
  inspectorIssuesOpen.value = false
  bookmarksOpen.value = false
}

function activatePanel(panel: DetachablePanelId): void {
  closeDockedPanels()
  if (isDetachedPanelWindow) document.title = detachedPanelTitle(panel)
  if (panel === 'site-controls') siteControlsOpen.value = true
  else if (panel === 'site-storage') siteStorageOpen.value = true
  else if (panel === 'page-tools') pageToolsOpen.value = true
  else if (panel === 'responsive-preview') responsivePanelOpen.value = true
  else if (panel === 'environment') environmentPanelOpen.value = true
  else if (panel === 'accessibility') accessibilityPanelOpen.value = true
  else if (panel === 'quality-audit') qualityAuditPanelOpen.value = true
  else if (panel === 'performance') performancePanelOpen.value = true
  else if (panel === 'design-overview') designOverviewPanelOpen.value = true
  else if (panel === 'page-metadata') pageMetadataPanelOpen.value = true
  else if (panel === 'security') securityPanelOpen.value = true
  else if (panel === 'coverage') coveragePanelOpen.value = true
  else if (panel === 'cpu-profile') cpuProfilePanelOpen.value = true
  else if (panel === 'memory') memoryPanelOpen.value = true
  else if (panel === 'console') consolePanelOpen.value = true
  else if (panel === 'network') networkMonitorOpen.value = true
  else if (panel === 'debug-report') debugReportPanelOpen.value = true
  else if (panel === 'repro-recorder') reproPanelOpen.value = true
  else if (panel === 'dom-changes') domChangesPanelOpen.value = true
  else if (panel === 'visual-compare') visualComparePanelOpen.value = true
  else if (panel === 'issues') inspectorIssuesOpen.value = true
  else if (panel === 'bookmarks') bookmarksOpen.value = true
}

async function refreshDetachedPanel(panel: DetachablePanelId): Promise<void> {
  if (panel === 'site-controls') await refreshSiteDataSummary()
  else if (panel === 'site-storage') await refreshSiteStorage()
  else if (panel === 'responsive-preview') loadResponsiveDraft()
  else if (panel === 'environment') loadEnvironmentDraft()
  else if (panel === 'accessibility') await runAccessibilityAudit()
  else if (panel === 'quality-audit') await runQualityAudit()
  else if (panel === 'performance') await runPerformanceReport()
  else if (panel === 'design-overview') await runDesignOverview()
  else if (panel === 'page-metadata') await runPageMetadata()
  else if (panel === 'security') await runSecurityReport()
  else if (panel === 'coverage') await manageCodeCoverage('get')
  else if (panel === 'cpu-profile') await manageCpuProfile('get')
  else if (panel === 'memory') await runMemoryReport()
  else if (panel === 'console') await refreshConsole()
  else if (panel === 'network') await Promise.all([refreshNetworkMonitor(), refreshNetworkRoutes()])
  else if (panel === 'debug-report') await runDebugReport()
  else if (panel === 'repro-recorder') await manageRepro('get')
  else if (panel === 'dom-changes') await manageDomChanges('get')
  else if (panel === 'visual-compare') await manageVisualCompare('get')
  else if (panel === 'issues') await refreshInspectorIssues()
}

async function showDetachedPanel(panel: DetachablePanelId): Promise<void> {
  activatePanel(panel)
  await nextTick()
  await refreshDetachedPanel(panel)
}

function closeTransientPanels(): void {
  if (isDetachedPanelWindow || panelDock.value !== 'window') closeDockedPanels()
  addressSuggestionsOpen.value = false
  zoomOpen.value = false
  downloadsOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  updateNoticeOpen.value = false
}

function togglePageTools(): void {
  if (pageToolsOpen.value) {
    pageToolsOpen.value = false
    return
  }
  closeTransientPanels()
  pageToolsOpen.value = true
}

function openHelpDialog(dialog: 'shortcuts' | 'about'): void {
  closeTransientPanels()
  settingsOpen.value = false
  helpDialog.value = dialog
}

function handleHelpRequested(action: HelpMenuAction): void {
  if (action === 'support') {
    openSupportSettings()
    return
  }
  openHelpDialog(action)
}

async function toggleDeveloperTools(): Promise<void> {
  const tab = activeTab.value
  if (!tab || activeIsHome.value || tab.humanInteractionLocked) return
  helpDialog.value = null
  settingsOpen.value = false
  closeTransientPanels()
  await browser.toggleDevTools(tab.id)
}

function openSupportSettings(): void {
  helpDialog.value = null
  closeTransientPanels()
  settingsSection.value = 'support'
  settingsOpen.value = true
  void loadCommercialLicenseState()
}

async function loadCommercialLicenseState(): Promise<void> {
  commercialLicense.value = await window.bronomLicense.getState()
}

async function activateCommercialLicense(): Promise<void> {
  const key = commercialLicenseKey.value.trim()
  if (!key) {
    commercialLicenseError.value = 'Enter the supporter key from your Creem receipt.'
    return
  }
  commercialLicenseAction.value = 'activating'
  commercialLicenseError.value = ''
  try {
    commercialLicense.value = await window.bronomLicense.activate(key)
    commercialLicenseKey.value = ''
  } catch (error) {
    commercialLicenseError.value = error instanceof Error ? error.message : String(error)
  } finally {
    commercialLicenseAction.value = 'idle'
  }
}

async function refreshCommercialLicense(): Promise<void> {
  commercialLicenseAction.value = 'refreshing'
  commercialLicenseError.value = ''
  try {
    commercialLicense.value = await window.bronomLicense.refresh()
  } catch (error) {
    commercialLicenseError.value = error instanceof Error ? error.message : String(error)
  } finally {
    commercialLicenseAction.value = 'idle'
  }
}

async function deactivateCommercialLicense(): Promise<void> {
  if (!window.confirm('Deactivate this Bronom installation and free its device slot?')) return
  commercialLicenseAction.value = 'deactivating'
  commercialLicenseError.value = ''
  try {
    commercialLicense.value = await window.bronomLicense.deactivate()
  } catch (error) {
    commercialLicenseError.value = error instanceof Error ? error.message : String(error)
  } finally {
    commercialLicenseAction.value = 'idle'
  }
}

function toggleSettings(): void {
  const open = !settingsOpen.value
  helpDialog.value = null
  closeTransientPanels()
  settingsOpen.value = open
}

async function resetCurrentSection(): Promise<void> {
  if (settingsSection.value === 'appearance') {
    await selectTheme('system')
    applyTheme(await window.bronomSettings.setInterfaceScale(DEFAULT_INTERFACE_SCALE))
    applyTheme(await window.bronomSettings.setHideInTray(true))
    applyTheme(await window.bronomSettings.setAttentionSound(true))
    applyTheme(await window.bronomSettings.setAttentionSoundCue('warning'))
    return
  }
  if (settingsSection.value === 'search') {
    await selectSearchEngine('google')
    return
  }
  if (settingsSection.value === 'downloads') return resetDownloadSettings()
  if (settingsSection.value === 'performance') {
    applyTheme(await window.bronomSettings.setMemorySaverEnabled(true))
    applyTheme(await window.bronomSettings.setMemorySaverTimeoutMinutes(DEFAULT_MEMORY_SAVER_TIMEOUT_MINUTES))
    return
  }
  if (settingsSection.value === 'permissions') {
    await window.bronomPermissions.clear()
    return
  }
  if (settingsSection.value === 'privacy') {
    browsingDataOptions.value = { history: true, cookiesAndSiteData: false, cache: true }
    browsingDataMessage.value = ''
    browsingDataState.value = 'idle'
    return
  }
  if (settingsSection.value === 'mcp') {
    applyTheme(await window.bronomSettings.setMcpAuthentication(false))
    mcpPortDraft.value = String(DEFAULT_MCP_PORT)
    await applyMcpPort()
    return
  }
  applyTheme(await window.bronomSettings.setCheckForUpdatesOnStartup(true))
}

function isAllInteractionLockTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('.all-lock-button') !== null
}

function guardShellInteraction(event: Event): void {
  if (!state.value.allHumanInteractionLocked || isAllInteractionLockTarget(event.target)) return
  event.preventDefault()
  event.stopImmediatePropagation()
}

function handleKeyDown(event: KeyboardEvent): void {
  guardShellInteraction(event)
  if (event.defaultPrevented) return
  const shortcut = browserShortcutAction({
    key: event.key,
    control: event.ctrlKey,
    meta: event.metaKey,
    alt: event.altKey,
    shift: event.shiftKey,
    repeat: event.repeat,
    composing: event.isComposing
  })
  if (commandPaletteOpen.value && shortcut !== 'command-palette') {
    if (event.key === 'Escape') commandPaletteOpen.value = false
    return
  }
  if (shortcut) {
    event.preventDefault()
    void runBrowserShortcut(shortcut)
    return
  }
  if (event.key !== 'Escape') return
  if (workspaceEditorOpen.value) closeWorkspaceEditor()
  else if (commandPaletteOpen.value) commandPaletteOpen.value = false
  else if (siteStorageOpen.value) siteStorageOpen.value = false
  else if (siteControlsOpen.value) siteControlsOpen.value = false
  else if (addressSuggestionsOpen.value) addressSuggestionsOpen.value = false
  else if (findOpen.value) void closeFind()
  else if (tabSearchOpen.value) tabSearchOpen.value = false
  else if (splitMenuOpen.value) splitMenuOpen.value = false
  else if (zoomOpen.value) zoomOpen.value = false
  else if (downloadsOpen.value) downloadsOpen.value = false
  else if (bookmarksOpen.value) {
    if (editingBookmarkId.value) cancelRenameBookmark()
    else bookmarksOpen.value = false
  }
  else if (historyOpen.value) historyOpen.value = false
  else if (pageToolsOpen.value) pageToolsOpen.value = false
  else if (accessibilityPanelOpen.value) accessibilityPanelOpen.value = false
  else if (qualityAuditPanelOpen.value) qualityAuditPanelOpen.value = false
  else if (performancePanelOpen.value) performancePanelOpen.value = false
  else if (designOverviewPanelOpen.value) designOverviewPanelOpen.value = false
  else if (pageMetadataPanelOpen.value) pageMetadataPanelOpen.value = false
  else if (securityPanelOpen.value) securityPanelOpen.value = false
  else if (coveragePanelOpen.value) coveragePanelOpen.value = false
  else if (cpuProfilePanelOpen.value) cpuProfilePanelOpen.value = false
  else if (memoryPanelOpen.value) memoryPanelOpen.value = false
  else if (consolePanelOpen.value) consolePanelOpen.value = false
  else if (debugReportPanelOpen.value) debugReportPanelOpen.value = false
  else if (reproPanelOpen.value) reproPanelOpen.value = false
  else if (domChangesPanelOpen.value) domChangesPanelOpen.value = false
  else if (visualComparePanelOpen.value) visualComparePanelOpen.value = false
  else if (inspectorIssuesOpen.value) inspectorIssuesOpen.value = false
  else if (networkMonitorOpen.value) networkMonitorOpen.value = false
  else if (responsivePanelOpen.value) responsivePanelOpen.value = false
  else if (environmentPanelOpen.value) environmentPanelOpen.value = false
  else if (areaCaptureState.value === 'picking') void toggleAreaCapture()
  else if (elementPickerState.value === 'picking') void cancelActiveElementPicker()
  else if (helpDialog.value) helpDialog.value = null
  else if (settingsOpen.value) settingsOpen.value = false
  else updateNoticeOpen.value = false
}

function reportShellHeight(): void {
  if (isDetachedPanelWindow) return
  if (!shell.value) return
  const shellHeight = shell.value.getBoundingClientRect().height
  shellContentTop.value = Math.ceil(shellHeight)
  const horizontal = panelDock.value === 'right' || panelDock.value === 'left'
  const preferredSize = horizontal
    ? panelDockHorizontalSize.value ?? Math.round(window.innerWidth * 0.4)
    : panelDockVerticalSize.value ?? Math.round(window.innerHeight * 0.45)
  const maximumSize = panelDockMaximumSize(shellHeight)
  const minimumSize = panelDockMinimumSize(maximumSize)
  panelDockSize.value = Math.round(Math.min(maximumSize, Math.max(minimumSize, preferredSize)))
  // Website content is a native WebContentsView. Renderer-owned UI may reserve
  // its space only when it is true application chrome or a full modal. Any
  // transient popover that overlaps a website must use a topmost native view.
  const modalOpen = fullModalOpen.value
  const sidePanelInset = modalOpen ? 0 : Array.from(
    shell.value.querySelectorAll<HTMLElement>('[data-shell-side-panel]')
  ).reduce((inset, panel) => Math.max(inset, window.innerWidth - panel.getBoundingClientRect().left), 0)
  window.bronomShell.setToolbarHeight(shellHeightForBrowserContent({
    shellHeight,
    viewportHeight: window.innerHeight,
    modalOpen
  }))
  const dockSize = dockedPanelOpen.value && !modalOpen ? panelDockSize.value : 0
  window.bronomShell.setContentInsets({
    top: panelDock.value === 'top' ? dockSize : 0,
    right: Math.max(panelDock.value === 'right' ? dockSize : 0, Math.ceil(sidePanelInset)),
    bottom: panelDock.value === 'bottom' ? dockSize : 0,
    left: panelDock.value === 'left' ? dockSize : 0
  })
}

function panelDockMaximumSize(shellHeight = shell.value?.getBoundingClientRect().height ?? shellContentTop.value): number {
  if (panelDock.value === 'right' || panelDock.value === 'left') {
    return Math.max(1, Math.min(840, window.innerWidth - 360))
  }
  return Math.max(1, Math.min(700, window.innerHeight - shellHeight - 220))
}

function panelDockMinimumSize(maximumSize = panelDockMaximumSize()): number {
  return Math.min(panelDock.value === 'right' || panelDock.value === 'left' ? 320 : 240, maximumSize)
}

function setPanelDockSize(size: number, persist: boolean): void {
  const horizontal = panelDock.value === 'right' || panelDock.value === 'left'
  const maximumSize = panelDockMaximumSize()
  const minimumSize = panelDockMinimumSize(maximumSize)
  const next = Math.round(Math.min(maximumSize, Math.max(minimumSize, size)))
  if (horizontal) panelDockHorizontalSize.value = next
  else panelDockVerticalSize.value = next
  if (persist) {
    window.localStorage.setItem(
      horizontal ? 'bronom:panel-dock-size-horizontal' : 'bronom:panel-dock-size-vertical',
      String(next)
    )
  }
  reportShellHeight()
}

function startPanelResize(event: PointerEvent): void {
  if (event.button !== 0 || panelDock.value === 'window') return
  event.preventDefault()
  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)
  panelResizeGesture.value = {
    pointerId: event.pointerId,
    coordinate: panelDock.value === 'right' || panelDock.value === 'left' ? event.clientX : event.clientY,
    size: panelDockSize.value,
    handle
  }
  window.addEventListener('pointermove', movePanelResize)
  window.addEventListener('pointerup', finishPanelResize)
  window.addEventListener('pointercancel', finishPanelResize)
}

function movePanelResize(event: PointerEvent): void {
  const gesture = panelResizeGesture.value
  if (!gesture || gesture.pointerId !== event.pointerId) return
  const coordinate = panelDock.value === 'right' || panelDock.value === 'left' ? event.clientX : event.clientY
  const direction = panelDock.value === 'right' || panelDock.value === 'bottom' ? -1 : 1
  setPanelDockSize(gesture.size + (coordinate - gesture.coordinate) * direction, false)
}

function finishPanelResize(event: PointerEvent): void {
  const gesture = panelResizeGesture.value
  if (!gesture || gesture.pointerId !== event.pointerId) return
  panelResizeGesture.value = null
  window.removeEventListener('pointermove', movePanelResize)
  window.removeEventListener('pointerup', finishPanelResize)
  window.removeEventListener('pointercancel', finishPanelResize)
  if (gesture.handle.hasPointerCapture(event.pointerId)) gesture.handle.releasePointerCapture(event.pointerId)
  setPanelDockSize(panelDockSize.value, true)
}

function resizePanelWithKeyboard(event: KeyboardEvent): void {
  const horizontal = panelDock.value === 'right' || panelDock.value === 'left'
  if (event.key === 'Home') {
    event.preventDefault()
    setPanelDockSize(horizontal ? 320 : 240, true)
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    setPanelDockSize(panelDockMaximumSize(), true)
    return
  }
  const direction = horizontal
    ? event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    : event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0
  if (!direction) return
  event.preventDefault()
  const outwardDirection = panelDock.value === 'right' || panelDock.value === 'bottom' ? -direction : direction
  setPanelDockSize(panelDockSize.value + outwardDirection * (event.shiftKey ? 48 : 16), true)
}

function resetPanelDockSize(): void {
  const horizontal = panelDock.value === 'right' || panelDock.value === 'left'
  if (horizontal) {
    panelDockHorizontalSize.value = null
    window.localStorage.removeItem('bronom:panel-dock-size-horizontal')
  } else {
    panelDockVerticalSize.value = null
    window.localStorage.removeItem('bronom:panel-dock-size-vertical')
  }
  reportShellHeight()
}

onMounted(async () => {
  bindFoley()
  unsubscribe = browser.onStateChanged((next) => (state.value = next))
  unsubscribeMcpActivity = browser.onMcpTabActivity(handleMcpTabActivity)
  unsubscribeDownloads = window.bronomDownloads.onChanged(applyDownloads)
  unsubscribeBookmarks = window.bronomBookmarks.onChanged((next) => (bookmarks.value = next))
  unsubscribeHistory = window.bronomHistory.onChanged((next) => (visitHistory.value = next))
  unsubscribeMcpControl = window.bronomMcp.onChanged((next) => (mcpControl.value = next))
  unsubscribeUserAttention = browser.onUserAttentionRequested(() => {
    playFoley(settings.value.attentionSoundCue, { volume: 0.65 })
  })
  unsubscribeShortcutRequested = browser.onShortcutRequested((action) => { void runBrowserShortcut(action) })
  unsubscribeTabGroupEdit = browser.onTabGroupEditRequested((groupId) => { void openTabGroupEditor(groupId) })
  if (!isDetachedPanelWindow) {
    unsubscribeAddressOverlay = window.bronomAddressOverlay.onSelected((suggestionId) => {
      const suggestion = addressSuggestions.value.find((candidate) => candidate.id === suggestionId)
      if (suggestion) void selectAddressSuggestion(suggestion)
    })
  }
  unsubscribeSettings = window.bronomSettings.onChanged(applyTheme)
  unsubscribeSystemTheme = window.bronomSettings.onSystemThemeChanged(handleSystemThemeChange)
  unsubscribePermissions = window.bronomPermissions.onChanged((next) => (sitePermissions.value = next))
  unsubscribeCredentials = window.bronomCredentials.onChanged((next) => (credentials.value = next))
  unsubscribeLicense = window.bronomLicense.onChanged((next) => (commercialLicense.value = next))
  unsubscribeUpdates = window.bronomUpdates.onChanged(handleUpdateState)
  unsubscribeUpdateOpen = window.bronomUpdates.onOpenRequested(() => {
    openUpdateSettings()
  })
  unsubscribeHelp = window.bronomShell.onHelpRequested(handleHelpRequested)
  unsubscribeClipboardFailed = window.bronomShell.onClipboardFailed((message) => {
    showAppToast('error', 'Copy failed', friendlyUiError(message, 'The system clipboard did not accept the text.'))
  })
  unsubscribeActionFailed = window.bronomShell.onActionFailed(({ action, message }) => {
    const normalizedAction = action.trim() || 'browser action'
    const title = `${normalizedAction.charAt(0).toUpperCase()}${normalizedAction.slice(1)} failed`
    showAppToast('error', title, friendlyUiError(message, 'The requested browser action could not be completed.'))
  })
  unsubscribePanelRequested = window.bronomPanelWindow.onPanelRequested((panel) => {
    if (isDetachedPanelWindow) void showDetachedPanel(panel)
  })
  unsubscribePanelActive = window.bronomPanelWindow.onActivePanelChanged((panel) => {
    if (isDetachedPanelWindow) return
    syncingDetachedPanelState = true
    activatePanel(panel)
    window.setTimeout(() => (syncingDetachedPanelState = false), 0)
  })
  unsubscribePanelRedock = window.bronomPanelWindow.onRedockRequested(({ panel, dock }) => {
    if (isDetachedPanelWindow) return
    panelDock.value = dock
    activatePanel(panel)
  })
  unsubscribePanelClosed = window.bronomPanelWindow.onClosed(() => {
    if (!isDetachedPanelWindow) closeDockedPanels()
  })
  const [browserState, appSettings, nativeSystemTheme, systemDownloadDirectory, permissions, appUpdateState, mcpControlState, credentialStatus, savedCredentials, savedDownloads, savedBookmarks, savedVisitHistory, savedCommercialLicense] = await Promise.all([
    browser.getState(),
    window.bronomSettings.get(),
    window.bronomSettings.getSystemTheme(),
    window.bronomSettings.getDefaultDownloadDirectory(),
    window.bronomPermissions.list(),
    window.bronomUpdates.getState(),
    window.bronomMcp.getState(),
    window.bronomCredentials.status(),
    window.bronomCredentials.list(),
    window.bronomDownloads.list(),
    window.bronomBookmarks.list(),
    window.bronomHistory.list(),
    window.bronomLicense.getState()
  ])
  state.value = browserState
  systemTheme.value = nativeSystemTheme
  defaultDownloadDirectory.value = systemDownloadDirectory
  applyTheme(appSettings)
  sitePermissions.value = permissions
  updateState.value = appUpdateState
  mcpControl.value = mcpControlState
  credentialStorage.value = credentialStatus
  credentials.value = savedCredentials
  commercialLicense.value = savedCommercialLicense
  downloads.value = savedDownloads
  for (const download of savedDownloads) knownDownloadIds.add(download.id)
  bookmarks.value = savedBookmarks
  visitHistory.value = savedVisitHistory
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', handleWindowResize)
  await nextTick()
  resizeObserver = new ResizeObserver(reportShellHeight)
  if (shell.value) resizeObserver.observe(shell.value)
  reportShellHeight()
})

onBeforeUnmount(() => {
  unsubscribe?.()
  unsubscribeMcpActivity?.()
  unsubscribeDownloads?.()
  unsubscribeBookmarks?.()
  unsubscribeHistory?.()
  unsubscribeMcpControl?.()
  unsubscribeUserAttention?.()
  unsubscribeShortcutRequested?.()
  unsubscribeSettings?.()
  unsubscribeSystemTheme?.()
  unsubscribePermissions?.()
  unsubscribeCredentials?.()
  unsubscribeLicense?.()
  unsubscribeUpdates?.()
  unsubscribeUpdateOpen?.()
  unsubscribeHelp?.()
  unsubscribeClipboardFailed?.()
  unsubscribeActionFailed?.()
  unsubscribeTabGroupEdit?.()
  unsubscribeAddressOverlay?.()
  if (!isDetachedPanelWindow) window.bronomAddressOverlay.hide()
  unsubscribePanelRequested?.()
  unsubscribePanelActive?.()
  unsubscribePanelRedock?.()
  unsubscribePanelClosed?.()
  resizeObserver?.disconnect()
  if (updateNoticeDismissTimer !== undefined) window.clearTimeout(updateNoticeDismissTimer)
  if (elementPickerResetTimer !== undefined) window.clearTimeout(elementPickerResetTimer)
  if (pageSnapshotResetTimer !== undefined) window.clearTimeout(pageSnapshotResetTimer)
  if (areaCaptureResetTimer !== undefined) window.clearTimeout(areaCaptureResetTimer)
  if (pdfExportResetTimer !== undefined) window.clearTimeout(pdfExportResetTimer)
  if (consoleRefreshTimer !== undefined) window.clearInterval(consoleRefreshTimer)
  if (domChangesRefreshTimer !== undefined) window.clearInterval(domChangesRefreshTimer)
  if (networkReplayConfirmTimer !== undefined) window.clearTimeout(networkReplayConfirmTimer)
  for (const timer of mcpActivityTimers.values()) window.clearTimeout(timer)
  mcpActivityTimers.clear()
  for (const timer of appToastTimers.values()) window.clearTimeout(timer)
  appToastTimers.clear()
  activeMcpRequestsByTab.clear()
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', handleWindowResize)
  window.removeEventListener('pointermove', movePanelResize)
  window.removeEventListener('pointerup', finishPanelResize)
  window.removeEventListener('pointercancel', finishPanelResize)
})
</script>

<template>
  <header
    ref="shell"
    class="shell"
    :class="[
      {
        'all-human-interaction-locked': state.allHumanInteractionLocked,
        'home-shell': activeIsHome,
        'detached-panel-window': isDetachedPanelWindow,
        'detached-panel-unavailable': detachedPanelUnavailable
      },
      `panel-dock-${panelDock}`
    ]"
    :style="{
      '--panel-dock-size': `${panelDockSize}px`,
      '--shell-content-top': `${shellContentTop}px`
    }"
    @click.capture="guardShellInteraction"
    @pointerdown.capture="guardShellInteraction"
    @contextmenu.capture="guardShellInteraction"
    @wheel.capture="guardShellInteraction"
    @submit.capture="guardShellInteraction"
  >
    <div class="topbar">
      <button
        class="app-home-button"
        :class="{ active: homeTab?.active }"
        type="button"
        title="Open Bronom Home"
        aria-label="Open Bronom Home"
        :aria-current="homeTab?.active ? 'page' : undefined"
        @click="openApplicationHome"
      >
        <span v-if="homeTab?.loading" class="spinner" aria-label="Loading" />
        <IconDashboard v-else aria-hidden="true" />
        <span>Home</span>
      </button>
      <span class="topbar-divider" aria-hidden="true" />
      <div class="tabs-strip" role="tablist" aria-label="Browser tabs">
        <template v-for="(tab, tabIndex) in regularTabs" :key="tab.id">
          <button
            v-if="beginsTabGroup(tab, tabIndex)"
            class="tab-group-label"
            :class="{ active: tabGroupContainsActiveTab(tab.mcpGroupId!) }"
            :style="tabGroupStyle(tab)"
            :title="`${isTabGroupCollapsed(tab.mcpGroupId!) ? 'Expand' : 'Collapse'} workspace ${tab.mcpGroupName} · ${tab.mcpGroupId}`"
            :aria-label="`${isTabGroupCollapsed(tab.mcpGroupId!) ? 'Expand' : 'Collapse'} workspace ${tab.mcpGroupName}, ${tabGroupTabCount(tab.mcpGroupId!)} ${tabGroupTabCount(tab.mcpGroupId!) === 1 ? 'tab' : 'tabs'}`"
            :aria-expanded="!isTabGroupCollapsed(tab.mcpGroupId!)"
            type="button"
            @click="toggleTabGroup(tab.mcpGroupId!)"
            @contextmenu.prevent="browser.showTabContextMenu(tab.id)"
          >
            <IconKeyboardArrowRight v-if="isTabGroupCollapsed(tab.mcpGroupId!)" aria-hidden="true" />
            <IconKeyboardArrowDown v-else aria-hidden="true" />
            <IconKeep
              v-if="state.mcpTabGroups.find((group) => group.id === tab.mcpGroupId)?.isDefault"
              class="tab-group-default-badge"
              aria-label="Default workspace for new tabs"
            />
            <span>{{ tab.mcpGroupName }}</span>
            <span class="tab-group-count" aria-hidden="true">{{ tabGroupTabCount(tab.mcpGroupId!) }}</span>
          </button>
        <button
          v-if="!tab.mcpGroupId || !isTabGroupCollapsed(tab.mcpGroupId)"
          class="tab"
          :class="{
            active: tab.active,
            pinned: tab.pinned,
            sleeping: tab.sleeping,
            grouped: Boolean(tab.mcpGroupId),
            dragging: draggedTabId === tab.id,
            'drop-before': tabDropTargetId === tab.id && tabDropPlacement === 'before',
            'drop-after': tabDropTargetId === tab.id && tabDropPlacement === 'after',
            locked: state.allHumanInteractionLocked || tab.humanInteractionLocked,
            'split-visible': state.splitView?.firstTabId === tab.id || state.splitView?.secondTabId === tab.id,
            'mcp-active': Boolean(mcpActivityByTab[tab.id])
          }"
          :style="tabGroupStyle(tab)"
          :title="mcpActivityByTab[tab.id]
            ? `AI command: ${mcpActivityByTab[tab.id].toolName}`
            : tabTooltip(tab)"
          :data-mcp-command="mcpActivityByTab[tab.id]?.toolName"
          :aria-label="tabTooltip(tab)"
          type="button"
          role="tab"
          draggable="true"
          :aria-selected="tab.active"
          @click="tabSearchOpen = false; selectBrowserTab(tab.id)"
          @contextmenu.prevent="browser.showTabContextMenu(tab.id)"
          @dragstart="beginTabDrag($event, tab)"
          @dragover="updateTabDrop($event, tab)"
          @drop="finishTabDrop($event, tab)"
          @dragend="clearTabDrag"
        >
          <span v-if="tab.loading" class="spinner" aria-label="Loading" />
          <IconError v-else-if="tab.pageProblem" class="favicon-fallback tab-problem-icon" aria-label="Page needs attention" />
          <img v-else-if="tab.faviconDataUrl" class="favicon-image" :src="tab.faviconDataUrl" alt="" draggable="false" />
          <span v-else-if="tab.url === 'about:blank'" class="favicon-fallback" aria-hidden="true">✦</span>
          <IconLanguage v-else class="favicon-fallback" aria-hidden="true" />
          <span class="tab-title">{{ tab.title || 'New tab' }}</span>
          <IconBedtime v-if="tab.sleeping" class="tab-sleep-mark" aria-label="Sleeping to save resources" />
          <IconHorizontalSplit
            v-if="state.splitView?.orientation === 'horizontal' && (state.splitView.firstTabId === tab.id || state.splitView.secondTabId === tab.id)"
            class="tab-split-mark"
            aria-label="Visible in stacked split view"
          />
          <IconVerticalSplit
            v-else-if="state.splitView && (state.splitView.firstTabId === tab.id || state.splitView.secondTabId === tab.id)"
            class="tab-split-mark"
            aria-label="Visible in side-by-side split view"
          />
          <IconSpeed v-if="tab.emulation" class="tab-emulation-mark" :aria-label="`Emulated: ${emulationDescription(tab.emulation)}`" />
          <IconRoute v-if="tab.networkRouteCount" class="tab-network-route-mark" :aria-label="`${tab.networkRouteCount} temporary network ${tab.networkRouteCount === 1 ? 'route' : 'routes'}`" />
          <IconLock v-if="state.allHumanInteractionLocked || tab.humanInteractionLocked" class="tab-lock-mark" aria-label="Human interaction locked" />
          <span
            v-if="tab.audible || tab.muted"
            class="tab-audio"
            :class="{ muted: tab.muted }"
            role="button"
            :title="tab.muted ? `Unmute ${tab.title || 'tab'}` : `Mute ${tab.title || 'tab'}`"
            :aria-label="tab.muted ? `Unmute ${tab.title || 'tab'}` : `Mute ${tab.title || 'tab'}`"
            :aria-pressed="tab.muted"
            @click="toggleTabMuted($event, tab)"
          >
            <IconVolumeOff v-if="tab.muted" aria-hidden="true" />
            <IconVolumeUp v-else aria-hidden="true" />
          </span>
          <span class="tab-close" role="button" title="Close tab (Ctrl/Cmd+W)" aria-label="Close tab" aria-keyshortcuts="Control+W Meta+W" @click="closeTab($event, tab.id)"><IconClose aria-hidden="true" /></span>
        </button>
        </template>
        <button class="new-tab" type="button" title="New tab (Ctrl/Cmd+T)" aria-label="New tab" aria-keyshortcuts="Control+T Meta+T" @click="runBrowserShortcut('new-tab')"><IconAdd aria-hidden="true" /></button>
        <button class="new-workspace" type="button" title="New isolated workspace" aria-label="Create workspace" @click="openNewWorkspaceEditor"><IconWorkspaces aria-hidden="true" /></button>
      </div>
      <div class="topbar-actions">
        <button
          class="topbar-icon-button command-palette-button"
          type="button"
          title="Commands (Ctrl/Cmd+Shift+P)"
          aria-label="Open command palette"
          aria-keyshortcuts="Control+Shift+P Meta+Shift+P"
          :aria-expanded="commandPaletteOpen"
          @click="toggleCommandPalette"
        >
          <IconKeyboardCommandKey aria-hidden="true" />
        </button>
        <button
          class="topbar-icon-button tab-search-button"
          type="button"
          title="Search tabs (Ctrl/Cmd+Shift+A)"
          aria-label="Search tabs"
          aria-keyshortcuts="Control+Shift+A Meta+Shift+A"
          :aria-expanded="tabSearchOpen"
          @click="toggleTabSearch"
        >
          <IconTabSearch aria-hidden="true" />
        </button>
        <button
          class="topbar-icon-button downloads-button"
          :class="{ active: activeDownloads.length, complete: !activeDownloads.length && downloads[0]?.state === 'completed' }"
          type="button"
          :title="downloadButtonLabel"
          :aria-label="downloadButtonLabel"
          :aria-expanded="downloadsOpen"
          @click="toggleDownloads"
        >
          <IconProgress v-if="activeDownloads.length" class="state-spinner" aria-hidden="true" />
          <IconDownloadDone v-else-if="downloads[0]?.state === 'completed'" aria-hidden="true" />
          <IconDownload v-else aria-hidden="true" />
          <span v-if="downloads.length" class="downloads-badge" aria-hidden="true">{{ Math.min(downloads.length, 99) }}</span>
        </button>
        <button
          class="topbar-icon-button history-button"
          type="button"
          title="Browsing history (Ctrl+H / Cmd+Y)"
          aria-label="Browsing history"
          aria-keyshortcuts="Control+H Meta+Y"
          :aria-expanded="historyOpen"
          @click="toggleVisitHistory"
        >
          <IconHistory aria-hidden="true" />
        </button>
        <span class="topbar-actions-divider" aria-hidden="true" />
        <button
          ref="allInteractionLockButton"
          class="browser-lock-button all-lock-button"
          :class="{ locked: state.allHumanInteractionLocked }"
          type="button"
          :title="allInteractionLockLabel"
          :aria-label="allInteractionLockLabel"
          :aria-pressed="state.allHumanInteractionLocked"
          @click="toggleAllHumanInteraction"
        >
          <IconLock v-if="state.allHumanInteractionLocked" aria-hidden="true" />
          <IconLockOpen v-else aria-hidden="true" />
          Bronom
        </button>
        <UpdateNotification
          v-if="showUpdateStatusPill"
          mode="pill"
          :state="updateState"
          @open="openUpdateSettings"
        />
        <div class="mcp-controls" :class="mcpControl.status">
          <button class="mcp-pill" type="button" :title="mcpStatusTitle" @click="copyMcpUrl">
            <span class="status-dot" />
            {{ mcpStatusLabel }}
          </button>
          <button
            class="mcp-pause-button"
            type="button"
            :title="canToggleMcpPaused ? (mcpControl.paused ? 'Resume new MCP commands' : 'Pause new MCP commands') : 'MCP server is unavailable'"
            :aria-label="mcpControl.paused ? 'Resume agents' : 'Pause agents'"
            :aria-pressed="mcpControl.paused"
            :disabled="!canToggleMcpPaused"
            @click="toggleMcpPaused"
          >
            <IconPlay v-if="mcpControl.paused" aria-hidden="true" />
            <IconPause v-else aria-hidden="true" />
          </button>
        </div>
        <button
          class="topbar-icon-button settings-button"
          type="button"
          title="Settings"
          aria-label="Settings"
          :aria-expanded="settingsOpen"
          @click="toggleSettings"
        >
          <IconSettings aria-hidden="true" />
        </button>
      </div>
    </div>
    <div v-if="!activeIsHome" class="toolbar">
      <button class="icon-button" type="button" title="Back" aria-label="Back" :disabled="!activeTab?.canGoBack" @click="syncState(browser.back())"><IconArrowBack aria-hidden="true" /></button>
      <button class="icon-button" type="button" title="Forward" aria-label="Forward" :disabled="!activeTab?.canGoForward" @click="syncState(browser.forward())"><IconArrowForward aria-hidden="true" /></button>
      <button class="icon-button" type="button" :title="activeTab?.loading ? 'Stop' : 'Reload'" :aria-label="activeTab?.loading ? 'Stop' : 'Reload'" @click="syncState(activeTab?.loading ? browser.stop() : browser.reload())">
        <IconStop v-if="activeTab?.loading" aria-hidden="true" />
        <IconRefresh v-else aria-hidden="true" />
      </button>
      <form ref="addressForm" class="address-form" @submit.prevent="navigate" @focusout="handleAddressFocusOut">
        <button
          ref="siteControlsButton"
          class="site-controls-button"
          :class="{ active: siteControlsOpen, customized: activeSitePermissions.length > 0 }"
          type="button"
          :title="activeWebUrl ? `Site controls for ${activeHostname}` : 'Site controls are available on websites'"
          :aria-label="activeWebUrl ? `Site controls for ${activeHostname}` : 'Site controls are unavailable'"
          aria-controls="site-controls-panel"
          :aria-expanded="siteControlsOpen"
          :disabled="!activeWebUrl"
          @click="toggleSiteControls"
        >
          <IconTune aria-hidden="true" />
          <span v-if="activeSitePermissions.length" class="site-controls-indicator" aria-hidden="true" />
        </button>
        <input
          ref="addressInput"
          v-model="address"
          class="address"
          aria-label="Address"
          role="combobox"
          aria-keyshortcuts="Control+L Meta+L"
          aria-autocomplete="list"
          aria-controls="address-suggestions"
          :aria-expanded="addressSuggestionsVisible"
          :aria-activedescendant="addressSuggestionsVisible && selectedAddressSuggestion ? addressSuggestionId(selectedAddressSuggestion) : undefined"
          autocomplete="off"
          spellcheck="false"
          placeholder="Search or enter address"
          @focus="showAddressSuggestions"
          @input="showAddressSuggestions"
          @keydown="handleAddressKeydown"
        />
        <button
          v-if="activeEmulation"
          class="emulation-pill"
          :class="{ offline: activeEmulation.network === 'offline' }"
          type="button"
          :title="`Reset tab emulation: ${emulationDescription(activeEmulation)}`"
          :aria-label="`Reset tab emulation: ${emulationDescription(activeEmulation)}`"
          @click="resetActiveTabEmulation"
        >
          <IconSpeed aria-hidden="true" />
          <span>{{ emulationLabel(activeEmulation) }}</span>
          <IconClose aria-hidden="true" />
        </button>
        <button
          v-if="activeNetworkRouteCount"
          class="network-routes-pill"
          type="button"
          :title="`Open ${activeNetworkRouteCount} temporary request ${activeNetworkRouteCount === 1 ? 'condition' : 'conditions'}`"
          :aria-label="`Open ${activeNetworkRouteCount} temporary request ${activeNetworkRouteCount === 1 ? 'condition' : 'conditions'}`"
          @click="openRequestConditions"
        >
          <IconRoute aria-hidden="true" />
          <span>{{ activeNetworkRouteCount }} {{ activeNetworkRouteCount === 1 ? 'condition' : 'conditions' }}</span>
          <IconKeyboardArrowRight aria-hidden="true" />
        </button>
        <section
          v-if="siteControlsOpen"
          id="site-controls-panel"
          class="site-controls-panel"
          data-shell-docked-panel
          role="dialog"
          aria-modal="false"
          aria-labelledby="site-controls-title"
        >
          <header>
            <span class="site-controls-mark" aria-hidden="true"><IconTune /></span>
            <span class="site-controls-heading">
              <strong id="site-controls-title">{{ activeHostname }}</strong>
              <small>{{ activeAddressKind }} · {{ activeOrigin }}</small>
            </span>
            <div class="panel-header-actions">
              <PanelDockPicker v-model="panelDock" label="Dock site controls" />
              <button class="panel-close" type="button" aria-label="Close site controls" @click="siteControlsOpen = false"><IconClose aria-hidden="true" /></button>
            </div>
          </header>
          <div class="site-data-summary" :aria-busy="siteDataState === 'loading'">
            <article :aria-label="siteDataSummary ? `${siteDataSummary.cookieCount} ${siteDataSummary.cookieCount === 1 ? 'cookie' : 'cookies'} available to this address` : 'Loading cookie count'">
              <IconPrivacy aria-hidden="true" />
              <span><strong>{{ siteDataSummary?.cookieCount ?? '…' }}</strong><small>{{ siteDataSummary?.cookieCount === 1 ? 'cookie' : 'cookies' }}</small></span>
            </article>
            <article :aria-label="siteDataSummary ? `${siteDataSummary.historyEntries} ${siteDataSummary.historyEntries === 1 ? 'history page' : 'history pages'} and ${siteDataSummary.historyVisits} ${siteDataSummary.historyVisits === 1 ? 'visit' : 'visits'}` : 'Loading history count'">
              <IconHistory aria-hidden="true" />
              <span><strong>{{ siteDataSummary?.historyEntries ?? '…' }}</strong><small>{{ siteDataSummary?.historyEntries === 1 ? 'history page' : 'history pages' }}<template v-if="siteDataSummary"> · {{ siteDataSummary.historyVisits }} {{ siteDataSummary.historyVisits === 1 ? 'visit' : 'visits' }}</template></small></span>
            </article>
          </div>
          <output v-if="siteDataState === 'error'" class="site-controls-error" aria-live="polite">{{ siteDataMessage }}</output>
          <section class="site-permission-controls" aria-labelledby="site-permission-controls-title">
            <div class="site-controls-section-heading">
              <strong id="site-permission-controls-title">Permissions</strong>
              <span>{{ activeSitePermissions.length ? `${activeSitePermissions.length} customized` : 'Using defaults' }}</span>
            </div>
            <div v-if="activeSitePermissions.length" class="site-permission-list">
              <div v-for="permission in activeSitePermissions" :key="permission.permission" class="site-permission-control">
                <label :for="`site-control-${permission.permission}`">{{ permissionLabel(permission.permission) }}</label>
                <select
                  :id="`site-control-${permission.permission}`"
                  :value="permission.decision"
                  :aria-label="`${permissionLabel(permission.permission)} permission for ${permission.origin}`"
                  @change="setSitePermission(permission, $event)"
                >
                  <option value="allow">Allow</option>
                  <option value="deny">Block</option>
                </select>
                <button type="button" :aria-label="`Reset ${permissionLabel(permission.permission)} permission for ${permission.origin}`" title="Reset to default" @click="resetSitePermissionFromControls(permission)"><IconClose aria-hidden="true" /></button>
              </div>
            </div>
            <p v-else>No custom decisions for this website. Bronom will ask when a permission is needed.</p>
          </section>
          <footer>
            <button class="site-controls-secondary" type="button" @click="openSitePermissionSettings">All site settings</button>
            <button class="site-controls-primary" type="button" @click="openSitePrivacySettings">Clear data for this website</button>
          </footer>
        </section>
        <section
          v-if="addressSuggestionsVisible"
          id="address-suggestions"
          class="sr-only"
          role="listbox"
          aria-label="Local address suggestions"
        >
          <span
            v-for="(suggestion, index) in addressSuggestions"
            :id="addressSuggestionId(suggestion)"
            :key="suggestion.id"
            role="option"
            :aria-selected="index === addressSuggestionSelection"
          >{{ suggestion.title }} {{ suggestion.url }} {{ addressSuggestionMeta(suggestion) }}</span>
        </section>
      </form>
      <button
        class="icon-button find-button"
        type="button"
        title="Find in page (Ctrl/Cmd+F)"
        aria-label="Find in page"
        aria-keyshortcuts="Control+F Meta+F"
        :disabled="!activeTab"
        @click="openFind"
      >
        <IconSearch aria-hidden="true" />
      </button>
      <button
        class="zoom-button"
        type="button"
        :title="`Page zoom: ${activeTab?.zoomPercent ?? 100}% (Ctrl/Cmd + Plus, Minus, or 0)`"
        aria-label="Page zoom controls"
        :aria-expanded="zoomOpen"
        :disabled="!activeTab"
        @click="zoomOpen ? zoomOpen = false : openZoom()"
      >
        {{ activeTab?.zoomPercent ?? 100 }}%
      </button>
      <button
        class="icon-button bookmarks-button"
        :class="{ bookmarked: Boolean(currentBookmark) }"
        type="button"
        :title="currentBookmark ? 'Bookmarks — current page saved (Ctrl/Cmd+D to remove)' : 'Bookmarks (Ctrl/Cmd+D to save current page)'"
        aria-label="Bookmarks"
        aria-keyshortcuts="Control+D Meta+D"
        :aria-expanded="bookmarksOpen"
        @click="toggleBookmarks"
      >
        <IconStar v-if="currentBookmark" aria-hidden="true" />
        <IconStarOutline v-else aria-hidden="true" />
      </button>
      <div
        class="interaction-locks"
        role="group"
        :aria-label="effectiveHumanInteractionLocked ? 'Human interaction is blocked' : 'Human interaction locks'"
      >
        <button
          class="interaction-lock-button"
          :class="{ locked: tabHumanInteractionLocked }"
          type="button"
          :title="tabInteractionLockLabel"
          :aria-label="tabInteractionLockLabel"
          :aria-pressed="tabHumanInteractionLocked"
          :disabled="!activeTab || activeIsHome || state.allHumanInteractionLocked"
          @click="toggleTabHumanInteraction"
        >
          <IconLock v-if="tabHumanInteractionLocked" aria-hidden="true" />
          <IconLockOpen v-else aria-hidden="true" />
          Tab
        </button>
      </div>
      <div v-if="regularTabs.length > 1 || state.splitView" class="split-view-control">
        <button
          class="icon-button split-view-button"
          :class="{ active: Boolean(state.splitView) }"
          type="button"
          :title="state.splitView ? `Split view with ${splitPartner?.title || 'another tab'}` : 'Open two tabs in split view'"
          aria-label="Split view"
          aria-haspopup="dialog"
          :aria-expanded="splitMenuOpen"
          @click="toggleSplitMenu"
        >
          <IconHorizontalSplit v-if="state.splitView?.orientation === 'horizontal'" aria-hidden="true" />
          <IconVerticalSplit v-else aria-hidden="true" />
        </button>
        <section
          v-if="splitMenuOpen"
          class="split-view-menu"
          data-shell-side-panel
          role="dialog"
          aria-modal="false"
          aria-labelledby="split-view-menu-title"
        >
          <header>
            <div>
              <span class="eyebrow">Workspace</span>
              <h2 id="split-view-menu-title">Split view</h2>
            </div>
            <button class="panel-close" type="button" aria-label="Close split view menu" @click="splitMenuOpen = false"><IconClose aria-hidden="true" /></button>
          </header>
          <template v-if="state.splitView">
            <p class="split-view-summary">{{ activeTab?.title || 'Current tab' }} with {{ splitPartner?.title || 'another tab' }}</p>
            <div class="split-layout-options" role="group" aria-label="Split layout">
              <button
                type="button"
                :class="{ selected: state.splitView.orientation === 'vertical' }"
                :aria-pressed="state.splitView.orientation === 'vertical'"
                @click="changeSplitLayout('vertical')"
              ><IconVerticalSplit aria-hidden="true" /><span>Side by side</span></button>
              <button
                type="button"
                :class="{ selected: state.splitView.orientation === 'horizontal' }"
                :aria-pressed="state.splitView.orientation === 'horizontal'"
                @click="changeSplitLayout('horizontal')"
              ><IconHorizontalSplit aria-hidden="true" /><span>Stacked</span></button>
            </div>
            <label class="split-ratio-control">
              <span>First pane</span>
              <input
                type="range"
                min="25"
                max="75"
                step="5"
                :value="Math.round(state.splitView.ratio * 100)"
                @change="changeSplitRatio"
              />
              <output>{{ Math.round(state.splitView.ratio * 100) }}%</output>
            </label>
            <footer>
              <button type="button" @click="swapSplitTabs"><IconSwapHoriz aria-hidden="true" /> Swap panes</button>
              <button class="danger" type="button" @click="exitSplitView"><IconClose aria-hidden="true" /> Exit split view</button>
            </footer>
          </template>
          <template v-else>
            <p class="split-view-summary">Choose a tab to show on the right of {{ activeTab?.title || 'this page' }}.</p>
            <div class="split-candidate-list">
              <button v-for="tab in splitCandidates" :key="tab.id" type="button" @click="openTabInSplitView(tab.id)">
                <img v-if="tab.faviconDataUrl" :src="tab.faviconDataUrl" alt="" />
                <IconLanguage v-else aria-hidden="true" />
                <span><strong>{{ tab.title || 'New tab' }}</strong><small>{{ tab.mcpGroupName || 'No workspace' }}</small></span>
              </button>
            </div>
          </template>
        </section>
      </div>
      <button
        class="icon-button area-capture-button"
        :class="{ active: areaCaptureState === 'picking' || areaCaptureState === 'capturing', copied: areaCaptureState === 'copied', error: areaCaptureState === 'error' }"
        type="button"
        :title="areaCaptureLabel"
        :aria-label="areaCaptureLabel"
        :aria-pressed="areaCaptureState === 'picking'"
        :disabled="!activeTab || activeTab.url.startsWith('bronom://home') || areaCaptureState === 'capturing'"
        @click="toggleAreaCapture"
      >
        <IconCheck v-if="areaCaptureState === 'copied'" aria-hidden="true" />
        <IconClose v-else-if="areaCaptureState === 'picking'" aria-hidden="true" />
        <IconProgress v-else-if="areaCaptureState === 'capturing'" class="state-spinner" aria-hidden="true" />
        <IconScreenshotRegion v-else aria-hidden="true" />
      </button>
      <button
        class="icon-button element-picker-button"
        :class="{ active: elementPickerState === 'picking', copied: elementPickerState === 'copied', error: elementPickerState === 'error' }"
        type="button"
        :title="elementPickerTitle"
        :aria-label="elementPickerLabel"
        aria-keyshortcuts="Control+Shift+C Meta+Alt+C"
        :aria-pressed="elementPickerState === 'picking'"
        :disabled="!activeTab || activeTab.url.startsWith('bronom://home')"
        @click="toggleElementPicker('context')"
      >
        <IconCheck v-if="elementPickerState === 'copied'" aria-hidden="true" />
        <IconClose v-else-if="elementPickerState === 'picking'" aria-hidden="true" />
        <IconAdsClick v-else aria-hidden="true" />
      </button>
      <button
        class="icon-button page-tools-button"
        :class="{ active: pageToolsOpen }"
        type="button"
        title="Page tools"
        aria-label="Page tools"
        aria-haspopup="dialog"
        aria-controls="page-tools-panel"
        :aria-expanded="pageToolsOpen"
        :disabled="!activeTab || activeTab.url.startsWith('bronom://home')"
        @click="togglePageTools"
      >
        <IconHandyman aria-hidden="true" />
      </button>
      <section
        v-if="pageToolsOpen"
        id="page-tools-panel"
        class="page-tools-panel"
        data-shell-docked-panel
        role="dialog"
        aria-modal="false"
        aria-labelledby="page-tools-title"
      >
        <header>
          <div>
            <span class="eyebrow">Current website</span>
            <h2 id="page-tools-title">Page tools</h2>
          </div>
          <div class="panel-header-actions">
            <PanelDockPicker v-model="panelDock" label="Dock page tools" />
            <button class="panel-close" type="button" aria-label="Close page tools" @click="pageToolsOpen = false"><IconClose aria-hidden="true" /></button>
          </div>
        </header>
        <div class="page-tools-content">
          <section aria-labelledby="page-tools-inspect-title">
            <h3 id="page-tools-inspect-title">Inspect &amp; simulate</h3>
            <div class="page-tools-grid">
              <button
                type="button"
                :aria-label="activeWebUrl ? `Site storage for ${activeHostname}` : 'Site storage is unavailable'"
                :disabled="!activeWebUrl"
                @click="toggleSiteStorage"
              >
                <IconDatabase aria-hidden="true" />
                <span><strong>Site storage</strong><small>Cookies and browser storage</small></span>
              </button>
              <button
                :class="{ complete: Boolean(activeEmulation?.viewport) }"
                type="button"
                :aria-label="`Responsive preview: ${responsivePreviewLabel}`"
                @click="toggleResponsivePreview"
              >
                <IconDevices aria-hidden="true" />
                <span><strong>Responsive preview</strong><small>{{ responsivePreviewLabel }}</small></span>
              </button>
              <button
                :class="{ complete: activeEnvironmentOverrideCount > 0, error: environmentState === 'error', running: environmentState === 'applying' }"
                type="button"
                :aria-label="`Environment: ${environmentLabel}`"
                :disabled="environmentState === 'applying'"
                @click="toggleEnvironment"
              >
                <IconProgress v-if="environmentState === 'applying'" class="state-spinner" aria-hidden="true" />
                <IconSpeed v-else aria-hidden="true" />
                <span><strong>Environment</strong><small>{{ environmentLabel }}</small></span>
              </button>
              <button
                type="button"
                aria-label="Open Console"
                @click="toggleConsole"
              >
                <IconTerminal aria-hidden="true" />
                <span><strong>Console</strong><small>Errors, call stacks, and grouped messages</small></span>
              </button>
              <button
                type="button"
                aria-label="Open network monitor"
                @click="toggleNetworkMonitor"
              >
                <IconNetworkCheck aria-hidden="true" />
                <span><strong>Network</strong><small>HTTP, WebSocket, timing, and sanitized HAR</small></span>
              </button>
              <button
                :class="{ warning: activeNetworkRouteCount > 0 }"
                type="button"
                :aria-label="`Request conditions: ${activeNetworkRouteCount ? `${activeNetworkRouteCount} active` : 'none active'}`"
                @click="openRequestConditions"
              >
                <IconRoute aria-hidden="true" />
                <span><strong>Request conditions</strong><small>{{ activeNetworkRouteCount ? `${activeNetworkRouteCount} temporary active` : 'Block, mock, or throttle requests' }}</small></span>
              </button>
            </div>
          </section>
          <section aria-labelledby="page-tools-diagnose-title">
            <h3 id="page-tools-diagnose-title">Diagnose &amp; reproduce</h3>
            <div class="page-tools-grid">
              <button
                :class="{ warning: activeInspectorIssueCount > 0 }"
                type="button"
                :aria-label="`Open browser issues: ${inspectorIssuesLabel}`"
                @click="toggleInspectorIssues"
              >
                <IconWarning aria-hidden="true" />
                <span><strong>Issues</strong><small>{{ inspectorIssuesLabel }}</small></span>
              </button>
              <button
                :class="{
                  complete: securityReport?.state === 'secure',
                  warning: securityReport?.state === 'insecure' || securityReport?.state === 'insecure-broken',
                  error: securityReportState === 'error',
                  running: securityReportState === 'loading'
                }"
                type="button"
                :aria-label="`Security: ${securityLabel}`"
                :disabled="securityReportState === 'loading'"
                @click="toggleSecurityReport"
              >
                <IconProgress v-if="securityReportState === 'loading'" class="state-spinner" aria-hidden="true" />
                <IconShieldLock v-else aria-hidden="true" />
                <span><strong>Security</strong><small>{{ securityLabel }}</small></span>
              </button>
              <button
                :class="{
                  complete: debugReportState === 'complete' && debugReportSignalCount === 0,
                  warning: debugReportState === 'complete' && debugReportSignalCount > 0,
                  error: debugReportState === 'error',
                  running: debugReportState === 'running'
                }"
                type="button"
                :aria-label="debugReportLabel"
                :disabled="debugReportState === 'running'"
                @click="toggleDebugReport"
              >
                <IconProgress v-if="debugReportState === 'running'" class="state-spinner" aria-hidden="true" />
                <IconCheck v-else-if="debugReportState === 'complete' && debugReportSignalCount === 0" aria-hidden="true" />
                <IconError v-else-if="debugReportState === 'error'" aria-hidden="true" />
                <IconBugReport v-else aria-hidden="true" />
                <span><strong>Debug report</strong><small>{{ debugReportLabel }}</small></span>
              </button>
              <button
                :class="{ running: activeTab?.reproRecording?.active }"
                type="button"
                :aria-label="`Repro recorder: ${reproLabel}`"
                @click="toggleReproRecorder"
              >
                <IconRecord aria-hidden="true" />
                <span><strong>Repro recorder</strong><small>{{ reproLabel }}</small></span>
              </button>
              <button
                :class="{ running: activeTab?.domChangesRecording?.active }"
                type="button"
                :aria-label="`DOM changes: ${domChangesLabel}`"
                @click="toggleDomChanges"
              >
                <IconAccountTree aria-hidden="true" />
                <span><strong>DOM changes</strong><small>{{ domChangesLabel }}</small></span>
              </button>
              <button
                :class="{
                  complete: visualCompareReport?.status === 'compared' && visualCompareReport.identical,
                  warning: visualCompareReport?.status === 'compared' && !visualCompareReport.identical,
                  error: visualCompareState === 'error',
                  running: visualCompareState === 'loading'
                }"
                type="button"
                :aria-label="`Visual compare: ${visualCompareLabel}`"
                :disabled="visualCompareState === 'loading'"
                @click="toggleVisualCompare"
              >
                <IconProgress v-if="visualCompareState === 'loading'" class="state-spinner" aria-hidden="true" />
                <IconDifference v-else aria-hidden="true" />
                <span><strong>Visual compare</strong><small>{{ visualCompareLabel }}</small></span>
              </button>
              <button
                :class="{
                  picking: elementPickerMode === 'context' && elementPickerState === 'picking',
                  copied: elementPickerMode === 'context' && elementPickerState === 'copied',
                  error: elementPickerMode === 'context' && elementPickerState === 'error'
                }"
                type="button"
                :aria-label="contextPickerLabel"
                @click="pageToolsOpen = false; toggleElementPicker('context')"
              >
                <IconCheck v-if="elementPickerMode === 'context' && elementPickerState === 'copied'" aria-hidden="true" />
                <IconClose v-else-if="elementPickerMode === 'context' && elementPickerState === 'picking'" aria-hidden="true" />
                <IconAdsClick v-else aria-hidden="true" />
                <span><strong>Pick element</strong><small>Copy DOM, box model, styles, and a11y</small></span>
              </button>
              <button
                :class="{
                  picking: elementPickerMode === 'screenshot' && elementPickerState === 'picking',
                  copied: elementPickerMode === 'screenshot' && elementPickerState === 'copied',
                  error: elementPickerMode === 'screenshot' && elementPickerState === 'error'
                }"
                type="button"
                :aria-label="elementScreenshotLabel"
                @click="pageToolsOpen = false; toggleElementPicker('screenshot')"
              >
                <IconCheck v-if="elementPickerMode === 'screenshot' && elementPickerState === 'copied'" aria-hidden="true" />
                <IconClose v-else-if="elementPickerMode === 'screenshot' && elementPickerState === 'picking'" aria-hidden="true" />
                <IconScreenshotRegion v-else aria-hidden="true" />
                <span><strong>Element screenshot</strong><small>Pick one component and copy its complete PNG</small></span>
              </button>
            </div>
          </section>
          <section aria-labelledby="page-tools-audit-title">
            <h3 id="page-tools-audit-title">Audit &amp; optimize</h3>
            <div class="page-tools-grid">
              <button
                :class="{
                  complete: qualityAuditState === 'complete' && qualityAuditReport?.status === 'pass',
                  warning: qualityAuditState === 'complete' && qualityAuditReport?.status === 'warning',
                  error: qualityAuditState === 'error' || qualityAuditReport?.status === 'error',
                  running: qualityAuditState === 'running'
                }"
                type="button"
                :aria-label="`Quality audit: ${qualityAuditLabel}`"
                :disabled="qualityAuditState === 'running'"
                @click="toggleQualityAudit"
              >
                <IconProgress v-if="qualityAuditState === 'running'" class="state-spinner" aria-hidden="true" />
                <IconCheck v-else-if="qualityAuditReport?.status === 'pass'" aria-hidden="true" />
                <IconError v-else-if="qualityAuditState === 'error' || qualityAuditReport?.status === 'error'" aria-hidden="true" />
                <IconFactCheck v-else aria-hidden="true" />
                <span><strong>Quality audit</strong><small>{{ qualityAuditLabel }}</small></span>
              </button>
              <button
                :class="{
                  complete: accessibilityAuditState === 'complete' && accessibilityAudit?.violationCount === 0,
                  warning: accessibilityAuditState === 'complete' && Boolean(accessibilityAudit?.violationCount),
                  error: accessibilityAuditState === 'error',
                  running: accessibilityAuditState === 'running'
                }"
                type="button"
                :aria-label="accessibilityAuditLabel"
                :disabled="accessibilityAuditState === 'running'"
                @click="toggleAccessibilityAudit"
              >
                <IconProgress v-if="accessibilityAuditState === 'running'" class="state-spinner" aria-hidden="true" />
                <IconCheck v-else-if="accessibilityAuditState === 'complete' && accessibilityAudit?.violationCount === 0" aria-hidden="true" />
                <IconError v-else-if="accessibilityAuditState === 'error'" aria-hidden="true" />
                <IconAccessibility v-else aria-hidden="true" />
                <span><strong>Accessibility</strong><small>{{ accessibilityAuditLabel }}</small></span>
              </button>
              <button
                :class="{ error: performanceState === 'error', running: performanceState === 'running' }"
                type="button"
                :aria-label="performanceLabel"
                :disabled="performanceState === 'running'"
                @click="togglePerformanceReport"
              >
                <IconProgress v-if="performanceState === 'running'" class="state-spinner" aria-hidden="true" />
                <IconError v-else-if="performanceState === 'error'" aria-hidden="true" />
                <IconMonitoring v-else aria-hidden="true" />
                <span><strong>Performance</strong><small>{{ performanceLabel }}</small></span>
              </button>
              <button
                :class="{
                  warning: Boolean(designOverviewReport?.summary.contrastIssueCount),
                  error: designOverviewState === 'error',
                  running: designOverviewState === 'loading'
                }"
                type="button"
                :aria-label="`Design overview: ${designOverviewLabel}`"
                :disabled="designOverviewState === 'loading'"
                @click="toggleDesignOverview"
              >
                <IconProgress v-if="designOverviewState === 'loading'" class="state-spinner" aria-hidden="true" />
                <IconPalette v-else aria-hidden="true" />
                <span><strong>Design overview</strong><small>{{ designOverviewLabel }}</small></span>
              </button>
              <button
                :class="{
                  warning: Boolean(pageMetadataReport?.issues.some((issue) => issue.severity !== 'info')),
                  error: pageMetadataState === 'error',
                  running: pageMetadataState === 'loading'
                }"
                type="button"
                :aria-label="`Page metadata: ${pageMetadataLabel}`"
                :disabled="pageMetadataState === 'loading'"
                @click="togglePageMetadata"
              >
                <IconProgress v-if="pageMetadataState === 'loading'" class="state-spinner" aria-hidden="true" />
                <IconLanguage v-else aria-hidden="true" />
                <span><strong>Page metadata</strong><small>{{ pageMetadataLabel }}</small></span>
              </button>
              <button
                :class="{
                  complete: coverageResult?.status === 'complete',
                  error: coverageState === 'error',
                  running: Boolean(activeTab?.codeCoverageRecording) || coverageState === 'loading'
                }"
                type="button"
                :aria-label="`Code coverage: ${coverageLabel}`"
                :disabled="coverageState === 'loading'"
                @click="toggleCodeCoverage"
              >
                <IconProgress v-if="coverageState === 'loading'" class="state-spinner" aria-hidden="true" />
                <IconCode v-else aria-hidden="true" />
                <span><strong>Code coverage</strong><small>{{ coverageLabel }}</small></span>
              </button>
              <button
                :class="{
                  complete: cpuProfileResult?.status === 'complete',
                  error: cpuProfileState === 'error',
                  running: Boolean(activeTab?.cpuProfileRecording) || cpuProfileState === 'loading'
                }"
                type="button"
                :aria-label="`JavaScript CPU profile: ${cpuProfileLabel}`"
                :disabled="cpuProfileState === 'loading'"
                @click="toggleCpuProfile"
              >
                <IconProgress v-if="cpuProfileState === 'loading'" class="state-spinner" aria-hidden="true" />
                <IconMonitoring v-else aria-hidden="true" />
                <span><strong>JavaScript CPU</strong><small>{{ cpuProfileLabel }}</small></span>
              </button>
              <button
                :class="{ error: memoryState === 'error', running: memoryState === 'running' }"
                type="button"
                :aria-label="`Page memory: ${memoryLabel}`"
                :disabled="memoryState === 'running'"
                @click="toggleMemoryReport"
              >
                <IconProgress v-if="memoryState === 'running'" class="state-spinner" aria-hidden="true" />
                <IconError v-else-if="memoryState === 'error'" aria-hidden="true" />
                <IconMemory v-else aria-hidden="true" />
                <span><strong>Memory</strong><small>{{ memoryLabel }}</small></span>
              </button>
            </div>
          </section>
          <section aria-labelledby="page-tools-export-title">
            <h3 id="page-tools-export-title">Export &amp; account</h3>
            <div class="page-tools-grid">
              <button
                :class="{ copied: pageSnapshotState === 'copied', error: pageSnapshotState === 'error', running: pageSnapshotState === 'copying' }"
                type="button"
                aria-label="Copy page snapshot for agent"
                :disabled="pageSnapshotState === 'copying'"
                @click="copyPageSnapshot"
              >
                <IconProgress v-if="pageSnapshotState === 'copying'" class="state-spinner" aria-hidden="true" />
                <IconCheck v-else-if="pageSnapshotState === 'copied'" aria-hidden="true" />
                <IconError v-else-if="pageSnapshotState === 'error'" aria-hidden="true" />
                <IconAccountTree v-else aria-hidden="true" />
                <span><strong>Copy page snapshot</strong><small>Headings, controls, and visible text</small></span>
              </button>
              <button
                type="button"
                :aria-label="pdfExportLabel"
                :disabled="pdfExportState === 'saving'"
                @click="pageToolsOpen = false; saveActivePdf()"
              >
                <IconProgress v-if="pdfExportState === 'saving'" class="state-spinner" aria-hidden="true" />
                <IconCheck v-else-if="pdfExportState === 'saved'" aria-hidden="true" />
                <IconError v-else-if="pdfExportState === 'error'" aria-hidden="true" />
                <IconPdf v-else aria-hidden="true" />
                <span><strong>Save as PDF</strong><small>{{ pdfExportLabel }}</small></span>
              </button>
              <button
                type="button"
                :aria-label="activeCredentials.length ? 'Fill saved password and pause agents' : 'No saved password for this site'"
                :disabled="!credentialStorage.available || !activeCredentials.length"
                @click="pageToolsOpen = false; fillSavedPassword()"
              >
                <IconPassword aria-hidden="true" />
                <span><strong>Saved password</strong><small>{{ activeCredentials.length ? `${activeCredentials.length} available · pauses agents` : 'No saved account for this site' }}</small></span>
              </button>
            </div>
          </section>
        </div>
        <footer><span>{{ activeHostname }}</span><span>Page-specific actions</span></footer>
      </section>
    </div>
    <div v-if="!activeIsHome && activeTab?.pageProblem" class="page-problem-bar" role="alert" aria-live="assertive">
      <span class="page-problem-mark" aria-hidden="true"><IconError /></span>
      <span class="page-problem-copy">
        <strong>{{ activeTab.pageProblem.title }}</strong>
        <span>{{ activeTab.pageProblem.message }}</span>
        <code v-if="pageProblemDetails(activeTab)">{{ pageProblemDetails(activeTab) }}</code>
      </span>
      <button type="button" @click="syncState(browser.reload(activeTab.id))">
        <IconRefresh aria-hidden="true" />
        {{ activeTab.pageProblem.kind === 'unresponsive' ? 'Reload' : 'Try again' }}
      </button>
    </div>
    <section
      v-if="responsivePanelOpen"
      class="accessibility-panel responsive-preview-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="responsive-preview-title"
      :aria-busy="responsiveState === 'applying'"
    >
      <header>
        <div>
          <span class="eyebrow">Responsive testing</span>
          <h2 id="responsive-preview-title">Responsive preview</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock responsive preview" />
          <button class="panel-close" type="button" aria-label="Close responsive preview" @click="responsivePanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <form class="responsive-preview-content" @submit.prevent="applyResponsivePreview">
        <section aria-labelledby="responsive-presets-title">
          <div class="responsive-section-heading">
            <div><h3 id="responsive-presets-title">Viewport preset</h3><p>Generic sizes expose layout breakpoints without pretending to be a physical device.</p></div>
            <button type="button" title="Rotate viewport" aria-label="Rotate responsive viewport" @click="toggleResponsiveOrientation"><IconScreenRotation aria-hidden="true" /> Rotate</button>
          </div>
          <div class="responsive-preset-grid" role="group" aria-label="Responsive viewport preset">
            <button
              v-for="preset in BROWSER_VIEWPORT_PRESETS"
              :key="preset.id"
              type="button"
              :class="{ selected: responsivePresetId === preset.id }"
              :aria-pressed="responsivePresetId === preset.id"
              @click="selectResponsivePreset(preset.id)"
            >
              <strong>{{ preset.label }}</strong>
              <span>{{ preset.width }}×{{ preset.height }} · {{ preset.deviceScaleFactor }}×</span>
              <small>{{ preset.description }}</small>
            </button>
            <button
              type="button"
              :class="{ selected: responsivePresetId === 'custom' }"
              :aria-pressed="responsivePresetId === 'custom'"
              @click="selectResponsivePreset('custom')"
            >
              <strong>Custom</strong>
              <span>200–3840 px</span>
              <small>Choose exact conditions</small>
            </button>
          </div>
        </section>
        <section class="responsive-orientation" aria-labelledby="responsive-orientation-title">
          <div><h3 id="responsive-orientation-title">Orientation</h3><p>Width and height rotate together.</p></div>
          <div role="group" aria-label="Viewport orientation">
            <button type="button" :class="{ selected: responsiveOrientation === 'portrait' }" :aria-pressed="responsiveOrientation === 'portrait'" @click="setResponsiveOrientation('portrait')">Portrait</button>
            <button type="button" :class="{ selected: responsiveOrientation === 'landscape' }" :aria-pressed="responsiveOrientation === 'landscape'" @click="setResponsiveOrientation('landscape')">Landscape</button>
          </div>
        </section>
        <section v-if="responsivePresetId === 'custom'" class="responsive-custom" aria-labelledby="responsive-custom-title">
          <div><h3 id="responsive-custom-title">Custom conditions</h3><p>Viewport values are CSS pixels.</p></div>
          <div class="responsive-fields">
            <label>Width<input v-model.number="responsiveWidth" type="number" min="200" max="3840" step="1" required @input="responsiveState = 'idle'" /></label>
            <label>Height<input v-model.number="responsiveHeight" type="number" min="200" max="3840" step="1" required @input="responsiveState = 'idle'" /></label>
            <label>DPR<input v-model.number="responsiveDeviceScaleFactor" type="number" min="0.5" max="5" step="0.5" required @input="responsiveState = 'idle'" /></label>
          </div>
          <div class="responsive-toggles">
            <label><input v-model="responsiveMobile" type="checkbox" @change="responsiveState = 'idle'" /> Mobile rendering</label>
            <label><input v-model="responsiveTouch" type="checkbox" @change="responsiveState = 'idle'" /> Touch events</label>
          </div>
        </section>
        <output class="responsive-preview-summary" :class="{ error: responsiveState === 'error' || !responsiveViewport }" aria-live="polite">
          <IconDevices aria-hidden="true" />
          <span><strong>{{ responsiveState === 'applied' ? 'Viewport applied' : responsiveState === 'applying' ? 'Applying viewport…' : 'Preview conditions' }}</strong><small>{{ responsiveError || responsiveSummary }}</small></span>
        </output>
        <p class="responsive-preview-caveat"><IconInfo aria-hidden="true" /> Simulation changes only this website tab. It is useful for responsive debugging, but it is not a physical-device test.</p>
        <footer>
          <button type="button" :disabled="!activeEmulation?.viewport || responsiveState === 'applying'" @click="resetResponsivePreview">Reset viewport</button>
          <button class="primary" type="submit" :disabled="!responsiveViewport || responsiveState === 'applying'">
            <IconProgress v-if="responsiveState === 'applying'" class="state-spinner" aria-hidden="true" />
            <IconDevices v-else aria-hidden="true" />
            {{ responsiveState === 'applying' ? 'Applying…' : 'Apply preview' }}
          </button>
        </footer>
      </form>
    </section>
    <section
      v-if="environmentPanelOpen"
      class="accessibility-panel environment-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="environment-panel-title"
      :aria-busy="environmentState === 'applying'"
    >
      <header>
        <div>
          <span class="eyebrow">Current website</span>
          <h2 id="environment-panel-title">Environment</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock Environment" />
          <button class="panel-close" type="button" aria-label="Close Environment" @click="environmentPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <form class="environment-content" @submit.prevent="applyEnvironment(false)">
        <section aria-labelledby="environment-speed-title">
          <div class="environment-section-heading">
            <div><h3 id="environment-speed-title">Loading conditions</h3><p>Reproduce slower devices and unreliable connections.</p></div>
          </div>
          <div class="environment-field-grid">
            <label>
              <span>Network</span>
              <select v-model="environmentDraft.network" aria-label="Network" @change="environmentState = 'idle'">
                <option value="none">No throttling</option>
                <option value="fast-4g">Fast 4G</option>
                <option value="slow-4g">Slow 4G</option>
                <option value="slow-3g">Slow 3G</option>
                <option value="offline">Offline</option>
              </select>
              <small>Applies to new HTTP and WebSocket traffic.</small>
            </label>
            <label>
              <span>CPU</span>
              <select v-model.number="environmentDraft.cpuThrottlingRate" aria-label="CPU" @change="environmentState = 'idle'">
                <option :value="1">No slowdown</option>
                <option :value="2">2× slowdown</option>
                <option :value="4">4× slowdown</option>
                <option :value="6">6× slowdown</option>
                <option :value="20">20× slowdown</option>
              </select>
              <small>Relative to this computer, not a physical device.</small>
            </label>
            <label class="environment-field-wide">
              <span>Data Saver</span>
              <select v-model="environmentDraft.dataSaver" aria-label="Data Saver" @change="environmentState = 'idle'">
                <option value="auto">Use system setting</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
              <small>Overrides <code>navigator.connection.saveData</code>; it does not throttle bandwidth.</small>
            </label>
          </div>
          <label class="environment-toggle">
            <input v-model="environmentDraft.cacheDisabled" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Disable HTTP cache</strong><small>Ignore memory and disk cache for new requests without deleting cached data.</small></span>
          </label>
          <label class="environment-toggle">
            <input v-model="environmentDraft.bypassServiceWorker" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Bypass service worker</strong><small>Send new requests to the network without unregistering the website’s worker.</small></span>
          </label>
          <p v-if="environmentDraft.network === 'offline'" class="environment-warning"><IconWarning aria-hidden="true" /> Offline blocks new network traffic until this condition is changed or all tab emulation is reset.</p>
          <p v-if="environmentDraft.network === 'offline' && environmentDraft.bypassServiceWorker" class="environment-warning"><IconWarning aria-hidden="true" /> Bypassing the service worker also bypasses its offline responses, so matching requests will fail while Offline is active.</p>
        </section>
        <section aria-labelledby="environment-runtime-title">
          <div class="environment-section-heading">
            <div><h3 id="environment-runtime-title">Page runtime</h3><p>Inspect motion precisely or check the page’s HTML and CSS fallback without client scripts.</p></div>
          </div>
          <div class="environment-field-grid">
            <label class="environment-field-wide">
              <span>Animation playback</span>
              <select v-model.number="environmentDraft.animationPlaybackRate" aria-label="Animation playback" @change="environmentState = 'idle'">
                <option :value="1">Normal speed</option>
                <option :value="0.25">25% speed</option>
                <option :value="0.1">10% speed</option>
                <option :value="0">Paused</option>
              </select>
              <small>Controls CSS Animations, transitions, and Web Animations on this tab; animation-frame scripts continue normally.</small>
            </label>
          </div>
          <label class="environment-toggle">
            <input v-model="environmentDraft.javaScriptDisabled" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Disable JavaScript</strong><small>Reload to test startup. Bronom controls and MCP reset remain available.</small></span>
          </label>
          <p v-if="environmentDraft.javaScriptDisabled" class="environment-warning"><IconWarning aria-hidden="true" /> Page interactions and agent evaluation may stop working until JavaScript is enabled again, but Environment and <code>browser_emulate</code> can always restore it.</p>
        </section>
        <section aria-labelledby="environment-rendering-title">
          <div class="environment-section-heading">
            <div><h3 id="environment-rendering-title">Rendering preferences</h3><p>Test CSS branches driven by user preferences.</p></div>
          </div>
          <div class="environment-field-grid">
            <label>
              <span>Media type</span>
              <select v-model="environmentDraft.mediaType" aria-label="Media type" @change="environmentState = 'idle'">
                <option value="auto">No override</option>
                <option value="screen">Screen</option>
                <option value="print">Print</option>
              </select>
              <small>Tests <code>@media print</code> without opening print preview.</small>
            </label>
            <label>
              <span>Color scheme</span>
              <select v-model="environmentDraft.colorScheme" aria-label="Color scheme" @change="environmentState = 'idle'">
                <option value="auto">No override</option>
                <option value="light">Prefer light</option>
                <option value="dark">Prefer dark</option>
              </select>
              <small>Emulates <code>prefers-color-scheme</code>.</small>
            </label>
            <label>
              <span>Forced colors</span>
              <select v-model="environmentDraft.forcedColors" aria-label="Forced colors" @change="environmentState = 'idle'">
                <option value="auto">No override</option>
                <option value="active">Active</option>
                <option value="none">Inactive</option>
              </select>
              <small>Tests <code>forced-colors</code> branches such as Windows High Contrast.</small>
            </label>
            <label>
              <span>Contrast</span>
              <select v-model="environmentDraft.contrast" aria-label="Contrast" @change="environmentState = 'idle'">
                <option value="auto">No override</option>
                <option value="more">Prefer more</option>
                <option value="less">Prefer less</option>
                <option value="custom">Custom</option>
                <option value="no-preference">No preference</option>
              </select>
              <small>Emulates <code>prefers-contrast</code>.</small>
            </label>
            <label>
              <span>Motion</span>
              <select v-model="environmentDraft.reducedMotion" aria-label="Motion" @change="environmentState = 'idle'">
                <option value="auto">No override</option>
                <option value="reduce">Reduce motion</option>
                <option value="no-preference">No preference</option>
              </select>
              <small>Emulates <code>prefers-reduced-motion</code>.</small>
            </label>
            <label>
              <span>Transparency</span>
              <select v-model="environmentDraft.reducedTransparency" aria-label="Transparency" @change="environmentState = 'idle'">
                <option value="auto">No override</option>
                <option value="reduce">Reduce transparency</option>
                <option value="no-preference">No preference</option>
              </select>
              <small>Emulates <code>prefers-reduced-transparency</code>.</small>
            </label>
            <label class="environment-field-wide">
              <span>Vision simulation</span>
              <select v-model="environmentDraft.visionDeficiency" aria-label="Vision simulation" @change="environmentState = 'idle'">
                <option value="none">No simulation</option>
                <option value="blurredVision">Blurred vision</option>
                <option value="reducedContrast">Reduced contrast</option>
                <option value="protanopia">Protanopia · no red</option>
                <option value="deuteranopia">Deuteranopia · no green</option>
                <option value="tritanopia">Tritanopia · no blue</option>
                <option value="achromatopsia">Achromatopsia · no color</option>
              </select>
              <small>Visual simulation helps reveal color-only meaning; it is not a medical representation of every person.</small>
            </label>
          </div>
        </section>
        <section aria-labelledby="environment-debug-overlays-title">
          <div class="environment-section-heading">
            <div><h3 id="environment-debug-overlays-title">Rendering diagnostics</h3><p>Show Chromium’s live compositor and layout evidence over this page.</p></div>
          </div>
          <label class="environment-toggle">
            <input v-model="environmentDraft.renderingDebug.paintFlashing" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Paint flashing</strong><small>Flash repainted regions in green to reveal unnecessary rendering work.</small></span>
          </label>
          <label class="environment-toggle">
            <input v-model="environmentDraft.renderingDebug.layoutShiftRegions" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Layout shift regions</strong><small>Briefly highlight content that moves unexpectedly; reload before reproducing startup shifts.</small></span>
          </label>
          <label class="environment-toggle">
            <input v-model="environmentDraft.renderingDebug.layerBorders" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Layer borders</strong><small>Show composited layer borders and tiles over the page.</small></span>
          </label>
          <label class="environment-toggle">
            <input v-model="environmentDraft.renderingDebug.fpsCounter" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Frame rendering stats</strong><small>Display live frame timing, dropped frames, and GPU rendering information.</small></span>
          </label>
          <label class="environment-toggle">
            <input v-model="environmentDraft.renderingDebug.scrollBottlenecks" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Scrolling performance issues</strong><small>Highlight regions with listeners or behavior that can delay scrolling.</small></span>
          </label>
          <p v-if="environmentDraft.renderingDebug.paintFlashing || environmentDraft.renderingDebug.layoutShiftRegions" class="environment-warning"><IconWarning aria-hidden="true" /> These diagnostics can flash rapidly. Disable them immediately if flashing content could affect you.</p>
        </section>
        <section aria-labelledby="environment-identity-title">
          <div class="environment-section-heading">
            <div><h3 id="environment-identity-title">Region, identity &amp; location</h3><p>Overrides stay isolated to this tab.</p></div>
          </div>
          <div class="environment-field-grid environment-region-grid">
            <label>
              <span>Locale <small>optional</small></span>
              <input v-model.trim="environmentDraft.locale" aria-label="Locale" type="text" maxlength="64" placeholder="System default · en-US" spellcheck="false" @input="environmentState = 'idle'" />
              <small>Controls locale-aware formatting, language APIs, and subsequent request headers after reload.</small>
            </label>
            <label>
              <span>Time zone <small>optional</small></span>
              <input v-model.trim="environmentDraft.timezoneId" aria-label="Time zone" type="text" maxlength="100" placeholder="System default · Europe/Kyiv" spellcheck="false" @input="environmentState = 'idle'" />
              <small>Use an IANA ID to reproduce local dates and daylight-saving transitions.</small>
            </label>
          </div>
          <label class="environment-user-agent">
            <span>Custom user agent <small>optional</small></span>
            <input v-model="environmentDraft.userAgent" type="text" maxlength="512" placeholder="Use Chromium default" spellcheck="false" @input="environmentState = 'idle'" />
            <small>Reload to send it on the main document request.</small>
          </label>
          <label class="environment-location-toggle">
            <input v-model="environmentLocationEnabled" type="checkbox" @change="environmentState = 'idle'" />
            <span><strong>Override geolocation</strong><small>The website still needs location permission.</small></span>
          </label>
          <div v-if="environmentLocationEnabled" class="environment-location-fields">
            <label>Latitude<input v-model.number="environmentLatitude" type="number" min="-90" max="90" step="0.000001" required @input="environmentState = 'idle'" /></label>
            <label>Longitude<input v-model.number="environmentLongitude" type="number" min="-180" max="180" step="0.000001" required @input="environmentState = 'idle'" /></label>
            <label>Accuracy, m<input v-model.number="environmentAccuracy" type="number" min="0" max="100000" step="1" required @input="environmentState = 'idle'" /></label>
          </div>
        </section>
        <section v-if="activeEmulation?.viewport || activeEmulation?.extraHttpHeaderNames?.length" class="environment-managed" aria-labelledby="environment-managed-title">
          <div class="environment-section-heading">
            <div><h3 id="environment-managed-title">Other active emulation</h3><p>Applying this form preserves these separately managed conditions.</p></div>
          </div>
          <button v-if="activeEmulation?.viewport" type="button" @click="toggleResponsivePreview">
            <IconDevices aria-hidden="true" />
            <span><strong>{{ activeEmulation.viewport.width }}×{{ activeEmulation.viewport.height }} viewport</strong><small>Open Responsive preview</small></span>
          </button>
          <div v-if="activeEmulation?.extraHttpHeaderNames?.length" class="environment-header-names">
            <IconRoute aria-hidden="true" />
            <span><strong>{{ activeEmulation.extraHttpHeaderNames.length }} agent-set request {{ activeEmulation.extraHttpHeaderNames.length === 1 ? 'header' : 'headers' }}</strong><small>{{ activeEmulation.extraHttpHeaderNames.join(', ') }} · values stay hidden</small></span>
          </div>
        </section>
        <output class="environment-status" :class="{ error: environmentState === 'error' || !environmentSettingsDraft, applied: environmentState === 'applied' }" aria-live="polite">
          <IconError v-if="environmentState === 'error' || !environmentSettingsDraft" aria-hidden="true" />
          <IconCheck v-else-if="environmentState === 'applied'" aria-hidden="true" />
          <IconSpeed v-else aria-hidden="true" />
          <span><strong>{{ environmentState === 'applying' ? 'Applying conditions…' : environmentState === 'applied' ? 'Environment applied' : !environmentSettingsDraft ? 'Check the entered values' : `${activeEnvironmentOverrideCount} active ${activeEnvironmentOverrideCount === 1 ? 'condition' : 'conditions'}` }}</strong><small>{{ environmentError || 'Apply without reload for live CSS and connection changes, or reload without cache to retest page startup.' }}</small></span>
        </output>
        <p class="responsive-preview-caveat"><IconInfo aria-hidden="true" /> Throttling is an approximation relative to this computer. Use a physical device and field data before drawing production conclusions.</p>
        <footer>
          <button type="button" :disabled="environmentState === 'applying'" @click="resetEnvironment">Reset environment</button>
          <div>
            <button type="submit" :disabled="!environmentSettingsDraft || environmentState === 'applying'">Apply</button>
            <button class="primary" type="button" :disabled="!environmentSettingsDraft || environmentState === 'applying'" @click="applyEnvironment(true)">
              <IconProgress v-if="environmentState === 'applying'" class="state-spinner" aria-hidden="true" />
              <IconRefresh v-else aria-hidden="true" />
              {{ environmentState === 'applying' ? 'Applying…' : 'Apply & reload' }}
            </button>
          </div>
        </footer>
      </form>
    </section>
    <section
      v-if="qualityAuditPanelOpen"
      class="accessibility-panel quality-audit-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="quality-audit-panel-title"
      :aria-busy="qualityAuditState === 'running'"
    >
      <header>
        <div>
          <span class="eyebrow">Local evidence review</span>
          <h2 id="quality-audit-panel-title">Quality audit</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock quality audit" />
          <button class="panel-close" type="button" aria-label="Close quality audit" @click="qualityAuditPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="qualityAuditState === 'running'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Checking six quality categories…</strong>
        <span>Bronom combines bounded local evidence without uploading page content or inventing a score.</span>
      </div>
      <div v-else-if="qualityAuditState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Quality audit could not finish</strong>
        <span>{{ qualityAuditError }}</span>
        <button type="button" @click="runQualityAudit">Try again</button>
      </div>
      <template v-else-if="qualityAuditReport">
        <div class="quality-audit-summary" :class="qualityAuditReport.status">
          <IconCheck v-if="qualityAuditReport.status === 'pass'" aria-hidden="true" />
          <IconWarning v-else-if="qualityAuditReport.status === 'warning'" aria-hidden="true" />
          <IconError v-else aria-hidden="true" />
          <span>
            <strong>{{ qualityAuditReport.status === 'pass' ? 'No automated blockers found' : qualityAuditReport.status === 'warning' ? 'Review the warnings' : 'Quality issues need attention' }}</strong>
            <small>{{ qualityAuditReport.totals.errors }} errors · {{ qualityAuditReport.totals.warnings }} warnings · {{ qualityAuditReport.totals.info }} informational</small>
          </span>
        </div>
        <div class="quality-audit-content">
          <section class="quality-audit-categories" aria-label="Quality categories">
            <article v-for="category in qualityAuditReport.categories" :key="category.id" :class="category.status">
              <header>
                <strong>{{ category.label }}</strong>
                <span>{{ category.status.replace('-', ' ') }}</span>
              </header>
              <p>{{ category.summary }}</p>
              <ul>
                <li v-for="item in category.evidence" :key="item">{{ item }}</li>
              </ul>
            </article>
          </section>
          <section v-if="qualityAuditReport.findings.length" class="quality-audit-findings" aria-labelledby="quality-audit-findings-title">
            <h3 id="quality-audit-findings-title">Findings</h3>
            <article v-for="(finding, index) in qualityAuditReport.findings" :key="`${finding.category}-${finding.code}-${index}`" :class="finding.severity">
              <header><span>{{ finding.severity }}</span><strong>{{ finding.code }}</strong><small>{{ finding.category }}</small></header>
              <p>{{ finding.message }}</p>
            </article>
            <p v-if="qualityAuditReport.truncated" class="quality-audit-truncated">Only the first 40 findings are shown and copied; category totals remain complete.</p>
          </section>
          <details class="quality-audit-caveats">
            <summary>Scope and limitations</summary>
            <ul><li v-for="caveat in qualityAuditReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <span>{{ qualityAuditReport.categories.length }} categories · {{ new Date(qualityAuditReport.auditedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          <div>
            <button type="button" @click="copyQualityAudit"><IconCheck v-if="qualityAuditCopied" aria-hidden="true" /><IconCopy v-else aria-hidden="true" /> {{ qualityAuditCopied ? 'Copied' : 'Copy report' }}</button>
            <button type="button" @click="runQualityAudit"><IconRefresh aria-hidden="true" /> Run again</button>
          </div>
        </footer>
      </template>
    </section>
    <section
      v-if="accessibilityPanelOpen"
      class="accessibility-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="accessibility-panel-title"
      :aria-busy="accessibilityAuditState === 'running'"
    >
      <header>
        <div>
          <span class="eyebrow">Local WCAG check</span>
          <h2 id="accessibility-panel-title">Accessibility</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock accessibility audit" />
          <button class="panel-close" type="button" aria-label="Close accessibility audit" @click="accessibilityPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="accessibilityAuditState === 'running'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Checking the rendered page…</strong>
        <span>The audit runs locally and does not send page data to a service.</span>
      </div>
      <div v-else-if="accessibilityAuditState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Audit could not finish</strong>
        <span>{{ accessibilityAuditError }}</span>
        <button type="button" @click="runAccessibilityAudit">Try again</button>
      </div>
      <template v-else-if="accessibilityAudit">
        <div class="accessibility-audit-summary">
          <article>
            <strong>{{ accessibilityAudit.violationCount }}</strong>
            <span>{{ accessibilityAudit.violationCount === 1 ? 'violation' : 'violations' }}</span>
          </article>
          <article class="critical">
            <strong>{{ accessibilityImpactCount('critical') }}</strong>
            <span>critical</span>
          </article>
          <article class="serious">
            <strong>{{ accessibilityImpactCount('serious') }}</strong>
            <span>serious</span>
          </article>
          <article>
            <strong>{{ accessibilityAudit.needsReviewCount }}</strong>
            <span>review</span>
          </article>
        </div>
        <div v-if="!accessibilityAudit.violationCount" class="accessibility-audit-empty">
          <IconCheck aria-hidden="true" />
          <strong>No automated WCAG A/AA violations found</strong>
          <span>Manual keyboard and assistive-technology testing is still needed.</span>
        </div>
        <div v-else class="accessibility-violations">
          <article v-for="violation in accessibilityAudit.violations" :key="violation.id" class="accessibility-violation">
            <header>
              <span class="accessibility-impact" :class="violation.impact">{{ violation.impact }}</span>
              <strong>{{ violation.help }}</strong>
              <small>{{ violation.id }} · {{ violation.nodeCount }} {{ violation.nodeCount === 1 ? 'element' : 'elements' }}</small>
            </header>
            <p>{{ violation.description }}</p>
            <ul>
              <li v-for="(node, nodeIndex) in violation.nodes" :key="`${violation.id}-${nodeIndex}`">
                <code>{{ node.targets.join(' → ') }}</code>
                <span>{{ node.failureSummary }}</span>
              </li>
            </ul>
            <button v-if="violation.helpUrl" type="button" @click="openSupport(violation.helpUrl)">Rule guidance ↗</button>
          </article>
        </div>
        <footer>
          <span>{{ accessibilityAudit.engine.name }} {{ accessibilityAudit.engine.version }} · {{ accessibilityAudit.standard }}</span>
          <button type="button" @click="runAccessibilityAudit"><IconRefresh aria-hidden="true" /> Run again</button>
        </footer>
      </template>
    </section>
    <section
      v-if="performancePanelOpen"
      class="accessibility-panel performance-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="performance-panel-title"
      :aria-busy="performanceState === 'running'"
    >
      <header>
        <div>
          <span class="eyebrow">Current visit</span>
          <h2 id="performance-panel-title">Page performance</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock performance report" />
          <button class="panel-close" type="button" aria-label="Close performance report" @click="performancePanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="performanceState === 'running'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Collecting local page metrics…</strong>
        <span>The measurement stays in Bronom and does not upload page data.</span>
      </div>
      <div v-else-if="performanceState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Performance report could not finish</strong>
        <span>{{ performanceError }}</span>
        <button type="button" @click="runPerformanceReport()">Try again</button>
      </div>
      <template v-else-if="performanceReport">
        <div v-if="performanceReport.baseline" class="performance-baseline-status" :class="{ warning: performanceReport.comparison && (!performanceReport.comparison.sameUrl || !performanceReport.comparison.sameEnvironment) }">
          <IconWarning v-if="performanceReport.comparison && (!performanceReport.comparison.sameUrl || !performanceReport.comparison.sameEnvironment)" aria-hidden="true" />
          <IconDifference v-else aria-hidden="true" />
          <span>
            <strong>{{ performanceReport.comparison ? `Compared with baseline from ${performanceBaselineTime()}` : `Baseline saved at ${performanceBaselineTime()}` }}</strong>
            <small v-if="performanceReport.comparison && !performanceReport.comparison.sameUrl">The page URL changed since the baseline.</small>
            <small v-else-if="performanceReport.comparison && !performanceReport.comparison.sameEnvironment">Viewport or browser conditions changed since the baseline.</small>
            <small v-else-if="performanceReport.comparison">Same page and browser conditions.</small>
            <small v-else>Measure again after your change to see deltas.</small>
          </span>
        </div>
        <div class="performance-vitals">
          <article
            v-for="name in (['LCP', 'INP', 'CLS'] as BrowserPerformanceMetricName[])"
            :key="name"
            :class="performanceMetric(name)?.rating || 'unavailable'"
          >
            <header>
              <strong>{{ name }}</strong>
              <span>{{ performanceMetric(name)?.rating?.replace('-', ' ') || 'not observed' }}</span>
            </header>
            <output>{{ formatPerformanceMetric(performanceMetric(name)) }}</output>
            <small v-if="name === 'LCP'">Good ≤ 2.5 s</small>
            <small v-else-if="name === 'INP'">Good ≤ 200 ms</small>
            <small v-else>Good ≤ 0.1</small>
            <small
              v-if="performanceComparisonMetric(name)?.direction !== 'unavailable' && performanceComparisonMetric(name)"
              class="performance-delta"
              :class="performanceComparisonMetric(name)?.direction"
            >{{ formatPerformanceDelta(performanceComparisonMetric(name)) }}</small>
          </article>
        </div>
        <div class="performance-details">
          <section>
            <h3>Loading</h3>
            <dl>
              <div><dt>TTFB</dt><dd>{{ formatPerformanceMetric(performanceMetric('TTFB')) }}<small v-if="performanceComparisonMetric('TTFB')?.direction !== 'unavailable'" class="performance-inline-delta" :class="performanceComparisonMetric('TTFB')?.direction">{{ formatPerformanceDelta(performanceComparisonMetric('TTFB')) }}</small></dd></div>
              <div><dt>First contentful paint</dt><dd>{{ formatPerformanceMetric(performanceMetric('FCP')) }}<small v-if="performanceComparisonMetric('FCP')?.direction !== 'unavailable'" class="performance-inline-delta" :class="performanceComparisonMetric('FCP')?.direction">{{ formatPerformanceDelta(performanceComparisonMetric('FCP')) }}</small></dd></div>
              <div><dt>DOM content loaded</dt><dd>{{ performanceReport.navigation?.domContentLoadedMs == null ? 'Unavailable' : `${Math.round(performanceReport.navigation.domContentLoadedMs)} ms` }}</dd></div>
              <div><dt>Load event</dt><dd>{{ performanceReport.navigation?.loadMs == null ? 'Unavailable' : `${Math.round(performanceReport.navigation.loadMs)} ms` }}<small v-if="performanceComparisonMetric('LOAD')?.direction !== 'unavailable'" class="performance-inline-delta" :class="performanceComparisonMetric('LOAD')?.direction">{{ formatPerformanceDelta(performanceComparisonMetric('LOAD')) }}</small></dd></div>
            </dl>
          </section>
          <section>
            <h3>Page work</h3>
            <dl>
              <div><dt>Resources</dt><dd>{{ performanceReport.resources.count }}</dd></div>
              <div><dt>Transferred</dt><dd>{{ formatBytes(performanceReport.resources.transferBytes ?? 0) }}<small v-if="performanceComparisonMetric('TRANSFER')?.direction !== 'unavailable'" class="performance-inline-delta" :class="performanceComparisonMetric('TRANSFER')?.direction">{{ formatPerformanceDelta(performanceComparisonMetric('TRANSFER')) }}</small></dd></div>
              <div><dt>Long tasks</dt><dd>{{ performanceReport.longTasks.supported ? performanceReport.longTasks.count : 'Unsupported' }}</dd></div>
              <div><dt>Observed blocking time</dt><dd>{{ performanceReport.longTasks.supported ? `${Math.round(performanceReport.longTasks.blockingTimeMs ?? 0)} ms` : 'Unavailable' }}<small v-if="performanceComparisonMetric('LONG_TASK_BLOCKING')?.direction !== 'unavailable'" class="performance-inline-delta" :class="performanceComparisonMetric('LONG_TASK_BLOCKING')?.direction">{{ formatPerformanceDelta(performanceComparisonMetric('LONG_TASK_BLOCKING')) }}</small></dd></div>
            </dl>
          </section>
          <section>
            <h3>Responsiveness</h3>
            <dl>
              <div><dt>Long animation frames</dt><dd>{{ performanceReport.longAnimationFrames.supported ? performanceReport.longAnimationFrames.count : 'Unsupported' }}</dd></div>
              <div><dt>Blocking duration</dt><dd>{{ performanceReport.longAnimationFrames.supported ? `${Math.round(performanceReport.longAnimationFrames.blockingDurationMs ?? 0)} ms` : 'Unavailable' }}<small v-if="performanceComparisonMetric('LOAF_BLOCKING')?.direction !== 'unavailable'" class="performance-inline-delta" :class="performanceComparisonMetric('LOAF_BLOCKING')?.direction">{{ formatPerformanceDelta(performanceComparisonMetric('LOAF_BLOCKING')) }}</small></dd></div>
              <div><dt>Longest frame</dt><dd>{{ performanceReport.longAnimationFrames.supported ? `${Math.round(performanceReport.longAnimationFrames.longestDurationMs ?? 0)} ms` : 'Unavailable' }}</dd></div>
              <div><dt>Style &amp; layout</dt><dd>{{ performanceReport.longAnimationFrames.supported ? `${Math.round(performanceReport.longAnimationFrames.styleAndLayoutDurationMs ?? 0)} ms` : 'Unavailable' }}</dd></div>
            </dl>
            <div v-if="performanceReport.longAnimationFrames.contributors.length" class="performance-contributors">
              <h4>Top script contributors</h4>
              <ol>
                <li v-for="(contributor, index) in performanceReport.longAnimationFrames.contributors" :key="`${performanceContributorSource(contributor)}-${index}`">
                  <span><strong>{{ performanceContributorTitle(contributor) }}</strong><small>{{ performanceContributorSource(contributor) }} · {{ contributor.count }} {{ contributor.count === 1 ? 'frame' : 'frames' }}</small></span>
                  <output>{{ Math.round(contributor.totalDurationMs) }} ms<small v-if="contributor.forcedStyleAndLayoutDurationMs">{{ Math.round(contributor.forcedStyleAndLayoutDurationMs) }} ms forced layout</small></output>
                </li>
              </ol>
              <p v-if="performanceReport.longAnimationFrames.truncated" class="performance-attribution-note">Showing the highest-cost bounded contributors and frames.</p>
            </div>
            <p v-else-if="performanceReport.longAnimationFrames.supported && performanceReport.longAnimationFrames.count" class="performance-hint"><IconInfo aria-hidden="true" /> Long frames were observed, but Chromium did not attribute them to a same-origin main-thread script.</p>
          </section>
          <section v-if="performanceReport.layoutShifts.supported">
            <h3>Layout shifts</h3>
            <dl>
              <div><dt>Unexpected shifts</dt><dd>{{ performanceReport.layoutShifts.count }}</dd></div>
              <div><dt>Observed score sum</dt><dd>{{ (performanceReport.layoutShifts.scoreSum ?? 0).toFixed(3) }}</dd></div>
              <div><dt>After recent input</dt><dd>{{ performanceReport.layoutShifts.recentInputCount }} excluded</dd></div>
            </dl>
            <div v-if="performanceReport.layoutShifts.entries.length" class="performance-contributors performance-layout-shifts">
              <h4>Largest unexpected shifts</h4>
              <ol>
                <li v-for="(entry, index) in performanceReport.layoutShifts.entries" :key="`${entry.startTimeMs}-${index}`">
                  <span><strong>{{ entry.sources[0] || 'Affected element unavailable' }}</strong><small>{{ Math.round(entry.startTimeMs) }} ms after navigation<span v-if="entry.sources.length > 1"> · {{ entry.sources.length }} affected elements</span></small></span>
                  <output>{{ entry.value.toFixed(3) }}</output>
                </li>
              </ol>
              <p v-if="performanceReport.layoutShifts.truncated" class="performance-attribution-note">Showing the highest-scoring bounded shifts.</p>
            </div>
            <p v-else class="performance-hint"><IconCheck aria-hidden="true" /> No unexpected layout shift was observed in this visit.</p>
          </section>
          <section v-if="performanceReport.userTimings.count">
            <h3>User timing</h3>
            <div class="performance-contributors performance-user-timings">
              <ol>
                <li v-for="(entry, index) in performanceReport.userTimings.entries" :key="`${entry.type}-${entry.startTimeMs}-${index}`">
                  <span><strong>{{ entry.name }}</strong><small>{{ entry.type }} · {{ Math.round(entry.startTimeMs) }} ms after navigation</small></span>
                  <output>{{ entry.type === 'measure' ? `${Math.round(entry.durationMs)} ms` : 'mark' }}</output>
                </li>
              </ol>
              <p v-if="performanceReport.userTimings.truncated" class="performance-attribution-note">Showing the {{ performanceReport.userTimings.entries.length }} most recent of {{ performanceReport.userTimings.count }} marks and measures.</p>
            </div>
          </section>
          <p v-if="!performanceMetric('INP')" class="performance-hint"><IconInfo aria-hidden="true" /> Interact with the page, then measure again to collect INP.</p>
          <details>
            <summary>How to interpret this report</summary>
            <ul>
              <li v-for="caveat in performanceReport.caveats" :key="caveat">{{ caveat }}</li>
            </ul>
          </details>
        </div>
        <footer>
          <span>{{ performanceReport.engine.name }} {{ performanceReport.engine.version }} · local sample</span>
          <div>
            <button v-if="performanceReport.baseline" type="button" @click="runPerformanceReport('clear-baseline')">Clear baseline</button>
            <button type="button" @click="runPerformanceReport('set-baseline')"><IconDifference aria-hidden="true" /> {{ performanceReport.baseline ? 'Replace baseline' : 'Save baseline' }}</button>
            <button type="button" @click="runPerformanceReport('measure')"><IconRefresh aria-hidden="true" /> Measure again</button>
          </div>
        </footer>
      </template>
    </section>
    <section
      v-if="designOverviewPanelOpen"
      class="accessibility-panel design-overview-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="design-overview-panel-title"
      :aria-busy="designOverviewState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Current rendering</span>
          <h2 id="design-overview-panel-title">Design overview</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock design overview" />
          <button class="panel-close" type="button" aria-label="Close design overview" @click="designOverviewPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="designOverviewState === 'loading'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Reading computed page styles…</strong>
        <span>Page text, form values, CSS source, IDs, and class names stay out of the report.</span>
      </div>
      <div v-else-if="designOverviewState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Design overview could not finish</strong>
        <span>{{ designOverviewError }}</span>
        <button type="button" @click="runDesignOverview">Try again</button>
      </div>
      <template v-else-if="designOverviewReport">
        <div class="design-overview-summary">
          <article><span>Visible elements</span><strong>{{ designOverviewReport.summary.visibleElements }}</strong></article>
          <article><span>Colors</span><strong>{{ designOverviewReport.summary.textColorCount + designOverviewReport.summary.backgroundColorCount + designOverviewReport.summary.borderColorCount }}</strong></article>
          <article><span>Font combinations</span><strong>{{ designOverviewReport.summary.fontCombinationCount }}</strong></article>
          <article :class="{ warning: designOverviewReport.summary.contrastIssueCount }"><span>Likely contrast issues</span><strong>{{ designOverviewReport.summary.contrastIssueCount }}</strong></article>
        </div>
        <div class="design-overview-details">
          <section>
            <h3>Computed colors</h3>
            <div class="design-color-groups">
              <div v-for="kind in (['text', 'background', 'border'] as const)" :key="kind">
                <h4>{{ kind }}</h4>
                <ul v-if="designOverviewReport.colors[kind].length" class="design-color-list">
                  <li v-for="color in designOverviewReport.colors[kind]" :key="`${kind}-${color.value}`">
                    <span class="design-color-swatch" :style="{ backgroundColor: color.value }" aria-hidden="true"></span>
                    <code>{{ color.value }}</code>
                    <small>{{ color.count }}×</small>
                  </li>
                </ul>
                <p v-else>No visible {{ kind }} colors observed.</p>
              </div>
            </div>
          </section>
          <section>
            <h3>Typography</h3>
            <div v-if="designOverviewReport.fonts.length" class="design-font-list" role="list">
              <article v-for="font in designOverviewReport.fonts" :key="`${font.family}-${font.sizePx}-${font.weight}-${font.lineHeight}`" role="listitem">
                <strong>{{ font.family || 'Browser default' }}</strong>
                <span>{{ font.sizePx == null ? 'unknown size' : `${font.sizePx}px` }} · weight {{ font.weight || 'normal' }} · line {{ font.lineHeight || 'normal' }}</span>
                <small>{{ font.count }} {{ font.count === 1 ? 'element' : 'elements' }}</small>
              </article>
            </div>
            <p v-else>No visible font combinations observed.</p>
          </section>
          <section>
            <h3>Likely text contrast issues</h3>
            <div v-if="designOverviewReport.contrastIssues.length" class="design-contrast-list" role="list">
              <article v-for="issue in designOverviewReport.contrastIssues" :key="`${issue.selector}-${issue.ratio}`" role="listitem">
                <header><code>{{ issue.selector }}</code><strong>{{ issue.ratio }}:1</strong></header>
                <span>{{ issue.foreground }} on {{ issue.background }} · needs {{ issue.requiredRatio }}:1</span>
                <small>{{ issue.fontSizePx == null ? 'unknown size' : `${issue.fontSizePx}px` }} · weight {{ issue.fontWeight }}{{ issue.largeText ? ' · large text' : '' }}</small>
              </article>
            </div>
            <p v-else>No likely failures were found in the bounded solid-background sample.</p>
          </section>
          <section v-if="designOverviewReport.mediaQueries.length">
            <h3>Media queries</h3>
            <ul class="design-media-list">
              <li v-for="media in designOverviewReport.mediaQueries" :key="media.query"><code>{{ media.query }}</code><small>{{ media.count }}×</small></li>
            </ul>
          </section>
          <details>
            <summary>Scope and limitations</summary>
            <ul><li v-for="caveat in designOverviewReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <span>{{ designOverviewReport.summary.elementsScanned }} elements sampled · {{ debugTimestamp(designOverviewReport.capturedAt) }}</span>
          <button type="button" @click="runDesignOverview"><IconRefresh aria-hidden="true" /> Capture again</button>
        </footer>
      </template>
    </section>
    <section
      v-if="pageMetadataPanelOpen"
      class="accessibility-panel page-metadata-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="page-metadata-panel-title"
      :aria-busy="pageMetadataState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Current rendered document</span>
          <h2 id="page-metadata-panel-title">Page metadata</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock page metadata" />
          <button class="panel-close" type="button" aria-label="Close page metadata" @click="pageMetadataPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="pageMetadataState === 'loading'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Inspecting search and social metadata…</strong>
        <span>Only allowlisted metadata and structured-data types are collected.</span>
      </div>
      <div v-else-if="pageMetadataState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Page metadata could not be inspected</strong>
        <span>{{ pageMetadataError }}</span>
        <button type="button" @click="runPageMetadata">Try again</button>
      </div>
      <template v-else-if="pageMetadataReport">
        <div class="page-metadata-summary">
          <article><span>Actionable findings</span><strong>{{ pageMetadataReport.issues.filter((issue) => issue.severity !== 'info').length }}</strong></article>
          <article><span>H1 headings</span><strong>{{ pageMetadataReport.document.headingCounts.h1 }}</strong></article>
          <article><span>Open Graph fields</span><strong>{{ pageMetadataReport.openGraph.propertyCount }}</strong></article>
          <article :class="{ warning: pageMetadataReport.structuredData.invalidBlockCount }"><span>Structured data types</span><strong>{{ pageMetadataReport.structuredData.types.length }}</strong></article>
        </div>
        <div class="page-metadata-details">
          <section v-if="pageMetadataReport.issues.length">
            <h3>Findings</h3>
            <div class="page-metadata-issues" role="list">
              <article v-for="issue in pageMetadataReport.issues" :key="`${issue.code}-${issue.message}`" :class="issue.severity" role="listitem">
                <IconError v-if="issue.severity === 'error'" aria-hidden="true" />
                <IconWarning v-else-if="issue.severity === 'warning'" aria-hidden="true" />
                <IconInfo v-else aria-hidden="true" />
                <div><strong>{{ issue.code.replaceAll('-', ' ') }}</strong><span>{{ issue.message }}</span></div>
              </article>
            </div>
          </section>
          <section>
            <h3>Search result inputs</h3>
            <article class="search-preview" aria-label="Approximate search result preview">
              <small>{{ pageMetadataReport.document.canonicalUrls[0] || pageMetadataReport.url }}</small>
              <strong>{{ pageMetadataReport.title || 'Untitled page' }}</strong>
              <p>{{ pageMetadataReport.document.description || 'No meta description. A search engine may select page content for the snippet.' }}</p>
            </article>
            <dl class="page-metadata-grid">
              <div class="wide"><dt>Canonical</dt><dd>{{ pageMetadataReport.document.canonicalUrls[0] || 'Not declared' }}</dd></div>
              <div><dt>Language</dt><dd>{{ pageMetadataReport.document.language || 'Not declared' }}</dd></div>
              <div><dt>Charset</dt><dd>{{ pageMetadataReport.document.charset || 'Unavailable' }}</dd></div>
              <div><dt>Robots</dt><dd>{{ pageMetadataReport.document.robots || 'Default indexing behavior' }}</dd></div>
              <div><dt>Viewport</dt><dd>{{ pageMetadataReport.document.viewport || 'Not declared' }}</dd></div>
              <div><dt>Theme color</dt><dd>{{ pageMetadataReport.document.themeColor || 'Not declared' }}</dd></div>
              <div><dt>Manifest</dt><dd>{{ pageMetadataReport.document.manifestUrl || 'Not linked' }}</dd></div>
              <div class="wide"><dt>Heading counts</dt><dd>H1 {{ pageMetadataReport.document.headingCounts.h1 }} · H2 {{ pageMetadataReport.document.headingCounts.h2 }} · H3 {{ pageMetadataReport.document.headingCounts.h3 }} · H4–H6 {{ pageMetadataReport.document.headingCounts.h4 + pageMetadataReport.document.headingCounts.h5 + pageMetadataReport.document.headingCounts.h6 }}</dd></div>
            </dl>
          </section>
          <section>
            <h3>Social cards</h3>
            <div class="social-metadata-cards">
              <article>
                <header><strong>Open Graph</strong><small>{{ pageMetadataReport.openGraph.propertyCount }} properties</small></header>
                <dl>
                  <div><dt>Title</dt><dd>{{ pageMetadataReport.openGraph.title || 'Not declared' }}</dd></div>
                  <div><dt>Type</dt><dd>{{ pageMetadataReport.openGraph.type || 'Not declared' }}</dd></div>
                  <div><dt>URL</dt><dd>{{ pageMetadataReport.openGraph.url || 'Not declared' }}</dd></div>
                  <div><dt>Description</dt><dd>{{ pageMetadataReport.openGraph.description || 'Not declared' }}</dd></div>
                  <div><dt>Image</dt><dd>{{ pageMetadataReport.openGraph.images[0]?.url || 'Not declared' }}</dd></div>
                  <div><dt>Image alt</dt><dd>{{ pageMetadataReport.openGraph.images[0]?.alt || 'Not declared' }}</dd></div>
                </dl>
              </article>
              <article>
                <header><strong>Twitter card</strong><small>{{ pageMetadataReport.twitter.propertyCount }} properties</small></header>
                <dl>
                  <div><dt>Card</dt><dd>{{ pageMetadataReport.twitter.card || 'Not declared' }}</dd></div>
                  <div><dt>Title</dt><dd>{{ pageMetadataReport.twitter.title || 'Falls back to Open Graph/title' }}</dd></div>
                  <div><dt>Description</dt><dd>{{ pageMetadataReport.twitter.description || 'Falls back to Open Graph/description' }}</dd></div>
                  <div><dt>Image</dt><dd>{{ pageMetadataReport.twitter.images[0]?.url || 'Not declared' }}</dd></div>
                </dl>
              </article>
            </div>
          </section>
          <section>
            <h3>Structured data</h3>
            <div v-if="pageMetadataReport.structuredData.types.length" class="metadata-type-list" aria-label="Structured data types">
              <span v-for="type in pageMetadataReport.structuredData.types" :key="type">{{ type }}</span>
            </div>
            <p v-else>No JSON-LD types were found.</p>
            <div v-if="pageMetadataReport.structuredData.blocks.some((block) => !block.valid)" class="metadata-json-errors">
              <div v-for="block in pageMetadataReport.structuredData.blocks.filter((item) => !item.valid)" :key="block.index"><strong>Block {{ block.index + 1 }}</strong><span>{{ block.error }}</span></div>
            </div>
          </section>
          <section v-if="pageMetadataReport.alternateLinks.length || pageMetadataReport.icons.length">
            <h3>Linked metadata</h3>
            <details v-if="pageMetadataReport.alternateLinks.length">
              <summary>{{ pageMetadataReport.alternateLinks.length }} language {{ pageMetadataReport.alternateLinks.length === 1 ? 'alternate' : 'alternates' }}</summary>
              <ul><li v-for="alternate in pageMetadataReport.alternateLinks" :key="`${alternate.language}-${alternate.url}`"><strong>{{ alternate.language }}</strong><code>{{ alternate.url }}</code></li></ul>
            </details>
            <details v-if="pageMetadataReport.icons.length">
              <summary>{{ pageMetadataReport.icons.length }} linked {{ pageMetadataReport.icons.length === 1 ? 'icon' : 'icons' }}</summary>
              <ul><li v-for="icon in pageMetadataReport.icons" :key="`${icon.rel}-${icon.url}`"><strong>{{ icon.sizes || icon.type || icon.rel }}</strong><code>{{ icon.url }}</code></li></ul>
            </details>
          </section>
          <details>
            <summary>Scope and limitations</summary>
            <ul><li v-for="caveat in pageMetadataReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <span>Rendered DOM · {{ debugTimestamp(pageMetadataReport.capturedAt) }}</span>
          <button type="button" @click="runPageMetadata"><IconRefresh aria-hidden="true" /> Inspect again</button>
        </footer>
      </template>
    </section>
    <section
      v-if="securityPanelOpen"
      class="accessibility-panel security-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="security-panel-title"
      :aria-busy="securityReportState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Current main document</span>
          <h2 id="security-panel-title">Connection security</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock security report" />
          <button class="panel-close" type="button" aria-label="Close security report" @click="securityPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="securityReportState === 'loading'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Inspecting the current connection…</strong>
        <span>Bronom reads transport metadata already observed by Chromium.</span>
      </div>
      <div v-else-if="securityReportState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Security report could not finish</strong>
        <span>{{ securityReportError }}</span>
        <button type="button" @click="runSecurityReport">Try again</button>
      </div>
      <template v-else-if="securityReport">
        <div class="security-overview" :class="securityReport.state">
          <IconShieldLock aria-hidden="true" />
          <div>
            <strong v-if="securityReport.state === 'secure'">This connection is secure</strong>
            <strong v-else-if="securityReport.state === 'insecure' || securityReport.state === 'insecure-broken'">This connection is not secure</strong>
            <strong v-else>Connection security is {{ securityReport.state }}</strong>
            <span>{{ securityReport.origin || securityReport.url }}</span>
          </div>
          <span class="security-state">{{ securityReport.state }}</span>
        </div>
        <div class="security-details">
          <section>
            <h3>Connection</h3>
            <dl>
              <div><dt>Encrypted transport</dt><dd>{{ securityReport.secureTransport ? 'Yes' : 'No' }}</dd></div>
              <div><dt>Protocol</dt><dd>{{ securityReport.connection?.protocol || 'Unavailable' }}</dd></div>
              <div><dt>Cipher</dt><dd>{{ securityReport.connection?.cipher || 'Unavailable' }}</dd></div>
              <div><dt>Key exchange</dt><dd>{{ securityReport.connection?.keyExchangeGroup || securityReport.connection?.keyExchange || 'Unavailable' }}</dd></div>
              <div><dt>Certificate transparency</dt><dd>{{ securityReport.connection?.certificateTransparencyCompliance || 'Unavailable' }}</dd></div>
              <div><dt>Encrypted ClientHello</dt><dd>{{ securityReport.connection?.encryptedClientHello == null ? 'Unavailable' : securityReport.connection.encryptedClientHello ? 'Yes' : 'No' }}</dd></div>
            </dl>
          </section>
          <section v-if="securityReport.certificate">
            <h3>Certificate</h3>
            <dl>
              <div class="wide"><dt>Subject</dt><dd>{{ securityReport.certificate.subjectName || 'Unavailable' }}</dd></div>
              <div class="wide"><dt>Issuer</dt><dd>{{ securityReport.certificate.issuer || 'Unavailable' }}</dd></div>
              <div><dt>Valid from</dt><dd>{{ formatSecurityDate(securityReport.certificate.validFrom) }}</dd></div>
              <div><dt>Valid until</dt><dd>{{ formatSecurityDate(securityReport.certificate.validTo) }}</dd></div>
              <div><dt>Validity</dt><dd :class="{ warning: !securityReport.certificate.valid }">{{ securityReport.certificate.expired ? 'Expired' : securityReport.certificate.notYetValid ? 'Not yet valid' : securityReport.certificate.valid ? 'Currently valid' : 'Unavailable' }}</dd></div>
              <div><dt>Expires in</dt><dd>{{ securityReport.certificate.validTo ? `${securityReport.certificate.daysUntilExpiry} days` : 'Unavailable' }}</dd></div>
            </dl>
            <details v-if="securityReport.certificate.sanCount">
              <summary>{{ securityReport.certificate.sanCount }} certificate {{ securityReport.certificate.sanCount === 1 ? 'name' : 'names' }}</summary>
              <ul><li v-for="name in securityReport.certificate.sanList" :key="name">{{ name }}</li></ul>
              <small v-if="securityReport.certificate.sanCount > securityReport.certificate.sanList.length">Only the first {{ securityReport.certificate.sanList.length }} names are shown.</small>
            </details>
          </section>
          <section v-else class="security-no-certificate">
            <IconInfo aria-hidden="true" />
            <div><strong>No TLS certificate details available</strong><span>This is expected for HTTP, local, cached, failed, or still-loading documents.</span></div>
          </section>
          <details class="security-caveats">
            <summary>What this report does not prove</summary>
            <ul><li v-for="caveat in securityReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <span>Main document · checked {{ debugTimestamp(securityReport.checkedAt) }}</span>
          <button type="button" @click="runSecurityReport"><IconRefresh aria-hidden="true" /> Inspect again</button>
        </footer>
      </template>
    </section>
    <section
      v-if="coveragePanelOpen"
      class="accessibility-panel coverage-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="coverage-panel-title"
      :aria-busy="coverageState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Current workflow</span>
          <h2 id="coverage-panel-title">Code coverage</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock code coverage" />
          <button class="panel-close" type="button" aria-label="Close code coverage" @click="coveragePanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="coverageState === 'loading'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Updating code coverage…</strong>
        <span>Instrumentation and source analysis stay inside Bronom.</span>
      </div>
      <div v-else-if="coverageState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Code coverage needs attention</strong>
        <span>{{ coverageError }}</span>
        <button type="button" @click="manageCodeCoverage('get')">Try again</button>
      </div>
      <div v-else-if="coverageResult?.status === 'recording'" class="coverage-recording" role="status">
        <IconRecord aria-hidden="true" />
        <strong>Coverage is recording</strong>
        <span>Use the page paths you want to measure, then stop to calculate used and unused bytes.</span>
        <small>{{ coverageResult.recording?.mode }} mode · started {{ debugTimestamp(coverageResult.recording?.startedAt || '') }}</small>
        <button class="primary" type="button" @click="manageCodeCoverage('stop')"><IconStop aria-hidden="true" /> Stop and show results</button>
      </div>
      <template v-else-if="coverageResult?.report">
        <div class="coverage-summary">
          <article>
            <span>Used</span>
            <strong>{{ coverageResult.report.usedPercent }}%</strong>
            <small>{{ formatBytes(coverageResult.report.usedBytes) }}</small>
          </article>
          <article>
            <span>Unused</span>
            <strong>{{ formatBytes(coverageResult.report.unusedBytes) }}</strong>
            <small>of {{ formatBytes(coverageResult.report.totalBytes) }}</small>
          </article>
          <article>
            <span>Resources</span>
            <strong>{{ coverageResult.report.resources.length }}</strong>
            <small>{{ coverageResult.report.javascript.resourceCount }} JS · {{ coverageResult.report.css.resourceCount }} CSS</small>
          </article>
        </div>
        <div class="coverage-resource-list" role="list" aria-label="Code coverage resources">
          <article v-for="resource in coverageResult.report.resources" :key="`${resource.type}:${resource.url}`" role="listitem">
            <div>
              <span class="coverage-type">{{ resource.type === 'javascript' ? 'JS' : 'CSS' }}</span>
              <strong :title="resource.url">{{ resource.url }}</strong>
              <small>{{ formatBytes(resource.unusedBytes) }} unused of {{ formatBytes(resource.totalBytes) }}</small>
            </div>
            <output>{{ resource.usedPercent }}%</output>
            <div class="coverage-bar" aria-hidden="true"><span :style="{ width: `${resource.usedPercent}%` }" /></div>
          </article>
          <div v-if="!coverageResult.report.resources.length" class="network-monitor-empty compact">
            <IconCode aria-hidden="true" />
            <strong>No measurable JavaScript or CSS</strong>
            <span>Reload a web page after starting coverage, then exercise it before stopping.</span>
          </div>
        </div>
        <details class="coverage-caveats">
          <summary>How to interpret this report</summary>
          <ul><li v-for="caveat in coverageResult.report.caveats" :key="caveat">{{ caveat }}</li></ul>
        </details>
        <footer>
          <span>{{ coverageResult.report.mode }} mode<span v-if="coverageResult.report.truncated"> · bounded result</span></span>
          <div>
            <button type="button" @click="manageCodeCoverage('clear')"><IconDelete aria-hidden="true" /> Clear</button>
            <button class="primary" type="button" @click="manageCodeCoverage('start', true)"><IconRefresh aria-hidden="true" /> Record again</button>
          </div>
        </footer>
      </template>
      <div v-else class="coverage-empty">
        <IconCode aria-hidden="true" />
        <strong>Find unused JavaScript and CSS</strong>
        <span>Start before loading or exercising the page. Bronom reports byte totals without exposing source code.</span>
        <label>
          <span>Precision</span>
          <select v-model="coverageMode">
            <option value="function">Function · lower overhead</option>
            <option value="block">Block · more precise</option>
          </select>
        </label>
        <div>
          <button type="button" @click="manageCodeCoverage('start', false)"><IconPlay aria-hidden="true" /> Start now</button>
          <button class="primary" type="button" @click="manageCodeCoverage('start', true)"><IconRefresh aria-hidden="true" /> Start and reload</button>
        </div>
      </div>
    </section>
    <section
      v-if="cpuProfilePanelOpen"
      class="accessibility-panel coverage-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="cpu-profile-panel-title"
      :aria-busy="cpuProfileState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Runtime diagnostics</span>
          <h2 id="cpu-profile-panel-title">JavaScript CPU profile</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock JavaScript CPU profile" />
          <button class="panel-close" type="button" aria-label="Close JavaScript CPU profile" @click="cpuProfilePanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="cpuProfileState === 'loading'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Updating JavaScript CPU profile…</strong>
        <span>Only bounded function timing and sanitized locations leave the profiler.</span>
      </div>
      <div v-else-if="cpuProfileState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>JavaScript CPU profile needs attention</strong>
        <span>{{ cpuProfileError }}</span>
        <button type="button" @click="manageCpuProfile('get')">Try again</button>
      </div>
      <div v-else-if="cpuProfileResult?.status === 'recording'" class="coverage-recording" role="status">
        <IconRecord aria-hidden="true" />
        <strong>CPU activity is recording</strong>
        <span>Exercise the slow interaction once, then stop to rank functions by direct self time.</span>
        <small>Started {{ debugTimestamp(cpuProfileResult.recording?.startedAt || '') }}</small>
        <button class="primary" type="button" @click="manageCpuProfile('stop')"><IconStop aria-hidden="true" /> Stop and show hotspots</button>
      </div>
      <template v-else-if="cpuProfileResult?.report">
        <div class="coverage-summary">
          <article>
            <span>Profile time</span>
            <strong>{{ Math.round(cpuProfileResult.report.durationMs) }} ms</strong>
            <small>{{ cpuProfileResult.report.sampleCount }} samples</small>
          </article>
          <article>
            <span>Sampled time</span>
            <strong>{{ Math.round(cpuProfileResult.report.sampledTimeMs) }} ms</strong>
            <small>JavaScript self time</small>
          </article>
          <article>
            <span>Hot functions</span>
            <strong>{{ cpuProfileResult.report.hotspots.length }}</strong>
            <small v-if="cpuProfileResult.report.truncated">Top bounded results</small>
            <small v-else>Ranked by self time</small>
          </article>
        </div>
        <div class="coverage-resource-list" role="list" aria-label="JavaScript CPU hotspots">
          <article v-for="hotspot in cpuProfileResult.report.hotspots" :key="`${hotspot.functionName}:${hotspot.url}:${hotspot.lineNumber}:${hotspot.columnNumber}`" role="listitem">
            <div>
              <span class="coverage-type">JS</span>
              <strong>{{ hotspot.functionName }}</strong>
              <small v-if="hotspot.url" :title="hotspot.url">{{ hotspot.url }}<template v-if="hotspot.lineNumber">:{{ hotspot.lineNumber }}</template></small>
              <small v-else>Browser or anonymous runtime work</small>
              <small>{{ hotspot.selfTimeMs }} ms self · {{ hotspot.samples }} {{ hotspot.samples === 1 ? 'sample' : 'samples' }}</small>
            </div>
            <output>{{ hotspot.selfPercent }}%</output>
            <div class="coverage-bar" aria-hidden="true"><span :style="{ width: `${hotspot.selfPercent}%` }" /></div>
          </article>
          <div v-if="!cpuProfileResult.report.hotspots.length" class="network-monitor-empty compact">
            <IconMonitoring aria-hidden="true" />
            <strong>No JavaScript hotspot was sampled</strong>
            <span>Record a longer or CPU-heavy interaction and try again.</span>
          </div>
        </div>
        <details class="coverage-caveats">
          <summary>How to interpret this profile</summary>
          <ul><li v-for="caveat in cpuProfileResult.report.caveats" :key="caveat">{{ caveat }}</li></ul>
        </details>
        <footer>
          <span>Started on {{ cpuProfileResult.report.startedUrl }}<span v-if="cpuProfileResult.report.currentUrl !== cpuProfileResult.report.startedUrl"> · page changed</span></span>
          <div>
            <button type="button" @click="manageCpuProfile('clear')"><IconDelete aria-hidden="true" /> Clear</button>
            <button class="primary" type="button" @click="manageCpuProfile('start')"><IconRecord aria-hidden="true" /> Record again</button>
          </div>
        </footer>
      </template>
      <div v-else class="coverage-empty">
        <IconMonitoring aria-hidden="true" />
        <strong>Find hot JavaScript functions</strong>
        <span>Start recording, reproduce one slow interaction, then stop. Bronom reports sampled self time without source code or page content.</span>
        <div>
          <button class="primary" type="button" @click="manageCpuProfile('start')"><IconRecord aria-hidden="true" /> Start recording</button>
        </div>
      </div>
    </section>
    <section
      v-if="memoryPanelOpen"
      class="accessibility-panel memory-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="memory-panel-title"
      :aria-busy="memoryState === 'running'"
    >
      <header>
        <div>
          <span class="eyebrow">Local diagnostics</span>
          <h2 id="memory-panel-title">Page memory</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock memory report" />
          <button class="panel-close" type="button" aria-label="Close memory report" @click="memoryPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="memoryState === 'running'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Collecting local memory counters…</strong>
        <span>The measurement stays in Bronom and never includes page content.</span>
      </div>
      <div v-else-if="memoryState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Memory report could not finish</strong>
        <span>{{ memoryError }}</span>
        <button type="button" @click="runMemoryReport()">Try again</button>
      </div>
      <template v-else-if="memoryReport?.current">
        <div class="memory-summary">
          <article>
            <span>JS heap used</span>
            <strong>{{ formatBytes(memoryReport.current.jsHeapUsedBytes) }}</strong>
            <small v-if="memoryReport.delta" :class="memoryDeltaClass(memoryReport.delta.jsHeapUsedBytes)">{{ formatSignedBytes(memoryReport.delta.jsHeapUsedBytes) }} from baseline</small>
            <small v-else>No baseline yet</small>
          </article>
          <article>
            <span>DOM nodes</span>
            <strong>{{ memoryReport.current.nodes }}</strong>
            <small v-if="memoryReport.delta" :class="memoryDeltaClass(memoryReport.delta.nodes)">{{ formatSignedCount(memoryReport.delta.nodes) }} from baseline</small>
            <small v-else>No baseline yet</small>
          </article>
          <article>
            <span>Event listeners</span>
            <strong>{{ memoryReport.current.eventListeners }}</strong>
            <small v-if="memoryReport.delta" :class="memoryDeltaClass(memoryReport.delta.eventListeners)">{{ formatSignedCount(memoryReport.delta.eventListeners) }} from baseline</small>
            <small v-else>No baseline yet</small>
          </article>
          <article>
            <span>Documents</span>
            <strong>{{ memoryReport.current.documents }}</strong>
            <small v-if="memoryReport.delta" :class="memoryDeltaClass(memoryReport.delta.documents)">{{ formatSignedCount(memoryReport.delta.documents) }} from baseline</small>
            <small v-else>No baseline yet</small>
          </article>
        </div>
        <div class="memory-details">
          <dl>
            <div><dt>Heap capacity</dt><dd>{{ formatBytes(memoryReport.current.jsHeapTotalBytes) }}</dd></div>
            <div><dt>Embedder heap</dt><dd>{{ formatBytes(memoryReport.current.embedderHeapUsedBytes) }}</dd></div>
            <div><dt>Backing storage</dt><dd>{{ formatBytes(memoryReport.current.backingStorageBytes) }}</dd></div>
            <div><dt>Layout objects</dt><dd>{{ memoryReport.current.layoutObjects }}</dd></div>
            <div><dt>Frames</dt><dd>{{ memoryReport.current.frames }}</dd></div>
            <div><dt>Sample</dt><dd>{{ memoryReport.forcedGarbageCollection ? 'After forced GC' : 'Current state' }}</dd></div>
          </dl>
          <p class="memory-hint"><IconInfo aria-hidden="true" /> Growth is a clue, not proof of a leak. Repeat the same interaction and compare post-GC samples.</p>
          <section class="memory-allocation-section" aria-labelledby="memory-allocation-title">
            <div class="memory-allocation-heading">
              <div>
                <span class="eyebrow">JavaScript allocation sampling</span>
                <h3 id="memory-allocation-title">Find retained allocations by function</h3>
              </div>
              <button
                v-if="memoryReport.allocationProfile"
                type="button"
                @click="manageMemoryAllocation('clear')"
              ><IconDelete aria-hidden="true" /> Clear profile</button>
            </div>
            <div v-if="memoryReport.allocationStatus === 'recording'" class="coverage-recording memory-allocation-recording" role="status">
              <IconRecord aria-hidden="true" />
              <strong>Allocation sampling is recording</strong>
              <span>Repeat the memory-heavy interaction, then stop to rank functions by sampled live bytes.</span>
              <small>Started {{ debugTimestamp(memoryReport.allocationRecording?.startedAt || '') }}</small>
              <button class="primary" type="button" @click="manageMemoryAllocation('stop')"><IconStop aria-hidden="true" /> Stop and show allocations</button>
            </div>
            <template v-else-if="memoryReport.allocationProfile">
              <div class="coverage-summary memory-allocation-summary">
                <article>
                  <span>Sampled live bytes</span>
                  <strong>{{ formatBytes(memoryReport.allocationProfile.sampledBytes) }}</strong>
                  <small>{{ memoryReport.allocationProfile.sampleCount }} samples</small>
                </article>
                <article>
                  <span>Hot functions</span>
                  <strong>{{ memoryReport.allocationProfile.hotspots.length }}</strong>
                  <small v-if="memoryReport.allocationProfile.truncated">Top bounded results</small>
                  <small v-else>Ranked by retained bytes</small>
                </article>
                <article>
                  <span>Top location</span>
                  <strong>{{ memoryReport.allocationProfile.hotspots[0]?.selfPercent ?? 0 }}%</strong>
                  <small>of sampled live bytes</small>
                </article>
              </div>
              <div class="coverage-resource-list memory-allocation-list" role="list" aria-label="JavaScript allocation hotspots">
                <article v-for="hotspot in memoryReport.allocationProfile.hotspots" :key="`${hotspot.functionName}:${hotspot.url}:${hotspot.lineNumber}:${hotspot.columnNumber}`" role="listitem">
                  <div>
                    <span class="coverage-type">JS</span>
                    <strong>{{ hotspot.functionName }}</strong>
                    <small v-if="hotspot.url" :title="hotspot.url">{{ hotspot.url }}<template v-if="hotspot.lineNumber">:{{ hotspot.lineNumber }}</template></small>
                    <small v-else>Browser or anonymous runtime allocation</small>
                    <small>{{ formatBytes(hotspot.selfBytes) }} sampled live · {{ hotspot.samples }} {{ hotspot.samples === 1 ? 'sample' : 'samples' }}</small>
                  </div>
                  <output>{{ hotspot.selfPercent }}%</output>
                  <div class="coverage-bar" aria-hidden="true"><span :style="{ width: `${hotspot.selfPercent}%` }" /></div>
                </article>
                <div v-if="!memoryReport.allocationProfile.hotspots.length" class="network-monitor-empty compact">
                  <IconMemory aria-hidden="true" />
                  <strong>No retained allocation hotspot was sampled</strong>
                  <span>Record a longer memory-heavy interaction and try again.</span>
                </div>
              </div>
              <details class="coverage-caveats">
                <summary>How to interpret allocation sampling</summary>
                <ul><li v-for="caveat in memoryReport.allocationProfile.caveats" :key="caveat">{{ caveat }}</li></ul>
              </details>
              <div class="memory-allocation-actions">
                <button class="primary" type="button" @click="manageMemoryAllocation('start')"><IconRecord aria-hidden="true" /> Record again</button>
              </div>
            </template>
            <div v-else class="memory-allocation-empty">
              <IconMemory aria-hidden="true" />
              <div>
                <strong>Locate functions retaining JavaScript memory</strong>
                <span>Start sampling, reproduce one interaction, then stop. Object values and page content never leave the profiler.</span>
              </div>
              <button class="primary" type="button" @click="manageMemoryAllocation('start')"><IconRecord aria-hidden="true" /> Start sampling</button>
            </div>
          </section>
        </div>
      </template>
      <div v-else class="accessibility-audit-empty">
        <IconMemory aria-hidden="true" />
        <strong>Baseline cleared</strong>
        <span>Set a new baseline before reproducing the interaction you want to inspect.</span>
      </div>
      <footer>
        <span>{{ memoryReport?.baseline ? 'Runtime baseline active' : 'No baseline' }}</span>
        <div class="memory-actions">
          <button v-if="memoryReport?.baseline" type="button" @click="clearMemoryBaseline"><IconDelete aria-hidden="true" /> Clear</button>
          <button type="button" @click="runMemoryReport('set-baseline', true)"><IconKeep aria-hidden="true" /> Set baseline</button>
          <button type="button" @click="runMemoryReport('measure', true)"><IconRefresh aria-hidden="true" /> GC &amp; measure</button>
        </div>
      </footer>
    </section>
    <section
      v-if="consolePanelOpen"
      class="accessibility-panel console-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="console-panel-title"
      :aria-busy="consoleState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Current website</span>
          <h2 id="console-panel-title">Console</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock Console" />
          <button class="panel-close" type="button" aria-label="Close Console" @click="consolePanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div class="console-tools">
        <label class="network-monitor-search">
          <IconSearch aria-hidden="true" />
          <input v-model="consoleSearch" type="search" aria-label="Filter Console messages" placeholder="Filter messages or sources" spellcheck="false" />
        </label>
        <label class="console-level-filter">
          <span>Level</span>
          <select v-model="consoleLevel" aria-label="Filter Console by level">
            <option value="all">All levels</option>
            <option value="error">Errors ({{ consoleMessageCounts.error }})</option>
            <option value="warning">Warnings ({{ consoleMessageCounts.warning }})</option>
            <option value="info">Info ({{ consoleMessageCounts.info }})</option>
            <option value="verbose">Verbose ({{ consoleMessageCounts.verbose }})</option>
          </select>
        </label>
        <label class="preserve-logs-toggle" title="Keep bounded Console and Network evidence when this tab loads another page">
          <input type="checkbox" :checked="activeTab?.preserveDiagnosticLogs" @change="updateDiagnosticLogPreservation" />
          Preserve logs
        </label>
      </div>
      <p v-if="consoleError" class="network-monitor-error" role="alert">{{ consoleError }}</p>
      <div v-if="consoleState === 'loading' && !consoleMessages.length" class="network-monitor-empty" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Reading the bounded Console log…</strong>
      </div>
      <div v-else class="console-messages" role="log" aria-live="polite" aria-label="Sanitized Console messages">
        <article
          v-for="(message, index) in filteredConsoleMessages"
          :key="`${message.timestamp}-${index}`"
          class="console-message"
          :class="browserConsoleLevel(message.level)"
        >
          <header>
            <span>{{ browserConsoleLevel(message.level) }}</span>
            <small
              v-if="(message.repeatCount ?? 1) > 1"
              class="console-repeat"
              :aria-label="`${message.repeatCount} repeated Console events`"
              :title="message.firstTimestamp ? `Repeated since ${debugTimestamp(message.firstTimestamp)}` : undefined"
            >×{{ message.repeatCount }}</small>
            <small v-if="message.handled" class="console-handled">handled later</small>
            <time :datetime="message.timestamp">{{ debugTimestamp(message.timestamp) }}</time>
            <button
              type="button"
              class="console-message-copy"
              aria-label="Copy Console entry"
              @click="copyConsoleEntry(message)"
            >
              <IconCheck v-if="consoleCopiedEntryKey === consoleEntryKey(message)" aria-hidden="true" />
              <IconCopy v-else aria-hidden="true" />
              {{ consoleCopiedEntryKey === consoleEntryKey(message) ? 'Copied' : 'Copy' }}
            </button>
          </header>
          <code>{{ message.message }}</code>
          <small v-if="message.sourceId">{{ networkSourceLocation(message.sourceId, message.lineNumber, message.columnNumber) }}</small>
          <details v-if="message.stack?.length" class="console-stack">
            <summary>Call stack <span>{{ message.stack.length }}{{ message.stackTruncated ? '+' : '' }}</span></summary>
            <ol>
              <li v-for="(frame, frameIndex) in message.stack" :key="`${frame.url || 'inline'}:${frame.lineNumber}:${frame.columnNumber}:${frameIndex}`">
                <span v-if="frame.async" class="console-async">async</span>
                <strong>{{ frame.functionName || '(anonymous)' }}</strong>
                <code>{{ networkSourceLocation(frame.url, frame.lineNumber, frame.columnNumber) }}</code>
              </li>
            </ol>
            <p v-if="message.stackTruncated">Only the first 20 sanitized frames are shown.</p>
          </details>
        </article>
        <div v-if="!filteredConsoleMessages.length" class="network-monitor-empty compact">
          <IconTerminal aria-hidden="true" />
          <strong>{{ consoleMessages.length ? 'No messages match these filters' : 'No Console messages captured yet' }}</strong>
          <span>{{ consoleMessages.length ? 'Change the text or level filter.' : 'Use the website or reload it; new messages appear automatically.' }}</span>
        </div>
      </div>
      <footer>
        <span>{{ filteredConsoleMessages.length }} of {{ consoleMessages.length }} entries · {{ filteredConsoleEventCount }} of {{ consoleEventCount }} events · newest first · sanitized</span>
        <div class="console-actions">
          <button type="button" @click="refreshConsole(true)"><IconDelete aria-hidden="true" /> Clear</button>
          <button type="button" @click="refreshConsole()"><IconRefresh aria-hidden="true" /> Refresh</button>
          <button type="button" :disabled="!consoleMessages.length" @click="copyAllConsole">
            <IconCheck v-if="consoleCopied === 'all'" aria-hidden="true" />
            <IconCopy v-else aria-hidden="true" />
            {{ consoleCopied === 'all' ? 'Copied all' : 'Copy all' }}
          </button>
          <button type="button" class="primary" :disabled="!filteredConsoleMessages.length" @click="copyFilteredConsole">
            <IconCheck v-if="consoleCopied === 'filtered'" aria-hidden="true" />
            <IconCopy v-else aria-hidden="true" />
            {{ consoleCopied === 'filtered' ? 'Copied filtered' : 'Copy filtered' }}
          </button>
        </div>
      </footer>
    </section>
    <section
      v-if="networkMonitorOpen"
      class="accessibility-panel network-monitor-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="network-monitor-title"
      :aria-busy="networkMonitorState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Current website</span>
          <h2 id="network-monitor-title">Network</h2>
        </div>
        <div class="network-monitor-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock network monitor" />
          <button
            type="button"
            :class="{ active: networkContentSearchOpen }"
            aria-label="Search request content"
            title="Search headers, payloads, and responses"
            @click="toggleNetworkContentSearch"
          ><IconSearch aria-hidden="true" /></button>
          <button type="button" aria-label="Refresh network requests" title="Refresh" @click="refreshNetworkMonitor()"><IconRefresh aria-hidden="true" /></button>
          <button class="panel-close" type="button" aria-label="Close network monitor" @click="networkMonitorOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <section class="request-conditions" aria-labelledby="request-conditions-title">
        <button
          class="request-conditions-toggle"
          type="button"
          :aria-expanded="requestConditionsExpanded"
          aria-controls="request-conditions-content"
          @click="requestConditionsExpanded = !requestConditionsExpanded"
        >
          <span class="request-conditions-toggle-copy">
            <IconRoute aria-hidden="true" />
            <span><strong id="request-conditions-title">Request conditions</strong><small>Block, mock, throttle, and prioritize requests</small></span>
          </span>
          <span class="request-conditions-toggle-meta">
            <span v-if="networkRoutes.length" class="request-conditions-count">{{ networkRoutes.length }} active</span>
            <IconKeyboardArrowDown v-if="requestConditionsExpanded" aria-hidden="true" />
            <IconKeyboardArrowRight v-else aria-hidden="true" />
          </span>
        </button>
        <div v-if="requestConditionsExpanded" id="request-conditions-content" class="request-conditions-content">
          <p v-if="networkRouteError" class="network-monitor-error" role="alert">{{ networkRouteError }}</p>
          <div v-if="networkRouteState === 'loading' && !networkRoutes.length" class="request-conditions-empty" role="status">
            <IconProgress class="state-spinner" aria-hidden="true" />
            Reading temporary conditions…
          </div>
          <div v-else-if="networkRoutes.length" class="request-condition-list" aria-label="Active request conditions">
            <article v-for="(route, index) in networkRoutes" :key="route.id" class="request-condition-item">
              <span class="request-condition-order" :title="index === 0 ? 'First matching condition wins' : `Priority ${index + 1}`">{{ index + 1 }}</span>
              <span class="request-condition-copy">
                <strong :title="route.urlPattern">{{ route.urlPattern }}</strong>
                <small>
                  {{ route.method || 'Any method' }} ·
                  <template v-if="route.behavior === 'abort'">Fail as {{ route.abort }}</template>
                  <template v-else-if="route.behavior === 'fulfill'">Respond {{ route.response?.status }} · {{ route.response?.bodyBytes || 0 }} B body</template>
                  <template v-else>Throttle as {{ networkEmulationLabel(route.throttle || 'slow-4g') }}</template>
                  <template v-if="route.remainingMatches !== undefined"> · {{ route.remainingMatches }} {{ route.remainingMatches === 1 ? 'match' : 'matches' }} left</template>
                  <template v-else> · until removed</template>
                </small>
              </span>
              <span class="request-condition-controls">
                <button
                  type="button"
                  :aria-label="`Move request condition ${route.urlPattern} up`"
                  title="Move up"
                  :disabled="networkRouteState === 'saving' || index === 0"
                  @click="moveNetworkRoute(route.id, 'up')"
                ><IconKeyboardArrowUp aria-hidden="true" /></button>
                <button
                  type="button"
                  :aria-label="`Move request condition ${route.urlPattern} down`"
                  title="Move down"
                  :disabled="networkRouteState === 'saving' || index === networkRoutes.length - 1"
                  @click="moveNetworkRoute(route.id, 'down')"
                ><IconKeyboardArrowDown aria-hidden="true" /></button>
                <button
                  type="button"
                  :aria-label="`Remove request condition ${route.urlPattern}`"
                  title="Remove condition"
                  :disabled="networkRouteState === 'saving'"
                  @click="removeNetworkRoute(route.id)"
                ><IconDelete aria-hidden="true" /></button>
              </span>
            </article>
          </div>
          <div v-else class="request-conditions-empty">
            <IconRoute aria-hidden="true" />
            <span><strong>No request conditions</strong><small>Add one to test loading and API failure states.</small></span>
          </div>
          <form class="request-condition-form" aria-label="Add temporary request condition" @submit.prevent="addNetworkRouteFromDraft">
            <h3>Add temporary condition</h3>
            <label class="request-condition-pattern">
              <span>URL pattern</span>
              <input v-model="networkRoutePattern" type="text" required maxlength="2048" placeholder="https://api.example.com/v1/*" spellcheck="false" />
            </label>
            <div class="request-condition-form-row">
              <label v-if="networkRouteMode !== 'throttle'">
                <span>Method</span>
                <select v-model="networkRouteMethod">
                  <option value="">Any</option>
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>PATCH</option>
                  <option>DELETE</option>
                  <option>OPTIONS</option>
                </select>
              </label>
              <label>
                <span>Behavior</span>
                <select v-model="networkRouteMode">
                  <option value="abort">Block / fail</option>
                  <option value="fulfill">Mock response</option>
                  <option value="throttle">Throttle request</option>
                </select>
              </label>
              <label v-if="networkRouteMode !== 'throttle'">
                <span>Matches</span>
                <input v-model.number="networkRouteTimes" type="number" min="1" max="100" step="1" required />
              </label>
              <label v-else>
                <span>Network profile</span>
                <select v-model="networkRouteThrottle" aria-label="Network profile">
                  <option value="fast-4g">Fast 4G</option>
                  <option value="slow-4g">Slow 4G</option>
                  <option value="slow-3g">Slow 3G</option>
                </select>
              </label>
            </div>
            <label v-if="networkRouteMode === 'abort'">
              <span>Failure reason</span>
              <select v-model="networkRouteAbort">
                <option v-for="reason in BROWSER_NETWORK_ABORT_REASONS" :key="reason" :value="reason">{{ reason }}</option>
              </select>
            </label>
            <template v-else-if="networkRouteMode === 'fulfill'">
              <label>
                <span>HTTP status</span>
                <input v-model.number="networkRouteStatus" type="number" min="100" max="599" step="1" required />
              </label>
              <label>
                <span>Response headers <small>JSON object with string values</small></span>
                <textarea v-model="networkRouteHeaders" rows="3" placeholder='{"content-type":"application/json"}' spellcheck="false" />
              </label>
              <label>
                <span>Response body <small>up to 512 KiB</small></span>
                <textarea v-model="networkRouteBody" rows="4" placeholder='{"ok":false}' spellcheck="false" />
              </label>
            </template>
            <div class="request-condition-form-actions">
              <p><IconInfo aria-hidden="true" /> First match wins. Block and mock rules expire after their match count; throttles stay active until removed. Every condition is discarded when the tab or Bronom closes.</p>
              <button
                type="submit"
                class="primary"
                :disabled="networkRouteState === 'saving' || !networkRoutePattern.trim()"
              >
                <IconProgress v-if="networkRouteState === 'saving'" class="state-spinner" aria-hidden="true" />
                <IconAdd v-else aria-hidden="true" />
                {{ networkRouteState === 'saving' ? 'Adding…' : 'Add condition' }}
              </button>
            </div>
          </form>
          <div v-if="networkRoutes.length" class="request-conditions-actions">
            <span>Mock bodies and header values are never shown again after creation.</span>
            <button type="button" :disabled="networkRouteState === 'saving'" @click="clearActiveNetworkRoutes"><IconDelete aria-hidden="true" /> Remove all</button>
          </div>
        </div>
      </section>
      <div class="network-monitor-tools">
        <label class="network-monitor-search">
          <IconSearch aria-hidden="true" />
          <input
            v-model="networkSearch"
            type="search"
            aria-label="Filter network requests"
            placeholder="Filter requests · method:POST status-code:500"
            title="Combine free text with domain:, is:running, larger-than:, method:, resource-type:, scheme:, status-code:, or url: filters"
            spellcheck="false"
          />
        </label>
        <div class="network-sort-controls">
          <label>
            <span>Sort</span>
            <select :value="networkSortBy" aria-label="Sort network requests" @change="setNetworkSortBy">
              <option v-for="option in networkSortOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </label>
          <button
            type="button"
            :aria-label="`Sort network requests ${networkSortDirection === 'asc' ? 'ascending' : 'descending'}`"
            :title="networkSortDirection === 'asc' ? 'Ascending' : 'Descending'"
            @click="toggleNetworkSortDirection"
          >
            <IconKeyboardArrowUp v-if="networkSortDirection === 'asc'" aria-hidden="true" />
            <IconKeyboardArrowDown v-else aria-hidden="true" />
          </button>
        </div>
        <label class="network-failures-toggle">
          <input v-model="networkFailuresOnly" type="checkbox" />
          Failures only
          <span v-if="networkFailureCount">{{ networkFailureCount }}</span>
        </label>
        <label class="preserve-logs-toggle" title="Keep bounded Network and Console evidence when this tab loads another page">
          <input type="checkbox" :checked="activeTab?.preserveDiagnosticLogs" @change="updateDiagnosticLogPreservation" />
          Preserve logs
        </label>
      </div>
      <div class="network-resource-filters" role="group" aria-label="Filter requests by resource type">
        <button
          v-for="filter in networkResourceFilters"
          :key="filter.value || 'all'"
          type="button"
          :class="{ active: networkResourceFilter === filter.value }"
          :aria-pressed="networkResourceFilter === filter.value"
          @click="networkResourceFilter = filter.value"
        >{{ filter.label }}</button>
      </div>
      <section v-if="networkContentSearchOpen" class="network-content-search" aria-label="Search request content">
        <form @submit.prevent="runNetworkContentSearch">
          <label>
            <IconSearch aria-hidden="true" />
            <input
              ref="networkContentSearchInput"
              v-model="networkContentSearchQuery"
              type="search"
              aria-label="Search headers, payloads, responses, WebSocket text, and event streams"
              placeholder="Search headers, payloads, responses, WebSocket text, and event streams"
              maxlength="200"
              spellcheck="false"
            />
          </label>
          <label class="network-content-search-case">
            <input v-model="networkContentSearchCaseSensitive" type="checkbox" />
            Match case
          </label>
          <button type="submit" class="primary" :disabled="networkContentSearchState === 'searching' || !networkContentSearchQuery.trim()">
            <IconProgress v-if="networkContentSearchState === 'searching'" class="state-spinner" aria-hidden="true" />
            <IconSearch v-else aria-hidden="true" />
            {{ networkContentSearchState === 'searching' ? 'Searching…' : 'Search' }}
          </button>
          <button type="button" aria-label="Close request content search" @click="closeNetworkContentSearch"><IconClose aria-hidden="true" /></button>
        </form>
        <p v-if="networkContentSearchError" class="network-content-search-error" role="alert">{{ networkContentSearchError }}</p>
        <template v-if="networkContentSearchResult">
          <header>
            <strong>{{ networkContentSearchResult.resultCount }} matching {{ networkContentSearchResult.resultCount === 1 ? 'field' : 'fields' }} in {{ networkContentSearchResult.matchingRequestCount }} {{ networkContentSearchResult.matchingRequestCount === 1 ? 'request' : 'requests' }}</strong>
            <span>{{ networkContentSearchResult.searchedRequestCount }} of {{ networkContentSearchResult.availableRequestCount }} requests searched<template v-if="networkContentSearchResult.truncated"> · bounded</template></span>
          </header>
          <div v-if="networkContentSearchResult.matches.length" class="network-content-search-results">
            <button
              v-for="(match, index) in networkContentSearchResult.matches"
              :key="`${match.requestId}:${match.field}:${match.label}:${index}`"
              type="button"
              :aria-label="`Inspect matching request ${index + 1}: ${match.label}`"
              @click="selectNetworkSearchMatch(match)"
            >
              <span>
                <strong>{{ match.label }}</strong>
                <small>{{ match.method }} · {{ match.status ?? 'No status' }} · {{ networkResourceCategory(match.resourceType) }} · {{ networkRequestName(match) }}<template v-if="match.occurrenceCount > 1"> · {{ match.occurrenceCount }} matches</template></small>
              </span>
              <code>{{ match.snippet }}</code>
            </button>
          </div>
          <div v-else class="network-content-search-empty">No sanitized request content matched “{{ networkContentSearchResult.query }}”.</div>
          <footer>
            Known secret fields, binary bodies, and multipart bodies are omitted. Review arbitrary text before sharing.
          </footer>
        </template>
      </section>
      <p v-if="networkMonitorError" class="network-monitor-error" role="alert">{{ networkMonitorError }}</p>
      <div v-if="networkMonitorState === 'loading' && !networkRequests.length" class="network-monitor-empty" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Reading the bounded request log…</strong>
      </div>
      <div v-else class="network-monitor-workspace">
        <div class="network-request-list" role="listbox" aria-label="Network requests">
          <button
            v-for="request in filteredNetworkRequests"
            :key="request.id"
            type="button"
            role="option"
            :aria-selected="networkSelectedRequestId === request.id"
            :data-request-id="request.id"
            :class="{
              selected: networkSelectedRequestId === request.id,
              failed: isNetworkRequestFailure(request)
            }"
            @click="selectNetworkRequest(request)"
          >
            <span class="network-request-primary">
              <span class="network-request-status">{{ networkRequestStatus(request) }}</span>
              <strong :title="request.url">{{ networkRequestName(request) }}</strong>
              <small
                v-if="request.responseSource && request.responseSource !== 'network'"
                class="network-request-source"
                :title="networkRequestSourceSummary(request)"
              >{{ networkResponseSourceLabel(request.responseSource) }}</small>
            </span>
            <span class="network-request-meta">
              <span>{{ request.method }}</span>
              <span>{{ networkResourceCategory(request.resourceType) }}</span>
              <span>{{ request.responseSizeBytes !== undefined ? formatBytes(request.responseSizeBytes) : '—' }}</span>
              <span>{{ networkRequestDuration(request) }}</span>
            </span>
            <span
              v-if="networkWaterfallRange"
              class="network-request-waterfall"
              role="img"
              :aria-label="networkWaterfallLabel(request)"
              :title="networkWaterfallLabel(request)"
            >
              <i
                :class="{ pending: request.durationMs === undefined && !request.completedAt }"
                :style="networkWaterfallStyle(request)"
              />
            </span>
          </button>
          <div v-if="!filteredNetworkRequests.length" class="network-monitor-empty compact">
            <IconNetworkCheck aria-hidden="true" />
            <strong>{{ networkRequests.length ? 'No requests match these filters' : 'No requests captured yet' }}</strong>
            <span>{{ networkRequests.length ? 'Change the text, type, or failure filter.' : 'Use the website, then refresh this monitor.' }}</span>
          </div>
        </div>
        <div class="network-request-details" aria-live="polite">
          <div v-if="networkRequestDetailsLoading" class="network-monitor-empty compact" role="status">
            <IconProgress class="state-spinner" aria-hidden="true" />
            <strong>Reading request details…</strong>
          </div>
          <template v-else-if="networkRequestDetails">
            <header class="network-detail-heading">
              <span>{{ networkRequestDetails.method }}</span>
              <strong>{{ networkRequestStatus(networkRequestDetails) }}</strong>
              <small>{{ networkRequestDetails.response.protocol || networkRequestDetails.resourceType }}</small>
            </header>
            <code class="network-detail-url">{{ networkRequestDetails.url }}</code>
            <details v-if="networkRequestDetails.responseSource" class="network-response-origin" open>
              <summary>
                Response source
                <span>{{ networkRequestSourceSummary(networkRequestDetails) }}</span>
              </summary>
              <dl>
                <template v-if="networkRequestDetails.serviceWorkerResponseSource">
                  <dt>Worker response</dt>
                  <dd>{{ serviceWorkerResponseSourceLabel(networkRequestDetails.serviceWorkerResponseSource) }}</dd>
                </template>
                <template v-if="networkRequestDetails.cacheStorageCacheName">
                  <dt>Cache Storage name</dt>
                  <dd><code>{{ networkRequestDetails.cacheStorageCacheName }}</code></dd>
                </template>
              </dl>
              <p v-if="networkRequestDetails.responseSource === 'network'">Chromium reported a direct network response.</p>
            </details>
            <div class="network-detail-actions">
              <span>
                {{ canFormatNetworkRequestCopy(networkRequestDetails)
                  ? 'Sanitized current-request evidence · review commands before sharing or running'
                  : 'Sanitized current-request evidence' }}
              </span>
              <div class="network-detail-copy-actions">
                <button
                  v-if="networkRequestDetails.resourceType.toLowerCase() === 'xhr'"
                  type="button"
                  :class="{
                    danger: networkReplayState === 'confirming',
                    complete: networkReplayState === 'replayed'
                  }"
                  :disabled="networkReplayState === 'replaying'"
                  :title="networkReplayRequiresConfirmation(networkRequestDetails.method)
                    ? 'This method can repeat writes or other side effects and requires a second click.'
                    : 'Replay this XHR with its original request details inside Chromium.'"
                  @click="replaySelectedNetworkRequest"
                >
                  <IconProgress v-if="networkReplayState === 'replaying'" class="state-spinner" aria-hidden="true" />
                  <IconCheck v-else-if="networkReplayState === 'replayed'" aria-hidden="true" />
                  <IconWarning v-else-if="networkReplayState === 'confirming'" aria-hidden="true" />
                  <IconReplay v-else aria-hidden="true" />
                  {{ networkReplayState === 'confirming'
                    ? `Confirm replay ${networkRequestDetails.method.toUpperCase()}`
                    : networkReplayState === 'replaying'
                      ? 'Replaying…'
                      : networkReplayState === 'replayed'
                        ? 'Replayed XHR'
                        : 'Replay XHR' }}
                </button>
                <button type="button" @click="copySanitizedNetworkDetails('json')">
                  <IconCheck v-if="networkDetailsCopied === 'json'" aria-hidden="true" />
                  <IconCode v-else aria-hidden="true" />
                  {{ networkDetailsCopied === 'json' ? 'Copied JSON' : 'Copy JSON' }}
                </button>
                <button
                  v-if="canFormatNetworkRequestCopy(networkRequestDetails)"
                  type="button"
                  @click="copySanitizedNetworkDetails('curl')"
                >
                  <IconCheck v-if="networkDetailsCopied === 'curl'" aria-hidden="true" />
                  <IconTerminal v-else aria-hidden="true" />
                  {{ networkDetailsCopied === 'curl' ? 'Copied cURL' : 'Copy sanitized cURL' }}
                </button>
                <button
                  v-if="canFormatNetworkRequestCopy(networkRequestDetails)"
                  type="button"
                  @click="copySanitizedNetworkDetails('fetch')"
                >
                  <IconCheck v-if="networkDetailsCopied === 'fetch'" aria-hidden="true" />
                  <IconCopy v-else aria-hidden="true" />
                  {{ networkDetailsCopied === 'fetch' ? 'Copied fetch' : 'Copy sanitized fetch' }}
                </button>
              </div>
            </div>
            <p
              v-if="networkReplayMessage"
              class="network-replay-feedback"
              :class="networkReplayState"
              :role="networkReplayState === 'error' ? 'alert' : 'status'"
            >{{ networkReplayMessage }}</p>
            <details v-if="networkRequestDetails.initiator" open>
              <summary>Initiator <span>{{ networkInitiatorLabel(networkRequestDetails.initiator.type) }}</span></summary>
              <div class="network-initiator-details">
                <p v-if="networkRequestDetails.initiator.redirectedFrom">
                  <strong>Redirected from</strong>
                  <code>{{ networkRequestDetails.initiator.redirectedFrom }}</code>
                </p>
                <p v-if="networkRequestDetails.initiator.url">
                  <strong>Source</strong>
                  <code>{{ networkSourceLocation(networkRequestDetails.initiator.url, networkRequestDetails.initiator.lineNumber, networkRequestDetails.initiator.columnNumber) }}</code>
                </p>
                <ol v-if="networkRequestDetails.initiator.stack?.length" class="network-initiator-stack">
                  <li v-for="(frame, index) in networkRequestDetails.initiator.stack" :key="`${frame.url || 'inline'}:${frame.lineNumber}:${frame.columnNumber}:${index}`">
                    <strong>{{ frame.functionName || '(anonymous)' }}</strong>
                    <code>{{ networkSourceLocation(frame.url, frame.lineNumber, frame.columnNumber) }}</code>
                  </li>
                </ol>
                <p v-if="networkRequestDetails.initiator.stackTruncated">Only the first 12 sanitized frames are shown.</p>
                <p v-if="!networkRequestDetails.initiator.url && !networkRequestDetails.initiator.redirectedFrom && !networkRequestDetails.initiator.stack?.length">Chromium identified the initiator type without exposing a source location.</p>
              </div>
            </details>
            <details v-if="networkRequestDetails.relationships" open>
              <summary>
                Request relationships
                <span>{{ networkRelationshipCount(networkRequestDetails) }} related</span>
              </summary>
              <div class="network-relationship-details">
                <section v-if="networkRequestDetails.relationships.triggeredBy">
                  <header>
                    <strong>Triggered by</strong>
                    <span>Reported by Chromium</span>
                  </header>
                  <button
                    type="button"
                    :aria-label="`Inspect triggering request ${networkRequestName(networkRequestDetails.relationships.triggeredBy)}`"
                    @click="selectRelatedNetworkRequest(networkRequestDetails.relationships.triggeredBy)"
                  >
                    <span>
                      <strong>{{ networkRequestName(networkRequestDetails.relationships.triggeredBy) }}</strong>
                      <small>{{ networkRequestDetails.relationships.triggeredBy.method }} · {{ networkRequestDetails.relationships.triggeredBy.resourceType }}</small>
                    </span>
                    <code>{{ networkRequestStatus(networkRequestDetails.relationships.triggeredBy) }}</code>
                  </button>
                </section>
                <section v-if="networkRequestDetails.relationships.redirectChain.length > 1">
                  <header>
                    <strong>Redirect chain</strong>
                    <span>{{ networkRequestDetails.relationships.redirectChain.length }} retained hops</span>
                  </header>
                  <button
                    v-for="(related, index) in networkRequestDetails.relationships.redirectChain"
                    :key="related.id"
                    type="button"
                    :disabled="related.id === networkRequestDetails.id"
                    :aria-current="related.id === networkRequestDetails.id ? 'true' : undefined"
                    :aria-label="related.id === networkRequestDetails.id
                      ? `Current request ${networkRequestName(related)}`
                      : `Inspect redirect hop ${index + 1} ${networkRequestName(related)}`"
                    @click="selectRelatedNetworkRequest(related)"
                  >
                    <i>{{ index + 1 }}</i>
                    <span>
                      <strong>{{ networkRequestName(related) }}</strong>
                      <small>{{ related.id === networkRequestDetails.id ? 'Current request' : `${related.method} · ${related.resourceType}` }}</small>
                    </span>
                    <code>{{ networkRequestStatus(related) }}</code>
                  </button>
                </section>
                <section v-if="networkRequestDetails.relationships.dependents.length">
                  <header>
                    <strong>Triggered requests</strong>
                    <span>{{ networkRequestDetails.relationships.dependents.length }} direct</span>
                  </header>
                  <button
                    v-for="related in networkRequestDetails.relationships.dependents"
                    :key="related.id"
                    type="button"
                    :aria-label="`Inspect triggered request ${networkRequestName(related)}`"
                    @click="selectRelatedNetworkRequest(related)"
                  >
                    <span>
                      <strong>{{ networkRequestName(related) }}</strong>
                      <small>{{ related.method }} · {{ related.resourceType }}</small>
                    </span>
                    <code>{{ networkRequestStatus(related) }}</code>
                  </button>
                </section>
                <p v-if="networkRequestDetails.relationships.truncated">Only a bounded window of retained relationships is shown.</p>
              </div>
            </details>
            <details v-if="networkRequestDetails.webSocket" open>
              <summary>
                Messages
                <span>{{ networkRequestDetails.webSocket.messages.length }}{{ networkRequestDetails.webSocket.droppedMessages ? ` + ${networkRequestDetails.webSocket.droppedMessages} older` : '' }}</span>
              </summary>
              <div class="network-websocket-summary">
                <span :class="networkRequestDetails.webSocket.open ? 'open' : 'closed'">{{ networkRequestDetails.webSocket.open ? 'Connection open' : 'Connection closed' }}</span>
                <small>Text is sanitized; binary payloads are omitted.</small>
              </div>
              <div v-if="networkRequestDetails.webSocket.messages.length" class="network-websocket-messages">
                <article
                  v-for="(message, index) in networkRequestDetails.webSocket.messages"
                  :key="`${message.timestamp}:${message.direction}:${index}`"
                  :class="[message.direction, message.kind]"
                >
                  <header>
                    <span>{{ message.direction }}</span>
                    <strong>{{ message.kind }}</strong>
                    <small>{{ debugTimestamp(message.timestamp) }}</small>
                    <code>{{ formatBytes(message.sizeBytes) }}</code>
                  </header>
                  <pre v-if="message.text">{{ message.text }}</pre>
                  <p v-else>Payload omitted for {{ message.kind }}<template v-if="message.opcode !== undefined"> (opcode {{ message.opcode }})</template>.</p>
                </article>
              </div>
              <p v-else>No messages captured yet.</p>
              <p v-if="networkRequestDetails.webSocket.droppedMessages">{{ networkRequestDetails.webSocket.droppedMessages }} older messages were removed from the bounded diagnostic buffer.</p>
            </details>
            <details v-if="networkRequestDetails.eventSource" open>
              <summary>
                Event stream
                <span>{{ networkRequestDetails.eventSource.messages.length }}{{ networkRequestDetails.eventSource.droppedMessages ? ` + ${networkRequestDetails.eventSource.droppedMessages} older` : '' }}</span>
              </summary>
              <div class="network-websocket-summary">
                <span :class="networkRequestDetails.eventSource.open ? 'open' : 'closed'">{{ networkRequestDetails.eventSource.open ? 'Stream open' : 'Stream closed' }}</span>
                <small>Event names, IDs, and data are sanitized and bounded.</small>
              </div>
              <div v-if="networkRequestDetails.eventSource.messages.length" class="network-websocket-messages network-eventsource-messages">
                <article
                  v-for="(message, index) in networkRequestDetails.eventSource.messages"
                  :key="`${message.timestamp}:${message.eventName}:${message.eventId || ''}:${index}`"
                  class="received text"
                >
                  <header>
                    <span>event</span>
                    <strong>{{ message.eventName }}</strong>
                    <small :title="message.eventId ? `Event ID: ${message.eventId}` : undefined">{{ message.eventId ? `${message.eventId} · ` : '' }}{{ debugTimestamp(message.timestamp) }}</small>
                    <code>{{ formatBytes(message.sizeBytes) }}</code>
                  </header>
                  <pre v-if="message.data">{{ message.data }}</pre>
                  <p v-else>Empty event data.</p>
                  <p v-if="message.truncated || message.redacted">{{ [message.truncated ? 'truncated' : '', message.redacted ? 'sanitized' : ''].filter(Boolean).join(' · ') }}</p>
                </article>
              </div>
              <p v-else>No events captured yet.</p>
              <p v-if="networkRequestDetails.eventSource.droppedMessages">{{ networkRequestDetails.eventSource.droppedMessages }} older events were removed from the bounded diagnostic buffer.</p>
            </details>
            <details v-if="networkRequestDetails.timing || networkRequestDetails.response.serverTiming?.length" open>
              <summary>Timing <span>{{ networkRequestDetails.timing?.totalMs !== undefined ? formatNetworkMilliseconds(networkRequestDetails.timing.totalMs) : `${networkRequestDetails.response.serverTiming?.length || 0} server metrics` }}</span></summary>
              <div v-if="networkRequestDetails.timing" class="network-timing-list">
                <div
                  v-for="phase in networkTimingRows(networkRequestDetails.timing)"
                  :key="phase.key"
                  :class="{ subphase: phase.subphase, total: phase.key === 'total' }"
                >
                  <span>{{ phase.label }}</span>
                  <span class="network-timing-bar" aria-hidden="true"><i :style="{ width: `${networkTimingPercent(phase.value, networkRequestDetails.timing)}%` }" /></span>
                  <strong>{{ formatNetworkMilliseconds(phase.value) }}</strong>
                </div>
              </div>
              <p v-if="networkRequestDetails.timing">Connection setup sub-phases overlap “Before request sent” and are not added to the total twice.</p>
              <div v-if="networkRequestDetails.response.serverTiming?.length" class="network-server-timing">
                <header>
                  <strong>Server timing</strong>
                  <span>Reported by the response</span>
                </header>
                <div v-for="(metric, index) in networkRequestDetails.response.serverTiming" :key="`${metric.name}:${index}`">
                  <span>
                    <strong>{{ metric.name }}</strong>
                    <small v-if="metric.description">{{ metric.description }}</small>
                  </span>
                  <code>{{ metric.durationMs !== undefined ? formatNetworkMilliseconds(metric.durationMs) : 'No duration' }}</code>
                </div>
                <p>Server-defined metrics can overlap and do not need to add up to TTFB.</p>
              </div>
            </details>
            <details open>
              <summary>Request headers <span>{{ Object.keys(networkRequestDetails.request.headers).length }}</span></summary>
              <dl v-if="Object.keys(networkRequestDetails.request.headers).length" class="network-header-list">
                <template v-for="(value, name) in networkRequestDetails.request.headers" :key="name">
                  <dt>{{ name }}</dt><dd>{{ Array.isArray(value) ? value.join('\n') : value }}</dd>
                </template>
              </dl>
              <p v-else>No request headers captured.</p>
            </details>
            <details v-if="networkRequestDetails.request.body">
              <summary>Request body <span v-if="networkRequestDetails.request.body.redacted">sanitized</span></summary>
              <pre>{{ networkRequestDetails.request.body.text }}</pre>
            </details>
            <details open>
              <summary>Response headers <span>{{ Object.keys(networkRequestDetails.response.headers).length }}</span></summary>
              <dl v-if="Object.keys(networkRequestDetails.response.headers).length" class="network-header-list">
                <template v-for="(value, name) in networkRequestDetails.response.headers" :key="name">
                  <dt>{{ name }}</dt><dd>{{ Array.isArray(value) ? value.join('\n') : value }}</dd>
                </template>
              </dl>
              <p v-else>No response headers captured.</p>
            </details>
            <details>
              <summary>Response body <span v-if="networkRequestDetails.response.body.redacted">sanitized</span></summary>
              <pre v-if="networkRequestDetails.response.body.available">{{ networkRequestDetails.response.body.text }}</pre>
              <p v-else>{{ networkRequestDetails.response.body.reason }}</p>
            </details>
            <p class="network-detail-safety"><IconInfo aria-hidden="true" /> Security headers, credential fields, fragments, binary bodies, and multipart bodies are protected.</p>
          </template>
          <div v-else class="network-monitor-empty compact">
            <IconNetworkCheck aria-hidden="true" />
            <strong>Select a request</strong>
            <span>Inspect bounded, sanitized request and response details.</span>
          </div>
        </div>
      </div>
      <footer>
        <span>{{ filteredNetworkRequests.length }} of {{ networkRequests.length }} requests · {{ formatBytes(networkResponseBytes) }} captured</span>
        <div class="network-monitor-actions">
          <button type="button" :disabled="!networkRequests.length" @click="refreshNetworkMonitor(true)"><IconDelete aria-hidden="true" /> Clear</button>
          <button type="button" :disabled="!filteredNetworkRequests.length" @click="copySanitizedNetworkHar">
            <IconCheck v-if="networkHarCopied" aria-hidden="true" />
            <IconCopy v-else aria-hidden="true" />
            {{ networkHarCopied ? 'Copied' : 'Copy sanitized HAR' }}
          </button>
          <button
            type="button"
            class="primary"
            :title="networkHarExport?.path"
            :disabled="!filteredNetworkRequests.length || networkHarSaveState === 'saving'"
            @click="saveSanitizedNetworkHar"
          >
            <IconProgress v-if="networkHarSaveState === 'saving'" class="state-spinner" aria-hidden="true" />
            <IconDownloadDone v-else-if="networkHarSaveState === 'saved'" aria-hidden="true" />
            <IconDownload v-else aria-hidden="true" />
            {{ networkHarSaveState === 'saving' ? 'Saving…' : networkHarSaveState === 'saved' ? 'Saved' : 'Save sanitized HAR' }}
          </button>
        </div>
      </footer>
    </section>
    <section
      v-if="inspectorIssuesOpen"
      class="accessibility-panel inspector-issues-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="inspector-issues-title"
      :aria-busy="inspectorIssuesState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Chromium diagnostics</span>
          <h2 id="inspector-issues-title">Issues</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock browser issues" />
          <button class="panel-close" type="button" aria-label="Close browser issues" @click="inspectorIssuesOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="inspectorIssuesState === 'loading'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Checking browser-detected issues…</strong>
        <span>Cookie values and raw browser payloads stay protected.</span>
      </div>
      <div v-else-if="inspectorIssuesState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Issues could not be loaded</strong>
        <span>{{ inspectorIssuesError }}</span>
        <button type="button" @click="refreshInspectorIssues">Try again</button>
      </div>
      <template v-else-if="inspectorIssuesReport">
        <div class="inspector-issues-summary">
          <article class="error"><strong>{{ inspectorIssuesReport.errorCount }}</strong><span>page errors</span></article>
          <article class="warning"><strong>{{ inspectorIssuesReport.warningCount }}</strong><span>warnings</span></article>
          <article><strong>{{ inspectorIssuesReport.infoCount }}</strong><span>improvements</span></article>
        </div>
        <div v-if="!inspectorIssuesReport.issues.length" class="accessibility-audit-empty inspector-issues-empty">
          <IconCheck aria-hidden="true" />
          <strong>No browser issues captured</strong>
          <span>Reload and reproduce the problem to include diagnostics emitted during page startup.</span>
        </div>
        <div v-else class="inspector-issues-list">
          <article v-for="issue in inspectorIssuesReport.issues" :key="issue.id" class="inspector-issue" :class="issue.severity">
            <header>
              <span class="inspector-issue-icon" aria-hidden="true"><IconError v-if="issue.severity === 'error'" /><IconWarning v-else-if="issue.severity === 'warning'" /><IconInfo v-else /></span>
              <span><strong>{{ issue.title }}</strong><small>{{ issue.code }}</small></span>
            </header>
            <ul v-if="issue.reasons.length" class="inspector-issue-reasons">
              <li v-for="reason in issue.reasons" :key="reason"><code>{{ reason }}</code></li>
            </ul>
            <div v-if="issue.affectedUrls.length" class="inspector-issue-urls">
              <span>Affected resources</span>
              <code v-for="url in issue.affectedUrls" :key="url">{{ url }}</code>
            </div>
            <small v-if="issue.source" class="inspector-issue-source">{{ issue.source.url }}<template v-if="issue.source.lineNumber">:{{ issue.source.lineNumber }}<template v-if="issue.source.columnNumber">:{{ issue.source.columnNumber }}</template></template></small>
          </article>
          <p v-if="inspectorIssuesReport.truncated" class="inspector-issues-truncated"><IconInfo aria-hidden="true" /> Showing the newest 200 issues.</p>
          <details class="debug-report-caveats">
            <summary>Sharing and scope</summary>
            <ul><li v-for="caveat in inspectorIssuesReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <span>{{ inspectorIssuesReport.issueCount }} {{ inspectorIssuesReport.issueCount === 1 ? 'issue' : 'issues' }} · review before sharing</span>
          <div class="debug-report-actions">
            <button type="button" @click="clearInspectorIssues"><IconDelete aria-hidden="true" /> Clear</button>
            <button type="button" @click="refreshInspectorIssues"><IconRefresh aria-hidden="true" /> Refresh</button>
            <button type="button" class="primary" :disabled="!inspectorIssuesReport.issueCount" @click="copyInspectorIssues">
              <IconCheck v-if="inspectorIssuesCopied" aria-hidden="true" />
              <IconDownload v-else aria-hidden="true" />
              {{ inspectorIssuesCopied ? 'Copied' : 'Copy issues' }}
            </button>
          </div>
        </footer>
      </template>
    </section>
    <section
      v-if="debugReportPanelOpen"
      class="accessibility-panel debug-report-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="debug-report-panel-title"
      :aria-busy="debugReportState === 'running'"
    >
      <header>
        <div>
          <span class="eyebrow">Console &amp; network</span>
          <h2 id="debug-report-panel-title">Debug report</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock debug report" />
          <button class="panel-close" type="button" aria-label="Close debug report" @click="debugReportPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="debugReportState === 'running'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Collecting bounded debug evidence…</strong>
        <span>Request bodies and headers are not included in this report.</span>
      </div>
      <div v-else-if="debugReportState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Debug report could not finish</strong>
        <span>{{ debugReportError }}</span>
        <button type="button" @click="runDebugReport">Try again</button>
      </div>
      <template v-else-if="debugReport">
        <div class="debug-report-summary">
          <article class="error"><strong>{{ debugReport.summary.consoleErrors }}</strong><span>console errors</span></article>
          <article class="warning"><strong>{{ debugReport.summary.consoleWarnings }}</strong><span>warnings</span></article>
          <article class="error"><strong>{{ debugReport.summary.failedRequests }}</strong><span>failed requests</span></article>
          <article><strong>{{ debugReport.summary.networkRequests }}</strong><span>requests seen</span></article>
        </div>
        <div v-if="!debugReport.console.length && !debugReport.network.length" class="accessibility-audit-empty debug-report-empty">
          <IconCheck aria-hidden="true" />
          <strong>No console messages or failed requests captured</strong>
          <span>Reproduce the issue, then refresh this report. Successful-request totals still appear above.</span>
        </div>
        <div v-else class="debug-report-evidence">
          <section v-if="debugReport.console.length" aria-labelledby="debug-report-console-title">
            <h3 id="debug-report-console-title">Recent console <span>{{ debugReport.console.length }}</span></h3>
            <article v-for="(message, index) in debugReport.console" :key="`${message.timestamp}-${index}`" class="debug-console-entry" :class="message.level">
              <header>
                <span>{{ message.level }}</span>
                <time :datetime="message.timestamp">{{ debugTimestamp(message.timestamp) }}</time>
              </header>
              <code>{{ message.message }}</code>
              <small v-if="message.sourceId">{{ message.sourceId }}<template v-if="message.lineNumber">:{{ message.lineNumber }}</template></small>
            </article>
          </section>
          <section v-if="debugReport.network.length" aria-labelledby="debug-report-network-title">
            <h3 id="debug-report-network-title">Failed requests <span>{{ debugReport.network.length }}</span></h3>
            <article v-for="request in debugReport.network" :key="request.id" class="debug-network-entry">
              <header>
                <span class="method">{{ request.method }}</span>
                <strong>{{ debugRequestStatus(request) }}</strong>
                <time :datetime="request.startedAt">{{ debugTimestamp(request.startedAt) }}</time>
              </header>
              <code>{{ request.url }}</code>
              <small>{{ request.resourceType }}<template v-if="request.durationMs !== undefined"> · {{ request.durationMs }} ms</template><template v-if="request.responseSizeBytes !== undefined"> · {{ formatBytes(request.responseSizeBytes) }}</template></small>
            </article>
          </section>
          <details class="debug-report-caveats">
            <summary>Sharing and scope</summary>
            <ul><li v-for="caveat in debugReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <div class="debug-report-footer-context">
            <span>Generated {{ debugTimestamp(debugReport.generatedAt) }} · review before sharing</span>
            <label class="preserve-logs-toggle" title="Keep bounded Network and Console evidence when this tab loads another page">
              <input type="checkbox" :checked="activeTab?.preserveDiagnosticLogs" @change="updateDiagnosticLogPreservation" />
              Preserve logs across page loads
            </label>
          </div>
          <div class="debug-report-actions">
            <button type="button" @click="runDebugReport"><IconRefresh aria-hidden="true" /> Refresh</button>
            <button type="button" class="primary" @click="copyDebugReport">
              <IconCheck v-if="debugReportCopied" aria-hidden="true" />
              <IconBugReport v-else aria-hidden="true" />
              {{ debugReportCopied ? 'Copied' : 'Copy report' }}
            </button>
          </div>
        </footer>
      </template>
    </section>
    <section
      v-if="reproPanelOpen"
      class="accessibility-panel debug-report-panel repro-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="repro-panel-title"
      :aria-busy="reproState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Privacy-safe timeline</span>
          <h2 id="repro-panel-title">Repro recorder</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock repro recorder" />
          <button class="panel-close" type="button" aria-label="Close repro recorder" @click="reproPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="reproState === 'loading' && !reproRecording" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Loading reproduction steps…</strong>
      </div>
      <div v-else-if="reproState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Repro recorder needs attention</strong>
        <span>{{ reproError }}</span>
        <button type="button" @click="manageRepro('get')">Try again</button>
      </div>
      <template v-else-if="reproRecording">
        <div class="repro-safety" :class="{ recording: reproRecording.active }">
          <IconRecord aria-hidden="true" />
          <div>
            <strong>{{ reproRecording.active ? 'Recording accepted human actions' : reproRecording.stepCount ? 'Recording stopped' : 'Ready to record' }}</strong>
            <span>Typed values, clipboard contents, uploads, screenshots, and page HTML are never recorded.</span>
          </div>
        </div>
        <div v-if="!reproRecording.steps.length" class="accessibility-audit-empty debug-report-empty">
          <IconRecord aria-hidden="true" />
          <strong>Show the issue once</strong>
          <span>Start recording, reproduce the problem in this tab, then stop and copy a compact timeline into agent chat.</span>
          <button class="primary" type="button" :disabled="reproState === 'loading'" @click="startReproRecording"><IconRecord aria-hidden="true" /> Start recording</button>
        </div>
        <div v-else class="repro-timeline" aria-label="Recorded reproduction steps">
          <article v-for="step in reproRecording.steps" :key="step.index" class="repro-step" :class="step.kind">
            <span class="repro-step-index">{{ step.index }}</span>
            <div>
              <header><strong>{{ step.kind }}</strong><time>{{ formatReproElapsed(step.elapsedMs) }}</time></header>
              <p>{{ step.description }}</p>
              <code v-if="step.target">{{ step.target.selector }}</code>
              <small v-else-if="step.url">{{ step.url }}</small>
            </div>
          </article>
          <p v-if="reproRecording.truncated" class="inspector-issues-truncated"><IconInfo aria-hidden="true" /> Timeline reached its 200-step limit.</p>
          <details class="debug-report-caveats">
            <summary>Privacy and scope</summary>
            <ul><li v-for="caveat in reproRecording.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <span>{{ reproRecording.stepCount }} {{ reproRecording.stepCount === 1 ? 'step' : 'steps' }} · review before sharing</span>
          <div class="debug-report-actions">
            <button type="button" :disabled="reproState === 'loading' || !reproRecording.stepCount" @click="clearReproRecording"><IconDelete aria-hidden="true" /> Clear</button>
            <button v-if="reproRecording.active" class="primary" type="button" :disabled="reproState === 'loading'" @click="stopReproRecording"><IconStop aria-hidden="true" /> Stop</button>
            <button v-else-if="reproRecording.stepCount" type="button" :disabled="reproState === 'loading'" @click="startReproRecording"><IconRecord aria-hidden="true" /> Record again</button>
            <button v-if="reproRecording.stepCount && !reproRecording.active" type="button" @click="copyReproRecording">
              <IconCheck v-if="reproCopied" aria-hidden="true" />
              <IconBugReport v-else aria-hidden="true" />
              {{ reproCopied ? 'Copied' : 'Copy timeline' }}
            </button>
            <button v-if="reproRecording.stepCount && !reproRecording.active" class="primary" type="button" @click="copyReproPlaywright">
              <IconCheck v-if="reproPlaywrightCopied" aria-hidden="true" />
              <IconCode v-else aria-hidden="true" />
              {{ reproPlaywrightCopied ? 'Copied Playwright' : 'Copy Playwright' }}
            </button>
          </div>
        </footer>
      </template>
    </section>
    <section
      v-if="domChangesPanelOpen"
      class="accessibility-panel debug-report-panel repro-panel dom-changes-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="dom-changes-panel-title"
      :aria-busy="domChangesState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Structural evidence</span>
          <h2 id="dom-changes-panel-title">DOM changes</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock DOM changes" />
          <button class="panel-close" type="button" aria-label="Close DOM changes" @click="domChangesPanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="domChangesState === 'loading' && !domChangesReport" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Loading DOM changes…</strong>
      </div>
      <div v-else-if="domChangesState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>DOM changes need attention</strong>
        <span>{{ domChangesError }}</span>
        <button type="button" @click="manageDomChanges('get')">Try again</button>
      </div>
      <template v-else-if="domChangesReport">
        <div class="repro-safety" :class="{ recording: domChangesReport.active }">
          <IconAccountTree aria-hidden="true" />
          <div>
            <strong>{{ domChangesReport.active ? 'Recording structural page changes' : domChangesReport.startedAt ? 'Recording stopped' : 'Ready to record' }}</strong>
            <span>Text, HTML, attribute values, IDs, classes, and form values are never recorded.</span>
          </div>
        </div>
        <div v-if="!domChangesReport.startedAt" class="accessibility-audit-empty debug-report-empty">
          <IconAccountTree aria-hidden="true" />
          <strong>Reveal what an action changed</strong>
          <span>Start recording, interact with the live page, then stop and copy the bounded structural report into agent chat.</span>
          <button class="primary" type="button" :disabled="domChangesState === 'loading'" @click="manageDomChanges('start')"><IconRecord aria-hidden="true" /> Start recording</button>
        </div>
        <div v-else-if="!domChangesReport.entries.length" class="accessibility-audit-empty debug-report-empty">
          <IconAccountTree aria-hidden="true" />
          <strong>{{ domChangesReport.active ? 'Waiting for a page change' : 'No structural changes recorded' }}</strong>
          <span>{{ domChangesReport.active ? 'Use the website beside this panel; changes will appear here automatically.' : 'Record again and perform the interaction whose result is unclear.' }}</span>
        </div>
        <div v-else class="repro-timeline" aria-label="Recorded DOM changes">
          <article v-for="entry in domChangesReport.entries" :key="entry.index" class="repro-step" :class="entry.kind">
            <span class="repro-step-index">{{ entry.index }}</span>
            <div>
              <header><strong>{{ entry.kind }}</strong><time>{{ formatReproElapsed(entry.elapsedMs) }}</time></header>
              <p>{{ domChangeDescription(entry) }}</p>
              <code>{{ entry.target }}</code>
              <small v-if="entry.addedTags?.length">Added tags: {{ entry.addedTags.join(', ') }}</small>
              <small v-if="entry.removedTags?.length">Removed tags: {{ entry.removedTags.join(', ') }}</small>
            </div>
          </article>
          <p v-if="domChangesReport.truncated" class="inspector-issues-truncated"><IconInfo aria-hidden="true" /> The 200-entry limit was reached; {{ domChangesReport.droppedChanges }} later changes were counted but omitted.</p>
          <details class="debug-report-caveats">
            <summary>Privacy and scope</summary>
            <ul><li v-for="caveat in domChangesReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer>
          <span>{{ domChangesReport.changeCount }} {{ domChangesReport.changeCount === 1 ? 'mutation' : 'mutations' }} · {{ domChangesReport.entries.length }} grouped {{ domChangesReport.entries.length === 1 ? 'entry' : 'entries' }}</span>
          <div class="debug-report-actions">
            <button type="button" :disabled="domChangesState === 'loading' || !domChangesReport.startedAt" @click="manageDomChanges('clear')"><IconDelete aria-hidden="true" /> Clear</button>
            <button v-if="domChangesReport.active" class="primary" type="button" :disabled="domChangesState === 'loading'" @click="manageDomChanges('stop')"><IconStop aria-hidden="true" /> Stop</button>
            <button v-else-if="domChangesReport.startedAt" type="button" :disabled="domChangesState === 'loading'" @click="manageDomChanges('start')"><IconRecord aria-hidden="true" /> Record again</button>
            <button v-if="domChangesReport.entries.length && !domChangesReport.active" class="primary" type="button" @click="copyDomChanges">
              <IconCheck v-if="domChangesCopied" aria-hidden="true" />
              <IconAccountTree v-else aria-hidden="true" />
              {{ domChangesCopied ? 'Copied' : 'Copy report' }}
            </button>
          </div>
        </footer>
      </template>
    </section>
    <section
      v-if="visualComparePanelOpen"
      class="accessibility-panel debug-report-panel visual-compare-panel"
      data-shell-docked-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby="visual-compare-panel-title"
      :aria-busy="visualCompareState === 'loading'"
    >
      <header>
        <div>
          <span class="eyebrow">Before and after</span>
          <h2 id="visual-compare-panel-title">Visual compare</h2>
        </div>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock visual compare" />
          <button class="panel-close" type="button" aria-label="Close visual compare" @click="visualComparePanelOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="visualCompareState === 'loading'" class="accessibility-audit-loading" role="status">
        <IconProgress class="state-spinner" aria-hidden="true" />
        <strong>Capturing the visible page…</strong>
      </div>
      <div v-else-if="visualCompareState === 'error'" class="accessibility-audit-error" role="alert">
        <IconError aria-hidden="true" />
        <strong>Visual comparison needs attention</strong>
        <span>{{ visualCompareError }}</span>
        <button type="button" @click="manageVisualCompare('get')">Return to baseline</button>
      </div>
      <template v-else-if="visualCompareReport">
        <div v-if="visualCompareReport.status === 'empty'" class="accessibility-audit-empty debug-report-empty">
          <IconDifference aria-hidden="true" />
          <strong>Capture the page before a change</strong>
          <span>Bronom keeps one temporary viewport baseline for this tab. Make the change, then compare the current page.</span>
          <button class="primary" type="button" @click="manageVisualCompare('set-baseline')"><IconScreenshotRegion aria-hidden="true" /> Set baseline</button>
        </div>
        <div v-else class="visual-compare-content">
          <div class="visual-compare-summary" :class="{ identical: visualCompareReport.identical, changed: visualCompareReport.status === 'compared' && !visualCompareReport.identical }">
            <IconCheck v-if="visualCompareReport.status === 'compared' && visualCompareReport.identical" aria-hidden="true" />
            <IconDifference v-else aria-hidden="true" />
            <div>
              <strong v-if="visualCompareReport.status === 'baseline'">Baseline ready</strong>
              <strong v-else-if="visualCompareReport.identical">No changed pixels</strong>
              <strong v-else>{{ visualCompareReport.changedPercent }}% of pixels changed</strong>
              <span v-if="visualCompareReport.baseline">{{ visualCompareReport.baseline.width }}×{{ visualCompareReport.baseline.height }} · {{ debugTimestamp(visualCompareReport.baseline.capturedAt) }}</span>
            </div>
          </div>
          <img
            v-if="visualCompareReport.status === 'compared' && visualCompareReport.diffPngDataUrl"
            class="visual-compare-image"
            :src="visualCompareReport.diffPngDataUrl"
            alt="Visual difference: changed pixels are white and unchanged pixels are dimmed"
          />
          <dl v-if="visualCompareReport.status === 'compared'" class="visual-compare-metrics">
            <div><dt>Changed pixels</dt><dd>{{ visualCompareReport.changedPixels?.toLocaleString() }}</dd></div>
            <div><dt>Total pixels</dt><dd>{{ visualCompareReport.totalPixels?.toLocaleString() }}</dd></div>
            <div><dt>Threshold</dt><dd>{{ visualCompareReport.threshold }} / 255</dd></div>
            <div><dt>Changed area</dt><dd>{{ visualCompareReport.diffBounds ? `${visualCompareReport.diffBounds.x}, ${visualCompareReport.diffBounds.y} · ${visualCompareReport.diffBounds.width}×${visualCompareReport.diffBounds.height}` : 'None' }}</dd></div>
          </dl>
          <details class="debug-report-caveats">
            <summary>Accuracy and privacy</summary>
            <ul><li v-for="caveat in visualCompareReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
        </div>
        <footer v-if="visualCompareReport.status !== 'empty'">
          <span>Viewport-only · stored in memory</span>
          <div class="debug-report-actions">
            <button type="button" @click="manageVisualCompare('clear')"><IconDelete aria-hidden="true" /> Clear</button>
            <button type="button" @click="manageVisualCompare('set-baseline')"><IconScreenshotRegion aria-hidden="true" /> New baseline</button>
            <button class="primary" type="button" @click="manageVisualCompare('compare')"><IconDifference aria-hidden="true" /> Compare now</button>
            <button v-if="visualCompareReport.status === 'compared'" type="button" @click="copyVisualDiff">
              <IconCheck v-if="visualCompareCopied" aria-hidden="true" />
              <IconDifference v-else aria-hidden="true" />
              {{ visualCompareCopied ? 'Copied' : 'Copy diff PNG' }}
            </button>
          </div>
        </footer>
      </template>
    </section>
    <section v-if="tabSearchOpen" class="tab-search-panel" data-shell-side-panel role="dialog" aria-modal="false" aria-labelledby="tab-search-title">
      <header>
        <div>
          <span class="eyebrow">Browser workspace</span>
          <h2 id="tab-search-title">Tabs</h2>
        </div>
        <span class="tab-search-count">{{ regularTabs.length }} open<template v-if="state.savedTabGroups.length"> · {{ state.savedTabGroups.length }} saved</template><template v-if="state.closedTabs.length"> · {{ state.closedTabs.length }} closed</template></span>
        <button class="panel-close" type="button" aria-label="Close tab search" @click="tabSearchOpen = false"><IconClose aria-hidden="true" /></button>
      </header>
      <div v-if="regularTabs.length || state.closedTabs.length || state.savedTabGroups.length" class="tab-search-field">
        <IconSearch aria-hidden="true" />
        <input
          ref="tabSearchInput"
          v-model="tabSearchQuery"
          type="search"
          aria-label="Search tabs"
          aria-controls="tab-search-results"
          aria-describedby="tab-search-status"
          autocomplete="off"
          spellcheck="false"
          placeholder="Search titles and addresses"
          @keydown="handleTabSearchKeydown"
        />
        <kbd>⌃/⌘ ⇧ A</kbd>
      </div>
      <span id="tab-search-status" class="sr-only" role="status" aria-live="polite">
        {{ tabSearchResults.length }} matching {{ tabSearchResults.length === 1 ? 'item' : 'items' }}.<template v-if="selectedTabSearchResult"> Selected {{ tabSearchResultLabel(selectedTabSearchResult) }}.</template>
      </span>
      <div v-if="!regularTabs.length && !state.closedTabs.length && !state.savedTabGroups.length" class="tab-search-empty">
        <IconTabSearch aria-hidden="true" />
        <strong>No website tabs open</strong>
        <span>Home stays available as application navigation.</span>
        <button type="button" @click="runBrowserShortcut('new-tab')">Open a new tab</button>
      </div>
      <div v-else-if="!tabSearchResults.length" class="tab-search-empty compact">
        <IconSearch aria-hidden="true" />
        <strong>No matching tabs</strong>
        <span>Try another title or address.</span>
      </div>
      <div v-else id="tab-search-results" class="tab-search-list">
        <section v-if="filteredSavedTabGroups.length" class="tab-search-section saved-groups" aria-labelledby="saved-groups-title">
          <h3 id="saved-groups-title">Archived workspaces <span>{{ filteredSavedTabGroups.length }}</span></h3>
          <div role="list" aria-label="Archived workspaces">
            <article
              v-for="group in filteredSavedTabGroups"
              :id="`tab-search-saved-${group.id}`"
              :key="group.id"
              class="tab-search-item saved-group"
              :class="{ selected: tabSearchResultIndex('saved', group.id) === tabSearchSelection }"
              role="listitem"
              @mouseenter="tabSearchSelection = tabSearchResultIndex('saved', group.id)"
            >
              <button class="tab-search-open" type="button" :title="group.tabs.map((tab) => tab.url).join('\n')" @click="restoreSavedTabGroup(group)">
                <span class="tab-search-site-icon saved" :style="tabGroupColorStyle(group.color)" aria-hidden="true"><IconFolderOpen /></span>
                <span class="tab-search-copy">
                  <strong>{{ group.name }}</strong>
                  <span>{{ group.tabs.length }} saved {{ group.tabs.length === 1 ? 'tab' : 'tabs' }}</span>
                  <small>{{ group.tabs.slice(0, 3).map((tab) => tab.title || tab.url).join(' · ') }}</small>
                </span>
              </button>
              <button class="tab-search-restore" type="button" :aria-label="`Restore archived workspace ${group.name}`" title="Restore workspace" @click="restoreSavedTabGroup(group)"><IconRestore aria-hidden="true" /></button>
              <button class="tab-search-close" type="button" :aria-label="`Delete archived workspace ${group.name}`" title="Delete archived workspace" @click="deleteSavedTabGroup($event, group)"><IconDelete aria-hidden="true" /></button>
            </article>
          </div>
        </section>
        <section v-if="filteredTabs.length" class="tab-search-section" aria-labelledby="open-tabs-title">
          <h3 id="open-tabs-title">Open tabs <span>{{ filteredTabs.length }}</span></h3>
          <div role="list" aria-label="Open tabs">
            <article
              v-for="tab in filteredTabs"
              :id="`tab-search-open-${tab.id}`"
              :key="tab.id"
              class="tab-search-item"
              :class="{ selected: tabSearchResultIndex('open', tab.id) === tabSearchSelection, active: tab.active }"
              role="listitem"
              @mouseenter="tabSearchSelection = tabSearchResultIndex('open', tab.id)"
            >
              <button class="tab-search-open" type="button" :title="tab.url" @click="selectSearchTab(tab)">
                <span class="tab-search-site-icon" aria-hidden="true">
                  <span v-if="tab.loading" class="spinner" />
                  <img v-else-if="tab.faviconDataUrl" :src="tab.faviconDataUrl" alt="" draggable="false" />
                  <span v-else-if="tab.url === 'about:blank'">✦</span>
                  <IconLanguage v-else />
                </span>
                <span class="tab-search-copy">
                  <strong>{{ tab.title || 'New tab' }}</strong>
                  <span>{{ tab.url === 'about:blank' ? 'Blank page' : tab.url }}</span>
                  <small v-if="tabSearchMeta(tab)">{{ tabSearchMeta(tab) }}</small>
                </span>
              </button>
              <button
                class="tab-search-pin"
                :class="{ active: tab.pinned }"
                type="button"
                :aria-label="`${tab.pinned ? 'Unpin' : 'Pin'} ${tab.title || 'New tab'}`"
                :title="tab.pinned ? 'Unpin tab' : 'Pin tab'"
                :aria-pressed="tab.pinned"
                @click="togglePinnedSearchTab($event, tab)"
              ><IconKeep aria-hidden="true" /></button>
              <button class="tab-search-close" type="button" :aria-label="`Close ${tab.title || 'New tab'}`" title="Close tab" @click="closeSearchTab($event, tab.id)"><IconClose aria-hidden="true" /></button>
            </article>
          </div>
        </section>
        <section v-if="filteredClosedTabs.length" class="tab-search-section recently-closed" aria-labelledby="closed-tabs-title">
          <h3 id="closed-tabs-title">Recently closed <span>{{ filteredClosedTabs.length }}</span></h3>
          <div role="list" aria-label="Recently closed tabs">
            <article
              v-for="tab in filteredClosedTabs"
              :id="`tab-search-closed-${tab.id}`"
              :key="tab.id"
              class="tab-search-item closed"
              :class="{ selected: tabSearchResultIndex('closed', tab.id) === tabSearchSelection }"
              role="listitem"
              @mouseenter="tabSearchSelection = tabSearchResultIndex('closed', tab.id)"
            >
              <button class="tab-search-open" type="button" :title="tab.url" @click="restoreSearchTab(tab)">
                <span class="tab-search-site-icon closed" aria-hidden="true"><IconHistory /></span>
                <span class="tab-search-copy">
                  <strong>{{ tab.title || 'New tab' }}</strong>
                  <span>{{ tab.url === 'about:blank' ? 'Blank page' : tab.url }}</span>
                  <small>{{ closedTabMeta(tab) }}</small>
                </span>
              </button>
              <button class="tab-search-restore" type="button" :aria-label="`Restore ${tab.title || 'New tab'}`" title="Restore tab" @click="restoreSearchTab(tab)"><IconRestore aria-hidden="true" /></button>
            </article>
          </div>
        </section>
      </div>
      <footer v-if="tabSearchResults.length"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Enter</kbd> Open</span><span><kbd>Esc</kbd> Close</span></footer>
    </section>
    <div v-if="findOpen" class="find-bar" role="search" aria-label="Find in page">
      <div class="find-field">
        <IconSearch aria-hidden="true" />
        <input
          ref="findInput"
          v-model="findQuery"
          type="search"
          aria-label="Find text"
          autocomplete="off"
          spellcheck="false"
          placeholder="Find in page"
          @input="searchInPage(true, true)"
          @keydown.enter.prevent="searchInPage(!$event.shiftKey, false)"
        />
      </div>
      <output class="find-count" aria-live="polite">
        {{ findQuery ? `${findResult.activeMatchOrdinal} / ${findResult.matches}` : '0 / 0' }}
      </output>
      <button
        class="find-action"
        type="button"
        title="Previous match (Shift+Enter)"
        aria-label="Previous match"
        :disabled="!findQuery || !findResult.matches"
        @click="searchInPage(false, false)"
      >
        <IconKeyboardArrowUp aria-hidden="true" />
      </button>
      <button
        class="find-action"
        type="button"
        title="Next match (Enter)"
        aria-label="Next match"
        :disabled="!findQuery || !findResult.matches"
        @click="searchInPage(true, false)"
      >
        <IconKeyboardArrowDown aria-hidden="true" />
      </button>
      <button class="find-action" type="button" title="Close (Escape)" aria-label="Close find in page" @click="closeFind"><IconClose aria-hidden="true" /></button>
    </div>
    <div v-if="zoomOpen" class="zoom-bar" role="group" aria-label="Page zoom controls">
      <span>Page zoom</span>
      <button type="button" title="Zoom out (Ctrl/Cmd+-)" aria-label="Zoom out" :disabled="(activeTab?.zoomPercent ?? 100) <= 50" @click="setActiveZoom('out')"><IconRemove aria-hidden="true" /></button>
      <output aria-live="polite">{{ activeTab?.zoomPercent ?? 100 }}%</output>
      <button type="button" title="Zoom in (Ctrl/Cmd++)" aria-label="Zoom in" :disabled="(activeTab?.zoomPercent ?? 100) >= 300" @click="setActiveZoom('in')"><IconZoomIn aria-hidden="true" /></button>
      <button class="zoom-reset" type="button" :disabled="(activeTab?.zoomPercent ?? 100) === 100" @click="setActiveZoom('reset')">Reset</button>
      <button type="button" title="Close (Escape)" aria-label="Close page zoom controls" @click="zoomOpen = false"><IconClose aria-hidden="true" /></button>
    </div>
    <section v-if="downloadsOpen" class="downloads-panel" data-shell-side-panel role="dialog" aria-modal="false" aria-labelledby="downloads-title">
      <header>
        <div>
          <span class="eyebrow">Browser files</span>
          <h2 id="downloads-title">Downloads</h2>
        </div>
        <div class="downloads-header-actions">
          <button type="button" :disabled="!finishedDownloads.length" @click="clearFinishedDownloads">Clear finished</button>
          <button class="panel-close" type="button" aria-label="Close downloads" @click="downloadsOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="!downloads.length" class="downloads-empty">
        <IconDownload aria-hidden="true" />
        <strong>No downloads yet</strong>
        <span>Files you download will appear here.</span>
      </div>
      <div v-else class="downloads-list">
        <article v-for="download in downloads" :key="download.id" class="download-item" :class="download.state">
          <span class="download-state-icon" aria-hidden="true">
            <IconProgress v-if="download.state === 'progressing'" class="state-spinner" />
            <IconDownloadDone v-else-if="download.state === 'completed'" />
            <IconWarning v-else />
          </span>
          <div class="download-copy">
            <strong :title="download.filename">{{ download.filename }}</strong>
            <span>{{ downloadMeta(download) }}</span>
            <div v-if="download.state === 'progressing'" class="download-progress" role="progressbar" :aria-label="`Downloading ${download.filename}`" :aria-valuenow="download.totalBytes > 0 ? downloadProgress(download) : undefined" aria-valuemin="0" aria-valuemax="100">
              <span :class="{ indeterminate: download.totalBytes <= 0 }" :style="download.totalBytes > 0 ? { width: `${downloadProgress(download)}%` } : undefined" />
            </div>
          </div>
          <button v-if="download.state === 'progressing'" class="download-action" type="button" :aria-label="`Cancel ${download.filename}`" title="Cancel download" @click="cancelDownload(download.id)"><IconClose aria-hidden="true" /></button>
          <button v-else-if="download.state === 'completed'" class="download-action" type="button" :aria-label="`Show ${download.filename} in folder`" title="Show in folder" @click="showDownloadInFolder(download.id)"><IconFolderOpen aria-hidden="true" /></button>
        </article>
      </div>
      <p v-if="downloadActionError" class="downloads-error" role="alert">{{ downloadActionError }}</p>
    </section>
    <section v-if="bookmarksOpen" class="bookmarks-panel" data-shell-docked-panel role="dialog" aria-modal="false" aria-labelledby="bookmarks-title">
      <header>
        <div>
          <span class="eyebrow">Saved locally</span>
          <h2 id="bookmarks-title">Bookmarks</h2>
        </div>
        <div class="bookmarks-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock bookmarks" />
          <button
            type="button"
            :disabled="!activeWebUrl"
            @click="toggleCurrentBookmark"
          >{{ currentBookmark ? 'Remove current' : 'Add current' }}</button>
          <button class="panel-close" type="button" aria-label="Close bookmarks" @click="bookmarksOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="bookmarks.length" class="bookmark-search-field">
        <IconSearch aria-hidden="true" />
        <input v-model="bookmarkSearch" type="search" aria-label="Search bookmarks" autocomplete="off" spellcheck="false" placeholder="Search bookmarks" />
      </div>
      <div v-if="!bookmarks.length" class="bookmarks-empty">
        <IconStarOutline aria-hidden="true" />
        <strong>No bookmarks yet</strong>
        <span>Save the current website with Ctrl/Cmd+D.</span>
      </div>
      <div v-else-if="!filteredBookmarks.length" class="bookmarks-empty compact">
        <IconSearch aria-hidden="true" />
        <strong>No matching bookmarks</strong>
        <span>Try another title or address.</span>
      </div>
      <div v-else class="bookmarks-list">
        <article v-for="bookmark in filteredBookmarks" :key="bookmark.id" class="bookmark-item" :class="{ current: bookmark.id === currentBookmark?.id }">
          <button class="bookmark-open" type="button" :title="bookmark.url" @click="openBookmark(bookmark)">
            <span class="bookmark-site-icon" aria-hidden="true"><IconLanguage /></span>
            <span class="bookmark-copy">
              <input
                v-if="editingBookmarkId === bookmark.id"
                v-model="editingBookmarkTitle"
                :aria-label="`Rename ${bookmark.title}`"
                maxlength="200"
                @click.stop
                @keydown.enter.prevent="commitBookmarkRename(bookmark.id)"
                @keydown.escape.prevent="cancelRenameBookmark"
              />
              <strong v-else>{{ bookmark.title }}</strong>
              <span>{{ bookmark.url }}</span>
            </span>
          </button>
          <button v-if="editingBookmarkId === bookmark.id" class="bookmark-action confirm" type="button" :aria-label="`Save name for ${bookmark.title}`" title="Save name" @click="commitBookmarkRename(bookmark.id)"><IconCheck aria-hidden="true" /></button>
          <button v-else class="bookmark-action" type="button" :aria-label="`Rename ${bookmark.title}`" title="Rename bookmark" @click="beginRenameBookmark(bookmark)"><IconEdit aria-hidden="true" /></button>
          <button class="bookmark-action danger" type="button" :aria-label="`Remove ${bookmark.title}`" title="Remove bookmark" @click="removeBookmark(bookmark.id)"><IconDelete aria-hidden="true" /></button>
        </article>
      </div>
      <p v-if="bookmarkError" class="bookmarks-error" role="alert">{{ bookmarkError }}</p>
    </section>
    <section v-if="historyOpen" class="history-panel" data-shell-side-panel role="dialog" aria-modal="false" aria-labelledby="history-title">
      <header>
        <div>
          <span class="eyebrow">Saved locally</span>
          <h2 id="history-title">Browsing history</h2>
        </div>
        <div class="history-header-actions">
          <button type="button" :disabled="!visitHistory.length" @click="clearVisitHistory">Clear all</button>
          <button class="panel-close" type="button" aria-label="Close browsing history" @click="historyOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div v-if="visitHistory.length" class="history-search-field">
        <IconSearch aria-hidden="true" />
        <input v-model="historySearch" type="search" aria-label="Search browsing history" autocomplete="off" spellcheck="false" placeholder="Search history" />
      </div>
      <div v-if="!visitHistory.length" class="history-empty">
        <IconHistory aria-hidden="true" />
        <strong>No browsing history yet</strong>
        <span>Websites you visit will appear here for up to 90 days.</span>
      </div>
      <div v-else-if="!filteredVisitHistory.length" class="history-empty compact">
        <IconSearch aria-hidden="true" />
        <strong>No matching visits</strong>
        <span>Try another title or address.</span>
      </div>
      <div v-else class="history-list">
        <article v-for="entry in filteredVisitHistory" :key="entry.id" class="history-item">
          <button class="history-open" type="button" :title="entry.url" @click="openHistoryEntry(entry)">
            <span class="history-site-icon" aria-hidden="true"><IconLanguage /></span>
            <span class="history-copy">
              <strong>{{ entry.title }}</strong>
              <span>{{ entry.url }}</span>
              <small>{{ historyEntryMeta(entry) }}</small>
            </span>
          </button>
          <button class="history-action danger" type="button" :aria-label="`Remove ${entry.title} from history`" title="Remove from history" @click="removeHistoryEntry(entry.id)"><IconDelete aria-hidden="true" /></button>
        </article>
      </div>
      <p class="history-retention"><IconPrivacy aria-hidden="true" /> Stored only on this device for up to 90 days.</p>
      <p v-if="historyError" class="history-error" role="alert">{{ historyError }}</p>
    </section>
    <section v-if="siteStorageOpen" class="site-storage-panel" data-shell-docked-panel role="dialog" aria-modal="false" aria-labelledby="site-storage-title">
      <header>
        <div>
          <span class="eyebrow">Current website</span>
          <h2 id="site-storage-title">Site storage · {{ activeHostname }}</h2>
        </div>
        <div class="site-storage-header-actions">
          <PanelDockPicker v-model="panelDock" label="Dock site storage" />
          <button type="button" :disabled="siteStorageUsageOpen ? siteStorageUsageState === 'loading' : siteStoragePwaOpen ? siteStoragePwaState === 'loading' : siteStorageIndexedDbOpen ? siteStorageIndexedDbState === 'loading' : siteStorageChangesOpen ? siteStorageChangesState === 'loading' : siteStorageState === 'loading'" @click="refreshActiveSiteStorageView"><IconRefresh aria-hidden="true" /> Refresh</button>
          <button class="panel-close" type="button" aria-label="Close site storage" @click="siteStorageOpen = false"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <nav class="site-storage-kinds" aria-label="Storage type">
        <button type="button" :class="{ active: siteStorageUsageOpen }" :aria-pressed="siteStorageUsageOpen" @click="selectSiteStorageUsage"><IconPieChart aria-hidden="true" /> Overview</button>
        <button type="button" :class="{ active: !siteStorageUsageOpen && !siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen && siteStorageKind === 'local-storage' }" :aria-pressed="!siteStorageUsageOpen && !siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen && siteStorageKind === 'local-storage'" @click="selectSiteStorageKind('local-storage')"><IconDatabase aria-hidden="true" /> Local</button>
        <button type="button" :class="{ active: !siteStorageUsageOpen && !siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen && siteStorageKind === 'session-storage' }" :aria-pressed="!siteStorageUsageOpen && !siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen && siteStorageKind === 'session-storage'" @click="selectSiteStorageKind('session-storage')"><IconDatabase aria-hidden="true" /> Session</button>
        <button type="button" :class="{ active: !siteStorageUsageOpen && !siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen && siteStorageKind === 'cookies' }" :aria-pressed="!siteStorageUsageOpen && !siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen && siteStorageKind === 'cookies'" @click="selectSiteStorageKind('cookies')"><IconCookie aria-hidden="true" /> Cookies</button>
        <button type="button" :class="{ active: siteStorageIndexedDbOpen }" :aria-pressed="siteStorageIndexedDbOpen" @click="selectSiteStorageIndexedDb"><IconDatabase aria-hidden="true" /> IndexedDB</button>
        <button type="button" :class="{ active: siteStoragePwaOpen }" :aria-pressed="siteStoragePwaOpen" @click="selectSiteStoragePwa"><IconOffline aria-hidden="true" /> Offline</button>
        <button type="button" :class="{ active: siteStorageChangesOpen }" :aria-pressed="siteStorageChangesOpen" @click="selectSiteStorageChanges"><IconDifference aria-hidden="true" /> Changes</button>
      </nav>
      <section v-if="siteStorageUsageOpen" class="storage-usage-view" :aria-busy="siteStorageUsageState === 'loading'">
        <div v-if="siteStorageUsageState === 'loading' && !siteStorageUsageReport" class="site-storage-empty">
          <IconProgress class="state-spinner" aria-hidden="true" /><strong>Measuring storage usage…</strong>
        </div>
        <div v-else-if="siteStorageUsageState === 'error'" class="storage-changes-error" role="alert">
          <IconError aria-hidden="true" /><strong>Storage overview needs attention</strong><span>{{ siteStorageUsageError }}</span>
        </div>
        <template v-else-if="siteStorageUsageReport">
          <div class="storage-usage-summary">
            <article><span>Used</span><strong>{{ formatBytes(siteStorageUsageReport.usage) }}</strong></article>
            <article><span>Available</span><strong>{{ formatBytes(siteStorageUsageReport.available) }}</strong></article>
            <article><span>Quota</span><strong>{{ formatBytes(siteStorageUsageReport.quota) }}</strong></article>
          </div>
          <div class="storage-usage-meter" :aria-label="`${formatStorageUsagePercent(siteStorageUsageReport.usagePercent)} of origin quota used`">
            <div><span :style="{ width: `${siteStorageUsageReport.usage > 0 ? Math.max(0.5, siteStorageUsageReport.usagePercent) : 0}%` }"></span></div>
            <strong>{{ formatStorageUsagePercent(siteStorageUsageReport.usagePercent) }} used</strong>
          </div>
          <div class="storage-usage-toolbar">
            <span :class="{ fallback: siteStorageUsageReport.source === 'storage-manager' }">{{ siteStorageUsageReport.source === 'chromium-quota' ? 'Chromium quota detail' : 'Storage Manager estimate' }}</span>
            <span v-if="siteStorageUsageReport.overrideActive" class="storage-usage-override">Quota override active</span>
            <button type="button" @click="copySiteStorageUsage"><IconCheck v-if="siteStorageUsageCopied" aria-hidden="true" /><IconCopy v-else aria-hidden="true" /> {{ siteStorageUsageCopied ? 'Copied' : 'Copy report' }}</button>
          </div>
          <div v-if="siteStorageUsageReport.breakdown.length" class="storage-usage-breakdown">
            <article v-for="item in siteStorageUsageReport.breakdown" :key="item.storageType">
              <header><strong>{{ storageUsageTypeLabel(item.storageType) }}</strong><span>{{ formatBytes(item.usage) }}</span></header>
              <div><span :style="{ width: `${storageUsageShare(item.usage)}%` }"></span></div>
            </article>
          </div>
          <div v-else class="site-storage-empty compact"><IconPieChart aria-hidden="true" /><strong>No category breakdown available</strong><span>The total estimate is still available above.</span></div>
          <details class="storage-changes-caveats storage-usage-caveats"><summary>Scope and privacy</summary><ul><li v-for="caveat in siteStorageUsageReport.caveats" :key="caveat">{{ caveat }}</li></ul></details>
          <footer class="storage-usage-footer"><span>{{ siteStorageUsageReport.origin }}</span><span>Read-only aggregate metadata</span></footer>
        </template>
      </section>
      <template v-else-if="!siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen">
        <div class="site-storage-tools">
          <label class="site-storage-search"><IconSearch aria-hidden="true" /><input v-model="siteStorageSearch" type="search" aria-label="Filter site storage" placeholder="Filter keys or values" autocomplete="off" /></label>
          <button class="site-storage-clear" type="button" :disabled="!siteStorageResult?.itemCount || siteStorageState === 'saving'" @click="clearSiteStorageKind"><IconDelete aria-hidden="true" /> Clear {{ siteStorageKindLabel.toLocaleLowerCase() }}</button>
        </div>
        <form class="site-storage-editor" @submit.prevent="saveSiteStorageItem">
          <input v-model="siteStorageKey" type="text" aria-label="Storage key" maxlength="512" placeholder="Key" autocomplete="off" spellcheck="false" />
          <textarea v-model="siteStorageValue" aria-label="Storage value" maxlength="262144" rows="2" placeholder="Value" spellcheck="false" />
          <button type="submit" :disabled="!siteStorageKey.trim() || siteStorageState === 'saving'">{{ siteStorageResult?.items.some((item) => item.key === siteStorageKey) ? 'Update' : 'Add' }}</button>
        </form>
        <div class="site-storage-list" :aria-busy="siteStorageState === 'loading'">
          <div v-if="siteStorageState === 'loading'" class="site-storage-empty"><IconProgress class="state-spinner" aria-hidden="true" /><strong>Reading site storage…</strong></div>
          <div v-else-if="!siteStorageResult?.itemCount" class="site-storage-empty"><IconDatabase aria-hidden="true" /><strong>No {{ siteStorageKindLabel.toLocaleLowerCase() }}</strong><span>This website has not stored anything in this category.</span></div>
          <div v-else-if="!filteredSiteStorageItems.length" class="site-storage-empty compact"><IconSearch aria-hidden="true" /><strong>No matching entries</strong></div>
          <template v-else>
            <article v-for="(item, index) in filteredSiteStorageItems" :key="`${item.key}-${item.domain ?? ''}-${item.path ?? ''}-${index}`" class="site-storage-item" :class="{ protected: item.protected }">
              <button class="site-storage-item-main" type="button" :disabled="item.protected" :title="item.protected ? 'HttpOnly cookie value is protected' : 'Edit this entry'" @click="editSiteStorageItem(item)">
                <strong>{{ item.key }}</strong>
                <code>{{ item.protected ? 'HttpOnly value protected' : (item.value || '(empty)') }}</code>
                <small>{{ formatBytes(item.valueBytes) }}<template v-if="item.domain"> · {{ item.domain }}{{ item.path }}</template><template v-if="item.valueTruncated"> · preview truncated</template></small>
              </button>
              <button class="site-storage-item-delete" type="button" :disabled="item.protected" :aria-label="item.protected ? `${item.key} is HttpOnly and protected` : `Delete ${item.key}`" :title="item.protected ? 'HttpOnly cookie is protected' : 'Delete entry'" @click="deleteSiteStorageItem(item)"><IconLock v-if="item.protected" aria-hidden="true" /><IconDelete v-else aria-hidden="true" /></button>
            </article>
          </template>
        </div>
        <footer>
          <span>{{ siteStorageResult?.itemCount ?? 0 }} {{ (siteStorageResult?.itemCount ?? 0) === 1 ? 'entry' : 'entries' }}</span>
          <span>{{ siteStorageKind === 'session-storage' ? 'This tab only' : 'Shared by origin in this workspace' }}</span>
        </footer>
      </template>
      <section v-else-if="siteStorageIndexedDbOpen" class="indexeddb-view" :aria-busy="siteStorageIndexedDbState === 'loading'">
        <div v-if="siteStorageIndexedDbState === 'loading' && !siteStorageIndexedDbReport" class="site-storage-empty">
          <IconProgress class="state-spinner" aria-hidden="true" /><strong>Reading IndexedDB…</strong>
        </div>
        <div v-else-if="siteStorageIndexedDbState === 'error'" class="storage-changes-error" role="alert">
          <IconError aria-hidden="true" /><strong>IndexedDB inspection needs attention</strong><span>{{ siteStorageIndexedDbError }}</span>
        </div>
        <div v-else-if="!siteStorageIndexedDbReport?.databases.length" class="site-storage-empty indexeddb-empty">
          <IconDatabase aria-hidden="true" /><strong>No IndexedDB databases</strong><span>This website has not created a database for its top-level origin.</span>
        </div>
        <template v-else-if="siteStorageIndexedDbReport">
          <div class="indexeddb-selectors">
            <label>
              <span>Database</span>
              <select v-model="siteStorageIndexedDbDatabase" aria-label="IndexedDB database" @change="selectSiteStorageIndexedDbDatabase">
                <option v-for="database in siteStorageIndexedDbReport.databases" :key="database.name" :value="database.name">{{ database.name }} · v{{ database.version }}</option>
              </select>
            </label>
            <label>
              <span>Object store</span>
              <select v-model="siteStorageIndexedDbStore" aria-label="IndexedDB object store" :disabled="!siteStorageIndexedDbReport.selectedDatabase?.objectStores?.length" @change="selectSiteStorageIndexedDbStore">
                <option v-for="store in siteStorageIndexedDbReport.selectedDatabase?.objectStores ?? []" :key="store.name" :value="store.name">{{ store.name }} · {{ store.entryCount }} {{ store.entryCount === 1 ? 'record' : 'records' }}</option>
              </select>
            </label>
          </div>
          <div v-if="siteStorageIndexedDbStore" class="indexeddb-tools">
            <label class="site-storage-search"><IconSearch aria-hidden="true" /><input v-model="siteStorageIndexedDbSearch" type="search" aria-label="Filter IndexedDB records" placeholder="Filter loaded keys or values" autocomplete="off" /></label>
            <button type="button" :disabled="!siteStorageIndexedDbReport.entries.length" @click="copySiteStorageIndexedDb"><IconCheck v-if="siteStorageIndexedDbCopied" aria-hidden="true" /><IconCopy v-else aria-hidden="true" /> {{ siteStorageIndexedDbCopied ? 'Copied' : 'Copy loaded' }}</button>
          </div>
          <div v-if="siteStorageIndexedDbStore" class="indexeddb-schema">
            <span>Key path <code>{{ JSON.stringify(siteStorageIndexedDbReport.selectedDatabase?.objectStores?.find((store) => store.name === siteStorageIndexedDbStore)?.keyPath ?? null) }}</code></span>
            <span>{{ siteStorageIndexedDbReport.selectedDatabase?.objectStores?.find((store) => store.name === siteStorageIndexedDbStore)?.autoIncrement ? 'Auto increment' : 'Manual keys' }}</span>
            <span>{{ siteStorageIndexedDbReport.selectedDatabase?.objectStores?.find((store) => store.name === siteStorageIndexedDbStore)?.indexes.length ?? 0 }} indexes</span>
          </div>
          <div v-if="!siteStorageIndexedDbStore" class="site-storage-empty compact"><IconDatabase aria-hidden="true" /><strong>No object stores</strong></div>
          <div v-else-if="!siteStorageIndexedDbReport.entries.length" class="site-storage-empty compact"><IconDatabase aria-hidden="true" /><strong>No records in this object store</strong></div>
          <div v-else-if="!filteredSiteStorageIndexedDbEntries.length" class="site-storage-empty compact"><IconSearch aria-hidden="true" /><strong>No matching loaded records</strong></div>
          <div v-else class="indexeddb-records">
            <article v-for="(entry, index) in filteredSiteStorageIndexedDbEntries" :key="`${entry.primaryKey}-${index}`" class="indexeddb-record">
              <header><strong>{{ entry.key }}</strong><span>{{ entry.valueType }}</span></header>
              <code>{{ entry.valuePreview ?? 'Value omitted' }}</code>
              <small>Primary key {{ entry.primaryKey }}<template v-if="entry.valuePreviewBytes !== undefined"> · {{ formatBytes(entry.valuePreviewBytes) }} preview</template><template v-if="entry.valueTruncated"> · truncated</template></small>
            </article>
          </div>
          <details class="storage-changes-caveats indexeddb-caveats">
            <summary>Schema, indexes, and privacy</summary>
            <div v-for="store in siteStorageIndexedDbReport.selectedDatabase?.objectStores ?? []" :key="store.name" class="indexeddb-store-schema">
              <strong>{{ store.name }}</strong>
              <span v-if="store.indexes.length">{{ store.indexes.map((index) => `${index.name}${index.unique ? ' (unique)' : ''}`).join(', ') }}</span>
              <span v-else>No indexes</span>
            </div>
            <ul><li v-for="caveat in siteStorageIndexedDbReport.caveats" :key="caveat">{{ caveat }}</li></ul>
          </details>
          <footer class="indexeddb-footer">
            <span>Records {{ siteStorageIndexedDbOffset + (siteStorageIndexedDbReport.entries.length ? 1 : 0) }}–{{ siteStorageIndexedDbOffset + siteStorageIndexedDbReport.entries.length }}</span>
            <div>
              <button type="button" :disabled="siteStorageIndexedDbOffset === 0 || siteStorageIndexedDbState === 'loading'" @click="moveSiteStorageIndexedDbPage(-1)"><IconArrowBack aria-hidden="true" /> Previous</button>
              <button type="button" :disabled="!siteStorageIndexedDbReport.hasMore || siteStorageIndexedDbState === 'loading'" @click="moveSiteStorageIndexedDbPage(1)">Next <IconArrowForward aria-hidden="true" /></button>
            </div>
          </footer>
        </template>
      </section>
      <section v-else-if="siteStoragePwaOpen" class="pwa-view" :aria-busy="siteStoragePwaState === 'loading'">
        <div v-if="siteStoragePwaState === 'loading' && !siteStoragePwaReport" class="site-storage-empty">
          <IconProgress class="state-spinner" aria-hidden="true" /><strong>Reading offline app state…</strong>
        </div>
        <div v-else-if="siteStoragePwaState === 'error'" class="storage-changes-error" role="alert">
          <IconError aria-hidden="true" /><strong>Offline inspection needs attention</strong><span>{{ siteStoragePwaError }}</span>
        </div>
        <template v-else-if="siteStoragePwaReport">
          <div class="pwa-summary">
            <IconOffline aria-hidden="true" />
            <div><strong>{{ siteStoragePwaReport.controlled ? 'Page controlled by a service worker' : 'Page is not controlled' }}</strong><span>{{ siteStoragePwaReport.registrations.length }} {{ siteStoragePwaReport.registrations.length === 1 ? 'registration' : 'registrations' }} · {{ siteStoragePwaReport.caches.length }} {{ siteStoragePwaReport.caches.length === 1 ? 'cache' : 'caches' }}</span></div>
            <button type="button" @click="copySiteStoragePwa"><IconCheck v-if="siteStoragePwaCopied" aria-hidden="true" /><IconCopy v-else aria-hidden="true" /> {{ siteStoragePwaCopied ? 'Copied' : 'Copy report' }}</button>
          </div>
          <div v-if="siteStoragePwaReport.manifestInspectionError" class="pwa-cache-warning" role="status"><IconWarning aria-hidden="true" /><span>Web app manifest unavailable: {{ siteStoragePwaReport.manifestInspectionError }}</span></div>
          <article v-if="siteStoragePwaReport.manifest" class="pwa-manifest">
            <header>
              <div><IconDashboard aria-hidden="true" /><span><strong>{{ siteStoragePwaReport.manifest.name ?? siteStoragePwaReport.manifest.shortName ?? 'Web app manifest' }}</strong><small>{{ siteStoragePwaReport.manifest.url || 'Embedded manifest' }}</small></span></div>
              <span>{{ siteStoragePwaReport.manifest.display ?? 'browser' }}</span>
            </header>
            <dl>
              <div v-if="siteStoragePwaReport.manifest.startUrl"><dt>Start URL</dt><dd>{{ siteStoragePwaReport.manifest.startUrl }}</dd></div>
              <div v-if="siteStoragePwaReport.manifest.scope"><dt>Scope</dt><dd>{{ siteStoragePwaReport.manifest.scope }}</dd></div>
              <div><dt>Assets</dt><dd>{{ siteStoragePwaReport.manifest.icons.length }} icons · {{ siteStoragePwaReport.manifest.shortcuts.length }} shortcuts</dd></div>
            </dl>
            <div v-if="siteStoragePwaReport.manifest.parseErrors.length || siteStoragePwaReport.manifest.installabilityErrors.length" class="pwa-manifest-errors">
              <strong>Manifest and installability findings</strong>
              <ul>
                <li v-for="(error, index) in siteStoragePwaReport.manifest.parseErrors" :key="`manifest-${index}`">{{ error.message }}<template v-if="error.line !== undefined"> · line {{ error.line }}</template></li>
                <li v-for="error in siteStoragePwaReport.manifest.installabilityErrors" :key="error.errorId">{{ error.errorId }}<template v-if="error.arguments.length"> · {{ error.arguments.map((argument) => `${argument.name}: ${argument.value}`).join(', ') }}</template></li>
              </ul>
            </div>
            <small v-else-if="siteStoragePwaReport.installabilityInspectionAvailable">No installability errors reported by this Chromium build.</small>
            <small v-else>Installability diagnostics are unavailable in this Chromium build.</small>
          </article>
          <div v-else-if="siteStoragePwaReport.manifestInspectionAvailable" class="site-storage-empty compact"><IconDashboard aria-hidden="true" /><strong>No web app manifest detected</strong></div>
          <div v-if="siteStoragePwaReport.registrations.length" class="pwa-registrations">
            <article v-for="registration in siteStoragePwaReport.registrations" :key="registration.scope">
              <strong>{{ registration.scope }}</strong>
              <code>{{ registration.active?.scriptUrl ?? registration.waiting?.scriptUrl ?? registration.installing?.scriptUrl ?? 'No worker script' }}</code>
              <small>{{ registration.active?.state ?? registration.waiting?.state ?? registration.installing?.state ?? 'inactive' }} · update via cache: {{ registration.updateViaCache }}</small>
            </article>
          </div>
          <div v-else class="site-storage-empty compact"><IconOffline aria-hidden="true" /><strong>No service-worker registrations</strong></div>
          <div v-if="siteStoragePwaReport.cacheInspectionError" class="pwa-cache-warning" role="status"><IconWarning aria-hidden="true" /><span>{{ siteStoragePwaReport.cacheInspectionAvailable ? siteStoragePwaReport.cacheInspectionError : `Cache Storage unavailable: ${siteStoragePwaReport.cacheInspectionError}` }}</span></div>
          <template v-else-if="siteStoragePwaReport.caches.length">
            <div class="pwa-cache-tools">
              <label><span>Cache</span><select v-model="siteStoragePwaCache" aria-label="Cache Storage cache" @change="selectSiteStoragePwaCache"><option v-for="cache in siteStoragePwaReport.caches" :key="cache.name" :value="cache.name">{{ cache.name }}</option></select></label>
              <form @submit.prevent="filterSiteStoragePwa"><label class="site-storage-search"><IconSearch aria-hidden="true" /><input v-model="siteStoragePwaQuery" type="search" aria-label="Filter cached requests" placeholder="Filter request paths" autocomplete="off" /></label><button type="submit">Apply</button></form>
            </div>
            <div v-if="siteStoragePwaReport.selectedCache && !siteStoragePwaReport.selectedCache.entries.length" class="site-storage-empty compact"><IconOffline aria-hidden="true" /><strong>No matching cached requests</strong></div>
            <div v-else-if="siteStoragePwaReport.selectedCache" class="pwa-cache-entries">
              <article v-for="entry in siteStoragePwaReport.selectedCache.entries" :key="`${entry.requestMethod}-${entry.requestUrl}`">
                <header><strong>{{ entry.requestMethod }}</strong><span>{{ entry.responseStatus }} {{ entry.responseStatusText }}</span></header>
                <code>{{ entry.requestUrl }}</code>
                <small>{{ entry.responseType }}<template v-if="entry.responseTime"> · {{ debugTimestamp(entry.responseTime) }}</template></small>
              </article>
            </div>
          </template>
          <div v-else-if="siteStoragePwaReport.cacheInspectionAvailable" class="site-storage-empty compact"><IconOffline aria-hidden="true" /><strong>No Cache Storage caches</strong></div>
          <details class="storage-changes-caveats pwa-caveats"><summary>Scope and privacy</summary><ul><li v-for="caveat in siteStoragePwaReport.caveats" :key="caveat">{{ caveat }}</li></ul></details>
          <footer v-if="siteStoragePwaReport.selectedCache" class="indexeddb-footer">
            <span>{{ siteStoragePwaReport.selectedCache.totalEntries }} matching {{ siteStoragePwaReport.selectedCache.totalEntries === 1 ? 'entry' : 'entries' }}</span>
            <div><button type="button" :disabled="siteStoragePwaOffset === 0 || siteStoragePwaState === 'loading'" @click="moveSiteStoragePwaPage(-1)"><IconArrowBack aria-hidden="true" /> Previous</button><button type="button" :disabled="!siteStoragePwaReport.selectedCache.hasMore || siteStoragePwaState === 'loading'" @click="moveSiteStoragePwaPage(1)">Next <IconArrowForward aria-hidden="true" /></button></div>
          </footer>
        </template>
      </section>
      <section v-else class="storage-changes-view" :aria-busy="siteStorageChangesState === 'loading'">
        <div v-if="siteStorageChangesState === 'loading' && !siteStorageChangesReport" class="site-storage-empty">
          <IconProgress class="state-spinner" aria-hidden="true" /><strong>Reading storage baseline…</strong>
        </div>
        <div v-else-if="siteStorageChangesState === 'error'" class="storage-changes-error" role="alert">
          <IconError aria-hidden="true" /><strong>Storage comparison needs attention</strong><span>{{ siteStorageChangesError }}</span>
        </div>
        <template v-else-if="siteStorageChangesReport">
          <div v-if="siteStorageChangesReport.status === 'empty'" class="site-storage-empty storage-changes-empty">
            <IconDifference aria-hidden="true" />
            <strong>See what browser state changes</strong>
            <span>Set a baseline, perform the action on the website, then compare local storage, session storage, and cookies.</span>
            <button class="primary" type="button" @click="manageSiteStorageChanges('baseline')"><IconDifference aria-hidden="true" /> Set baseline</button>
          </div>
          <template v-else>
            <div class="storage-changes-summary" :class="{ changed: siteStorageChangesReport.status === 'compared' && siteStorageChangesReport.changeCount, identical: siteStorageChangesReport.status === 'compared' && !siteStorageChangesReport.changeCount }">
              <IconDifference v-if="siteStorageChangesReport.status === 'baseline'" aria-hidden="true" />
              <IconCheck v-else-if="!siteStorageChangesReport.changeCount" aria-hidden="true" />
              <IconWarning v-else aria-hidden="true" />
              <div>
                <strong v-if="siteStorageChangesReport.status === 'baseline'">Baseline ready</strong>
                <strong v-else-if="!siteStorageChangesReport.changeCount">No storage changes</strong>
                <strong v-else>{{ siteStorageChangesReport.changeCount }} storage {{ siteStorageChangesReport.changeCount === 1 ? 'change' : 'changes' }}</strong>
                <span>{{ siteStorageChangesReport.status === 'baseline' ? 'Use the website, then compare.' : `${siteStorageChangesReport.counts.added} added · ${siteStorageChangesReport.counts.updated} updated · ${siteStorageChangesReport.counts.removed} removed` }}</span>
              </div>
            </div>
            <div v-if="siteStorageChangesReport.status === 'compared' && siteStorageChangesReport.changes.length" class="storage-changes-list">
              <button v-for="(change, index) in siteStorageChangesReport.changes" :key="`${change.kind}-${change.key}-${change.domain ?? ''}-${change.path ?? ''}-${index}`" type="button" class="storage-change" :class="change.type" @click="inspectStorageChange(change)">
                <span class="storage-change-type">{{ change.type }}</span>
                <span class="storage-change-copy"><strong>{{ change.key }}</strong><small>{{ storageChangeKindLabel(change.kind) }}<template v-if="change.domain"> · {{ change.domain }}{{ change.path }}</template><template v-if="change.protected"> · HttpOnly</template><template v-if="change.attributesChanged"> · attributes changed</template></small></span>
                <span class="storage-change-bytes">{{ change.beforeValueBytes === undefined ? '—' : formatBytes(change.beforeValueBytes) }} → {{ change.afterValueBytes === undefined ? '—' : formatBytes(change.afterValueBytes) }}</span>
              </button>
            </div>
            <p v-if="siteStorageChangesReport.truncated" class="storage-changes-note"><IconInfo aria-hidden="true" /> The bounded snapshot or 200-change report limit was reached.</p>
            <details class="storage-changes-caveats">
              <summary>Scope and privacy</summary>
              <ul><li v-for="caveat in siteStorageChangesReport.caveats" :key="caveat">{{ caveat }}</li></ul>
            </details>
            <footer class="storage-changes-footer">
              <span>Baseline {{ siteStorageChangesReport.baselineAt ? debugTimestamp(siteStorageChangesReport.baselineAt) : 'not set' }}</span>
              <div>
                <button type="button" @click="manageSiteStorageChanges('clear')"><IconDelete aria-hidden="true" /> Clear</button>
                <button type="button" @click="manageSiteStorageChanges('baseline')"><IconRefresh aria-hidden="true" /> New baseline</button>
                <button v-if="siteStorageChangesReport.status === 'compared'" type="button" @click="copySiteStorageChanges"><IconCheck v-if="siteStorageChangesCopied" aria-hidden="true" /><IconCopy v-else aria-hidden="true" /> {{ siteStorageChangesCopied ? 'Copied' : 'Copy report' }}</button>
                <button class="primary" type="button" :disabled="siteStorageChangesState === 'loading'" @click="manageSiteStorageChanges('compare')"><IconDifference aria-hidden="true" /> Compare now</button>
              </div>
            </footer>
          </template>
        </template>
      </section>
      <p v-if="siteStorageError && !siteStorageUsageOpen && !siteStorageChangesOpen && !siteStorageIndexedDbOpen && !siteStoragePwaOpen" class="site-storage-error" role="alert">{{ siteStorageError }}</p>
    </section>
    <div v-if="workspaceEditorOpen" class="tab-group-editor-overlay" @click.self="closeWorkspaceEditor">
      <form class="tab-group-editor workspace-editor" role="dialog" aria-modal="true" aria-labelledby="tab-group-editor-title" @submit.prevent="saveWorkspaceEditor">
        <header>
          <div><span class="eyebrow">Browser workspace</span><h2 id="tab-group-editor-title">{{ workspaceEditorMode === 'create' ? 'Create workspace' : 'Edit workspace' }}</h2></div>
          <button class="panel-close" type="button" aria-label="Close workspace editor" @click="closeWorkspaceEditor"><IconClose aria-hidden="true" /></button>
        </header>
        <div class="workspace-editor-body">
        <label for="tab-group-name">Workspace name</label>
        <input id="tab-group-name" v-model="tabGroupEditorName" type="text" maxlength="80" autocomplete="off" autofocus :disabled="workspaceEditorMode === 'edit' && state.mcpTabGroups.find((workspace) => workspace.id === tabGroupEditorId)?.isDefault" />
        <label id="tab-group-color-label">Color</label>
        <div class="tab-group-color-options" role="radiogroup" aria-labelledby="tab-group-color-label">
          <button
            v-for="color in BROWSER_TAB_GROUP_COLORS"
            :key="color"
            class="tab-group-color-option"
            :class="{ selected: tabGroupEditorColor === color }"
            :style="tabGroupColorStyle(color)"
            type="button"
            role="radio"
            :aria-label="tabGroupColorLabel(color)"
            :aria-checked="tabGroupEditorColor === color"
            :title="tabGroupColorLabel(color)"
            @click="tabGroupEditorColor = color"
          ><IconCheck v-if="tabGroupEditorColor === color" aria-hidden="true" /></button>
        </div>
        <section v-if="workspaceEditorMode === 'create'" class="workspace-storage-section">
          <div class="workspace-storage-heading"><IconDatabase aria-hidden="true" /><div><strong>Starting browser data</strong><span>Choose whether this workspace starts clean or receives selected data from Default.</span></div></div>
          <label class="workspace-storage-choice">
            <input v-model="workspaceStorageMode" type="radio" value="scratch" />
            <span><strong>Start from scratch</strong><small>Use an empty isolated browser profile.</small></span>
          </label>
          <label class="workspace-storage-choice">
            <input v-model="workspaceStorageMode" type="radio" value="fork-default" />
            <span><strong>Fork Default</strong><small>Copy cookies and local storage without linking future changes.</small></span>
          </label>
          <div v-if="workspaceStorageMode === 'fork-default'" class="workspace-origin-picker">
            <div><strong>Websites to copy</strong><button type="button" @click="workspaceSelectedOrigins = workspaceSelectedOrigins.length === workspaceOriginOptions.length ? [] : [...workspaceOriginOptions]">{{ workspaceSelectedOrigins.length === workspaceOriginOptions.length ? 'Clear' : 'Select all' }}</button></div>
            <p v-if="!workspaceOriginOptions.length">No known website origins yet. Bronom will still copy Default cookies.</p>
            <label v-for="origin in workspaceOriginOptions" :key="origin"><input v-model="workspaceSelectedOrigins" type="checkbox" :value="origin" /><span>{{ origin }}</span></label>
          </div>
        </section>
        <p v-else-if="state.mcpTabGroups.find((workspace) => workspace.id === tabGroupEditorId)?.isDefault" class="workspace-default-note"><IconKeep aria-hidden="true" /> Default is the shared durable browser profile. Human-created tabs open here, agents are instructed not to use it, and it cannot be closed or deleted.</p>
        <section v-else class="workspace-storage-section">
          <div class="workspace-storage-heading"><IconDatabase aria-hidden="true" /><div><strong>Browser data</strong><span>This workspace has an isolated profile. Transfers merge data; they do not create a live connection.</span></div></div>
          <div class="workspace-transfer-direction" role="radiogroup" aria-label="Storage transfer direction">
            <label><input v-model="workspaceTransferDirection" type="radio" value="from-default" /><span>Import from Default</span></label>
            <label><input v-model="workspaceTransferDirection" type="radio" value="to-default" /><span>Save to Default</span></label>
          </div>
          <div class="workspace-origin-picker">
            <div><strong>Websites to copy</strong><button type="button" @click="workspaceSelectedOrigins = workspaceSelectedOrigins.length === workspaceOriginOptions.length ? [] : [...workspaceOriginOptions]">{{ workspaceSelectedOrigins.length === workspaceOriginOptions.length ? 'Clear' : 'Select all' }}</button></div>
            <p v-if="workspaceStorageState === 'loading'">Loading known websites…</p>
            <p v-else-if="!workspaceOriginOptions.length">No known website origins in the source profile. All cookies can still be copied.</p>
            <label v-for="origin in workspaceOriginOptions" :key="origin"><input v-model="workspaceSelectedOrigins" type="checkbox" :value="origin" /><span>{{ origin }}</span></label>
          </div>
          <button class="workspace-transfer-button" type="button" :disabled="workspaceStorageState === 'saving' || workspaceStorageState === 'loading' || workspaceStorageState === 'error'" @click="transferWorkspaceStorage"><IconSwapHoriz aria-hidden="true" /> {{ workspaceStorageState === 'saving' ? 'Copying…' : workspaceTransferDirection === 'from-default' ? 'Import selected data' : 'Save selected data to Default' }}</button>
          <output v-if="workspaceStorageMessage" :class="{ error: workspaceStorageState === 'error' }" role="status">{{ workspaceStorageMessage }}</output>
          <div class="workspace-danger-zone"><div><strong>Close workspace permanently</strong><span>Closes its tabs and deletes its isolated browser data.</span></div><button type="button" @click="closeEditedWorkspace">Close workspace</button></div>
        </section>
        <output v-if="tabGroupEditorError" class="workspace-editor-error" role="alert">{{ tabGroupEditorError }}</output>
        </div>
        <footer><button type="button" @click="closeWorkspaceEditor">Cancel</button><button class="primary" type="submit" :disabled="!tabGroupEditorName.trim()">{{ workspaceEditorMode === 'create' ? 'Create workspace' : 'Save changes' }}</button></footer>
      </form>
    </div>
    <div v-if="credentialPickerOpen" class="settings-overlay credential-picker-overlay" @click.self="credentialPickerOpen = false">
      <section class="credential-picker" role="dialog" aria-modal="true" aria-labelledby="credential-picker-title">
        <header class="credential-picker-header">
          <IconPassword aria-hidden="true" />
          <div>
            <span class="eyebrow">Saved locally</span>
            <h2 id="credential-picker-title">Choose an account</h2>
          </div>
          <button class="panel-close" type="button" aria-label="Close account chooser" @click="credentialPickerOpen = false"><IconClose aria-hidden="true" /></button>
        </header>
        <div class="credential-picker-field">
          <IconSearch aria-hidden="true" />
          <input
            ref="credentialPickerInput"
            v-model="credentialPickerQuery"
            type="search"
            role="combobox"
            aria-label="Search saved accounts"
            aria-autocomplete="list"
            aria-controls="credential-picker-results"
            :aria-expanded="filteredActiveCredentials.length > 0"
            :aria-activedescendant="selectedActiveCredential ? credentialOptionId(selectedActiveCredential) : undefined"
            autocomplete="off"
            spellcheck="false"
            placeholder="Search usernames"
            @keydown="handleCredentialPickerKeydown"
          />
        </div>
        <div v-if="filteredActiveCredentials.length" id="credential-picker-results" class="credential-picker-results" role="listbox" aria-label="Saved accounts for this website">
          <button
            v-for="(credential, index) in filteredActiveCredentials"
            :id="credentialOptionId(credential)"
            :key="credential.id"
            class="credential-picker-item"
            :class="{ selected: index === credentialPickerSelection }"
            type="button"
            role="option"
            :aria-selected="index === credentialPickerSelection"
            @mouseenter="credentialPickerSelection = index"
            @click="fillSelectedCredential(credential)"
          >
            <span class="credential-picker-mark" aria-hidden="true"><IconKey /></span>
            <span><strong>{{ credential.username || 'Unnamed account' }}</strong><small>{{ credential.origin }}</small></span>
            <IconKeyboardArrowRight aria-hidden="true" />
          </button>
        </div>
        <div v-else class="credential-picker-empty"><IconSearch aria-hidden="true" /><strong>No matching accounts</strong><span>Try another username.</span></div>
        <footer><span><IconShieldLock aria-hidden="true" /> Filling pauses new agent commands and leaves agents paused.</span><span><kbd>↑</kbd><kbd>↓</kbd> Select · <kbd>Enter</kbd> Fill</span></footer>
      </section>
    </div>
    <div v-if="commandPaletteOpen" class="settings-overlay command-palette-overlay" @click.self="commandPaletteOpen = false">
      <section
        class="command-palette"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
      >
        <header class="command-palette-header">
          <IconKeyboardCommandKey aria-hidden="true" />
          <div>
            <span class="eyebrow">Quick actions</span>
            <h2 id="command-palette-title">Commands</h2>
          </div>
          <button class="panel-close" type="button" aria-label="Close command palette" @click="commandPaletteOpen = false"><IconClose aria-hidden="true" /></button>
        </header>
        <div class="command-palette-field">
          <IconSearch aria-hidden="true" />
          <input
            ref="commandPaletteInput"
            v-model="commandPaletteQuery"
            type="search"
            role="combobox"
            aria-label="Search commands"
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            :aria-expanded="commandPaletteCommands.length > 0"
            :aria-activedescendant="selectedCommandPaletteCommand ? commandPaletteCommandId(selectedCommandPaletteCommand) : undefined"
            autocomplete="off"
            spellcheck="false"
            placeholder="Type a command or feature"
            @keydown="handleCommandPaletteKeydown"
          />
          <kbd>⌃/⌘ ⇧ P</kbd>
        </div>
        <span class="sr-only" role="status" aria-live="polite">
          {{ commandPaletteCommands.length }} matching {{ commandPaletteCommands.length === 1 ? 'command' : 'commands' }}.<template v-if="selectedCommandPaletteCommand"> Selected {{ selectedCommandPaletteCommand.label }}.</template>
        </span>
        <div v-if="commandPaletteCommands.length" id="command-palette-results" class="command-palette-results" role="listbox" aria-label="Available commands">
          <button
            v-for="(command, index) in commandPaletteCommands"
            :id="commandPaletteCommandId(command)"
            :key="command.id"
            class="command-palette-item"
            :class="{ selected: index === commandPaletteSelection }"
            type="button"
            role="option"
            :aria-selected="index === commandPaletteSelection"
            @mouseenter="commandPaletteSelection = index"
            @click="runCommandPaletteCommand(command.id)"
          >
            <span class="command-palette-mark" aria-hidden="true">›</span>
            <span class="command-palette-copy">
              <strong>{{ command.label }}</strong>
              <small>{{ command.description }}</small>
            </span>
            <span class="command-palette-meta">
              <kbd v-if="command.shortcut">{{ command.shortcut }}</kbd>
              <small>{{ command.category }}</small>
            </span>
          </button>
        </div>
        <div v-else class="command-palette-empty">
          <IconSearch aria-hidden="true" />
          <strong>No matching commands</strong>
          <span>Try a feature, action, or synonym such as “screenshot” or “cookies”.</span>
        </div>
        <footer><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Enter</kbd> Run</span><span><kbd>Esc</kbd> Close</span></footer>
      </section>
    </div>
    <div v-if="settingsOpen" class="settings-overlay" @click.self="settingsOpen = false">
      <section
        ref="settingsPanel"
        class="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabindex="-1"
      >
        <div class="settings-header">
          <div>
            <span class="eyebrow">Bronom preferences</span>
            <h2 id="settings-title">Settings</h2>
          </div>
          <button class="panel-close" type="button" aria-label="Close settings" @click="settingsOpen = false"><IconClose aria-hidden="true" /></button>
        </div>

        <div class="settings-layout">
          <nav class="settings-sidebar" aria-label="Settings sections">
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'appearance' }"
              type="button"
              :aria-current="settingsSection === 'appearance' ? 'page' : undefined"
              @click="settingsSection = 'appearance'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconContrast /></span>
              <span>
                <strong>Appearance</strong>
                <small>Theme and window</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'search' }"
              type="button"
              :aria-current="settingsSection === 'search' ? 'page' : undefined"
              @click="settingsSection = 'search'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconSearch /></span>
              <span>
                <strong>Search engine</strong>
                <small>Address bar searches</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'downloads' }"
              type="button"
              :aria-current="settingsSection === 'downloads' ? 'page' : undefined"
              @click="settingsSection = 'downloads'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconDownload /></span>
              <span>
                <strong>Downloads</strong>
                <small>Location and prompts</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'performance' }"
              type="button"
              :aria-current="settingsSection === 'performance' ? 'page' : undefined"
              @click="settingsSection = 'performance'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconBedtime /></span>
              <span>
                <strong>Performance</strong>
                <small>Sleeping tabs</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'mcp' }"
              type="button"
              :aria-current="settingsSection === 'mcp' ? 'page' : undefined"
              @click="settingsSection = 'mcp'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconShieldLock /></span>
              <span>
                <strong>MCP security</strong>
                <small>Local authentication</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'privacy' }"
              type="button"
              :aria-current="settingsSection === 'privacy' ? 'page' : undefined"
              @click="settingsSection = 'privacy'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconDelete /></span>
              <span>
                <strong>Privacy &amp; data</strong>
                <small>History, cookies, cache</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'permissions' }"
              type="button"
              :aria-current="settingsSection === 'permissions' ? 'page' : undefined"
              @click="settingsSection = 'permissions'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconPrivacy /></span>
              <span>
                <strong>Site permissions</strong>
                <small>Per-website access</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'credentials' }"
              type="button"
              :aria-current="settingsSection === 'credentials' ? 'page' : undefined"
              @click="settingsSection = 'credentials'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconKey /></span>
              <span>
                <strong>Passwords</strong>
                <small>Saved accounts</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'updates' }"
              type="button"
              :aria-current="settingsSection === 'updates' ? 'page' : undefined"
              @click="settingsSection = 'updates'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconSystemUpdate /></span>
              <span>
                <strong>Updates</strong>
                <small>Automatic checks</small>
              </span>
            </button>
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'support' }"
              type="button"
              :aria-current="settingsSection === 'support' ? 'page' : undefined"
              @click="settingsSection = 'support'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconFavorite /></span>
              <span>
                <strong>Support Bronom</strong>
                <small>Open source and contributions</small>
              </span>
            </button>
          </nav>

          <main v-if="settingsSection === 'appearance'" class="settings-content">
            <div class="setting-copy">
              <h3>Application theme</h3>
              <p>Choose how Bronom's tabs, toolbar, dialogs, and menus look.</p>
            </div>
            <div class="theme-options" role="radiogroup" aria-label="Theme">
              <button
                v-for="theme in themes"
                :key="theme.name"
                class="theme-option"
                :class="[`theme-${theme.name}`, { selected: settings.theme === theme.name }]"
                type="button"
                role="radio"
                :aria-checked="settings.theme === theme.name"
                :data-testid="`theme-${theme.name}`"
                @click="selectTheme(theme.name)"
              >
                <span class="theme-preview" aria-hidden="true">
                  <span class="preview-tab" />
                  <span class="preview-bar" />
                  <span class="preview-page" />
                </span>
                <span class="theme-label">{{ theme.label }}</span>
                <span class="theme-description">{{ theme.description }}</span>
                <span class="theme-check" aria-hidden="true"><IconCheck /></span>
              </button>
            </div>
            <div class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>System follows your device as it changes. A specific theme stays fixed for this Bronom profile.</p>
            </div>
            <div class="settings-rows">
              <label class="settings-row" for="setting-interface-scale">
                <span>
                  <strong>Interface size</strong>
                  <small>Enlarge Bronom's controls and text without changing website zoom.</small>
                </span>
                <select
                  id="setting-interface-scale"
                  aria-label="Interface size"
                  :value="settings.interfaceScale"
                  @change="selectInterfaceScale"
                >
                  <option v-for="option in INTERFACE_SCALE_OPTIONS" :key="option.value" :value="option.value">
                    {{ option.label }} · {{ option.description }}
                  </option>
                </select>
              </label>
              <label class="settings-row" for="setting-hide-in-tray">
                <span>
                  <strong>Hide in tray when closing</strong>
                  <small>Keep Bronom and its MCP server running after the window is closed.</small>
                </span>
                <input
                  id="setting-hide-in-tray"
                  type="checkbox"
                  :checked="settings.hideInTray"
                  @change="setHideInTray"
                />
              </label>
              <label class="settings-row" for="setting-attention-sound">
                <span>
                  <strong>Play attention sound</strong>
                  <small>Play a warning cue when an agent needs you to complete a manual browser step.</small>
                </span>
                <input
                  id="setting-attention-sound"
                  type="checkbox"
                  :checked="settings.attentionSound"
                  @change="setAttentionSound"
                />
              </label>
              <div class="settings-row">
                <span>
                  <strong>Attention sound</strong>
                  <small>Choose the cue that plays when Bronom needs you.</small>
                </span>
                <div class="attention-sound-actions">
                  <select
                    aria-label="Attention sound"
                    :value="settings.attentionSoundCue"
                    :disabled="!settings.attentionSound"
                    @change="setAttentionSoundCue"
                  >
                    <option v-for="option in attentionSoundOptions" :key="option.cue" :value="option.cue">
                      {{ option.label }}
                    </option>
                  </select>
                  <button
                    class="test-sound-button"
                    type="button"
                    :disabled="!settings.attentionSound"
                    @click="testAttentionSound"
                  >
                    Test sound
                  </button>
                </div>
              </div>
            </div>
          </main>
          <main v-else-if="settingsSection === 'search'" class="settings-content">
            <div class="setting-copy">
              <h3>Default search engine</h3>
              <p>Choose where plain text entered in the address bar or through <code>browser_navigate</code> is searched.</p>
            </div>
            <div class="search-engine-options" role="radiogroup" aria-label="Default search engine">
              <button
                v-for="engine in SEARCH_ENGINE_OPTIONS"
                :key="engine.id"
                class="search-engine-option"
                :class="{ selected: settings.searchEngine === engine.id }"
                type="button"
                role="radio"
                :aria-checked="settings.searchEngine === engine.id"
                :data-testid="`search-engine-${engine.id}`"
                @click="selectSearchEngine(engine.id)"
              >
                <span class="search-engine-mark" aria-hidden="true">{{ engine.label.slice(0, 1) }}</span>
                <span class="search-engine-copy">
                  <strong>{{ engine.label }}</strong>
                  <small>{{ engine.description }}</small>
                  <code>{{ engine.hostname }}</code>
                </span>
                <span class="search-engine-check" aria-hidden="true"><IconCheck /></span>
              </button>
            </div>
            <div class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>Local tabs, bookmarks, and history suggestions stay on this device. Bronom sends the query only after you submit it.</p>
            </div>
          </main>
          <main v-else-if="settingsSection === 'downloads'" class="settings-content downloads-settings">
            <div class="setting-copy">
              <h3>Website downloads</h3>
              <p>Choose where new files go and whether Bronom asks before saving each one.</p>
            </div>
            <div class="settings-rows">
              <div class="settings-row download-location-row">
                <span class="download-location-copy">
                  <strong>Download location</strong>
                  <code :title="effectiveDownloadDirectory">{{ effectiveDownloadDirectory }}</code>
                </span>
                <div class="download-location-actions">
                  <button class="secondary-button" type="button" :disabled="downloadSettingsState === 'working'" @click="chooseDownloadDirectory">
                    Change…
                  </button>
                  <button class="secondary-button" type="button" :disabled="downloadSettingsState === 'working'" @click="openDownloadDirectory">
                    <IconFolderOpen aria-hidden="true" />
                    Open folder
                  </button>
                </div>
              </div>
              <label class="settings-row" for="setting-ask-download-location">
                <span>
                  <strong>Ask where to save each file</strong>
                  <small>Show the operating system save dialog for every new website download.</small>
                </span>
                <input
                  id="setting-ask-download-location"
                  type="checkbox"
                  :checked="settings.askWhereToSaveDownloads"
                  :disabled="downloadSettingsState === 'working'"
                  @change="setAskWhereToSaveDownloads"
                />
              </label>
            </div>
            <output class="download-settings-status" :class="downloadSettingsState" aria-live="polite">{{ downloadSettingsMessage }}</output>
            <div class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>Changes apply to new website downloads. Active transfers keep their original destination. PDF exports and agent-created files use the selected folder without opening a human dialog.</p>
            </div>
          </main>
          <main v-else-if="settingsSection === 'performance'" class="settings-content performance-settings">
            <div class="setting-copy">
              <h3>Memory Saver</h3>
              <p>Unload inactive website tabs so active human and agent work gets more CPU and memory.</p>
            </div>
            <div class="memory-saver-summary" aria-live="polite">
              <span class="settings-nav-icon" aria-hidden="true"><IconBedtime /></span>
              <span><strong>{{ sleepingTabsCount }} sleeping</strong><small>of {{ regularTabs.length }} website tabs</small></span>
            </div>
            <div class="settings-rows">
              <label class="settings-row" for="setting-memory-saver">
                <span>
                  <strong>Automatically sleep inactive tabs</strong>
                  <small>Sleeping tabs wake before you select them or an MCP tool uses them.</small>
                </span>
                <input
                  id="setting-memory-saver"
                  type="checkbox"
                  :checked="settings.memorySaverEnabled"
                  @change="setMemorySaverEnabled"
                />
              </label>
              <label class="settings-row" for="setting-memory-saver-timeout">
                <span>
                  <strong>Sleep after</strong>
                  <small>Counted from the tab's last selection, human input, navigation, or MCP command.</small>
                </span>
                <select
                  id="setting-memory-saver-timeout"
                  :value="settings.memorySaverTimeoutMinutes"
                  :disabled="!settings.memorySaverEnabled"
                  @change="setMemorySaverTimeout"
                >
                  <option v-for="timeout in MEMORY_SAVER_TIMEOUT_MINUTES" :key="timeout" :value="timeout">
                    {{ memorySaverTimeoutLabel(timeout) }}
                  </option>
                </select>
              </label>
            </div>
            <div class="memory-saver-actions">
              <button class="secondary-button" type="button" :disabled="!settings.memorySaverEnabled" @click="sleepInactiveTabsNow">
                <IconBedtime aria-hidden="true" /> Sleep eligible tabs now
              </button>
            </div>
            <div class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>Visible, pinned, loading, audio-playing, downloading, form-edited, DevTools, and active MCP tabs stay awake. Sleeping unloads the page and restores its navigation history when it wakes.</p>
            </div>
          </main>
          <main v-else-if="settingsSection === 'mcp'" class="settings-content">
            <div class="setting-copy">
              <h3>MCP security</h3>
              <p>Control which local applications can connect to this browser profile.</p>
            </div>
            <div class="settings-rows">
              <label class="settings-row" for="setting-mcp-authentication">
                <span>
                  <strong>Require MCP authentication</strong>
                  <small>Require the owner-only per-profile bearer token for MCP and health requests.</small>
                </span>
                <input
                  id="setting-mcp-authentication"
                  type="checkbox"
                  :checked="settings.mcpAuthentication"
                  @change="setMcpAuthentication"
                />
              </label>
              <div class="settings-row mcp-port-row">
                <label for="setting-mcp-port">
                  <strong>MCP server port</strong>
                  <small>Move the local listener without restarting Bronom. Connected clients must use the new endpoint.</small>
                </label>
                <div class="mcp-port-control">
                  <div>
                    <input
                      id="setting-mcp-port"
                      v-model="mcpPortDraft"
                      type="number"
                      inputmode="numeric"
                      :min="MIN_MCP_PORT"
                      :max="MAX_MCP_PORT"
                      step="1"
                      aria-label="MCP server port"
                      @input="editMcpPort"
                      @keydown.enter.prevent="applyMcpPort"
                    />
                    <button
                      class="secondary-button"
                      type="button"
                      :disabled="!canApplyMcpPort || mcpPortState === 'saving'"
                      @click="applyMcpPort"
                    >
                      {{ mcpPortState === 'saving' ? 'Moving…' : 'Apply port' }}
                    </button>
                  </div>
                  <output
                    class="mcp-port-status"
                    :class="mcpPortState"
                    aria-live="polite"
                  >{{ mcpPortMessage || `Active endpoint: ${state.mcpUrl}` }}</output>
                </div>
              </div>
            </div>
            <div class="settings-info" :class="{ 'security-warning': !settings.mcpAuthentication }">
              <span class="info-dot" aria-hidden="true">
                <IconInfo v-if="settings.mcpAuthentication" />
                <IconWarning v-else />
              </span>
              <p v-if="settings.mcpAuthentication">The token is generated once per profile and never displayed on Bronom Home.</p>
              <p v-else>Authentication is off. Any process on this computer can control logged-in tabs and attach local files.</p>
            </div>
          </main>
          <main v-else-if="settingsSection === 'privacy'" class="settings-content privacy-settings">
            <div class="setting-copy">
              <h3>Privacy &amp; browsing data</h3>
              <p>Manage the durable Default workspace profile. Isolated workspaces are managed from their workspace editor.</p>
            </div>
            <fieldset class="privacy-category-options" :disabled="browsingDataState === 'clearing' || janitorState === 'clearing'">
              <legend>What to clear</legend>
              <label for="clear-browsing-history">
                <input id="clear-browsing-history" v-model="browsingDataOptions.history" type="checkbox" />
                <span><strong>History</strong><small>Local visits</small></span>
              </label>
              <label for="clear-cookies-site-data">
                <input id="clear-cookies-site-data" v-model="browsingDataOptions.cookiesAndSiteData" type="checkbox" />
                <span><strong>Cookies &amp; site data</strong><small>May sign you out</small></span>
              </label>
              <label for="clear-browser-cache">
                <input id="clear-browser-cache" v-model="browsingDataOptions.cache" type="checkbox" />
                <span><strong>Cached files</strong><small>Reloads may be slower</small></span>
              </label>
            </fieldset>
            <div class="privacy-data-actions">
              <button
                class="clear-data-button"
                type="button"
                :disabled="!canClearBrowsingData"
                @click="clearSelectedBrowsingData"
              >
                {{ browsingDataState === 'clearing' ? 'Clearing all…' : `Clear all websites… (${selectedBrowsingDataCount})` }}
              </button>
              <output class="privacy-data-status" :class="browsingDataState" aria-live="polite">{{ browsingDataMessage || (browsingDataSummary ? `${browsingDataSummary.historyEntries} ${browsingDataSummary.historyEntries === 1 ? 'history page' : 'history pages'} · ${browsingDataSummary.cookieCount} ${browsingDataSummary.cookieCount === 1 ? 'cookie' : 'cookies'} · ${formatBytes(browsingDataSummary.cacheBytes)} cache` : 'Loading profile totals…') }}</output>
            </div>
            <div class="privacy-websites-heading">
              <div>
                <h4>Websites</h4>
                <p>Search Default and application-wide records, then clear the selected categories from one website.</p>
              </div>
              <button class="secondary-button janitor-refresh" type="button" :disabled="janitorState === 'loading' || janitorState === 'clearing'" @click="refreshJanitorWebsites">
                <IconRefresh aria-hidden="true" />
                Refresh
              </button>
            </div>
            <div class="janitor-search-field">
              <IconSearch aria-hidden="true" />
              <input v-model="janitorSearch" type="search" aria-label="Search websites" autocomplete="off" spellcheck="false" placeholder="Search websites" />
              <span>{{ filteredJanitorWebsites.length }} of {{ janitorWebsites.length }}</span>
            </div>
            <div class="janitor-list" :aria-busy="janitorState === 'loading'">
              <div v-if="janitorState === 'loading' && !janitorWebsites.length" class="site-permissions-empty janitor-empty">
                <IconProgress class="state-spinner" aria-hidden="true" />
                <strong>Finding websites…</strong>
                <p>Checking the Default workspace and application-wide records.</p>
              </div>
              <div v-else-if="!janitorWebsites.length" class="site-permissions-empty janitor-empty">
                <IconCleaning aria-hidden="true" />
                <strong>No websites yet</strong>
                <p>Websites appear after they are visited, opened, bookmarked, granted a permission, saved with an account, or store a cookie.</p>
              </div>
              <div v-else-if="!filteredJanitorWebsites.length" class="site-permissions-empty janitor-empty">
                <IconSearch aria-hidden="true" />
                <strong>No matching websites</strong>
                <p>Try a hostname, title, or full origin.</p>
              </div>
              <article v-for="site in filteredJanitorWebsites" v-else :key="site.origin" class="janitor-site">
                <span class="janitor-site-icon" aria-hidden="true"><IconLanguage /></span>
                <span class="janitor-site-copy">
                  <strong :title="site.title">{{ site.hostname }}</strong>
                  <small :title="site.origin">{{ site.origin }}</small>
                  <span v-if="janitorWebsiteMeta(site).length" class="janitor-site-meta">
                    <span v-for="item in janitorWebsiteMeta(site)" :key="item">{{ item }}</span>
                  </span>
                  <span v-else class="janitor-site-meta"><span>Known to Default</span></span>
                </span>
                <button
                  class="janitor-clear-button"
                  type="button"
                  :aria-label="`Clear selected data for ${site.origin}`"
                  :disabled="selectedBrowsingDataCount === 0 || janitorState === 'clearing' || browsingDataState === 'clearing'"
                  @click="clearJanitorWebsite(site)"
                >
                  <IconProgress v-if="janitorClearingOrigin === site.origin" class="state-spinner" aria-hidden="true" />
                  <IconDelete v-else aria-hidden="true" />
                  {{ janitorClearingOrigin === site.origin ? 'Clearing…' : 'Clear…' }}
                </button>
              </article>
            </div>
            <output class="privacy-data-status janitor-status" :class="janitorState" aria-live="polite">{{ janitorMessage }}</output>
            <div class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>
                Bookmarks ({{ browsingDataSummary?.bookmarkCount ?? '…' }}), saved passwords ({{ browsingDataSummary?.savedPasswordCount ?? '…' }}),
                site-permission decisions ({{ browsingDataSummary?.permissionDecisionCount ?? '…' }}), downloaded files, settings, and open tabs stay untouched.
                Open pages are not reloaded automatically. New MCP commands pause only while clearing is in progress.
                Cookies, cache, and site data here belong to Default; history, bookmarks, saved accounts, and downloaded files are application-wide.
                The website list combines origins known from those records and open Default tabs. Chromium does not expose a complete index of storage-only origins. Related subdomains may share cookies.
              </p>
            </div>
          </main>
          <main v-else-if="settingsSection === 'permissions'" class="settings-content permissions-settings">
            <div class="setting-copy">
              <h3>Site permissions</h3>
              <p>Review access decisions remembered for each website.</p>
            </div>
            <div v-if="!permissionsByOrigin.length" class="site-permissions-empty">
              <span class="empty-permission-icon" aria-hidden="true"><IconPrivacy /></span>
              <strong>No saved decisions</strong>
              <p>Websites will appear here after they request permission and you choose Allow or Deny.</p>
            </div>
            <div v-else class="permission-sites">
              <section v-for="group in permissionsByOrigin" :key="group.origin" class="permission-site">
                <h4>{{ group.origin }}</h4>
                <div
                  v-for="permission in group.permissions"
                  :key="permission.permission"
                  class="permission-row"
                >
                  <span class="permission-name">
                    <strong>{{ permissionLabel(permission.permission) }}</strong>
                    <small>{{ permission.permission }}</small>
                  </span>
                  <select
                    :value="permission.decision"
                    :aria-label="`${permissionLabel(permission.permission)} permission for ${group.origin}`"
                    @change="setSitePermission(permission, $event)"
                  >
                    <option value="allow">Allow</option>
                    <option value="deny">Block</option>
                  </select>
                  <button
                    class="permission-remove"
                    type="button"
                    :aria-label="`Forget ${permissionLabel(permission.permission)} permission for ${group.origin}`"
                    title="Forget decision"
                    @click="removeSitePermission(permission)"
                  >
                    <IconDelete aria-hidden="true" />
                  </button>
                </div>
              </section>
            </div>
            <div class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>Removing a decision makes Bronom ask again the next time the website requests that permission.</p>
            </div>
          </main>
          <main v-else-if="settingsSection === 'credentials'" class="settings-content credentials-settings">
            <div class="setting-copy">
              <h3>Saved passwords</h3>
              <p>Save website logins with explicit consent and fill them from the password button in the toolbar.</p>
            </div>
            <div v-if="!credentialStorage.available" class="settings-info security-warning">
              <span class="info-dot" aria-hidden="true"><IconWarning /></span>
              <p>{{ credentialStorage.reason }}</p>
            </div>
            <div v-else-if="!credentials.length" class="site-permissions-empty">
              <span class="empty-permission-icon" aria-hidden="true"><IconKey /></span>
              <strong>No saved passwords</strong>
              <p>After you submit a password form yourself, Bronom will ask whether to save it.</p>
            </div>
            <div v-else class="permission-sites">
              <section v-for="credential in credentials" :key="credential.id" class="permission-site">
                <div class="credential-row">
                  <span class="permission-name">
                    <strong>{{ credential.username || 'Unnamed account' }}</strong>
                    <small>{{ credential.origin }}</small>
                  </span>
                  <button
                    class="permission-remove credential-remove"
                    type="button"
                    :aria-label="`Remove saved password for ${credential.username || 'unnamed account'} on ${credential.origin}`"
                    title="Remove saved password"
                    @click="removeSavedCredential(credential.id)"
                  >
                    <IconDelete aria-hidden="true" />
                  </button>
                </div>
              </section>
            </div>
            <div v-if="credentialStorage.available" class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>Encrypted by {{ credentialStorage.backend }}. Filling a password automatically pauses new MCP commands and leaves agents paused until you resume them.</p>
            </div>
          </main>
          <main v-else-if="settingsSection === 'updates'" class="settings-content updates-settings">
            <div class="setting-copy">
              <h3>Software updates</h3>
              <p>Keep Bronom current without downloading or installing anything silently.</p>
            </div>
            <UpdateNotification
              v-if="updateState.status !== 'idle'"
              mode="panel"
              :state="updateState"
              @check="checkForUpdatesInSettings"
              @download="downloadUpdate"
              @install="installUpdate"
            />
            <div class="settings-rows">
              <label class="settings-row" for="setting-startup-update">
                <span>
                  <strong>Check for updates on startup</strong>
                  <small>Run a background check shortly after Bronom opens.</small>
                </span>
                <input
                  id="setting-startup-update"
                  type="checkbox"
                  :checked="settings.checkForUpdatesOnStartup"
                  @change="setCheckForUpdatesOnStartup"
                />
              </label>
              <div class="settings-row version-row">
                <span>
                  <strong>Current version</strong>
                  <small>{{ updateState.currentVersion || 'Development build' }}</small>
                </span>
                <button class="secondary-button check-update-button" type="button" @click="checkForUpdatesInSettings">
                  Check now
                </button>
              </div>
            </div>
            <div class="settings-info">
              <span class="info-dot" aria-hidden="true"><IconInfo /></span>
              <p>Bronom asks before downloading and installing an available update.</p>
            </div>
          </main>
          <main v-else class="settings-content support-settings">
            <div class="setting-copy">
              <span class="support-kicker">Open source</span>
              <h3>{{ commercialLicense.active ? 'Thank you for supporting Bronom' : 'Support Bronom development' }}</h3>
              <p>Bronom is open source under Apache 2.0. Personal and commercial use do not require activation; an optional supporter subscription helps fund continued development.</p>
            </div>
            <div v-if="commercialLicense.active" class="support-card commercial-license-card active">
              <span class="support-heart" aria-hidden="true"><IconCheck /></span>
              <strong>Supporter key {{ commercialLicense.maskedKey }} is active on this device.</strong>
              <small>
                {{ commercialLicense.activations ?? '—' }} of {{ commercialLicense.activationLimit ?? 'unlimited' }} device activations used.
                <template v-if="commercialLicense.lastValidatedAt"> Last checked {{ new Date(commercialLicense.lastValidatedAt).toLocaleString() }}.</template>
              </small>
              <div class="commercial-license-actions">
                <button class="secondary-button" type="button" :disabled="commercialLicenseAction !== 'idle'" @click="refreshCommercialLicense">
                  {{ commercialLicenseAction === 'refreshing' ? 'Checking…' : 'Check license' }}
                </button>
                <button class="secondary-button" type="button" :disabled="commercialLicenseAction !== 'idle'" @click="openSupport('https://www.creem.io/my-orders/login')">
                  Manage subscription ↗
                </button>
                <button class="secondary-button danger" type="button" :disabled="commercialLicenseAction !== 'idle'" @click="deactivateCommercialLicense">
                  {{ commercialLicenseAction === 'deactivating' ? 'Deactivating…' : 'Deactivate device' }}
                </button>
              </div>
            </div>
            <div v-else class="support-card commercial-license-card">
              <span class="support-heart" aria-hidden="true"><IconFavorite /></span>
              <strong>Activate an optional supporter key from your Creem receipt.</strong>
              <small v-if="commercialLicense.secureStorageAvailable">The key is encrypted with your operating system secure storage and is used only for Creem license validation.</small>
              <small v-else>License activation requires an operating-system secure storage backend.</small>
              <form class="commercial-license-form" @submit.prevent="activateCommercialLicense">
                <label for="commercial-license-key">Supporter key</label>
                <input
                  id="commercial-license-key"
                  v-model="commercialLicenseKey"
                  type="password"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  :disabled="!commercialLicense.secureStorageAvailable || commercialLicenseAction !== 'idle'"
                />
                <button class="primary-button support-primary" type="submit" :disabled="!commercialLicense.secureStorageAvailable || commercialLicenseAction !== 'idle'">
                  {{ commercialLicenseAction === 'activating' ? 'Activating…' : 'Activate supporter key' }}
                </button>
              </form>
              <small v-if="commercialLicense.message">{{ commercialLicense.message }}</small>
              <small v-if="commercialLicenseError" class="commercial-license-error" role="alert">{{ commercialLicenseError }}</small>
              <button class="secondary-button" type="button" @click="openSupport('https://bronom.pages.dev')">Support Bronom ↗</button>
            </div>
            <div class="support-alternatives">
              <span>License and community</span>
              <button type="button" @click="openSupport('https://github.com/Netroforge/bronom/blob/main/LICENSE')">Apache 2.0 license ↗</button>
              <button type="button" @click="openSupport('https://github.com/Netroforge/bronom/blob/main/CONTRIBUTING.md')">Contributing guide ↗</button>
              <button type="button" @click="openSupport('https://github.com/Netroforge/bronom/issues')">Report an issue ↗</button>
            </div>
          </main>
        </div>

        <footer class="settings-footer">
          <button v-if="settingsSection !== 'support' && settingsSection !== 'credentials'" class="secondary-button" type="button" @click="resetCurrentSection">Reset to default</button>
          <button class="primary-button" type="button" @click="settingsOpen = false">Close</button>
        </footer>
      </section>
    </div>
    <div v-if="helpDialog" class="settings-overlay help-overlay" @click.self="helpDialog = null">
      <section
        ref="helpDialogPanel"
        class="help-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="helpDialog === 'shortcuts' ? 'shortcuts-title' : 'about-title'"
        tabindex="-1"
      >
        <header class="help-dialog-header">
          <div>
            <span class="eyebrow">Bronom help</span>
            <h2 v-if="helpDialog === 'shortcuts'" id="shortcuts-title">Keyboard shortcuts</h2>
            <h2 v-else id="about-title">About Bronom</h2>
          </div>
          <button class="panel-close" type="button" aria-label="Close help" @click="helpDialog = null"><IconClose aria-hidden="true" /></button>
        </header>
        <div v-if="helpDialog === 'shortcuts'" class="shortcuts-content">
          <p>Use these shortcuts from Bronom or from the website currently in focus.</p>
          <dl class="shortcut-list">
            <div v-for="shortcut in keyboardShortcuts" :key="shortcut.label" class="shortcut-row">
              <dt>{{ shortcut.label }}</dt>
              <dd>
                <kbd v-for="key in shortcut.keys" :key="key">{{ key }}</kbd>
              </dd>
            </div>
          </dl>
        </div>
        <div v-else class="about-content">
          <span class="about-mark" aria-hidden="true"><IconDashboard /></span>
          <div>
            <h3>Bronom {{ updateState.currentVersion || 'Development build' }}</h3>
            <p>A persistent, visible browser that coding agents can navigate with you through MCP.</p>
          </div>
          <div class="about-actions">
            <button class="secondary-button" type="button" @click="openSupport('https://github.com/Netroforge/bronom')">GitHub repository</button>
            <button class="secondary-button" type="button" @click="openSupport('https://github.com/Netroforge/bronom/blob/main/LICENSE')">Apache 2.0 license</button>
            <button class="secondary-button" type="button" @click="openSupport('https://github.com/Netroforge/bronom/blob/main/CONTRIBUTING.md')">Contribute</button>
            <button class="primary-button" type="button" @click="openSupportSettings">Support Bronom</button>
          </div>
        </div>
      </section>
    </div>
    <div
      v-if="detachedPanelUnavailable"
      class="detached-panel-unavailable-state"
      role="dialog"
      aria-modal="false"
      :aria-label="detachedPanelLabelText"
    >
      <header>
        <span>
          <small>WEBSITE REQUIRED</small>
          <strong>{{ detachedPanelLabelText }}</strong>
        </span>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" :label="`Dock ${detachedPanelLabelText.toLocaleLowerCase()}`" />
          <button class="panel-close" type="button" :aria-label="`Close ${detachedPanelLabelText.toLocaleLowerCase()}`" @click="closeDockedPanels"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div>
        <span aria-hidden="true"><IconLanguage /></span>
        <h2>Open a website tab</h2>
        <p>Select or open a website tab in the main Bronom window. This panel will refresh automatically.</p>
      </div>
    </div>
    <div
      v-if="dockedPanelOpen && panelDock !== 'window'"
      class="panel-resize-handle"
      :class="{ active: panelResizeGesture !== null }"
      role="separator"
      :aria-orientation="panelDock === 'right' || panelDock === 'left' ? 'vertical' : 'horizontal'"
      aria-label="Resize docked panel"
      :aria-valuemin="panelDockMinimumSize()"
      :aria-valuemax="panelDockMaximumSize()"
      :aria-valuenow="panelDockSize"
      tabindex="0"
      title="Drag to resize. Use arrow keys for precise changes; double-click to reset."
      @pointerdown="startPanelResize"
      @keydown="resizePanelWithKeyboard"
      @dblclick="resetPanelDockSize"
    />
  </header>
  <TransitionGroup
    name="app-toast"
    tag="aside"
    class="app-toast-region"
    :class="{ home: activeIsHome }"
    aria-label="Application notifications"
  >
    <article
      v-for="toast in appToasts"
      :key="toast.id"
      class="app-toast"
      :class="toast.tone"
      :role="toast.tone === 'error' ? 'alert' : 'status'"
      :aria-label="toast.title"
      :title="`${toast.title}: ${toast.message}`"
    >
      <span class="app-toast-mark" aria-hidden="true">
        <IconError v-if="toast.tone === 'error'" />
        <IconCheck v-else-if="toast.tone === 'success'" />
        <IconInfo v-else />
      </span>
      <span class="app-toast-copy"><strong>{{ toast.title }}</strong><span>{{ toast.message }}</span></span>
      <button type="button" :aria-label="`Dismiss ${toast.title}`" @click="dismissAppToast(toast.id)"><IconClose aria-hidden="true" /></button>
    </article>
  </TransitionGroup>
</template>
