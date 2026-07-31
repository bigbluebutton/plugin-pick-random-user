# Scripts

## deploy-remote.sh

Builds the plugin locally and deploys it to a remote BBB server over SSH.

```bash
./scripts/deploy-remote.sh
```

It will:
1. Delete `dist/` and `node_modules/`, then do a clean `npm ci` + `npm run build-bundle`
2. Clear the plugin directory on the remote server
3. Copy the build artifacts via `scp`

**Configuration** — copy `.env.template` to `.env` in this folder and fill in your values:

| Variable | Description |
|---|---|
| `DESTINATION_SERVER` | Hostname or IP of the target BBB server |
| `SSH_USERNAME` | SSH user on that server |

`scripts/.env` is gitignored; `.env.template` is the committed reference.

---

## copy-plugin-to-container.sh

Copies an already-built `dist/` into a locally running BBB Docker container.

```bash
./scripts/copy-plugin-to-container.sh [containerName]
```

`containerName` defaults to `$LOCAL_CONTAINER_NAME` from the root `.env` when omitted.

Run `npm run build-bundle` first — this script only copies, it does not build.

It's mostly used for testing the plugin in local containers.
