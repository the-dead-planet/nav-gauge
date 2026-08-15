---
name: add-ui-component
description: Create a UI component following existing design system patterns
compatibility: opencode
metadata:
  audience: developers
  workflow: ui-creation
---

## When to use

Use when creating a new reusable UI component.

## Before creating

Search existing UI components with similar purpose.

Match existing patterns for:
- component API
- variants
- colors
- sizes
- states
- accessibility behaviour

Prefer extending an existing component over creating a parallel one.

## Placement

Choose the lowest-level package that fits:

- `ui/common`: shared props/types (e.g. `ui/common/src/<component>/model.ts`) and shared components
- `ui/web`: web-specific components
- `ui/mobile`: mobile-specific components

Do not put platform-specific behaviour in `ui/common`.

Components used on both platforms ship as a pair: a `model.ts` (or component folder) in `ui/common` plus an implementation in both `ui/web/src/<component>` and `ui/mobile/src/<component>`. After creating one platform's implementation, mirror it in the other, reusing the shared props/types.

Props that differ between platforms stay out of the shared model. For example `icon` is a string path on web but a `ComponentType<SvgProps>` on mobile — define it in each platform component's own `interface Props` instead.

## After creating

Verify:
- API matches similar components
- existing variants/conventions are reused
- component contains presentation logic only
- both web and mobile implementations exist (unless the component is single-platform by design)