<script setup lang="ts">
import { bind as bindFoley, play as playFoley, set as setFoley } from '@foleyjs/core'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import {
  formatBytes as formatLocalizedBytes,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatTime
} from '../../shared/format'
import IconAdd from '~icons/material-symbols/add-rounded'
import IconAddBox from '~icons/material-symbols/add-box-rounded'
import IconAdsClick from '~icons/material-symbols/ads-click-rounded'
import IconArrowBack from '~icons/material-symbols/arrow-back-rounded'
import IconArrowForward from '~icons/material-symbols/arrow-forward-rounded'
import IconBedtime from '~icons/material-symbols/bedtime-rounded'
import IconCheck from '~icons/material-symbols/check-rounded'
import IconClose from '~icons/material-symbols/close-rounded'
import IconContrast from '~icons/material-symbols/contrast-rounded'
import IconDelete from '~icons/material-symbols/delete-outline-rounded'
import IconDashboard from '~icons/material-symbols/space-dashboard-rounded'
import IconDownload from '~icons/material-symbols/download-rounded'
import IconDownloadDone from '~icons/material-symbols/download-done-rounded'
import IconError from '~icons/material-symbols/error-outline-rounded'
import IconFavorite from '~icons/material-symbols/favorite-rounded'
import IconInfo from '~icons/material-symbols/info-rounded'
import IconHistory from '~icons/material-symbols/history-rounded'
import IconHandyman from '~icons/material-symbols/handyman-rounded'
import IconHorizontalSplit from '~icons/material-symbols/horizontal-split-rounded'
import IconKeyboardArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded'
import IconKeyboardArrowRight from '~icons/material-symbols/keyboard-arrow-right-rounded'
import IconKeyboardArrowUp from '~icons/material-symbols/keyboard-arrow-up-rounded'
import IconKeyboardCommandKey from '~icons/material-symbols/keyboard-command-key-rounded'
import IconKeep from '~icons/material-symbols/keep-rounded'
import IconLanguage from '~icons/material-symbols/language-rounded'
import IconKey from '~icons/material-symbols/key-rounded'
import IconLock from '~icons/material-symbols/lock-rounded'
import IconLockOpen from '~icons/material-symbols/lock-open-rounded'
import IconRemove from '~icons/material-symbols/remove-rounded'
import IconPause from '~icons/material-symbols/pause-rounded'
import IconPlay from '~icons/material-symbols/play-arrow-rounded'
import IconProgress from '~icons/material-symbols/progress-activity-rounded'
import IconPrivacy from '~icons/material-symbols/privacy-tip-rounded'
import IconRefresh from '~icons/material-symbols/refresh-rounded'
import IconRoute from '~icons/material-symbols/route-rounded'
import IconSearch from '~icons/material-symbols/search-rounded'
import IconScreenshotRegion from '~icons/material-symbols/screenshot-region-rounded'
import IconSettings from '~icons/material-symbols/settings-rounded'
import IconSpeed from '~icons/material-symbols/speed-rounded'
import IconStar from '~icons/material-symbols/star-rounded'
import IconStarOutline from '~icons/material-symbols/star-outline-rounded'
import IconShieldLock from '~icons/material-symbols/shield-lock-rounded'
import IconTune from '~icons/material-symbols/tune-rounded'
import IconStop from '~icons/material-symbols/stop-rounded'
import IconSystemUpdate from '~icons/material-symbols/system-update-alt-rounded'
import IconTabSearch from '~icons/material-symbols/tab-search-rounded'
import IconSwapHoriz from '~icons/material-symbols/swap-horiz-rounded'
import IconVerticalSplit from '~icons/material-symbols/vertical-split-rounded'
import IconVolumeOff from '~icons/material-symbols/volume-off-rounded'
import IconVolumeUp from '~icons/material-symbols/volume-up-rounded'
import IconZoomIn from '~icons/material-symbols/zoom-in-rounded'
import {
  DETACHABLE_PANEL_IDS,
  PANEL_DOCKS,
  AppSettings,
  BrowserState,
  BrowserEmulationState,
  BrowserTabState,
  BrowserTabGroupColor,
  BrowserFindResult,
  BrowserDownloadState,
  BrowserBookmark,
  BrowserHistoryEntry,
  HelpMenuAction,
  McpTabActivity,
  McpControlState,
  CredentialSummary,
  DetachablePanelId,
  PanelDock,
  SitePermissionDecision,
  SitePermissionEntry,
  SearchEngineName,
  ThemeName
} from '../../shared/types'
import {
  BROWSER_TAB_GROUP_COLOR_HEX,
  defaultTabGroupColor
} from '../../shared/tab-groups'
import UpdateNotification from './components/UpdateNotification.vue'
import AppearanceSettings from './components/AppearanceSettings.vue'
import BookmarksPanel from './components/BookmarksPanel.vue'
import CommandPalette from './components/CommandPalette.vue'
import CredentialsSettingsPanel from './components/CredentialsSettingsPanel.vue'
import ConsolePanelContainer from './components/ConsolePanelContainer.vue'
import CredentialPicker from './components/CredentialPicker.vue'
import DiagnosticsPanels from './components/DiagnosticsPanels.vue'
import DownloadSettingsPanel from './components/DownloadSettingsPanel.vue'
import DownloadsPanel from './components/DownloadsPanel.vue'
import EnvironmentPanel from './components/EnvironmentPanel.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import McpSettingsPanel from './components/McpSettingsPanel.vue'
import NetworkPanel from './components/NetworkPanel.vue'
import PageToolsPanel from './components/PageToolsPanel.vue'
import PanelDockPicker from './components/PanelDockPicker.vue'
import PerformanceSettingsPanel from './components/PerformanceSettingsPanel.vue'
import PrivacySettingsPanel from './components/PrivacySettingsPanel.vue'
import ResponsivePreviewPanel from './components/ResponsivePreviewPanel.vue'
import SiteControlsPanel from './components/SiteControlsPanel.vue'
import SitePermissionsSettingsPanel from './components/SitePermissionsSettingsPanel.vue'
import SiteStoragePanel from './components/SiteStoragePanel.vue'
import SupportSettingsPanel from './components/SupportSettingsPanel.vue'
import TabSearchPanel from './components/TabSearchPanel.vue'
import UpdateSettingsPanel from './components/UpdateSettingsPanel.vue'
import WorkspaceEditor from './components/WorkspaceEditor.vue'
import { useBrowserStore } from './stores/browser'
import { useSettingsStore } from './stores/settings'
import { useShellWindowLifecycle } from './composables/useShellWindowLifecycle'
import { useDiagnosticsController } from './composables/useDiagnosticsController'
import { useCredentialsController } from './composables/useCredentialsController'
import { useDownloadSettingsController } from './composables/useDownloadSettingsController'
import { useEnvironmentPanelController } from './composables/useEnvironmentPanelController'
import { useMcpSettingsController } from './composables/useMcpSettingsController'
import { usePageExportController } from './composables/usePageExportController'
import { usePerformanceSettingsController } from './composables/usePerformanceSettingsController'
import { usePrivacySettingsController } from './composables/usePrivacySettingsController'
import { useSiteDataSummaryController } from './composables/useSiteDataSummaryController'
import { useSitePermissionsController } from './composables/useSitePermissionsController'
import { useCommercialLicenseController } from './composables/useCommercialLicenseController'
import { useUpdateSettingsController } from './composables/useUpdateSettingsController'
import {
  shellHeightForBrowserContent,
  shouldShowUpdateStatusPill,
  shouldAutoDismissUpdateStatus,
  UPDATE_STATUS_DISMISS_MS
} from '../../shared/update-presentation'
import { browserShortcutAction, type BrowserShortcutAction } from '../../shared/browser-shortcuts'
import type { CommandPaletteCommandId } from '../../shared/command-palette'
import {
  buildLocalAddressSuggestions,
  type AddressSuggestion,
  type AddressSuggestionOverlayRequest,
  type AddressSuggestionOverlayTheme
} from '../../shared/address-suggestions'
import { SEARCH_ENGINE_OPTIONS } from '../../shared/search-engine'
import { DEFAULT_INTERFACE_SCALE } from '../../shared/interface-scale'
import type { BrowserSplitOrientation } from '../../shared/split-view'

function isPanelDock(value: string | null): value is PanelDock {
  return value !== null && (PANEL_DOCKS as readonly string[]).includes(value)
}

function isDetachablePanelId(value: string | null): value is DetachablePanelId {
  return value !== null && (DETACHABLE_PANEL_IDS as readonly string[]).includes(value)
}

function detachedPanelLabel(panel: DetachablePanelId): string {
  const keys: Record<DetachablePanelId, string> = {
    'site-controls': 'panels.siteControls',
    'site-storage': 'panels.siteStorage',
    'page-tools': 'panels.pageTools',
    'responsive-preview': 'panels.responsivePreview',
    environment: 'panels.environment',
    accessibility: 'panels.accessibility',
    'quality-audit': 'panels.qualityAudit',
    performance: 'panels.performance',
    'design-overview': 'panels.designOverview',
    'page-metadata': 'panels.pageMetadata',
    security: 'panels.security',
    coverage: 'panels.coverage',
    'cpu-profile': 'panels.cpuProfile',
    memory: 'panels.memory',
    console: 'panels.console',
    network: 'panels.network',
    'debug-report': 'panels.debugReport',
    'repro-recorder': 'panels.reproRecorder',
    'dom-changes': 'panels.domChanges',
    'visual-compare': 'panels.visualCompare',
    issues: 'panels.issues',
    bookmarks: 'panels.bookmarks'
  }
  return t(keys[panel])
}

function detachedPanelTitle(panel: DetachablePanelId): string {
  return t('panels.title', { panel: detachedPanelLabel(panel) })
}

const { t } = useI18n({ useScope: 'global' })
const browserStore = useBrowserStore()
const settingsStore = useSettingsStore()
const { state } = storeToRefs(browserStore)
const { settings, systemTheme, resolvedLocale } = storeToRefs(settingsStore)
const browser = window.bronom
const bookmarksApi = window.bronomBookmarks
const downloadsApi = window.bronomDownloads
const historyApi = window.bronomHistory
const activeTab = computed(() => state.value.tabs.find((tab) => tab.id === state.value.activeTabId))
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
const sitePermissionsController = useSitePermissionsController({
  api: window.bronomPermissions,
  translate: (key) => t(key),
  onError: (error) => showAppToast(
    'error',
    t('runtime.toast.settingNotSaved'),
    friendlyUiError(error, t('runtime.toast.settingKept'))
  )
})
const {
  entries: sitePermissions,
  busy: sitePermissionsBusy,
  permissionLabel,
  initialize: initializeSitePermissions,
  replace: replaceSitePermissions,
  isPending: isSitePermissionPending,
  setDecision: setSitePermissionDecision,
  remove: removeSitePermission,
  clear: clearSitePermissions,
  dispose: disposeSitePermissionsController
} = sitePermissionsController
const credentialsController = useCredentialsController({
  api: window.bronomCredentials,
  initializingReason: t('runtime.initializingStorage'),
  missingCredentialMessage: t('runtimeActions.credential.noLongerExists'),
  formatError: (error) => friendlyUiError(error, t('runtime.toast.passwordRemoveDescription')),
  onRemoved: () => showAppToast(
    'success',
    t('runtime.toast.passwordRemoved'),
    t('runtime.toast.passwordRemovedDescription')
  ),
  onError: (error) => showAppToast(
    'error',
    t('runtime.toast.passwordRemoveFailed'),
    friendlyUiError(error, t('runtime.toast.passwordRemoveDescription'))
  )
})
const {
  entries: credentials,
  storage: credentialStorage,
  initialize: initializeCredentials,
  replace: replaceCredentials,
  dispose: disposeCredentialsController
} = credentialsController
const credentialPickerOpen = ref(false)
const credentialPicker = ref<InstanceType<typeof CredentialPicker> | null>(null)
const credentialFillState = ref<'idle' | 'filling'>('idle')
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
const downloads = ref<BrowserDownloadState[]>([])
const downloadsOpen = ref(false)
const bookmarks = ref<BrowserBookmark[]>([])
const bookmarksOpen = ref(false)
const bookmarksPanel = ref<InstanceType<typeof BookmarksPanel> | null>(null)
const visitHistory = ref<BrowserHistoryEntry[]>([])
const historyOpen = ref(false)
const historyPanel = ref<InstanceType<typeof HistoryPanel> | null>(null)
const siteStorageOpen = ref(false)
const siteStoragePanel = ref<InstanceType<typeof SiteStoragePanel> | null>(null)
const pageToolsOpen = ref(false)
const responsivePanelOpen = ref(false)
const responsivePanel = ref<InstanceType<typeof ResponsivePreviewPanel> | null>(null)
const environmentPanelOpen = ref(false)
const environmentController = useEnvironmentPanelController({
  open: environmentPanelOpen,
  activeTab,
  setTabEnvironment: (tabId, environment) => browser.setTabEnvironment(tabId, environment),
  reloadIgnoringCache: (tabId) => browser.reloadIgnoringCache(tabId),
  commitState: commitBrowserState,
  beginMutation: beginEmulationMutation,
  isMutationCurrent: isEmulationMutationCurrent,
  closeTransientPanels
})
const {
  state: environmentState,
  activeOverrideCount: activeEnvironmentOverrideCount
} = environmentController
const workspaceEditorOpen = ref(false)
const workspaceEditor = ref<InstanceType<typeof WorkspaceEditor> | null>(null)
const privacySettingsController = usePrivacySettingsController({
  api: window.bronomBrowsingData,
  translate: (key, parameters, plural) => plural === undefined
    ? t(key, parameters ?? {})
    : t(key, parameters ?? {}, plural),
  confirm: (message) => window.confirm(message),
  formatNumber: localNumber
})
const {
  search: janitorSearch,
  refresh: refreshPrivacySettings,
  resetSelection: resetPrivacySelection,
  dispose: disposePrivacySettingsController
} = privacySettingsController
const siteControlsOpen = ref(false)
const siteDataController = useSiteDataSummaryController({
  current: () => activeTab.value && activeWebUrl.value
    ? { tabId: activeTab.value.id, url: activeWebUrl.value }
    : null,
  load: ({ url, tabId }) => window.bronomBrowsingData.siteSummary(url, tabId)
})
const { summary: siteDataSummary, state: siteDataState, message: siteDataMessage } = siteDataController
const tabSearchOpen = ref(false)
const tabSearchPanel = ref<InstanceType<typeof TabSearchPanel> | null>(null)
const commandPaletteOpen = ref(false)
const commandPalette = ref<InstanceType<typeof CommandPalette> | null>(null)
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
const updateSettingsController = useUpdateSettingsController({
  api: window.bronomUpdates,
  settings,
  setCheckOnStartup: (enabled) => settingsStore.setCheckForUpdatesOnStartup(enabled),
  onCheckStarted: () => (updateNoticeOpen.value = true),
  onStateAccepted: (next) => {
    if (
      next.status === 'available'
      || next.status === 'downloading'
      || next.status === 'downloaded'
      || next.status === 'up-to-date'
      || next.status === 'error'
      || next.status === 'install-error'
    ) updateNoticeOpen.value = true
  },
  onSettingError: (error) => showAppToast(
    'error',
    t('runtime.toast.settingNotSaved'),
    friendlyUiError(error, t('runtime.toast.settingKept'))
  ),
  onActionError: (error) => showAppToast(
    'error',
    t('runtime.toast.actionFailed'),
    friendlyUiError(error, t('runtime.toast.actionFailed'))
  )
})
const {
  state: updateState,
  busy: updateSettingsBusy,
  initialize: initializeUpdateSettings,
  reset: resetUpdateSettings,
  dispose: disposeUpdateSettingsController
} = updateSettingsController
const commercialLicenseController = useCommercialLicenseController({
  api: window.bronomLicense,
  confirmDeactivate: () => window.confirm(t('runtimeDetails.deactivate')),
  emptyKeyMessage: () => t('runtime.license.enterKey'),
  formatError: (error) => error instanceof Error ? error.message : String(error)
})
const {
  initialize: initializeCommercialLicense,
  dispose: disposeCommercialLicenseController
} = commercialLicenseController
const defaultDownloadDirectory = ref('')
const downloadSettingsController = useDownloadSettingsController({
  api: window.bronomSettings,
  settings,
  defaultDirectory: defaultDownloadDirectory,
  applySettings: applyTheme,
  translate: (key) => t(key)
})
const {
  busy: downloadSettingsBusy,
  reset: resetDownloadSettings,
  dispose: disposeDownloadSettingsController
} = downloadSettingsController
const performanceSettingsController = usePerformanceSettingsController({
  settings,
  browserState: state,
  setEnabled: (enabled) => settingsStore.setMemorySaverEnabled(enabled),
  setTimeout: (minutes) => settingsStore.setMemorySaverTimeoutMinutes(minutes),
  sleepInactiveTabs: () => browser.sleepInactiveTabs(),
  syncBrowserState: (operation) => browserStore.syncOperation(operation),
  formatError: (error, operation) => friendlyUiError(
    error,
    t(operation === 'saving' ? 'runtime.toast.settingKept' : 'runtime.toast.actionFailed')
  ),
  onError: (error, operation) => showAppToast(
    'error',
    t(operation === 'saving' ? 'runtime.toast.settingNotSaved' : 'runtime.toast.actionFailed'),
    friendlyUiError(error, t(operation === 'saving' ? 'runtime.toast.settingKept' : 'runtime.toast.actionFailed'))
  )
})
const {
  busy: performanceSettingsBusy,
  reset: resetPerformanceSettings,
  dispose: disposePerformanceSettingsController
} = performanceSettingsController
const mcpSettingsController = useMcpSettingsController({
  settings,
  endpoint: computed(() => state.value.mcpUrl),
  listenerFailed: computed(() => mcpControl.value.status === 'error'),
  setAuthentication: (enabled) => settingsStore.setMcpAuthentication(enabled),
  setPort: (port) => settingsStore.setMcpPort(port),
  confirmDisableAuthentication: () => window.confirm(t('runtimeActions.mcp.disableConfirm')),
  translate: (key, parameters) => t(key, parameters ?? {}),
  formatPortError: (error) => error instanceof Error ? error.message : String(error),
  onAuthenticationError: (error) => showAppToast(
    'error',
    t('runtime.toast.settingNotSaved'),
    friendlyUiError(error, t('runtime.toast.settingKept'))
  )
})
const {
  busy: mcpSettingsBusy,
  reset: resetMcpSettings,
  dispose: disposeMcpSettingsController
} = mcpSettingsController
const settingsResetDisabled = computed(() => (
  (settingsSection.value === 'downloads' && downloadSettingsBusy.value)
  || (settingsSection.value === 'performance' && performanceSettingsBusy.value)
  || (settingsSection.value === 'privacy' && privacySettingsController.clearing.value)
  || (settingsSection.value === 'permissions' && sitePermissionsBusy.value)
  || (settingsSection.value === 'mcp' && mcpSettingsBusy.value)
  || (settingsSection.value === 'updates' && updateSettingsBusy.value)
))
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
const areaCaptureState = ref<'idle' | 'picking' | 'capturing' | 'copied' | 'error'>('idle')
const screenshotCaptureMode = ref<ScreenshotCaptureMode>('area')
const areaCaptureError = ref('')
const appToasts = ref<AppToast[]>([])
const pageExportController = usePageExportController({
  activeTab,
  browser,
  snapshotCopied: (result) => showAppToast(
    'success',
    t('runtimeActions.pageSnapshot.copied'),
    t('runtimeActions.pageSnapshot.ready', {
      count: localNumber(result.characters),
      limit: t(result.truncated ? 'runtimeActions.pageSnapshot.bounded' : 'runtimeActions.pageSnapshot.period')
    })
  ),
  snapshotFailed: (error) => showAppToast(
    'error',
    t('runtime.toast.pageSnapshotFailed'),
    friendlyUiError(error, t('runtime.toast.pageSnapshotDescription'))
  )
})
const {
  snapshotState: pageSnapshotState,
  pdfState: pdfExportState,
  pdfExport,
  copySnapshot: copyPageSnapshot,
  savePdf: saveActivePdf,
  dispose: disposePageExportController
} = pageExportController
const diagnosticsController = useDiagnosticsController({
  activeTab,
  browser,
  translate: (message, parameters) => t(message, parameters ?? {}),
  copyText: copyAppText,
  acceptBrowserState: browserStore.acceptAuthoritativeState,
  closeTransientPanels,
  keepsSeparatePanelOpen
})
const {
  accessibilityAuditState,
  accessibilityAudit,
  accessibilityPanelOpen,
  qualityAuditState,
  qualityAuditReport,
  qualityAuditPanelOpen,
  performanceState,
  performancePanelOpen,
  designOverviewPanelOpen,
  designOverviewReport,
  designOverviewState,
  pageMetadataPanelOpen,
  pageMetadataReport,
  pageMetadataState,
  securityPanelOpen,
  securityReport,
  securityReportState,
  coveragePanelOpen,
  coverageResult,
  coverageState,
  cpuProfilePanelOpen,
  cpuProfileResult,
  cpuProfileState,
  memoryState,
  memoryReport,
  memoryPanelOpen,
  debugReportState,
  debugReport,
  debugReportPanelOpen,
  reproPanelOpen,
  reproRecording,
  domChangesPanelOpen,
  domChangesReport,
  visualComparePanelOpen,
  visualCompareReport,
  visualCompareState,
  inspectorIssuesOpen,
  runPerformanceReport,
  togglePerformanceReport,
  runDesignOverview,
  toggleDesignOverview,
  runPageMetadata,
  togglePageMetadata,
  runSecurityReport,
  toggleSecurityReport,
  manageCodeCoverage,
  toggleCodeCoverage,
  manageCpuProfile,
  toggleCpuProfile,
  runMemoryReport,
  toggleMemoryReport,
  runDebugReport,
  toggleDebugReport,
  manageRepro,
  toggleReproRecorder,
  manageDomChanges,
  toggleDomChanges,
  manageVisualCompare,
  toggleVisualCompare,
  refreshInspectorIssues,
  toggleInspectorIssues,
  runAccessibilityAudit,
  toggleAccessibilityAudit,
  runQualityAudit,
  toggleQualityAudit,
  dispose: disposeDiagnosticsController
} = diagnosticsController
const consolePanelOpen = ref(false)
const consolePanel = ref<InstanceType<typeof ConsolePanelContainer> | null>(null)
const networkMonitorOpen = ref(false)
const networkPanel = ref<InstanceType<typeof NetworkPanel> | null>(null)
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
let unsubscribeMcpActivity: (() => void) | undefined
let unsubscribeDownloads: (() => void) | undefined
let unsubscribeBookmarks: (() => void) | undefined
let unsubscribeHistory: (() => void) | undefined
let unsubscribeMcpControl: (() => void) | undefined
let unsubscribeUserAttention: (() => void) | undefined
let unsubscribeShortcutRequested: (() => void) | undefined
let unsubscribePermissions: (() => void) | undefined
let unsubscribeCredentials: (() => void) | undefined
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
let unsubscribeAddressOverlayDismissed: (() => void) | undefined
let updateNoticeDismissTimer: number | undefined
let elementPickerResetTimer: number | undefined
let areaCaptureResetTimer: number | undefined
let nextAppToastId = 1
const appToastTimers = new Map<number, number>()
let emulationMutationSequence = 0
let elementPickerTabId: string | undefined
let areaCaptureTabId: string | undefined
let findTabId: string | undefined
let findRequestSequence = 0
const mcpActivityTimers = new Map<string, number>()
const MCP_TAB_ACTIVITY_LINGER_MS = 900
const knownDownloadIds = new Set<string>()
const keyboardShortcuts = computed(() => [
  { label: t('runtime.shortcuts.address'), keys: ['Ctrl/Cmd', 'L'] },
  { label: t('runtime.shortcuts.reload'), keys: ['Ctrl/Cmd', 'R'] },
  { label: t('runtime.shortcuts.reloadFresh'), keys: ['Ctrl/Cmd', 'Shift', 'R'] },
  { label: t('runtime.shortcuts.newTab'), keys: ['Ctrl/Cmd', 'T'] },
  { label: t('runtime.shortcuts.closeTab'), keys: ['Ctrl/Cmd', 'W'] },
  { label: t('runtime.shortcuts.reopenTab'), keys: ['Ctrl/Cmd', 'Shift', 'T'] },
  { label: t('runtime.shortcuts.searchTabs'), keys: ['Ctrl/Cmd', 'Shift', 'A'] },
  { label: t('runtime.shortcuts.commands'), keys: ['Ctrl/Cmd', 'Shift', 'P'] },
  { label: t('runtime.shortcuts.pick'), keys: ['Ctrl+Shift+C', 'Cmd+Option+C'] },
  { label: t('runtime.shortcuts.find'), keys: ['Ctrl/Cmd', 'F'] },
  { label: t('runtime.shortcuts.bookmark'), keys: ['Ctrl/Cmd', 'D'] },
  { label: t('runtime.shortcuts.history'), keys: ['Ctrl+H', 'Cmd+Y'] },
  { label: t('runtime.shortcuts.clearData'), keys: ['Ctrl/Cmd', 'Shift', 'Delete'] },
  { label: t('runtime.shortcuts.devtools'), keys: ['F12', 'Ctrl+Shift+I', 'Cmd+Option+I'] },
  { label: t('runtime.shortcuts.nextTab'), keys: ['Ctrl', 'Tab'] },
  { label: t('runtime.shortcuts.previousTab'), keys: ['Ctrl', 'Shift', 'Tab'] },
  { label: t('runtime.shortcuts.resetZoom'), keys: ['Ctrl/Cmd', '0'] }
])
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
const responsivePreviewLabel = computed(() => {
  const viewport = activeEmulation.value?.viewport
  return viewport ? t('runtime.responsive.at', { size: `${viewport.width}×${viewport.height}`, scale: localNumber(viewport.deviceScaleFactor) }) : t('runtime.responsive.preview')
})
const environmentLabel = computed(() => {
  if (environmentState.value === 'applying') return t('runtime.tool.environmentApplying')
  if (environmentState.value === 'error') return t('runtime.tool.environmentAttention')
  if (activeEnvironmentOverrideCount.value) {
    return t(activeEnvironmentOverrideCount.value === 1 ? 'environment.activeCondition' : 'environment.activeConditions', { count: localNumber(activeEnvironmentOverrideCount.value) })
  }
  return t('runtime.tool.environmentDescription')
})
const activeNetworkRouteCount = computed(() => activeTab.value?.networkRouteCount ?? 0)
const accessibilityAuditLabel = computed(() => {
  if (accessibilityAuditState.value === 'running') return t('runtime.tool.accessibilityRunning')
  if (accessibilityAuditState.value === 'error') return t('runtime.tool.accessibilityAttention')
  if (accessibilityAuditState.value === 'complete' && accessibilityAudit.value) {
    const count = accessibilityAudit.value.violationCount
    return t('runtime.tool.accessibilityResult', { count: localNumber(count) }, count)
  }
  return t('runtime.tool.accessibilityRun')
})
const qualityAuditLabel = computed(() => {
  if (qualityAuditState.value === 'running') return t('runtime.tool.qualityRunning')
  if (qualityAuditState.value === 'error') return t('runtime.tool.qualityAttention')
  if (qualityAuditReport.value) {
    if (qualityAuditReport.value.status === 'pass') return t('runtime.tool.qualityClear')
    const { errors, warnings } = qualityAuditReport.value.totals
    return t('runtime.tool.qualityResult', { errors: localNumber(errors), warnings: localNumber(warnings) }, Math.max(errors, warnings))
  }
  return t('runtime.tool.qualityDescription')
})
const performanceLabel = computed(() => {
  if (performanceState.value === 'running') return t('runtime.tool.performanceRunning')
  if (performanceState.value === 'error') return t('runtime.tool.performanceAttention')
  if (performanceState.value === 'complete') return t('runtime.tool.performanceView')
  return t('runtime.tool.performanceRun')
})
const designOverviewLabel = computed(() => {
  if (designOverviewState.value === 'loading') return t('designOverview.toolCapturing')
  if (designOverviewState.value === 'error') return t('designOverview.toolAttention')
  if (designOverviewReport.value) {
    const issues = designOverviewReport.value.summary.contrastIssueCount
    return issues
      ? t('designOverview.toolIssueCount', { count: localNumber(issues) }, issues)
      : t('designOverview.toolReady')
  }
  return t('designOverview.toolDescription')
})
const pageMetadataLabel = computed(() => {
  if (pageMetadataState.value === 'loading') return t('pageMetadata.toolInspecting')
  if (pageMetadataState.value === 'error') return t('pageMetadata.toolAttention')
  if (pageMetadataReport.value) {
    const actionable = pageMetadataReport.value.issues.filter((issue) => issue.severity !== 'info').length
    return actionable
      ? t('pageMetadata.toolWarningCount', { count: localNumber(actionable) }, actionable)
      : t('pageMetadata.toolReady')
  }
  return t('pageMetadata.toolDescription')
})
const securityLabel = computed(() => {
  if (securityReportState.value === 'loading') return t('securityReport.toolInspecting')
  if (securityReportState.value === 'error') return t('securityReport.toolAttention')
  if (securityReport.value?.state === 'secure') return t('securityReport.toolSecure')
  if (securityReport.value?.state === 'insecure' || securityReport.value?.state === 'insecure-broken') return t('securityReport.toolInsecure')
  if (securityReport.value) return t('securityReport.toolState', { state: securityReport.value.state })
  return t('securityReport.toolDescription')
})
const coverageLabel = computed(() => {
  if (coverageState.value === 'loading') return t('coverage.toolLoading')
  if (coverageState.value === 'error') return t('coverage.toolAttention')
  if (activeTab.value?.codeCoverageRecording) return t('coverage.toolRecording', { mode: activeTab.value.codeCoverageRecording.mode })
  if (coverageResult.value?.status === 'complete') return t('coverage.toolComplete', { percent: localPercent(coverageResult.value.report?.usedPercent ?? 0) })
  return t('coverage.toolDescription')
})
const cpuProfileLabel = computed(() => {
  if (cpuProfileState.value === 'loading') return t('cpuProfile.toolLoading')
  if (cpuProfileState.value === 'error') return t('cpuProfile.toolAttention')
  if (activeTab.value?.cpuProfileRecording) return t('cpuProfile.toolRecording')
  if (cpuProfileResult.value?.status === 'complete') {
    const hotspot = cpuProfileResult.value.report?.hotspots[0]
    return hotspot ? t('cpuProfile.toolHotspot', { function: hotspot.functionName, percent: localPercent(hotspot.selfPercent) }) : t('cpuProfile.toolComplete')
  }
  return t('cpuProfile.toolDescription')
})
const memoryLabel = computed(() => {
  if (memoryState.value === 'running') return t('memory.toolMeasuring')
  if (memoryState.value === 'error') return t('memory.toolAttention')
  if (activeTab.value?.memoryAllocationRecording) return t('memory.toolSampling')
  if (memoryReport.value?.allocationProfile) {
    const hotspot = memoryReport.value.allocationProfile.hotspots[0]
    return hotspot
      ? t('memory.toolHotspot', { function: hotspot.functionName || t('memory.allocation.anonymous'), bytes: formatBytes(hotspot.selfBytes) })
      : t('memory.toolAllocationComplete')
  }
  if (memoryPanelOpen.value) return t('memory.toolClose')
  return t('memory.toolDescription')
})
const debugReportLabel = computed(() => {
  if (debugReportState.value === 'running') return t('debugReport.toolCollecting')
  if (debugReportState.value === 'error') return t('debugReport.toolAttention')
  if (debugReportState.value === 'complete' && debugReport.value) {
    const issues = debugReport.value.summary.consoleErrors
      + debugReport.value.summary.consoleWarnings
      + debugReport.value.summary.failedRequests
    return issues ? t('debugReport.toolSignals', { count: localNumber(issues) }, issues) : t('debugReport.toolClear')
  }
  return t('debugReport.toolDescription')
})
const debugReportSignalCount = computed(() => debugReport.value
  ? debugReport.value.summary.consoleErrors
    + debugReport.value.summary.consoleWarnings
    + debugReport.value.summary.failedRequests
  : 0)
const reproLabel = computed(() => {
  const recording = activeTab.value?.reproRecording
  if (recording?.active) return t('repro.toolRecording', { steps: t('repro.stepCount', { count: localNumber(recording.stepCount) }, recording.stepCount) })
  if (reproRecording.value?.stepCount) return t('repro.toolReady', { steps: t('repro.stepCount', { count: localNumber(reproRecording.value.stepCount) }, reproRecording.value.stepCount) })
  return t('repro.toolDescription')
})
const domChangesLabel = computed(() => {
  const recording = activeTab.value?.domChangesRecording
  if (recording?.active) return t('domChanges.toolRecording', { changes: t('domChanges.mutations', { count: localNumber(recording.changeCount) }, recording.changeCount) })
  if (domChangesReport.value?.changeCount) {
    return t('domChanges.toolReady', { changes: t('domChanges.mutations', { count: localNumber(domChangesReport.value.changeCount) }, domChangesReport.value.changeCount) })
  }
  return t('domChanges.toolDescription')
})
const visualCompareLabel = computed(() => {
  if (visualCompareState.value === 'loading') return t('visualCompare.toolCapturing')
  if (visualCompareState.value === 'error') return t('visualCompare.toolAttention')
  if (visualCompareReport.value?.status === 'compared') {
    return visualCompareReport.value.identical
      ? t('visualCompare.toolIdentical')
      : t('visualCompare.toolChanged', { percent: localPercent(visualCompareReport.value.changedPercent ?? 0, 2) })
  }
  if (visualCompareReport.value?.status === 'baseline') return t('visualCompare.toolBaseline')
  return t('visualCompare.toolDescription')
})
const activeInspectorIssueCount = computed(() => activeTab.value?.inspectorIssueCount ?? 0)
const inspectorIssuesLabel = computed(() => {
  const count = activeInspectorIssueCount.value
  return count ? t('issues.toolCount', { count: localNumber(count) }, count) : t('issues.toolDescription')
})
const homeTab = computed(() => state.value.tabs.find((tab) => tab.url.startsWith('bronom://home')))
const regularTabs = computed(() => state.value.tabs.filter((tab) => !tab.url.startsWith('bronom://home')))
function tabGroupStyle(tab: BrowserTabState): Record<string, string> | undefined {
  if (!tab.mcpGroupId) return undefined
  const color = state.value.mcpTabGroups.find((group) => group.id === tab.mcpGroupId)?.color ?? defaultTabGroupColor(tab.mcpGroupId)
  return { '--tab-group-color': BROWSER_TAB_GROUP_COLOR_HEX[color] }
}
function tabGroupColorStyle(color: BrowserTabGroupColor): Record<string, string> {
  return { '--tab-group-color': BROWSER_TAB_GROUP_COLOR_HEX[color] }
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
function expandTabGroup(groupId: string): void {
  if (!collapsedTabGroupIds.value.has(groupId)) return
  const next = new Set(collapsedTabGroupIds.value)
  next.delete(groupId)
  collapsedTabGroupIds.value = next
  persistCollapsedTabGroups()
}
function expandTabGroupForTab(tab: BrowserTabState): void {
  if (tab.mcpGroupId) expandTabGroup(tab.mcpGroupId)
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
  activePanelId.value ? detachedPanelLabel(activePanelId.value) : t('shell.pageTools.heading')
))
const showUpdateStatusPill = computed(() => (
  updateNoticeOpen.value
  && !settingsOpen.value
  && shouldShowUpdateStatusPill(updateState.value.status)
))
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
const activeAddressKind = computed(() => activeWebUrl.value?.startsWith('https:') ? t('runtime.address.https') : t('runtime.address.http'))
const activeCredentials = computed(() => credentials.value.filter((credential) => credential.origin === activeOrigin.value))
const activeDownloads = computed(() => downloads.value.filter((download) => download.state === 'progressing'))
const activeWebUrl = computed(() => {
  try {
    const url = new URL(activeTab.value?.url ?? '')
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
})
const activeTabUsesDefaultProfile = computed(() => {
  const workspaceId = activeTab.value?.mcpGroupId
  if (!workspaceId) return true
  return state.value.mcpTabGroups.find((workspace) => workspace.id === workspaceId)?.isDefault !== false
})
const currentBookmark = computed(() => bookmarks.value.find((bookmark) => bookmark.url === activeWebUrl.value))
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
const downloadButtonLabel = computed(() => {
  if (activeDownloads.value.length) return t('runtime.downloads.progress', { count: localNumber(activeDownloads.value.length) }, activeDownloads.value.length)
  if (downloads.value[0]?.state === 'completed') return t('runtime.downloads.complete', { filename: downloads.value[0].filename })
  if (downloads.value.length) return t('runtime.downloads.recent')
  return t('runtime.downloads.heading')
})
const mcpStatusLabel = computed(() => {
  if (mcpCopied.value) return t('runtime.mcp.copied')
  if (mcpControl.value.status === 'starting') return t('runtime.mcp.starting')
  if (mcpControl.value.status === 'paused') return t('runtime.mcp.paused')
  if (mcpControl.value.status === 'error') return t('runtime.mcp.error')
  return t('runtime.mcp.ready')
})
const mcpStatusTitle = computed(() => {
  if (mcpControl.value.status === 'error') return t('runtime.mcp.failed', { error: mcpControl.value.error ?? t('runtime.mcp.unknown') })
  if (mcpControl.value.status === 'starting') return t('runtime.mcp.startingAt', { url: state.value.mcpUrl })
  return t('runtime.mcp.title', { url: state.value.mcpUrl })
})
const canToggleMcpPaused = computed(() => mcpControl.value.status === 'ready' || mcpControl.value.status === 'paused')
const elementPickerLabel = computed(() => {
  if (elementPickerState.value === 'picking') return elementPickerMode.value === 'screenshot'
    ? t('runtime.capture.cancelElementScreenshot')
    : t('runtime.capture.cancelElement')
  if (elementPickerState.value === 'copied') return elementPickerMode.value === 'screenshot'
    ? t('runtime.capture.elementScreenshotCopied')
    : t('runtime.capture.elementCopied')
  if (elementPickerState.value === 'error') return elementPickerMode.value === 'screenshot'
    ? t('runtime.capture.elementScreenshotFailed')
    : t('runtime.capture.elementFailed')
  return t('runtime.capture.selectElement')
})
const contextPickerLabel = computed(() => elementPickerMode.value === 'context'
  ? elementPickerLabel.value
  : t('runtime.capture.selectElement'))
const elementScreenshotLabel = computed(() => elementPickerMode.value === 'screenshot'
  ? elementPickerLabel.value
  : t('runtime.capture.selectScreenshot'))
const elementPickerTitle = computed(() => elementPickerState.value === 'idle'
  ? `${elementPickerLabel.value} (Ctrl+Shift+C / Cmd+Option+C)`
  : elementPickerLabel.value)
const areaCaptureLabel = computed(() => {
  if (areaCaptureState.value === 'picking') return t('runtime.capture.cancelArea')
  if (areaCaptureState.value === 'capturing') return screenshotCaptureMode.value === 'full-page'
    ? t('runtime.capture.capturingFull')
    : t('runtime.capture.capturingViewport')
  if (areaCaptureState.value === 'copied') {
    if (screenshotCaptureMode.value === 'viewport') return t('runtime.capture.viewportCopied')
    if (screenshotCaptureMode.value === 'full-page') return t('runtime.capture.fullCopied')
    return t('runtime.capture.areaCopied')
  }
  if (areaCaptureState.value === 'error') return areaCaptureError.value || t('runtime.capture.failed')
  return t('runtime.capture.area')
})
const tabHumanInteractionLocked = computed(() => activeTab.value?.humanInteractionLocked === true)
const effectiveHumanInteractionLocked = computed(() => (
  state.value.allHumanInteractionLocked || tabHumanInteractionLocked.value
))
const tabInteractionLockLabel = computed(() => {
  if (activeIsHome.value) return t('runtime.locks.websiteOnly')
  if (state.value.allHumanInteractionLocked) return t('runtime.locks.allLocked')
  return tabHumanInteractionLocked.value
    ? t('runtime.locks.unlockTab')
    : t('runtime.locks.lockTab')
})
const allInteractionLockLabel = computed(() => (
  state.value.allHumanInteractionLocked
    ? t('runtime.locks.unlockAll')
    : t('runtime.locks.lockAll')
))
const pdfExportLabel = computed(() => {
  if (pdfExportState.value === 'saving') return t('runtime.pdf.saving')
  if (pdfExportState.value === 'saved') return t('runtime.pdf.saved', { path: pdfExport.value?.path ?? t('runtime.pdf.directory') })
  if (pdfExportState.value === 'error') return t('runtime.pdf.failed')
  return t('runtime.pdf.save')
})

function formatBytes(bytes: number): string {
  return formatLocalizedBytes(resolvedLocale.value, bytes)
}

function localNumber(value: number): string {
  return formatNumber(resolvedLocale.value, value)
}

function localDateTime(value: Date | number | string): string {
  return formatDateTime(resolvedLocale.value, value)
}

function localTime(value: Date | number | string): string {
  return formatTime(resolvedLocale.value, value)
}

function localPercent(percent: number, maximumFractionDigits = 0): string {
  return formatPercent(resolvedLocale.value, percent / 100, { maximumFractionDigits })
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
  if (!downloadsOpen.value) downloads.value = await window.bronomDownloads.list()
  downloadsOpen.value = !downloadsOpen.value
}

async function toggleBookmarks(): Promise<void> {
  settingsOpen.value = false
  downloadsOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  await bookmarksPanel.value?.toggle()
}

async function toggleCurrentBookmark(): Promise<void> {
  downloadsOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  await bookmarksPanel.value?.toggleCurrent()
}

async function openBookmark(bookmark: BrowserBookmark): Promise<void> {
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

async function toggleVisitHistory(): Promise<void> {
  settingsOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  tabSearchOpen.value = false
  await historyPanel.value?.toggle()
}

function resetSiteStorageView(closePanel = false): void {
  siteStoragePanel.value?.reset(closePanel)
  if (closePanel && !keepsSeparatePanelOpen()) siteStorageOpen.value = false
}

async function refreshSiteStorage(): Promise<void> {
  await nextTick()
  await siteStoragePanel.value?.refresh()
}

async function openSiteStorage(): Promise<void> {
  settingsOpen.value = false
  siteControlsOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  tabSearchOpen.value = false
  zoomOpen.value = false
  addressSuggestionsOpen.value = false
  siteStorageOpen.value = true
  await nextTick()
  siteStoragePanel.value?.reset()
  await siteStoragePanel.value?.refresh()
}

async function toggleSiteStorage(): Promise<void> {
  if (siteStorageOpen.value) {
    siteStorageOpen.value = false
    return
  }
  await openSiteStorage()
}

async function openTabGroupEditor(groupId: string): Promise<void> {
  await workspaceEditor.value?.openExisting(groupId)
}

async function openNewWorkspaceEditor(): Promise<void> {
  await workspaceEditor.value?.openNew()
}

function closeWorkspaceEditor(): void {
  workspaceEditor.value?.close()
}

async function openHistoryEntry(entry: BrowserHistoryEntry): Promise<void> {
  await syncState(browser.newTab({ url: entry.url, active: true }))
}

async function toggleTabSearch(): Promise<void> {
  if (tabSearchOpen.value) {
    tabSearchPanel.value?.close()
    tabSearchOpen.value = false
    return
  }
  settingsOpen.value = false
  updateNoticeOpen.value = false
  downloadsOpen.value = false
  bookmarksOpen.value = false
  historyOpen.value = false
  zoomOpen.value = false
  const stopFind = findOpen.value ? closeFind() : undefined
  await tabSearchPanel.value?.openPanel()
  await stopFind
}

async function toggleCommandPalette(): Promise<void> {
  if (commandPaletteOpen.value) {
    commandPalette.value?.close()
    commandPaletteOpen.value = false
    return
  }
  settingsOpen.value = false
  helpDialog.value = null
  closeTransientPanels()
  await commandPalette.value?.openPanel()
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

function networkEmulationLabel(network: BrowserEmulationState['network']): string {
  if (network === 'slow-3g') return t('environment.network.slow3g')
  if (network === 'slow-4g') return t('environment.network.slow4g')
  if (network === 'fast-4g') return t('environment.network.fast4g')
  if (network === 'offline') return t('environment.network.offline')
  return t('runtime.emulation.normal')
}

function emulationLabel(emulation: BrowserEmulationState): string {
  if (emulation.network !== 'none') return networkEmulationLabel(emulation.network)
  if (emulation.cacheDisabled) return t('runtime.emulation.cacheDisabled')
  if (emulation.bypassServiceWorker) return t('runtime.emulation.workerBypassed')
  if (emulation.dataSaver !== 'auto') return t(emulation.dataSaver === 'enabled' ? 'runtime.emulation.dataSaverOn' : 'runtime.emulation.dataSaverOff')
  if (emulation.javaScriptDisabled) return t('runtime.emulation.jsDisabled')
  if (emulation.viewport) return t('runtimeDetails.emulation.viewport', { size: `${localNumber(emulation.viewport.width)}×${localNumber(emulation.viewport.height)}`, scale: localNumber(emulation.viewport.deviceScaleFactor), mobile: emulation.viewport.mobile ? t('runtimeDetails.emulation.mobile') : '', touch: '', orientation: emulation.viewport.orientation })
  if (emulation.locale) return t('runtimeDetails.emulation.locale', { locale: emulation.locale })
  if (emulation.timezoneId) return emulation.timezoneId
  if (emulation.geolocation) return t('runtime.emulation.location')
  if (emulation.cpuThrottlingRate > 1) return t('runtimeDetails.emulation.cpu', { rate: localNumber(emulation.cpuThrottlingRate) })
  if ((emulation.animationPlaybackRate ?? 1) !== 1) return emulation.animationPlaybackRate === 0 ? t('runtime.emulation.animationsPaused') : t('runtime.emulation.animations', { percent: localPercent(emulation.animationPlaybackRate! * 100) })
  if (emulation.colorScheme !== 'auto') return t(emulation.colorScheme === 'dark' ? 'runtime.emulation.darkMode' : 'runtime.emulation.lightMode')
  if (emulation.reducedMotion !== 'auto') return t(emulation.reducedMotion === 'reduce' ? 'runtime.emulation.reducedMotion' : 'runtime.emulation.fullMotion')
  if (emulation.mediaType !== 'auto') return t(emulation.mediaType === 'print' ? 'runtime.emulation.printMedia' : 'runtime.emulation.screenMedia')
  if (emulation.forcedColors !== 'auto') return t(emulation.forcedColors === 'active' ? 'runtime.emulation.forcedColors' : 'runtime.emulation.noForcedColors')
  if (emulation.contrast !== 'auto') return t('runtimeDetails.emulation.contrast', { contrast: emulation.contrast })
  if (emulation.reducedTransparency !== 'auto') return t(emulation.reducedTransparency === 'reduce' ? 'runtime.emulation.reducedTransparency' : 'runtime.emulation.fullTransparency')
  if (emulation.visionDeficiency !== 'none') return visionDeficiencyLabel(emulation.visionDeficiency)
  if (emulation.renderingDebug?.paintFlashing) return t('runtime.emulation.paint')
  if (emulation.renderingDebug?.layoutShiftRegions) return t('runtime.emulation.shifts')
  if (emulation.renderingDebug?.layerBorders) return t('runtime.emulation.layers')
  if (emulation.renderingDebug?.fpsCounter) return t('runtime.emulation.frames')
  if (emulation.renderingDebug?.scrollBottlenecks) return t('runtime.emulation.scroll')
  if (emulation.extraHttpHeaderNames?.length) return t('runtimeDetails.headers', { count: localNumber(emulation.extraHttpHeaderNames.length) }, emulation.extraHttpHeaderNames.length)
  return t('runtime.emulation.custom')
}

function emulationDescription(emulation: BrowserEmulationState): string {
  const conditions: string[] = []
  if (emulation.network !== 'none') conditions.push(networkEmulationLabel(emulation.network))
  if (emulation.cacheDisabled) conditions.push(t('runtimeDetails.emulation.cache'))
  if (emulation.bypassServiceWorker) conditions.push(t('runtimeDetails.emulation.worker'))
  if (emulation.dataSaver !== 'auto') conditions.push(t('runtimeDetails.emulation.dataSaver', { state: t(emulation.dataSaver === 'enabled' ? 'runtimeDetails.emulation.on' : 'runtimeDetails.emulation.off') }))
  if (emulation.javaScriptDisabled) conditions.push(t('runtimeDetails.emulation.js'))
  if (emulation.viewport) {
    conditions.push(t('runtimeDetails.emulation.viewport', { size: `${localNumber(emulation.viewport.width)}×${localNumber(emulation.viewport.height)}`, scale: localNumber(emulation.viewport.deviceScaleFactor), mobile: emulation.viewport.mobile ? t('runtimeDetails.emulation.mobile') : '', touch: emulation.viewport.touch ? t('runtimeDetails.emulation.touch') : '', orientation: emulation.viewport.orientation }))
  }
  if (emulation.geolocation) conditions.push(t('runtimeDetails.emulation.geolocation'))
  if (emulation.locale) conditions.push(t('runtimeDetails.emulation.locale', { locale: emulation.locale }))
  if (emulation.timezoneId) conditions.push(t('runtimeDetails.emulation.timezone', { timezone: emulation.timezoneId }))
  if (emulation.cpuThrottlingRate > 1) conditions.push(t('runtimeDetails.emulation.cpu', { rate: localNumber(emulation.cpuThrottlingRate) }))
  if ((emulation.animationPlaybackRate ?? 1) !== 1) conditions.push(emulation.animationPlaybackRate === 0 ? t('runtimeDetails.emulation.animationsPaused') : t('runtimeDetails.emulation.animations', { percent: localPercent(emulation.animationPlaybackRate! * 100) }))
  if (emulation.colorScheme !== 'auto') conditions.push(t('runtimeDetails.emulation.color', { scheme: emulation.colorScheme }))
  if (emulation.reducedMotion !== 'auto') conditions.push(t(emulation.reducedMotion === 'reduce' ? 'runtimeDetails.emulation.reducedMotion' : 'runtimeDetails.emulation.fullMotion'))
  if (emulation.mediaType !== 'auto') conditions.push(t('runtimeDetails.emulation.media', { media: emulation.mediaType }))
  if (emulation.forcedColors !== 'auto') conditions.push(t('runtimeDetails.emulation.forced', { state: emulation.forcedColors }))
  if (emulation.contrast !== 'auto') conditions.push(t('runtimeDetails.emulation.contrast', { contrast: emulation.contrast }))
  if (emulation.reducedTransparency !== 'auto') conditions.push(t(emulation.reducedTransparency === 'reduce' ? 'runtimeDetails.emulation.reducedTransparency' : 'runtimeDetails.emulation.fullTransparency'))
  if (emulation.visionDeficiency !== 'none') conditions.push(t('runtimeDetails.emulation.vision', { vision: visionDeficiencyLabel(emulation.visionDeficiency) }))
  if (emulation.renderingDebug?.paintFlashing) conditions.push(t('runtimeDetails.emulation.paint'))
  if (emulation.renderingDebug?.layoutShiftRegions) conditions.push(t('runtimeDetails.emulation.shifts'))
  if (emulation.renderingDebug?.layerBorders) conditions.push(t('runtimeDetails.emulation.layers'))
  if (emulation.renderingDebug?.fpsCounter) conditions.push(t('runtimeDetails.emulation.frames'))
  if (emulation.renderingDebug?.scrollBottlenecks) conditions.push(t('runtimeDetails.emulation.scroll'))
  if (emulation.userAgent) conditions.push(t('runtimeDetails.emulation.userAgent'))
  if (emulation.extraHttpHeaderNames?.length) {
    conditions.push(t('runtimeDetails.emulation.customHeaders', { count: localNumber(emulation.extraHttpHeaderNames.length) }, emulation.extraHttpHeaderNames.length))
  }
  return conditions.join(', ') || t('runtimeDetails.emulation.custom')
}

function visionDeficiencyLabel(value: BrowserEmulationState['visionDeficiency']): string {
  if (value === 'blurredVision') return t('environment.rendering.blurred')
  if (value === 'reducedContrast') return t('environment.rendering.reducedContrast')
  if (value === 'protanopia') return t('environment.rendering.protanopia')
  if (value === 'deuteranopia') return t('environment.rendering.deuteranopia')
  if (value === 'tritanopia') return t('environment.rendering.tritanopia')
  if (value === 'achromatopsia') return t('environment.rendering.achromatopsia')
  return t('environment.rendering.noSimulation')
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

function beginEmulationMutation(): number {
  return ++emulationMutationSequence
}

function isEmulationMutationCurrent(sequence: number, tabId: string): boolean {
  return sequence === emulationMutationSequence && activeTab.value?.id === tabId
}

function commitBrowserState(nextState: BrowserState): void {
  state.value = nextState
}

function setResponsiveTabViewport(
  tabId: string,
  viewport: NonNullable<BrowserEmulationState['viewport']> | null
): Promise<BrowserState> {
  return browser.setTabViewport(tabId, viewport)
}

function loadResponsiveDraft(viewport = activeEmulation.value?.viewport): void {
  responsivePanel.value?.loadDraft(viewport)
}

function resetResponsiveFeedback(): void {
  responsivePanel.value?.resetFeedback()
}

function toggleResponsivePreview(): void {
  responsivePanel.value?.toggle()
}

function loadEnvironmentDraft(emulation = activeEmulation.value): void {
  environmentController.loadDraft(emulation)
}

function toggleEnvironment(): void {
  environmentController.toggle()
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
    void refreshPrivacySettings()
  }
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
    siteDataController.reset()
    addressSuggestionsOpen.value = false
    if (!keepPanelOpen) {
      siteControlsOpen.value = false
      pageToolsOpen.value = false
      responsivePanelOpen.value = false
      environmentPanelOpen.value = false
    }
    resetSiteStorageView(true)
    if (responsivePanelOpen.value && keepPanelOpen) loadResponsiveDraft(activeEmulation.value?.viewport)
    else resetResponsiveFeedback()
    if (environmentPanelOpen.value && keepPanelOpen) loadEnvironmentDraft(activeEmulation.value)
    else environmentController.resetFeedback()
    resetConsoleView(true)
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
    siteDataController.reset()
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
    resetConsoleView(true)
    resetNetworkMonitorView(true)
    if (responsivePanelOpen.value) {
      if (!keepPanelOpen) responsivePanelOpen.value = false
      else loadResponsiveDraft(tab?.emulation?.viewport)
    } else resetResponsiveFeedback()
    if (environmentPanelOpen.value) {
      if (!keepPanelOpen) environmentPanelOpen.value = false
      else loadEnvironmentDraft(tab?.emulation)
    } else environmentController.resetFeedback()
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

async function syncState(next: Promise<BrowserState> | BrowserState): Promise<void> {
  await browserStore.syncOperation(Promise.resolve(next))
}

async function selectBrowserTab(tabId: string): Promise<boolean> {
  try {
    await syncState(browser.selectTab(tabId))
    return true
  } catch (error) {
    showAppToast('error', t('runtime.workspace.openFailed'), friendlyUiError(error, t('runtime.workspace.openDescription')))
    return false
  }
}

async function navigate(): Promise<void> {
  if (!address.value.trim()) return
  closeAddressSuggestions()
  try {
    await syncState(browser.navigate({ url: address.value, tabId: state.value.activeTabId ?? undefined }))
  } catch (error) {
    showAppToast('error', t('runtime.navigation.failed'), friendlyUiError(error, t('runtime.navigation.failedDescription')))
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
  await siteDataController.refresh()
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
  if (!activeTabUsesDefaultProfile.value) {
    await openSiteStorage()
    return
  }
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
    theme: addressSuggestionTheme.value,
    locale: resolvedLocale.value
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
  if (suggestion.kind === 'bookmark') return t('runtime.suggestion.bookmark')
  return suggestion.visitCount && suggestion.visitCount > 1 ? t('runtime.suggestion.visits', { count: localNumber(suggestion.visitCount) }) : t('runtime.suggestion.history')
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
  if (state.value.allHumanInteractionLocked && action === 'close-tab') return
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

async function newTabInWorkspace(groupId: string): Promise<void> {
  if (state.value.allHumanInteractionLocked) return
  const workspace = state.value.mcpTabGroups.find((candidate) => candidate.id === groupId)
  if (!workspace) return
  settingsOpen.value = false
  tabSearchOpen.value = false
  try {
    await syncState(browser.newTab({ active: true, mcpGroupId: groupId }))
    expandTabGroup(groupId)
    await focusAddress()
  } catch (error) {
    showAppToast('error', t('runtime.workspace.newTabFailed'), friendlyUiError(error, t('runtime.workspace.newTabDescription', { workspace: workspace.name })))
  }
}

async function showWorkspaceContextMenu(groupId: string): Promise<void> {
  const firstTab = tabGroupTabs(groupId)[0]
  if (firstTab) await browser.showTabContextMenu(firstTab.id)
  else await openTabGroupEditor(groupId)
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
    t('runtimeActions.workspace.splitOpen')
  )
}

async function changeSplitLayout(orientation: BrowserSplitOrientation): Promise<void> {
  await updateSplitState(
    browser.updateSplitView({ orientation }),
    t('runtimeActions.workspace.splitLayout')
  )
}

async function changeSplitRatio(event: Event): Promise<void> {
  const ratio = Number((event.target as HTMLInputElement).value) / 100
  await updateSplitState(
    browser.updateSplitView({ ratio }),
    t('runtimeActions.workspace.splitSize')
  )
}

async function swapSplitTabs(): Promise<void> {
  await updateSplitState(
    browser.updateSplitView({ swap: true }),
    t('runtimeActions.workspace.splitSwap')
  )
}

async function exitSplitView(): Promise<void> {
  splitMenuOpen.value = false
  await updateSplitState(
    browser.closeSplitView(),
    t('runtimeActions.workspace.splitClose')
  )
}

async function updateSplitState(next: Promise<BrowserState>, fallback: string): Promise<void> {
  try {
    await syncState(next)
  } catch (error) {
    showAppToast('error', t('runtime.workspace.splitFailed'), friendlyUiError(error, fallback))
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

async function closeTab(event: MouseEvent, tabId: string): Promise<void> {
  event.stopPropagation()
  if (state.value.allHumanInteractionLocked) return
  await syncState(browser.closeTab(tabId))
}

function tabTooltip(tab: BrowserTabState): string {
  const pinned = tab.pinned ? t('runtimeDetails.tab.pinned') : ''
  const sleeping = tab.sleeping ? t('runtimeDetails.tab.sleeping') : ''
  const audio = tab.muted ? t('runtimeDetails.tab.muted') : tab.audible ? t('runtimeDetails.tab.audio') : ''
  const locked = state.value.allHumanInteractionLocked || tab.humanInteractionLocked ? t('runtimeDetails.tab.locked') : ''
  const problem = tab.pageProblem ? t('runtimeDetails.tab.problem', { problem: tab.pageProblem.title }) : ''
  const emulation = tab.emulation ? t('runtimeDetails.tab.emulated', { description: emulationDescription(tab.emulation) }) : ''
  const networkRoutes = tab.networkRouteCount ? t('runtimeDetails.tab.routes', { count: localNumber(tab.networkRouteCount) }, tab.networkRouteCount) : ''
  const split = state.value.splitView?.firstTabId === tab.id || state.value.splitView?.secondTabId === tab.id ? t('runtimeDetails.tab.split') : ''
  const workspace = tab.mcpGroupName ? t('runtimeDetails.tab.workspace', { name: tab.mcpGroupName }) : ''
  return `${tab.title || t('tabSearch.newTabTitle')}${problem}${pinned}${sleeping}${audio}${locked}${emulation}${networkRoutes}${split}${workspace}`
}

function pageProblemDetails(tab: BrowserTabState): string {
  const problem = tab.pageProblem
  if (!problem) return ''
  if (problem.kind === 'load-error' && problem.errorDescription) {
    return `${problem.errorDescription}${problem.errorCode ? ` (${problem.errorCode})` : ''}`
  }
  if (problem.kind === 'renderer-gone' && problem.reason) {
    return problem.exitCode !== undefined ? t('runtimeDetails.tab.exit', { reason: problem.reason, code: localNumber(problem.exitCode) }) : problem.reason
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

function resetConsoleView(closePanel = false): void {
  consolePanel.value?.reset(closePanel)
  if (closePanel && !keepsSeparatePanelOpen()) consolePanelOpen.value = false
}

async function refreshConsole(clear = false): Promise<void> {
  await nextTick()
  await consolePanel.value?.refresh(clear)
}

 function toggleConsole(): void {
  if (consolePanelOpen.value) {
    consolePanelOpen.value = false
    return
  }
  closeTransientPanels()
  consolePanelOpen.value = true
}

function resetNetworkMonitorView(closePanel = false): void {
  networkPanel.value?.reset(closePanel)
  if (closePanel && !keepsSeparatePanelOpen()) networkMonitorOpen.value = false
}

async function refreshNetworkMonitor(clear = false): Promise<void> {
  await nextTick()
  await networkPanel.value?.refresh(clear)
}

async function refreshNetworkRoutes(silent = false): Promise<void> {
  await nextTick()
  await networkPanel.value?.refreshRoutes(silent)
}

async function refreshNetwork(): Promise<void> {
  await nextTick()
  await networkPanel.value?.refreshAll()
}

function toggleNetworkMonitor(): void {
  if (networkMonitorOpen.value) {
    networkMonitorOpen.value = false
    return
  }
  closeTransientPanels()
  networkMonitorOpen.value = true
  void refreshNetwork()
}

async function openRequestConditions(): Promise<void> {
  if (!networkMonitorOpen.value) {
    closeTransientPanels()
    networkMonitorOpen.value = true
    await nextTick()
  }
  await networkPanel.value?.openRequestConditions()
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

function describeTabEmulation(tab: BrowserTabState): string {
  return tab.emulation ? emulationDescription(tab.emulation) : ''
}

function showTabSearchError(title: string, message: string): void {
  showAppToast('error', title, message)
}

async function copyAppText(text: string): Promise<boolean> {
  try {
    await browser.copyText(text)
    return true
  } catch (error) {
    showAppToast('error', t('runtime.capture.copyFailed'), friendlyUiError(error, t('runtime.capture.clipboardFailed')))
    return false
  }
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
        t(mode === 'screenshot' ? 'runtime.toast.elementScreenshotCopied' : 'runtime.toast.elementCopied'),
        t(mode === 'screenshot' ? 'runtime.capture.pastePng' : 'runtime.capture.safeContext')
      )
      resetElementPickerSoon()
    }
  } catch (error) {
    if (elementPickerTabId !== tabId) return
    elementPickerTabId = undefined
    elementPickerState.value = 'error'
    showAppToast(
      'error',
      t(mode === 'screenshot' ? 'runtime.toast.elementScreenshotFailed' : 'runtime.toast.elementFailed'),
      friendlyUiError(error, t(mode === 'screenshot' ? 'runtime.toast.elementScreenshotDescription' : 'runtime.toast.elementDescription'))
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
      showAppToast('success', t('runtime.toast.areaCopied'), t('runtime.capture.pastePng'))
      resetAreaCaptureSoon()
    }
  } catch (error) {
    if (areaCaptureTabId !== tabId) return
    areaCaptureTabId = undefined
    const message = friendlyUiError(error, t('runtimeActions.capture.areaFallback'))
    areaCaptureError.value = t('runtimeActions.capture.areaCopyFailed', { error: message })
    areaCaptureState.value = 'error'
    showAppToast('error', t('runtime.capture.screenshotFailed'), message)
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
      showAppToast('success', t(mode === 'full-page' ? 'runtime.toast.fullCopied' : 'runtime.toast.viewportCopied'), t('runtime.capture.pastePng'))
      resetAreaCaptureSoon()
    }
  } catch (error) {
    if (areaCaptureTabId !== tabId) return
    areaCaptureTabId = undefined
    const captureName = t(mode === 'full-page' ? 'runtimeActions.capture.fullPage' : 'runtimeActions.capture.viewport')
    const message = friendlyUiError(error, t('runtimeActions.capture.pageFallback', { area: captureName }))
    areaCaptureError.value = t('runtimeActions.capture.pageCopyFailed', { area: captureName, error: message })
    areaCaptureState.value = 'error'
    showAppToast('error', t('runtime.capture.screenshotFailed'), message)
    resetAreaCaptureSoon()
  }
}

function applyTheme(next: AppSettings): void {
  settings.value = next
  setFoley({ muted: !next.attentionSound })
  const effectiveTheme = next.theme === 'system' ? systemTheme.value : next.theme
  document.documentElement.dataset.themePreference = next.theme
  document.documentElement.dataset.theme = effectiveTheme
  document.documentElement.style.colorScheme = effectiveTheme === 'light' ? 'light' : 'dark'
}

watch([settings, systemTheme], () => applyTheme(settings.value), { deep: true, immediate: true })

function handleExtractedSettingError(error: unknown): void {
  showAppToast('error', t('runtime.toast.settingNotSaved'), friendlyUiError(error, t('runtime.toast.settingKept')))
}

async function applySettingsChange(operation: Promise<AppSettings>): Promise<boolean> {
  try {
    applyTheme(await operation)
    return true
  } catch (error) {
    showAppToast('error', t('runtime.toast.settingNotSaved'), friendlyUiError(error, t('runtime.toast.settingKept')))
    return false
  }
}

async function selectTheme(theme: ThemeName): Promise<boolean> {
  return applySettingsChange(window.bronomSettings.setTheme(theme))
}

async function selectSearchEngine(searchEngine: SearchEngineName): Promise<boolean> {
  return applySettingsChange(window.bronomSettings.setSearchEngine(searchEngine))
}

function testAttentionSound(): void {
  playFoley(settings.value.attentionSoundCue, { volume: 0.65 })
}

async function setSitePermission(entry: SitePermissionEntry, decision: SitePermissionDecision): Promise<boolean> {
  return setSitePermissionDecision(entry, decision)
}

async function resetSitePermissionFromControls(entry: SitePermissionEntry): Promise<boolean> {
  const removed = await removeSitePermission(entry)
  await nextTick()
  siteControlsOpen.value = true
  await nextTick()
  siteControlsButton.value?.focus()
  return removed
}

async function fillSavedPassword(): Promise<void> {
  if (!activeTab.value || !activeCredentials.value.length) return
  if (activeCredentials.value.length === 1) {
    await fillSelectedCredential(activeCredentials.value[0])
    return
  }
  await credentialPicker.value?.openPanel()
}

async function fillSelectedCredential(credential: CredentialSummary): Promise<void> {
  const tabId = activeTab.value?.id
  if (!tabId || credentialFillState.value === 'filling') return
  credentialPickerOpen.value = false
  credentialFillState.value = 'filling'
  try {
    const filled = await window.bronomCredentials.fill(tabId, credential.id)
    if (!filled) throw new Error(t('runtimeActions.credential.noLongerMatches'))
    showAppToast('success', t('runtime.toast.passwordFilled'), t('runtime.toast.passwordFilledDescription', { username: credential.username || t('credentialPicker.unnamed') }))
  } catch (error) {
    showAppToast('error', t('runtime.toast.passwordFillFailed'), friendlyUiError(error, t('runtime.toast.passwordFillDescription')))
  } finally {
    credentialFillState.value = 'idle'
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
}

function toggleSettings(): void {
  const open = !settingsOpen.value
  helpDialog.value = null
  closeTransientPanels()
  settingsOpen.value = open
}

async function resetCurrentSection(): Promise<void> {
  if (settingsSection.value === 'appearance') {
    if (!(await selectTheme('system'))) return
    if (!(await applySettingsChange(window.bronomSettings.setInterfaceScale(DEFAULT_INTERFACE_SCALE)))) return
    if (!(await applySettingsChange(window.bronomSettings.setHideInTray(true)))) return
    if (!(await applySettingsChange(window.bronomSettings.setAttentionSound(true)))) return
    await applySettingsChange(window.bronomSettings.setAttentionSoundCue('warning'))
    return
  }
  if (settingsSection.value === 'search') {
    await selectSearchEngine('google')
    return
  }
  if (settingsSection.value === 'downloads') {
    await resetDownloadSettings()
    return
  }
  if (settingsSection.value === 'performance') {
    await resetPerformanceSettings()
    return
  }
  if (settingsSection.value === 'permissions') {
    await clearSitePermissions()
    return
  }
  if (settingsSection.value === 'privacy') {
    resetPrivacySelection()
    return
  }
  if (settingsSection.value === 'mcp') {
    await resetMcpSettings()
    return
  }
  if (settingsSection.value === 'updates') await resetUpdateSettings()
}

function guardShellInteraction(event: Event): void {
  if (
    !state.value.allHumanInteractionLocked
    || !(event.target instanceof Element)
    || event.target.closest('[data-lock-protected-tab-close]') === null
  ) return
  event.preventDefault()
  event.stopImmediatePropagation()
}

function handleKeyDown(event: KeyboardEvent): void {
  const shortcut = browserShortcutAction({
    key: event.key,
    control: event.ctrlKey,
    meta: event.metaKey,
    alt: event.altKey,
    shift: event.shiftKey,
    repeat: event.repeat,
    composing: event.isComposing
  })
  guardShellInteraction(event)
  if (event.defaultPrevented) return
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
  else if (bookmarksOpen.value) bookmarksPanel.value?.handleEscape()
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
  else if (responsivePanelOpen.value) responsivePanel.value?.handleEscape()
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

useShellWindowLifecycle({
  shell,
  onKeyDown: handleKeyDown,
  onWindowResize: handleWindowResize,
  onShellResize: reportShellHeight
})

onMounted(async () => {
  bindFoley()
  await Promise.all([
    browserStore.initialize(),
    initializeUpdateSettings(),
    initializeCommercialLicense()
  ])
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
    unsubscribeAddressOverlayDismissed = window.bronomAddressOverlay.onDismissed(() => {
      addressSuggestionsOpen.value = false
      // Always acknowledge the native dismissal, even if another shell action
      // already closed suggestions and the ref value therefore did not change.
      window.bronomAddressOverlay.hide()
    })
  }
  unsubscribePermissions = window.bronomPermissions.onChanged(replaceSitePermissions)
  unsubscribeCredentials = window.bronomCredentials.onChanged(replaceCredentials)
  unsubscribeUpdateOpen = window.bronomUpdates.onOpenRequested(() => {
    openUpdateSettings()
  })
  unsubscribeHelp = window.bronomShell.onHelpRequested(handleHelpRequested)
  unsubscribeClipboardFailed = window.bronomShell.onClipboardFailed((message) => {
    showAppToast('error', t('runtime.capture.copyFailed'), friendlyUiError(message, t('runtime.capture.clipboardFailed')))
  })
  unsubscribeActionFailed = window.bronomShell.onActionFailed(({ action, message }) => {
    const title = action === 'reload'
      ? t('runtimeActions.actionFailure.reload')
      : action === 'save link'
        ? t('runtimeActions.actionFailure.saveLink')
        : t('runtimeActions.actionFailure.generic')
    showAppToast('error', title, friendlyUiError(message, t('runtime.toast.actionFailed')))
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
  const [systemDownloadDirectory, , mcpControlState, , savedDownloads, savedBookmarks, savedVisitHistory] = await Promise.all([
    window.bronomSettings.getDefaultDownloadDirectory(),
    initializeSitePermissions(window.bronomPermissions.list()),
    window.bronomMcp.getState(),
    initializeCredentials(window.bronomCredentials.status(), window.bronomCredentials.list()),
    window.bronomDownloads.list(),
    window.bronomBookmarks.list(),
    window.bronomHistory.list()
  ])
  defaultDownloadDirectory.value = systemDownloadDirectory
  mcpControl.value = mcpControlState
  downloads.value = savedDownloads
  for (const download of savedDownloads) knownDownloadIds.add(download.id)
  bookmarks.value = savedBookmarks
  visitHistory.value = savedVisitHistory
  await nextTick()
  reportShellHeight()
})

onBeforeUnmount(() => {
  browserStore.dispose()
  settingsStore.dispose()
  unsubscribeMcpActivity?.()
  unsubscribeDownloads?.()
  unsubscribeBookmarks?.()
  unsubscribeHistory?.()
  unsubscribeMcpControl?.()
  unsubscribeUserAttention?.()
  unsubscribeShortcutRequested?.()
  unsubscribePermissions?.()
  unsubscribeCredentials?.()
  unsubscribeUpdateOpen?.()
  unsubscribeHelp?.()
  unsubscribeClipboardFailed?.()
  unsubscribeActionFailed?.()
  unsubscribeTabGroupEdit?.()
  unsubscribeAddressOverlay?.()
  unsubscribeAddressOverlayDismissed?.()
  if (!isDetachedPanelWindow) window.bronomAddressOverlay.hide()
  unsubscribePanelRequested?.()
  unsubscribePanelActive?.()
  unsubscribePanelRedock?.()
  unsubscribePanelClosed?.()
  if (updateNoticeDismissTimer !== undefined) window.clearTimeout(updateNoticeDismissTimer)
  if (elementPickerResetTimer !== undefined) window.clearTimeout(elementPickerResetTimer)
  if (areaCaptureResetTimer !== undefined) window.clearTimeout(areaCaptureResetTimer)
  disposePageExportController()
  disposeDownloadSettingsController()
  disposePerformanceSettingsController()
  disposeMcpSettingsController()
  disposeUpdateSettingsController()
  disposeCommercialLicenseController()
  disposePrivacySettingsController()
  disposeSitePermissionsController()
  disposeCredentialsController()
  disposeDiagnosticsController()
  for (const timer of mcpActivityTimers.values()) window.clearTimeout(timer)
  mcpActivityTimers.clear()
  for (const timer of appToastTimers.values()) window.clearTimeout(timer)
  appToastTimers.clear()
  activeMcpRequestsByTab.clear()
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
        :title="t('shell.home.open')"
        :aria-label="t('shell.home.open')"
        :aria-current="homeTab?.active ? 'page' : undefined"
        @click="openApplicationHome"
      >
        <span v-if="homeTab?.loading" class="spinner" :aria-label="t('shell.loading')" />
        <IconDashboard v-else aria-hidden="true" />
        <span>{{ t('shell.home.label') }}</span>
      </button>
      <span class="topbar-divider" aria-hidden="true" />
      <div class="tabs-strip" role="tablist" :aria-label="t('shell.tabs.list')">
        <template v-for="workspace in state.mcpTabGroups" :key="workspace.id">
          <button
            class="tab-group-label"
            :class="{ active: tabGroupContainsActiveTab(workspace.id) }"
            :style="tabGroupColorStyle(workspace.color)"
            :title="t(isTabGroupCollapsed(workspace.id) ? 'runtime.tabs.expand' : 'runtime.tabs.collapse', { name: workspace.name, id: workspace.id })"
            :aria-label="t(isTabGroupCollapsed(workspace.id) ? 'runtime.tabs.expandAria' : 'runtime.tabs.collapseAria', { name: workspace.name, count: localNumber(tabGroupTabCount(workspace.id)) }, tabGroupTabCount(workspace.id))"
            :aria-expanded="!isTabGroupCollapsed(workspace.id)"
            type="button"
            @click="toggleTabGroup(workspace.id)"
            @contextmenu.prevent="showWorkspaceContextMenu(workspace.id)"
          >
            <IconKeyboardArrowRight v-if="isTabGroupCollapsed(workspace.id)" aria-hidden="true" />
            <IconKeyboardArrowDown v-else aria-hidden="true" />
            <IconKeep
              v-if="workspace.isDefault"
              class="tab-group-default-badge"
              :aria-label="t('shell.tabs.defaultWorkspace')"
            />
            <span>{{ workspace.name }}</span>
            <span class="tab-group-count" aria-hidden="true">{{ tabGroupTabCount(workspace.id) }}</span>
          </button>
          <button
            class="new-tab workspace-new-tab"
            type="button"
            :style="tabGroupColorStyle(workspace.color)"
            :title="t('runtime.tabs.newTab', { name: workspace.name })"
            :aria-label="t('runtime.tabs.newTab', { name: workspace.name })"
            @click="newTabInWorkspace(workspace.id)"
          ><IconAdd aria-hidden="true" /></button>
        <template v-for="tab in tabGroupTabs(workspace.id)" :key="tab.id">
        <button
          v-if="!isTabGroupCollapsed(workspace.id)"
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
          <span v-if="tab.loading" class="spinner" :aria-label="t('shell.loading')" />
          <IconError v-else-if="tab.pageProblem" class="favicon-fallback tab-problem-icon" :aria-label="t('shell.tabs.pageAttention')" />
          <img v-else-if="tab.faviconDataUrl" class="favicon-image" :src="tab.faviconDataUrl" alt="" draggable="false" />
          <span v-else-if="tab.url === 'about:blank'" class="favicon-fallback" aria-hidden="true">✦</span>
          <IconLanguage v-else class="favicon-fallback" aria-hidden="true" />
          <span class="tab-title">{{ tab.title || t('tabSearch.newTabTitle') }}</span>
          <IconBedtime v-if="tab.sleeping" class="tab-sleep-mark" :aria-label="t('shell.tabs.sleeping')" />
          <IconHorizontalSplit
            v-if="state.splitView?.orientation === 'horizontal' && (state.splitView.firstTabId === tab.id || state.splitView.secondTabId === tab.id)"
            class="tab-split-mark"
            :aria-label="t('shell.tabs.stackedVisible')"
          />
          <IconVerticalSplit
            v-else-if="state.splitView && (state.splitView.firstTabId === tab.id || state.splitView.secondTabId === tab.id)"
            class="tab-split-mark"
            :aria-label="t('shell.tabs.sideVisible')"
          />
          <IconSpeed v-if="tab.emulation" class="tab-emulation-mark" :aria-label="t('runtime.emulation.reset', { description: emulationDescription(tab.emulation) })" />
          <IconRoute v-if="tab.networkRouteCount" class="tab-network-route-mark" :aria-label="t('runtime.tabs.routes', { count: localNumber(tab.networkRouteCount) }, tab.networkRouteCount)" />
          <IconLock v-if="state.allHumanInteractionLocked || tab.humanInteractionLocked" class="tab-lock-mark" :aria-label="t('shell.tabs.inputLocked')" />
          <span
            v-if="tab.audible || tab.muted"
            class="tab-audio"
            :class="{ muted: tab.muted }"
            role="button"
            :title="t(tab.muted ? 'runtime.tabs.unmute' : 'runtime.tabs.mute', { title: tab.title || t('runtime.tabs.unnamed') })"
            :aria-label="t(tab.muted ? 'runtime.tabs.unmute' : 'runtime.tabs.mute', { title: tab.title || t('runtime.tabs.unnamed') })"
            :aria-pressed="tab.muted"
            @click="toggleTabMuted($event, tab)"
          >
            <IconVolumeOff v-if="tab.muted" aria-hidden="true" />
            <IconVolumeUp v-else aria-hidden="true" />
          </span>
          <span
            class="tab-close"
            role="button"
            :title="state.allHumanInteractionLocked ? t('runtime.locks.unlockToClose') : t('runtime.locks.closeShortcut')"
            :aria-label="state.allHumanInteractionLocked ? t('runtime.locks.closeUnavailable') : t('tabSearch.closeTab')"
            aria-keyshortcuts="Control+W Meta+W"
            :aria-disabled="state.allHumanInteractionLocked"
            data-lock-protected-tab-close
            @click="closeTab($event, tab.id)"
          ><IconClose aria-hidden="true" /></span>
        </button>
        </template>
        </template>
        <span class="workspace-action-divider" aria-hidden="true" />
        <button class="new-workspace" type="button" :title="t('shell.tabs.createWorkspaceTitle')" :aria-label="t('shell.tabs.createWorkspace')" @click="openNewWorkspaceEditor">
          <IconAddBox aria-hidden="true" />
          <span>{{ t('shell.tabs.workspace') }}</span>
        </button>
      </div>
      <div class="topbar-actions">
        <button
          class="topbar-icon-button command-palette-button"
          type="button"
          :title="t('shell.actions.commandsTitle')"
          :aria-label="t('shell.actions.commands')"
          aria-keyshortcuts="Control+Shift+P Meta+Shift+P"
          :aria-expanded="commandPaletteOpen"
          @click="toggleCommandPalette"
        >
          <IconKeyboardCommandKey aria-hidden="true" />
        </button>
        <button
          class="topbar-icon-button tab-search-button"
          type="button"
          :title="t('shell.actions.searchTabsTitle')"
          :aria-label="t('shell.actions.searchTabs')"
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
          :title="t('shell.actions.historyTitle')"
          :aria-label="t('shell.actions.history')"
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
          {{ state.allHumanInteractionLocked ? t('shell.tabs.locked') : t('shell.tabs.lock') }}
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
            :title="canToggleMcpPaused ? t(mcpControl.paused ? 'runtime.mcp.resumeCommands' : 'runtime.mcp.pauseCommands') : t('runtime.mcp.unavailable')"
            :aria-label="t(mcpControl.paused ? 'runtime.mcp.resumeAgents' : 'runtime.mcp.pauseAgents')"
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
          :title="t('shell.actions.settings')"
          :aria-label="t('shell.actions.settings')"
          :aria-expanded="settingsOpen"
          @click="toggleSettings"
        >
          <IconSettings aria-hidden="true" />
        </button>
      </div>
    </div>
    <div v-if="!activeIsHome" class="toolbar">
      <button class="icon-button" type="button" :title="t('shell.toolbar.back')" :aria-label="t('shell.toolbar.back')" :disabled="!activeTab?.canGoBack" @click="syncState(browser.back())"><IconArrowBack aria-hidden="true" /></button>
      <button class="icon-button" type="button" :title="t('shell.toolbar.forward')" :aria-label="t('shell.toolbar.forward')" :disabled="!activeTab?.canGoForward" @click="syncState(browser.forward())"><IconArrowForward aria-hidden="true" /></button>
      <button class="icon-button" type="button" :title="t(activeTab?.loading ? 'runtime.tabs.stop' : 'runtime.tabs.reload')" :aria-label="t(activeTab?.loading ? 'runtime.tabs.stop' : 'runtime.tabs.reload')" @click="syncState(activeTab?.loading ? browser.stop() : browser.reload())">
        <IconStop v-if="activeTab?.loading" aria-hidden="true" />
        <IconRefresh v-else aria-hidden="true" />
      </button>
      <form ref="addressForm" class="address-form" @submit.prevent="navigate" @focusout="handleAddressFocusOut">
        <button
          ref="siteControlsButton"
          class="site-controls-button"
          :class="{ active: siteControlsOpen, customized: activeSitePermissions.length > 0 }"
          type="button"
          :title="activeWebUrl ? t('runtime.tabs.siteControls', { host: activeHostname }) : t('runtime.tabs.siteControlsAvailable')"
          :aria-label="activeWebUrl ? t('runtime.tabs.siteControls', { host: activeHostname }) : t('runtime.tabs.siteControlsUnavailable')"
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
          :aria-label="t('shell.toolbar.address')"
          role="combobox"
          aria-keyshortcuts="Control+L Meta+L"
          aria-autocomplete="list"
          aria-controls="address-suggestions"
          :aria-expanded="addressSuggestionsVisible"
          :aria-activedescendant="addressSuggestionsVisible && selectedAddressSuggestion ? addressSuggestionId(selectedAddressSuggestion) : undefined"
          autocomplete="off"
          spellcheck="false"
          :placeholder="t('shell.toolbar.addressPlaceholder')"
          @focus="showAddressSuggestions"
          @input="showAddressSuggestions"
          @keydown="handleAddressKeydown"
        />
        <button
          v-if="activeEmulation"
          class="emulation-pill"
          :class="{ offline: activeEmulation.network === 'offline' }"
          type="button"
          :title="t('runtime.emulation.reset', { description: emulationDescription(activeEmulation) })"
          :aria-label="t('runtime.emulation.reset', { description: emulationDescription(activeEmulation) })"
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
          :title="t('shell.pageTools.openRoutes', { count: localNumber(activeNetworkRouteCount) }, activeNetworkRouteCount)"
          :aria-label="t('shell.pageTools.openRoutes', { count: localNumber(activeNetworkRouteCount) }, activeNetworkRouteCount)"
          @click="openRequestConditions"
        >
          <IconRoute aria-hidden="true" />
          <span>{{ t('shell.pageTools.routeCount', { count: localNumber(activeNetworkRouteCount) }, activeNetworkRouteCount) }}</span>
          <IconKeyboardArrowRight aria-hidden="true" />
        </button>
        <SiteControlsPanel
          v-model:open="siteControlsOpen"
          v-model:dock="panelDock"
          :hostname="activeHostname"
          :address-kind="activeAddressKind"
          :origin="activeOrigin"
          :summary="siteDataSummary"
          :state="siteDataState"
          :message="siteDataMessage"
          :permissions="activeSitePermissions"
          :uses-default-profile="activeTabUsesDefaultProfile"
          :locale="resolvedLocale"
          :permission-label="permissionLabel"
          :permission-pending="isSitePermissionPending"
          :set-permission="setSitePermission"
          :reset-permission="resetSitePermissionFromControls"
          :open-permission-settings="openSitePermissionSettings"
          :open-privacy-settings="openSitePrivacySettings"
        />
        <section
          v-if="addressSuggestionsVisible"
          id="address-suggestions"
          class="sr-only"
          role="listbox"
          :aria-label="t('shell.suggestions')"
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
        :title="t('shell.toolbar.findTitle')"
        :aria-label="t('shell.toolbar.find')"
        aria-keyshortcuts="Control+F Meta+F"
        :disabled="!activeTab"
        @click="openFind"
      >
        <IconSearch aria-hidden="true" />
      </button>
      <button
        class="zoom-button"
        type="button"
        :title="t('runtime.address.zoom', { percent: localPercent(activeTab?.zoomPercent ?? 100) })"
        :aria-label="t('shell.toolbar.zoom')"
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
        :title="t(currentBookmark ? 'runtime.tabs.bookmarkSaved' : 'runtime.tabs.bookmarkSave')"
        :aria-label="t('shell.toolbar.bookmarks')"
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
        :aria-label="t(effectiveHumanInteractionLocked ? 'runtime.locks.inputLocked' : 'runtime.locks.inputLock')"
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
          {{ t('shell.split.tab') }}
        </button>
      </div>
      <div v-if="regularTabs.length > 1 || state.splitView" class="split-view-control">
        <button
          class="icon-button split-view-button"
          :class="{ active: Boolean(state.splitView) }"
          type="button"
          :title="state.splitView ? t('runtime.tabs.splitWith', { title: splitPartner?.title || t('runtime.tabs.splitOther') }) : t('runtime.tabs.splitOpen')"
          :aria-label="t('shell.split.heading')"
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
              <span class="eyebrow">{{ t('shell.split.workspace') }}</span>
              <h2 id="split-view-menu-title">{{ t('shell.split.heading') }}</h2>
            </div>
            <button class="panel-close" type="button" :aria-label="t('shell.split.closeMenu')" @click="splitMenuOpen = false"><IconClose aria-hidden="true" /></button>
          </header>
          <template v-if="state.splitView">
            <p class="split-view-summary">{{ activeTab?.title || t('shell.split.tab') }} {{ t('shell.split.with') }} {{ splitPartner?.title || t('shell.split.tab') }}</p>
            <div class="split-layout-options" role="group" :aria-label="t('shell.split.layout')">
              <button
                type="button"
                :class="{ selected: state.splitView.orientation === 'vertical' }"
                :aria-pressed="state.splitView.orientation === 'vertical'"
                @click="changeSplitLayout('vertical')"
              ><IconVerticalSplit aria-hidden="true" /><span>{{ t('shell.split.side') }}</span></button>
              <button
                type="button"
                :class="{ selected: state.splitView.orientation === 'horizontal' }"
                :aria-pressed="state.splitView.orientation === 'horizontal'"
                @click="changeSplitLayout('horizontal')"
              ><IconHorizontalSplit aria-hidden="true" /><span>{{ t('shell.split.stacked') }}</span></button>
            </div>
            <label class="split-ratio-control">
              <span>{{ t('shell.split.first') }}</span>
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
              <button type="button" @click="swapSplitTabs"><IconSwapHoriz aria-hidden="true" /> {{ t('shell.split.swap') }}</button>
              <button class="danger" type="button" @click="exitSplitView"><IconClose aria-hidden="true" /> {{ t('shell.split.exit') }}</button>
            </footer>
          </template>
          <template v-else>
            <p class="split-view-summary">{{ t('shell.split.choose', { page: activeTab?.title || t('shell.split.thisPage') }) }}</p>
            <div class="split-candidate-list">
              <button v-for="tab in splitCandidates" :key="tab.id" type="button" @click="openTabInSplitView(tab.id)">
                <img v-if="tab.faviconDataUrl" :src="tab.faviconDataUrl" alt="" />
                <IconLanguage v-else aria-hidden="true" />
                <span><strong>{{ tab.title || t('shell.split.newTab') }}</strong><small>{{ tab.mcpGroupName || t('shell.split.noWorkspace') }}</small></span>
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
        :title="t('shell.pageTools.heading')"
        :aria-label="t('shell.pageTools.heading')"
        aria-haspopup="dialog"
        aria-controls="page-tools-panel"
        :aria-expanded="pageToolsOpen"
        :disabled="!activeTab || activeTab.url.startsWith('bronom://home')"
        @click="togglePageTools"
      >
        <IconHandyman aria-hidden="true" />
      </button>
      <PageToolsPanel
        v-model:open="pageToolsOpen"
        v-model:dock="panelDock"
        :active-tab="activeTab"
        :active-web-url="activeWebUrl"
        :hostname="activeHostname"
        :locale="resolvedLocale"
        :active-emulation="activeEmulation"
        :environment-state="environmentState"
        :environment-override-count="activeEnvironmentOverrideCount"
        :network-route-count="activeNetworkRouteCount"
        :inspector-issue-count="activeInspectorIssueCount"
        :debug-report-signal-count="debugReportSignalCount"
        :element-picker-state="elementPickerState"
        :element-picker-mode="elementPickerMode"
        :snapshot-state="pageSnapshotState"
        :pdf-state="pdfExportState"
        :credential-storage-available="credentialStorage.available"
        :credential-count="activeCredentials.length"
        :diagnostics="diagnosticsController"
        :labels="{
          responsive: responsivePreviewLabel,
          environment: environmentLabel,
          inspectorIssues: inspectorIssuesLabel,
          security: securityLabel,
          debugReport: debugReportLabel,
          repro: reproLabel,
          domChanges: domChangesLabel,
          visualCompare: visualCompareLabel,
          contextPicker: contextPickerLabel,
          elementScreenshot: elementScreenshotLabel,
          qualityAudit: qualityAuditLabel,
          accessibilityAudit: accessibilityAuditLabel,
          performance: performanceLabel,
          designOverview: designOverviewLabel,
          pageMetadata: pageMetadataLabel,
          coverage: coverageLabel,
          cpuProfile: cpuProfileLabel,
          memory: memoryLabel,
          pdfExport: pdfExportLabel
        }"
        :actions="{
          toggleSiteStorage,
          toggleResponsivePreview,
          toggleEnvironment,
          toggleConsole,
          toggleNetwork: toggleNetworkMonitor,
          openRequestConditions,
          toggleElementPicker,
          copyPageSnapshot,
          savePdf: saveActivePdf,
          fillSavedPassword
        }"
      />
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
        {{ activeTab.pageProblem.kind === 'unresponsive' ? t('pageProblem.reload') : t('pageProblem.tryAgain') }}
      </button>
    </div>
    <ResponsivePreviewPanel
      ref="responsivePanel"
      v-model:open="responsivePanelOpen"
      v-model:dock="panelDock"
      :active-tab="activeTab"
      :locale="resolvedLocale"
      :set-tab-viewport="setResponsiveTabViewport"
      :commit-state="commitBrowserState"
      :begin-mutation="beginEmulationMutation"
      :is-mutation-current="isEmulationMutationCurrent"
      :close-transient-panels="closeTransientPanels"
    />
    <EnvironmentPanel
      v-model:open="environmentPanelOpen"
      v-model:dock="panelDock"
      :active-tab="activeTab"
      :locale="resolvedLocale"
      :controller="environmentController"
      :open-responsive-preview="toggleResponsivePreview"
    />
    <DiagnosticsPanels
      v-model:dock="panelDock"
      :active-tab="activeTab"
      :locale="resolvedLocale"
      :controller="diagnosticsController"
      :open-support="openSupport"
    />
    <ConsolePanelContainer
      ref="consolePanel"
      v-model:open="consolePanelOpen"
      v-model:dock="panelDock"
      :active-tab="activeTab"
      :locale="resolvedLocale"
      :copy-text="copyAppText"
      :accept-browser-state="browserStore.acceptAuthoritativeState"
      :keeps-separate-panel-open="keepsSeparatePanelOpen"
    />
    <NetworkPanel
      ref="networkPanel"
      v-model:open="networkMonitorOpen"
      v-model:dock="panelDock"
      :active-tab="activeTab"
      :locale="resolvedLocale"
      :copy-text="copyAppText"
      :accept-browser-state="browserStore.acceptAuthoritativeState"
      :keeps-separate-panel-open="keepsSeparatePanelOpen"
    />
    <TabSearchPanel
      ref="tabSearchPanel"
      v-model:open="tabSearchOpen"
      :state="state"
      :mcp-activity-by-tab="mcpActivityByTab"
      :sync-state="syncState"
      :select-tab="selectBrowserTab"
      :expand-tab-group="expandTabGroupForTab"
      :describe-emulation="describeTabEmulation"
      :format-number="localNumber"
      :format-time="localTime"
      :format-error="friendlyUiError"
      :show-error="showTabSearchError"
      @new-tab="runBrowserShortcut('new-tab')"
    />
    <div v-if="findOpen" class="find-bar" role="search" :aria-label="t('find.region')">
      <div class="find-field">
        <IconSearch aria-hidden="true" />
        <input
          ref="findInput"
          v-model="findQuery"
          type="search"
          :aria-label="t('find.text')"
          autocomplete="off"
          spellcheck="false"
          :placeholder="t('find.placeholder')"
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
        :title="t('find.previousTitle')"
        :aria-label="t('find.previous')"
        :disabled="!findQuery || !findResult.matches"
        @click="searchInPage(false, false)"
      >
        <IconKeyboardArrowUp aria-hidden="true" />
      </button>
      <button
        class="find-action"
        type="button"
        :title="t('find.nextTitle')"
        :aria-label="t('find.next')"
        :disabled="!findQuery || !findResult.matches"
        @click="searchInPage(true, false)"
      >
        <IconKeyboardArrowDown aria-hidden="true" />
      </button>
      <button class="find-action" type="button" :title="t('find.closeTitle')" :aria-label="t('find.close')" @click="closeFind"><IconClose aria-hidden="true" /></button>
    </div>
    <div v-if="zoomOpen" class="zoom-bar" role="group" :aria-label="t('zoom.controls')">
      <span>{{ t('zoom.heading') }}</span>
      <button type="button" :title="t('zoom.outTitle')" :aria-label="t('zoom.out')" :disabled="(activeTab?.zoomPercent ?? 100) <= 50" @click="setActiveZoom('out')"><IconRemove aria-hidden="true" /></button>
      <output aria-live="polite">{{ localPercent(activeTab?.zoomPercent ?? 100) }}</output>
      <button type="button" :title="t('zoom.inTitle')" :aria-label="t('zoom.in')" :disabled="(activeTab?.zoomPercent ?? 100) >= 300" @click="setActiveZoom('in')"><IconZoomIn aria-hidden="true" /></button>
      <button class="zoom-reset" type="button" :disabled="(activeTab?.zoomPercent ?? 100) === 100" @click="setActiveZoom('reset')">{{ t('zoom.reset') }}</button>
      <button type="button" :title="t('zoom.closeTitle')" :aria-label="t('zoom.close')" @click="zoomOpen = false"><IconClose aria-hidden="true" /></button>
    </div>
    <DownloadsPanel
      v-model:open="downloadsOpen"
      v-model:downloads="downloads"
      :format-bytes="formatBytes"
      :format-percent="localPercent"
      :cancel-download="downloadsApi.cancel"
      :clear-finished="downloadsApi.clearFinished"
      :show-in-folder="downloadsApi.showInFolder"
    />
    <BookmarksPanel
      ref="bookmarksPanel"
      v-model:open="bookmarksOpen"
      v-model:bookmarks="bookmarks"
      v-model:dock="panelDock"
      :active-url="activeWebUrl"
      :active-title="activeTab?.title ?? ''"
      :current-bookmark="currentBookmark"
      :list-bookmarks="bookmarksApi.list"
      :add-bookmark="bookmarksApi.add"
      :rename-bookmark="bookmarksApi.rename"
      :remove-bookmark="bookmarksApi.remove"
      :open-bookmark="openBookmark"
    />
    <HistoryPanel
      ref="historyPanel"
      v-model:open="historyOpen"
      v-model:entries="visitHistory"
      :format-date-time="localDateTime"
      :format-number="localNumber"
      :list-history="historyApi.list"
      :remove-history-entry="historyApi.remove"
      :clear-history="historyApi.clear"
      :open-history-entry="openHistoryEntry"
    />
    <SiteStoragePanel
      ref="siteStoragePanel"
      v-model:open="siteStorageOpen"
      v-model:dock="panelDock"
      :active-tab="activeTab"
      :locale="resolvedLocale"
      :copy-text="copyAppText"
      :keeps-separate-panel-open="keepsSeparatePanelOpen"
    />
    <WorkspaceEditor
      ref="workspaceEditor"
      v-model:open="workspaceEditorOpen"
      :state="state"
      :sync-state="syncState"
      :format-number="localNumber"
    />
    <CredentialPicker
      ref="credentialPicker"
      v-model:open="credentialPickerOpen"
      :credentials="credentials"
      :origin="activeOrigin"
      :fill-credential="fillSelectedCredential"
    />
    <CommandPalette
      ref="commandPalette"
      v-model:open="commandPaletteOpen"
      :website-available="Boolean(activeTab && !activeIsHome)"
      :format-number="localNumber"
      :run-command="runCommandPaletteCommand"
    />
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
            <span class="eyebrow">{{ t('settings.kicker') }}</span>
            <h2 id="settings-title">{{ t('settings.heading') }}</h2>
          </div>
          <button class="panel-close" type="button" :aria-label="t('settings.close')" @click="settingsOpen = false"><IconClose aria-hidden="true" /></button>
        </div>

        <div class="settings-layout">
          <nav class="settings-sidebar" :aria-label="t('settings.sections')">
            <button
              class="settings-nav-item"
              :class="{ active: settingsSection === 'appearance' }"
              type="button"
              :aria-current="settingsSection === 'appearance' ? 'page' : undefined"
              @click="settingsSection = 'appearance'"
            >
              <span class="settings-nav-icon" aria-hidden="true"><IconContrast /></span>
              <span>
                <strong>{{ t('settings.nav.appearance') }}</strong>
                <small>{{ t('settings.nav.appearanceDescription') }}</small>
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
                <strong>{{ t('settings.nav.search') }}</strong>
                <small>{{ t('settings.nav.searchDescription') }}</small>
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
                <strong>{{ t('settings.nav.downloads') }}</strong>
                <small>{{ t('settings.nav.downloadsDescription') }}</small>
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
                <strong>{{ t('settings.nav.performance') }}</strong>
                <small>{{ t('settings.nav.performanceDescription') }}</small>
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
                <strong>{{ t('settings.nav.mcp') }}</strong>
                <small>{{ t('settings.nav.mcpDescription') }}</small>
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
                <strong>{{ t('settings.nav.privacy') }}</strong>
                <small>{{ t('settings.nav.privacyDescription') }}</small>
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
                <strong>{{ t('settings.nav.permissions') }}</strong>
                <small>{{ t('settings.nav.permissionsDescription') }}</small>
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
                <strong>{{ t('settings.nav.passwords') }}</strong>
                <small>{{ t('settings.nav.passwordsDescription') }}</small>
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
                <strong>{{ t('settings.nav.updates') }}</strong>
                <small>{{ t('settings.nav.updatesDescription') }}</small>
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
                <strong>{{ t('settings.nav.support') }}</strong>
                <small>{{ t('settings.nav.supportDescription') }}</small>
              </span>
            </button>
          </nav>

          <AppearanceSettings
            v-if="settingsSection === 'appearance'"
            @test-sound="testAttentionSound"
            @setting-error="handleExtractedSettingError"
          />
          <main v-else-if="settingsSection === 'search'" class="settings-content">
            <div class="setting-copy">
              <h3>{{ t('settings.search.heading') }}</h3>
              <p>{{ t('settings.search.description') }}</p>
            </div>
            <div class="search-engine-options" role="radiogroup" :aria-label="t('settings.search.heading')">
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
              <p>{{ t('settings.search.privacy') }}</p>
            </div>
          </main>
          <DownloadSettingsPanel
            v-else-if="settingsSection === 'downloads'"
            :controller="downloadSettingsController"
          />
          <PerformanceSettingsPanel
            v-else-if="settingsSection === 'performance'"
            :controller="performanceSettingsController"
            :format-number="localNumber"
          />
          <McpSettingsPanel
            v-else-if="settingsSection === 'mcp'"
            :controller="mcpSettingsController"
          />
          <PrivacySettingsPanel
            v-else-if="settingsSection === 'privacy'"
            :controller="privacySettingsController"
            :format-bytes="formatBytes"
            :format-number="localNumber"
          />
          <SitePermissionsSettingsPanel
            v-else-if="settingsSection === 'permissions'"
            :controller="sitePermissionsController"
          />
          <CredentialsSettingsPanel
            v-else-if="settingsSection === 'credentials'"
            :controller="credentialsController"
          />
          <UpdateSettingsPanel
            v-else-if="settingsSection === 'updates'"
            :controller="updateSettingsController"
          />
          <SupportSettingsPanel
            v-else
            :controller="commercialLicenseController"
            :format-number="localNumber"
            :format-date-time="localDateTime"
            @open-url="openSupport"
          />
        </div>

        <footer class="settings-footer">
          <button
            v-if="settingsSection !== 'support' && settingsSection !== 'credentials'"
            class="secondary-button"
            type="button"
            :disabled="settingsResetDisabled"
            @click="resetCurrentSection"
          >{{ t('settings.reset') }}</button>
          <button class="primary-button" type="button" @click="settingsOpen = false">{{ t('common.close') }}</button>
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
            <span class="eyebrow">{{ t('help.kicker') }}</span>
            <h2 v-if="helpDialog === 'shortcuts'" id="shortcuts-title">{{ t('help.shortcuts') }}</h2>
            <h2 v-else id="about-title">{{ t('help.about') }}</h2>
          </div>
          <button class="panel-close" type="button" :aria-label="t('help.close')" @click="helpDialog = null"><IconClose aria-hidden="true" /></button>
        </header>
        <div v-if="helpDialog === 'shortcuts'" class="shortcuts-content">
          <p>{{ t('help.shortcutsDescription') }}</p>
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
            <h3>Bronom {{ updateState.currentVersion || t('help.developmentBuild') }}</h3>
            <p>{{ t('help.description') }}</p>
          </div>
          <div class="about-actions">
            <button class="secondary-button" type="button" @click="openSupport('https://github.com/Netroforge/bronom')">{{ t('help.repository') }}</button>
            <button class="secondary-button" type="button" @click="openSupport('https://github.com/Netroforge/bronom/blob/main/LICENSE')">{{ t('help.license') }}</button>
            <button class="secondary-button" type="button" @click="openSupport('https://github.com/Netroforge/bronom/blob/main/CONTRIBUTING.md')">{{ t('help.contribute') }}</button>
            <button class="primary-button" type="button" @click="openSupportSettings">{{ t('help.support') }}</button>
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
          <small>{{ t('panels.websiteRequired') }}</small>
          <strong>{{ detachedPanelLabelText }}</strong>
        </span>
        <div class="panel-header-actions">
          <PanelDockPicker v-model="panelDock" :label="t('panels.dockPanel')" />
          <button class="panel-close" type="button" :aria-label="t('panels.closePanel', { panel: detachedPanelLabelText })" @click="closeDockedPanels"><IconClose aria-hidden="true" /></button>
        </div>
      </header>
      <div>
        <span aria-hidden="true"><IconLanguage /></span>
        <h2>{{ t('panels.openWebsite') }}</h2>
        <p>{{ t('panels.openWebsiteDescription') }}</p>
      </div>
    </div>
    <div
      v-if="dockedPanelOpen && panelDock !== 'window'"
      class="panel-resize-handle"
      :class="{ active: panelResizeGesture !== null }"
      role="separator"
      :aria-orientation="panelDock === 'right' || panelDock === 'left' ? 'vertical' : 'horizontal'"
      :aria-label="t('panels.resize')"
      :aria-valuemin="panelDockMinimumSize()"
      :aria-valuemax="panelDockMaximumSize()"
      :aria-valuenow="panelDockSize"
      tabindex="0"
      :title="t('panels.resizeHelp')"
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
    :aria-label="t('panels.notifications')"
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
      <button type="button" :aria-label="t('panels.dismiss', { title: toast.title })" @click="dismissAppToast(toast.id)"><IconClose aria-hidden="true" /></button>
    </article>
  </TransitionGroup>
</template>
