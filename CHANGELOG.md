# Changelog

All notable changes to Bronom 1.0 and later are documented in this file.

## [Unreleased]

### Changed

- Define the Bronom-wide human lock as an all-tabs safety lock: block website input and every human tab-closing path while leaving browser chrome, Settings, diagnostics, and tab switching available.
- Align workspace chips, workspace-specific new-tab buttons, and the new-workspace action on one compact icon-control baseline; clarify the lock labels and disabled close affordances so their scope is visible before clicking.
- Join each workspace chip to its own new-tab action and label the separate workspace-creation control, making the destination and scope of both `+` actions clear even when a workspace is empty.

### Fixed

- Restore the exact original tab set when deleting the only isolated workspace fails, without leaving a phantom blank Default tab behind after rollback.
- Detach and reset the native address-suggestion surface when Electron destroys its renderer so a stale topmost child view cannot linger above the website or make CI timing-dependent.
- Keep a failed archived-workspace restore under one recoverable active owner when its rollback also fails, instead of re-adding an archive that shares the same persistent browser profile.

## [1.6.6] - 2026-08-21

### Fixed

- Allow people to switch between tabs with clicks or Ctrl+Tab while Bronom-wide human interaction is locked, without re-enabling page controls, tab actions, or website input.
- Count every cookie belonging to a website origin in Privacy & browsing data and `browser_site_data`, including cookies scoped to a different path than the page currently open.
- Restore a workspace's tabs and active page when closing its isolated profile fails, instead of reporting failure after silently discarding the working pages.

## [1.6.5] - 2026-08-21

### Changed

- Leave MCP authentication off for new profiles so local agents can connect without token setup, while preserving an existing profile's explicit setting and keeping opt-in bearer authentication available in Settings.
- Make section reset restore every Appearance preference and keep MCP authentication off; Saved passwords no longer exposes a generic reset that could silently delete credentials.
- Keep passwords, bookmarks, history, site permissions, and commercial-license state unchanged when a disk write fails; repair duplicate stored identifiers without losing accounts or bookmarks, and surface password save or removal failures as application toasts.
- Keep every active workspace visible even when it has no tabs, and place a workspace-specific new-tab button beside each workspace instead of an ambiguous global new-tab action.
- Keep rejected Settings writes out of live application state and later saves, serialize concurrent partial changes without losing fields, restore toggled controls after persistence errors, and surface the failure as a top-level application toast.

## [1.6.4] - 2026-08-21

### Fixed

- Keep a stable renderer reference for the native address-suggestion overlay so an independently destroyed overlay can be recreated without touching an invalid Electron child view.
- Catch address-bar navigation rejections and surface them as top-level application toasts while retaining the recoverable site-error bar.
- Mark independently destroyed page renderers as unavailable and immediately activate another live tab, or create a safe Default tab when no live renderer remains.
- Record a committed website as soon as its main document is ready so it appears in recent address suggestions even while slow page resources are still loading.
- Collapse an existing split view onto its surviving pane when Electron destroys either native renderer, and show a top-level error toast if a stale tab is selected afterward.
- Reject destroyed split-view panes before mutating layout state, keep stale tabs closable, and surface split-view failures as top-level application toasts instead of raw Electron errors.

## [1.6.3] - 2026-08-20

### Changed

- Show recent local browsing history as soon as the address bar is focused or cleared, while continuing to navigate the exact typed address on Enter unless a suggestion was explicitly selected.

### Fixed

- Retain each tab's stable Electron `WebContents` handle independently from its native view so externally destroyed renderers cannot crash state publication or prevent the stale tab from closing.
- Cancel MCP page and text waits promptly when their tab closes, preserve correct timeout semantics, and prevent hidden screenshot or visual-comparison cleanup from reattaching a destroyed native view.
- Detach the topmost native address-suggestion overlay before opening Settings, Help, the command palette, workspace editing, or the saved-account chooser.

## [1.6.2] - 2026-08-20

### Changed

- Keep open tabs out of address suggestions so entering or selecting an address always navigates the current tab and duplicate website addresses remain allowed; use tab search when the intent is to switch tabs.

### Fixed

- Show address suggestions in a topmost native dropdown without moving or shrinking the current website, including after results appear while typing and at compact window sizes.
- Reserve renderer-owned full-window overlays only for true modal dialogs, including the saved-account chooser, while requiring transient website popovers to use the native overlay path.

## [1.6.1] - 2026-08-20

### Fixed

- Serialize tab, settings, and window-state persistence so overlapping saves and application shutdown always keep the newest complete snapshot.
- Tolerate navigation history disappearing during renderer failure or tab teardown, allowing unavailable tabs to close and state to persist without a main-process exception.
- Keep the keyboard-selected address or saved-account suggestion visible while navigating long, scrollable lists; pressing Enter without explicitly selecting a suggestion still navigates the exact typed address.
- Serialize credential saves and removals, retain the newest password for each website account, and automatically repair duplicate saved-account records without allowing a delayed save to resurrect a removed credential.

## [1.6.0] - 2026-08-20

### Added

- Organize tabs into named, UUIDv7-identified workspaces: keep the undeletable Default workspace as the durable shared browser profile, create isolated workspaces from a clean profile or a copy of Default, explicitly copy all or selected-site storage in either direction, and archive isolated workspaces for later reopening with a fresh active ID.
- Choose among multiple saved accounts in a searchable, vertically scrollable Bronom dialog; a single matching account still fills directly, and every selection is revalidated against the active website before use.

### Changed

- Require MCP agents to create or reopen an explicit workspace before opening tabs, list workspaces when coordination is needed, and consistently address both workspaces and tabs by UUIDv7 while retaining unique editable workspace names for people.
- Navigate the exact address-bar text when Enter is pressed; suggestions are used only after an explicit keyboard or pointer selection.
- Update the embedded Electron runtime to 42.9.3.

### Fixed

- Close crashed, unavailable, or already-destroyed tabs without reading a missing navigation history, reattaching a destroyed view, or trapping the user in repeated close failures; closing a tab now activates the nearest usable neighbor.
- Make profile transfers transactional: serialize workspace storage operations, roll back cookies and local storage after partial copy failures, prevent failed forks from leaving ghost workspaces, and retain recoverable metadata if profile cleanup cannot complete.
- Reject corrupt, duplicate, cross-workspace, oversized, or pre-workspace tab state instead of restoring ambiguous identities or sharing an isolated profile accidentally. Existing legacy tab/workspace layout is intentionally reset, while Default continues to use the durable shared browser profile.
- Clear stale per-site transfer selections after source-loading errors and prevent transfers from applying an outdated origin list to another workspace.

## [1.5.0] - 2026-08-17

### Added

- Run one bounded, copy-ready Quality audit from Page tools, the Command Palette, or `browser_quality_audit`, combining accessibility, observed Web Vitals, metadata and SEO, transport security, PWA readiness, and retained Chromium issues without inventing a synthetic score or uploading page content.

## [1.4.1] - 2026-08-17

### Fixed

- Serialize update checks, downloads, and installation so native menu or tray actions cannot race an active updater operation, and never start a download from a generic check-error state without fresh update metadata.
- Replace the remaining paid-use wording in the native Help menu and supporter-key feedback after the Apache 2.0 transition.
- Keep the public website's MCP tool count and feature numbering aligned with the application, offer the Linux ARM64 AppImage already produced by releases, and collapse the long capability catalog behind an accessible progressive control.
- Fall back safely when browser clipboard permission blocks copying an MCP setup command, select the command for manual copying if both backends fail, and announce the result accessibly.
- Fail fast if the advertised MCP catalog and real server registrations drift, and verify that every operational tool exposed to agents requires a tab group ID.

## [1.4.0] - 2026-08-16

### Added

- Copy a bounded, sanitized page snapshot from Page tools or the Command Palette so a person can paste the current semantic page structure into an agent chat without exposing password values, URL credentials, fragments, or recognized secret query parameters.

### Changed

- License Bronom under Apache License 2.0 for personal and commercial use, modification, and redistribution under its terms; reopen focused code contributions under the same license with Developer Certificate of Origin sign-off.
- Present the existing subscription activation as optional project support instead of a requirement for paid work.

### Fixed

- Keep detached website diagnostic panels open on Bronom Home with a clear website-required state, then reconnect them automatically when a website tab is selected.

## [1.3.0] - 2026-08-16

### Added

- Record bounded JavaScript CPU profiles from Page tools or `browser_cpu_profile`, then inspect a sanitized bottom-up hot-function summary without exposing source code or arbitrary stack data.
- Sample JavaScript heap allocations from Page tools or `browser_memory`, save an in-memory baseline, and compare later profiles to identify growing allocation sites while keeping raw heap snapshots out of Bronom and MCP responses.

### Fixed

- Stop expired or invalid commercial subscriptions from retaining an active local grant after their stored entitlement is no longer valid.
- Keep a completed memory-allocation profile visible when its comparison baseline is cleared so the same sample can immediately become a new baseline.
- Isolate Page tools, Site storage, Console, and Network monitor results by active tab so delayed responses and tab changes cannot display data collected from another website.
- Keep every Page tools panel open in a separate window while the active tab navigates or changes, and refresh that window against the new active website instead of silently closing it or leaving stale results.

## [1.2.0] - 2026-08-16

### Added

- Save a volatile per-tab Page performance baseline from the human panel or `browser_performance`, then compare later local samples across Web Vitals, load time, transferred bytes, long-task blocking, and Long Animation Frame blocking with explicit URL and browser-environment compatibility warnings.
- Surface the 50 most recent sanitized `performance.mark()` and `performance.measure()` entries in Page performance and `browser_performance`, including start time and duration while omitting arbitrary detail objects, stacks, and source code.
- Explain CLS with the highest-scoring unexpected layout-shift events, timings, and bounded affected-element selectors in Page performance and MCP while separately counting shifts excluded after recent input.
- Pause or slow document-timeline CSS transitions, CSS Animations, and Web Animations per tab from Environment or `browser_emulate`, with 10%, 25%, and normal playback controls that survive reloads.
- Activate, validate, and deactivate Creem commercial licenses from Bronom Settings without embedding provider credentials in the desktop application.
- Store the commercial license and installation identity in operating-system secure storage, with up to three active devices per named-user seat.

### Changed

- Validate commercial access periodically against the subscription entitlement and direct customers to the Creem Customer Portal for subscription management.

### Fixed

- Treat immediate cancellations as ending commercial access immediately while scheduled cancellations remain active only through Creem's stated effective date.

## [1.1.0] - 2026-08-16

### Added

- Save filtered, sanitized Network monitor HAR files directly to Downloads with collision-safe names, both from the human interface and the `browser_network_har` MCP tool; request and response bodies remain omitted by default.
- Filter the human Network monitor, `browser_network`, and HAR exports with composable Chrome-style `domain`, running-state, size, method, resource-type, scheme, status-code, URL, and quoted free-text expressions.
- Inspect bounded, sanitized EventSource/SSE messages through a dedicated Network filter and Event stream view, `browser_network_request`, cross-request search, and payload-free HAR metadata.

### Fixed

- Route Bronom Home setup snippets, website context-menu addresses and images, Console, Network, storage, diagnostic, reproduction, and MCP URL copy actions through serialized, verified native clipboard paths, retry transient platform failures, remove Home's Chromium clipboard permission, and show a top-level error toast instead of silently claiming success.
- Surface failures from native tab/page-menu actions, including stale save/edit commands, and page-requested new windows in Bronom's top-window toast instead of failing only in the developer console or doing nothing.
- Preserve POST bodies, content types, referrers, and background-tab disposition when forms or pages open a new Bronom tab.
- Raise undersized shell, Home, Settings, diagnostic-panel, element-picker, and area-capture text to a readable 11–12 px floor while keeping the public website's existing 16–19 px body scale.
- Keep human area screenshots and element selection reliable on MCP-created or locked tabs when reactive content changes or page-side picker state disappears; concurrent agent-generated input no longer completes or steals the human selection.
- Avoid deadlocking `browser_evaluate` when evaluated page code opens an asynchronous JavaScript dialog.

## [1.0.0] - 2026-08-16

### Added

- Bronom is a visible, persistent local browser and QA workspace controlled through MCP.
- Publish the Bronom 1.0.0 source under PolyForm Noncommercial License 1.0.0 with separate evaluation and commercial-use paths.
