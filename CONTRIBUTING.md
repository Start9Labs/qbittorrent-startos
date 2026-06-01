# Contributing to qBittorrent on StartOS

## Keep these in sync

Read `README.md`, `instructions.md`, and `TODO.md` before starting any work. After any code change affecting user-visible behavior, update `README.md` and `instructions.md` in the same change.

## Environment setup

Follow the StartOS SDK setup guide: <https://docs.start9.com/latest/developer-guide/sdk/installing-the-sdk>

```bash
npm ci
```

## Building

```bash
npm ci && make
```

The Makefile includes `s9pk.mk` which handles the full build pipeline. See [Makefile](https://docs.start9.com/packaging/makefile) for details.

## Updating the upstream version

See [UPDATING.md](UPDATING.md) for the exact steps. Per-package bump steps live there; see [Versions](https://docs.start9.com/packaging/versions) for the rule on when to create a new version file versus renaming the existing one in place.

## CI/CD

Three GitHub Actions workflows under `.github/workflows/`:

| Workflow | Trigger | Description |
| -------- | ------- | ----------- |
| `build.yml` | PR to `master` | Verifies the package builds |
| `tagAndRelease.yml` | Push to `master` | Version check, tag, build, release |
| `release.yml` | Manual tag push | Build and release on tag |

See [CI/CD](https://docs.start9.com/packaging/publishing) for publishing details.

## How to contribute

1. Fork this repository
2. Branch from `master`
3. Open a PR back to `master`
