# Changelog

## [Unreleased]

## [0.1.0] - 2026-05-31

### Added

- Added `github-pr-indicator` extension package.
- Added `session-name` extension package.
- Added root bundle package that loads all workspace extensions.

### Changed

- Hardened `github-pr-indicator` with async command execution, command timeouts, debounced branch refreshes, stale-result protection, and one-time setup warnings.
- Reorganized extensions into workspace packages under `packages/`.
- Renamed the PR footer extension from `pr-status` to `github-pr-indicator`.
