# Jim Kring Pi Extensions

Pi extension packages for Jim Kring's coding workflow.

This repository is an aggregator for related Pi extensions. Some extensions live in standalone repositories and are included here as Git submodules for local bundle development.

## Packages

### `@jimkring/pi-github-pr-indicator`

Shows the current GitHub pull request in the Pi footer.

Standalone repo: <https://github.com/jimkring/pi-github-pr-indicator>

Submodule directory: [`packages/github-pr-indicator`](packages/github-pr-indicator)

![Screenshot of the GitHub PR indicator extension showing a PR in the Pi terminal footer](packages/github-pr-indicator/assets/github-pr-indicator-terminal.svg)

### `@jimkring/pi-session-name`

Exposes session naming as an LLM-callable tool.

Package directory: [`packages/session-name`](packages/session-name)

## Install

### Recommended: install standalone extensions directly

```bash
pi install git:github.com/jimkring/pi-github-pr-indicator
```

After npm publication, packages can also be installed individually:

```bash
pi install npm:@jimkring/pi-github-pr-indicator
pi install npm:@jimkring/pi-session-name
```

### Root bundle / local development

Clone this aggregator with submodules before running the root bundle locally:

```bash
git clone --recurse-submodules https://github.com/jimkring/pi-extensions.git
cd pi-extensions
npm install
pi -e .
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

> Note: current Pi git package installs do not document submodule initialization. Prefer the standalone install command above for `github-pr-indicator` instead of relying on `pi install git:github.com/jimkring/pi-extensions` to populate submodules.

Run one package at a time:

```bash
pi -e ./packages/github-pr-indicator
pi -e ./packages/session-name
```

Update the `github-pr-indicator` submodule to its latest `main` branch:

```bash
git submodule update --remote packages/github-pr-indicator
```

## Development

```bash
npm install
npm run check
npm run pack:dry-run
```

## License

MIT
