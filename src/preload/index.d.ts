import type { BrowserActionFailure, BronomApi, BronomBookmarksApi, BronomBrowsingDataApi, BronomCredentialsApi, BronomDownloadsApi, BronomHistoryApi, BronomLicenseApi, BronomMcpApi, BronomPanelWindowApi, BronomPermissionsApi, BronomSettingsApi, BronomUpdatesApi, HelpMenuAction } from '../shared/types'
import type { AddressSuggestionOverlayRequest } from '../shared/address-suggestions'

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
    bronomLicense: BronomLicenseApi
    bronomPanelWindow: BronomPanelWindowApi
    bronomAddressOverlay: {
      show(request: AddressSuggestionOverlayRequest): void
      hide(): void
      onSelected(listener: (suggestionId: string) => void): () => void
    }
    bronomShell: {
      setToolbarHeight(height: number): void
      setContentInsets(insets: { top: number; right: number; bottom: number; left: number }): void
      onHelpRequested(listener: (action: HelpMenuAction) => void): () => void
      onClipboardFailed(listener: (message: string) => void): () => void
      onActionFailed(listener: (failure: BrowserActionFailure) => void): () => void
    }
  }
}

export {}
