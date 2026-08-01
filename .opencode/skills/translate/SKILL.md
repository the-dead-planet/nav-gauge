---
name: translate
description: Add a UI label translation across all supported languages in nav-gauge. Use when asked to translate a label, add a translation key, or localize UI text.
compatibility: opencode
metadata:
  audience: developers
  workflow: i18n
---

## Purpose

Add a new UI translation key safely.

A translation key requires:
1. An enum entry in the correct owner.
2. The same key in every language table of that owner.
3. Matching key names between enum and language files.

Missing any of these causes `yarn typecheck:web` to fail.

## Find the owner

First locate the translation usage:

Search for:
- `useTranslation`
- `useMultipleTranslations`
- `<T ... />`
- `translatron.translate(...)`

Read the `n:` namespace value. The namespace identifies the translation owner.

| Namespace source | Owner | Key enum | Translation tables |
|---|---|---|---|
| `namespace` from `useMachineWard()` | MachineWard | `MachineTranslationKey` (`apparatus/common/src/machine-ward/model.ts`) | `apparatus/common/src/machine-ward/translations/` |
| `individuator.namespace` | Individuator | `IndividuatorTranslationKey` (`machine-ward/individuator/model.ts`) | `machine-ward/individuator/translations/` |
| `cartomancer.namespace` | Cartomancer | `CartomancerTranslationKey` (`machine-ward/cartomancer/model.ts`) | `machine-ward/cartomancer/translations/` |
| `animatrix.namespace` | Animatrix | `AnimatrixTranslationKey` (`gears/route-story/common/src/animatrix/model.ts`) | `gears/route-story/common/src/animatrix/translations/` |
| `gear.id` or `gearId` | Gear owner | `{GearName}TranslationKey` (`gears/{name}/common/src/model.ts`) | `gears/{name}/common/src/translations/` |

Examples from the codebase:
- `{ n: namespace, t: translationKey.Menu }` → MachineWard
- `{ n: individuator.namespace, t: individuator.translationKey.Language }` → Individuator
- `{ n: cartomancer.namespace, t: cartomancer.translationKey.Compass }` → Cartomancer
- `{ n: animatrix.namespace, t: animatrix.translationKey.Search }` → Animatrix
- `{ n: gear.id, t: gear.translationKey.GearName }` (GearsTopToolbar) or `{ n: gearId, t: translationKey.UploadFile }` (prop-drilled) → the gear

## Workflow

1. **Locate the usage** and read its `n:` to identify the owner (table above).
2. **Add the enum value** to that owner's `*TranslationKey` enum — e.g. `UnderConstruction = 'under-construction',`.
3. **Add the key to EVERY language table** Find the supported languages by inspecting the translation directory. Do not assume a fixed language list. The key string must match the enum value exactly.
4. **Update the component** if it referenced a placeholder key.

## Rules

- **ONLY add the new key. NEVER modify existing translation strings** — existing entries may be deliberately untranslated or use `{{placeholders}}`.
- Match each file's existing style (quoting, ordering, accents).
- Gears share the base `GearTranslationKey` (`gear-name`, `gear-description`) plus their own enum.

## Validation

- `yarn typecheck:web` — proves the enum member exists and every language has the key.
- `yarn lint` — zero warnings policy.
