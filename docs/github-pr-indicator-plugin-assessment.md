# `github-pr-indicator` Plugin Readiness Assessment

Date: 2026-05-31

This document captures the current assessment of moving the `github-pr-indicator` extension toward publishing as an official Pi plugin/package.

## Current State

`github-pr-indicator` is close to package-ready, but should receive a small hardening pass before being promoted as an official plugin.

Positive indicators:

- The repository is now organized as a workspace/monorepo with a dedicated `packages/github-pr-indicator` package.
- The root package remains a bundle package for installing all extensions together.
- `package.json` files include the `pi-package` keyword where appropriate.
- Pi extension resources are declared via `pi.extensions`.
- README files document the package and screenshot.
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

The current implementation uses synchronous shell execution via `execFileSync()` for both `git` and `gh` commands.

That is acceptable for local experimentation, but less ideal for an official plugin because it can block Pi's TUI while `gh pr view` performs network work.

Recommended changes:

- Replace `execFileSync()` with `pi.exec()`.
- Add short command timeouts, probably 3-5 seconds.
- Debounce refreshes from file watcher events.
- Avoid overlapping `gh` calls.
- Ignore stale results if the branch changes while a refresh is in flight.
- Skip UI work when `ctx.hasUI` is false.
- Truncate long PR titles for footer safety.
- Notify at most once for common setup problems such as missing `gh` or unauthenticated `gh`.

Commands that still need to run:

- `git rev-parse --show-toplevel`
- `git rev-parse --git-path HEAD`
- `gh pr view --json number,title`

### 3. Document Dependencies and Behavior Clearly

The README should explicitly state:

- Requires GitHub CLI: `gh`.
- Requires `gh auth login`.
- Requires a GitHub-backed git repository.
- Shows a footer status only when the current branch has an open PR.
- Runs read-only `git` and `gh pr view` commands.
- Does not write files or modify the repository.

This is important because Pi packages and extensions run with full local system permissions.

### 4. Add Release and Package Metadata

Before npm or gallery publication, add or verify:

- `repository`
- `homepage`
- `bugs`
- `author`
- `publishConfig.access: "public"` for scoped public npm packages
- `pi.image` or `pi.video` gallery metadata
- Current Pi dev dependency version
- A concrete changelog entry for the first published release

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

Once hardened and documented:

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

Complete one hardening pass in `packages/github-pr-indicator`:

1. Replace synchronous command execution with async `pi.exec()` plus timeouts.
2. Add debounce/overlap/stale-result protection around refreshes.
3. Add graceful one-time setup warnings for missing or unauthenticated `gh`.
4. Consider adding gallery metadata once a supported preview image or video is available.
5. Run `npm run check && npm pack --workspace @jimkring/pi-github-pr-indicator --dry-run`.

After that, `github-pr-indicator` should be credible as an official Pi plugin candidate.
