# Updating qBittorrent

## Determining the upstream version

Read the qBittorrent tag list, skipping beta and rc tags rather than relying on GitHub's Latest badge:

```bash
gh api 'repos/qbittorrent/qBittorrent/tags?per_page=100' --jq '.[].name'
```

Tags look like `release-5.3.0`. The Docker image tag omits the `release-` prefix. Confirm that the exact image is published for amd64 and arm64 before changing the pin:

```bash
curl -fsSL https://hub.docker.com/v2/repositories/linuxserver/qbittorrent/tags/5.3.0
```

The current pin lives in `startos/manifest/index.ts`:

```typescript
dockerTag: 'linuxserver/qbittorrent:5.3.0',
```

## Applying the bump

1. Follow the packaging guide's scrutiny tier for the jump. Read upstream's release notes and `Changelog` for a feature release; config migrations or raised requirements require the breaking-change pass.
2. Edit `startos/manifest/index.ts` — update the `dockerTag` to the verified version.
3. Edit `startos/versions/current.ts` — update the version string (e.g. `'5.3.0:0'`) and localized release notes. Spin off the outgoing version only if its existing `up` migration does work, as the guide's migration rule specifies.
4. Check the keys in `assets/scripts/configure-webui.sh` against the new upstream source. Since 5.3.0, Web UI keys live in `[WebUI]`, not under `[Preferences]`. Upstream migrates existing settings and torrent state itself; do not duplicate its migrations in the wrapper.
5. Update this file's version examples.
6. Follow the packaging guide's SDK update and verification instructions, or the task's narrower verification gate when one is specified. Use `npm install`, not `npm ci`, in the cache-backed build workspace.
