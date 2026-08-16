# Changelog

All notable changes to Bronom 1.0 and later are documented in this file.

## [Unreleased]

### Fixed

- Serialize update checks, downloads, and installation so native menu or tray actions cannot race an active updater operation, and never start a download from a generic check-error state without fresh update metadata.
- Replace the remaining paid-use wording in the native Help menu and supporter-key feedback after the Apache 2.0 transition.
- Keep the public website's MCP tool count and feature numbering aligned with the application, offer the Linux ARM64 AppImage already produced by releases, and collapse the long capability catalog behind an accessible progressive control.
- Fall back safely when browser clipboard permission blocks copying an MCP setup command, select the command for manual copying if both backends fail, and announce the result accessibly.

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
