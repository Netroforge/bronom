# Changelog

All notable changes to Bronom 1.0 and later are documented in this file.

## [Unreleased]

### Added

- Save a volatile per-tab Page performance baseline from the human panel or `browser_performance`, then compare later local samples across Web Vitals, load time, transferred bytes, long-task blocking, and Long Animation Frame blocking with explicit URL and browser-environment compatibility warnings.
- Surface the 50 most recent sanitized `performance.mark()` and `performance.measure()` entries in Page performance and `browser_performance`, including start time and duration while omitting arbitrary detail objects, stacks, and source code.

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
