# `@jimkring/pi-pr-status`

Pi extension that shows the current GitHub PR number and title in the Pi footer.

![Screenshot of the pr-status extension showing a PR in the Pi terminal footer](assets/pr-status-terminal.svg)

## Install

After publication:

```bash
pi install npm:@jimkring/pi-pr-status
```

For local development from this repository:

```bash
pi -e ./packages/pr-status
```

The repository root can also be installed as a bundle that includes this extension:

```bash
pi install git:github.com/jimkring/pi-extensions
```

## Requirements

- Git repository checkout
- GitHub CLI: `gh`
- Authenticated GitHub CLI session via `gh auth login`
- Current branch must have an open GitHub PR for a footer status to appear

## Behavior

- Runs read-only `git` and `gh pr view` commands.
- Shows `PR #1234 (title)` in the Pi footer when a PR is found.
- Clears the footer indicator when no PR is found.
- Registers the `pr_status_update` tool so the agent can refresh the footer after creating a PR or switching branches.

## License

MIT
