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

Reuse theme sizing for controls with the same geometry: `theme.sizes.control[size]` on mobile and generated `--size-control-*` variables on web. Keep component-specific geometry only when it has a different visual purpose.

## Interactive stories

Public components require `Playground with Live code editor` and `Gallery`. Web Playground uses `makeLiveEditStory`. Both views must support direct interaction and drawer controls against the same story args; one value shared by every Gallery example is fine.

- **Web:** use a `useArgs()` decorator to update controlled args from callbacks. The live editor renders the controlled component directly.
- **Mobile:** use the second `updateArgs` argument supplied to `renderPlayground` and `renderGallery`, wiring callbacks explicitly (for example, `onChange={(value) => updateArgs({ value })}`).
- Avoid private per-example state that leaves the drawer stale or overrides its values. Gallery owns only the dimensions it fixes; keep value controls available when values are interactive.
- Compose the platform gallery primitives, start at shared defaults, and follow the selected size. Cover supported variants, palette/status colors, and shapes without looping over sizes. Arbitrary color values are not a palette appearance API.

## After creating

Verify:

- API matches similar components
- existing variants/conventions are reused
- component contains presentation logic only
- both web and mobile implementations exist (unless the component is single-platform by design)
- the mobile story default-exports one `MobileStoryDefinition` from `ui/mobile/src/storybook/model.ts`; do not repeat its path-derived group or component name
- shared story defaults and Storybook-compatible controls live in the common component's `tinkers.ts`; platform component references, platform-only props and mappings, callbacks, and renderers stay in their platform stories
- mobile controls match the web story, with `renderPlayground` and `renderGallery` as the only required views
- direct interaction updates the drawer's value, drawer changes update the preview, and Gallery examples remain interactive
