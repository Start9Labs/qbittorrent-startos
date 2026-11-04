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

1. Edit `startos/manifest/index.ts` — update the `dockerTag` to the verified version.
2. Check the keys in `assets/scripts/configure-webui.sh` against the new upstream source. Web UI keys live in `[WebUI]`, not under `[Preferences]`.
