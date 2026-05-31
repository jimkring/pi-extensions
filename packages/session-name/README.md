# `@jimkring/pi-session-name`

Pi extension that exposes session naming as an LLM-callable tool.

## Install

After publication:

```bash
pi install npm:@jimkring/pi-session-name
```

For local development from this repository:

```bash
pi -e ./packages/session-name
```

The repository root can also be installed as a bundle that includes this extension:

```bash
pi install git:github.com/jimkring/pi-extensions
```

## Behavior

Registers the `set_session_name` tool. The agent can call it to set a short, descriptive session name that appears in Pi's session selector.

## License

MIT
