# Gears

Pluggable features. Gears can span one or more packages depending on the platforms they target:

| Template | Packages |
|----------|----------|
| `default` | `common/` (abstract `Gear<TMap>`), `web/` (maplibregl.Map), `mobile/` (MobileMap) |
| `web-only` | `web/` (extends `Gear<maplibregl.Map>` directly) |
| `mobile-only` | `mobile/` (extends `Gear<MobileMap>` directly) |

Gears are automatically discovered by the web build — no manual registration needed.

## Generating a new gear

```bash
yarn generate:gear <name>               # common + web + mobile
yarn generate:gear <name> --web-only    # web only (no common)
yarn generate:gear <name> --mobile-only # mobile only (no common)
```

This copies the relevant template from [.templates/](./.templates/), replaces `__name__` / `__PascalName__` placeholders, and links the packages. Run `yarn install` after generating.

## Adding dependencies to a gear

```bash
yarn add:gear <name> <common|web|mobile> <package...>
```

Resolves the long workspace name for you:

```bash
yarn add:gear route-story web maplibre-gl
# equivalent to: yarn workspace @the-dead-planet/nav-gauge-gears-route-story-web add maplibre-gl

yarn add:gear navigate common -D @types/foo
# equivalent to: yarn workspace @the-dead-planet/nav-gauge-gears-navigate-common add -D @types/foo
```