# `github-pr-indicator` Plugin Readiness Assessment

Date: 2026-05-31

This document captures the current assessment of moving the `github-pr-indicator` extension toward publishing as an official Pi plugin/package.

## Current State

`github-pr-indicator` has received the recommended package-structure, documentation, metadata, and runtime-hardening pass. It is credible as an official Pi plugin candidate pending final namespace/gallery decisions, manual validation, and npm publication.

Positive indicators:

- The repository is now organized as a workspace/monorepo with a dedicated `packages/github-pr-indicator` package.
- The root package remains a bundle package for installing all extensions together.
- `package.json` files include the `pi-package` keyword where appropriate.
- Pi extension resources are declared via `pi.extensions`.
- README files document the package, screenshot, dependencies, and read-only behavior.
- Runtime behavior now uses async `pi.exec()` with timeouts, debouncing, overlap protection, stale-result protection, UI guards, footer-safe title truncation, and one-time setup warnings.
- Release metadata and a first `0.1.0` changelog entry are present.
- The package has not yet been published to npm.

## Recommended Remaining Steps

### 1. Decide the Package Shape

Status: mostly complete.

The repository now uses a monorepo layout:

```text
packages/
  github-pr-indicator/
    package.json
    index.ts
  session-name/
    package.json
    index.ts
```

The root package remains a bundle package:

```json
{
  "name": "@jimkring/pi-extensions",
  "pi": {
    "extensions": ["./packages/github-pr-indicator", "./packages/session-name"]
  }
}
```

The focused `github-pr-indicator` package is named `@jimkring/pi-github-pr-indicator` and loads only its own entry point:

```json
{
  "name": "@jimkring/pi-github-pr-indicator",
  "pi": {
    "extensions": ["./index.ts"]
  }
}
```

Remaining decision: whether to eventually transfer/rename the package under an official namespace such as `@earendil-works/pi-github-pr-indicator`.

### 2. Harden Runtime Behavior

Status: complete.

The implementation now:

- Uses async `pi.exec()` instead of synchronous shell execution.
- Applies short command timeouts: 3 seconds for `git`, 5 seconds for `gh`.
- Debounces refreshes from file watcher events.
- Avoids overlapping refresh/`gh` work.
- Ignores stale results when the branch changes while a refresh is in flight.
- Skips UI work when `ctx.hasUI` is false.
- Sanitizes and truncates long PR titles for footer safety.
- Notifies at most once for common setup problems such as missing `gh` or unauthenticated `gh`.

Commands used:

- `git rev-parse --show-toplevel`
- `git rev-parse --git-path HEAD`
- `gh pr view --json number,title`

### 3. Document Dependencies and Behavior Clearly

Status: complete.

The README now explicitly states:

- Requires GitHub CLI: `gh`.
- Requires `gh auth login`.
- Requires a GitHub-backed git repository.
- Shows a footer status only when the current branch has an open PR.
- Runs read-only `git` and `gh pr view` commands.
- Does not write files or modify the repository.

This is important because Pi packages and extensions run with full local system permissions.

### 4. Add Release and Package Metadata

Status: mostly complete.

Verified or added:

- `repository`
- `homepage`
- `bugs`
- `author`
- `publishConfig.access: "public"` for scoped public npm packages
- Current Pi dev dependency version
- A concrete changelog entry for the first published release

Still pending:

- `pi.image` or `pi.video` gallery metadata once a supported PNG/JPEG/GIF/WebP image or MP4 video URL is available.

The package gallery discovers packages tagged with `pi-package`; preview metadata improves presentation.

### 5. Add a Small Test Plan

Minimum manual validation matrix:

- Outside a git repository: no footer status and no noisy errors.
- Git repository without a GitHub remote: no footer status and no noisy errors.
- GitHub repository with no PR for the current branch: no footer status.
- GitHub repository with an open PR: shows `PR #1234 (title)`.
- Branch switch: footer updates.
- PR creation: `github_pr_indicator_update` tool refreshes footer.
- Missing `gh`: graceful behavior.
- Unauthenticated `gh`: graceful behavior.
- `/reload`: watcher cleanup and restart work correctly.

For stronger confidence, extract git/GitHub/status formatting logic into testable helpers.

### 6. Publish Path

When ready to publish:

```bash
npm run check
npm pack --workspace @jimkring/pi-github-pr-indicator --dry-run
npm publish --workspace @jimkring/pi-github-pr-indicator --access public
```

Users should then be able to install with:

```bash
pi install npm:@jimkring/pi-github-pr-indicator
```

## Suggested Next Milestone

Finalize release:

1. Run the manual validation matrix above.
2. Decide whether to publish under `@jimkring/pi-github-pr-indicator` first or transfer/rename under an official namespace.
3. Add gallery metadata if a supported preview image/video URL is available.
4. Publish with `npm publish --workspace @jimkring/pi-github-pr-indicator --access public`.
