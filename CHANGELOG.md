# Changelog

All notable changes to Bronom 1.0 and later are documented in this file.

## [Unreleased]

### Added

- Save filtered, sanitized Network monitor HAR files directly to Downloads with collision-safe names, both from the human interface and the `browser_network_har` MCP tool; request and response bodies remain omitted by default.

### Fixed

- Route Bronom Home setup snippets, website context-menu addresses and images, Console, Network, storage, diagnostic, reproduction, and MCP URL copy actions through serialized, verified native clipboard paths, retry transient platform failures, remove Home's Chromium clipboard permission, and show a top-level error toast instead of silently claiming success.
- Surface failures from native tab/page-menu actions, including stale save/edit commands, and page-requested new windows in Bronom's top-window toast instead of failing only in the developer console or doing nothing.
- Preserve POST bodies, content types, referrers, and background-tab disposition when forms or pages open a new Bronom tab.
- Raise undersized shell, Home, Settings, diagnostic-panel, element-picker, and area-capture text to a readable 11–12 px floor while keeping the public website's existing 16–19 px body scale.

## [1.0.0] - 2026-08-16

### Added

- Bronom is a visible, persistent local browser and QA workspace controlled through MCP.
- Publish the Bronom 1.0.0 source under PolyForm Noncommercial License 1.0.0 with separate evaluation and commercial-use paths.
