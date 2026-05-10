---
name: add-gear
description: Scaffold a new pluggable Gear feature from the templates at apps/gears/.templates/
license: AGPL-3.0
compatibility: opencode
metadata:
  audience: developers
  workflow: feature-creation
---

## What I do

Scaffold a new **Gear** — the pluggable feature unit in nav-gauge — by running `yarn generate:gear <name>` from `apps/`. The script copies the relevant template from `apps/gears/.templates/` (real TypeScript files that are linted and type-checked), replaces `__name__` and `__PascalName__` placeholders with the gear name, and removes unwanted platform directories.

## When to use me

Use this when you are asked to add a new feature that should be implemented as a Gear. The gear name must be in **kebab-case** (e.g. `route-story`, `navigate`, `submit-data`). Ask the user for the name if it is not clear.

## Usage

```bash
cd apps
yarn generate:gear <name>           # common + web + mobile
yarn generate:gear <name> --web-only
yarn generate:gear <name> --mobile-only
```

The script validates the name (must be valid kebab-case), picks the right template (`default`, `web-only`, or `mobile-only`) based on flags, and replaces `__name__` and `__PascalName__` in filenames and content.

## Template reference

The canonical boilerplate lives at `apps/gears/.templates/default/`. Each gear has up to three packages:

| Package | Contents |
|---------|----------|
| `common/` | Abstract `{PascalName}Gear<TMap>` extending `Gear<TMap>`, `engage`/`disengage` lifecycle stubs |
| `web/` | `Web{PascalName}Gear` extending abstract gear with `TMap = maplibregl.Map` |
| `mobile/` | `Mobile{PascalName}Gear` extending abstract gear with `TMap = MobileMap` |

View the actual template files at `apps/gears/.templates/` for the exact structure — they are the source of truth.

## Naming conventions

| Context | Format | Example |
|---------|--------|---------|
| Directory | kebab-case | `route-story` |
| Gear `id` | kebab-case string | `"route-story"` |
| Abstract class | `{PascalName}Gear` | `RouteStoryGear` |
| Web class | `Web{PascalName}Gear` | `WebRouteStoryGear` |
| Mobile class | `Mobile{PascalName}Gear` | `MobileRouteStoryGear` |
| Package (common) | `@the-dead-planet/nav-gauge-gears-{name}-common` | `@the-dead-planet/nav-gauge-gears-route-story-common` |
| Package (web) | `@the-dead-planet/nav-gauge-gears-{name}-web` | `@the-dead-planet/nav-gauge-gears-route-story-web` |
| Package (mobile) | `@the-dead-planet/nav-gauge-gears-{name}-mobile` | `@the-dead-planet/nav-gauge-gears-route-story-mobile` |

## Auto-discovery

No manual registration needed. The Rspack `GearRegistryGenerator` plugin discovers gears by checking for `web/src/index.ts` in `apps/gears/{name}/`. It injects a `__GEAR_REGISTRY__` compile-time constant, and the app dynamically imports each gear.

## After scaffolding

1. `yarn install` at `apps/` to link the new packages
2. `yarn test:gear <name>` to verify the scaffold works
3. Implement `engage`/`disengage` in the abstract class and platform specializations
