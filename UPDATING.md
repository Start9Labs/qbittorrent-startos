# Updating qBittorrent

## Determining the upstream version

Check the latest qBittorrent release:

```bash
gh release view -R qbittorrent/qBittorrent --json tagName -q '.tagName'
```

This returns tags like `release-5.2.1`. The Docker image tag is the same without the `release-` prefix, e.g. `5.2.1`.

The current pin lives in `startos/manifest/index.ts`:

```typescript
dockerTag: 'linuxserver/qbittorrent:5.2.1',
```

## Applying the bump

1. Edit `startos/manifest/index.ts` — update the `dockerTag` to the new version.
2. Edit `startos/versions/current.ts` — update the version string (e.g. `'5.2.1:0'`).
3. If the bump carries migration logic, create a new version file instead of editing `current.ts`.
4. Update `UPDATING.md` with the new version number in the example commands.
5. Build and test: `npm ci && make`
