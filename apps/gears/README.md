# Gears

Pluggable features. Each gear is split into three packages:

| Package | Layer |
|---------|-------|
| `common/` | Abstract `Gear<TMap>` class with platform-agnostic logic |
| `web/` | Web-specific implementation (maplibregl.Map) |
| `mobile/` | Mobile-specific implementation (MobileMap) |

Gears are automatically discovered by the web build — no manual registration needed.

## Generating a new gear

```bash
yarn generate:gear <name>               # common + web + mobile
yarn generate:gear <name> --web-only    # common + web only
yarn generate:gear <name> --mobile-only # common + mobile only
```

This copies the template at [.template](./.template/), replaces `__name__` / `__PascalName__` placeholders, and links the packages. Run `yarn install` after generating.

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