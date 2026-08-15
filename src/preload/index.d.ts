import type { BronomApi, BronomBookmarksApi, BronomBrowsingDataApi, BronomCredentialsApi, BronomDownloadsApi, BronomHistoryApi, BronomMcpApi, BronomPanelWindowApi, BronomPermissionsApi, BronomSettingsApi, BronomUpdatesApi, HelpMenuAction } from '../shared/types'

declare global {
  interface Window {
    bronom: BronomApi
    bronomBookmarks: BronomBookmarksApi
    bronomHistory: BronomHistoryApi
    bronomBrowsingData: BronomBrowsingDataApi
    bronomDownloads: BronomDownloadsApi
    bronomMcp: BronomMcpApi
    bronomCredentials: BronomCredentialsApi
    bronomPermissions: BronomPermissionsApi
    bronomSettings: BronomSettingsApi
    bronomUpdates: BronomUpdatesApi
    bronomPanelWindow: BronomPanelWindowApi
    bronomShell: {
      setToolbarHeight(height: number): void
      setContentInsets(insets: { top: number; right: number; bottom: number; left: number }): void
      onHelpRequested(listener: (action: HelpMenuAction) => void): () => void
    }
  }
}

export {}
