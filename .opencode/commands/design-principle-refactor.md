---
description: Refactor existing UI components to the shared design principles and appearance system.
agent: build
---

Refactor these existing UI components: $ARGUMENTS

Treat this as a deliberate redesign of their implementation, not a sequence of local patches.

1. Read `ui/web/src/design-system/Overview.mdx`, `ui/web/src/design-system/Theming.mdx`, and `ui/web/src/design-system/colors/Colors.mdx` before editing.
2. Locate the common API and both web and mobile implementations, stories, tests, composed primitives, and all callers. Trace state ownership end to end.
3. Compare every variant and state with the design-principle tables: default, hover/focus, pressed/persistent active, and disabled. Disabled wins; transient interaction overrides persistent active; `highlightColor ?? color` supplies interactive states.
4. Step back and decide how the code should look if implemented cleanly today. Remove contradictory selectors, cascade-dependent behavior, duplicated state machines, dead definitions, obsolete compatibility code, and accidental abstractions.
5. Use the common theme/appearance model as the source of truth on both platforms. Default to `ghost` when the component supports it; otherwise default to `fill-inverse`. Web components must consume shared `--appearance-*` variables directly. Do not introduce or retain component-specific color/variant matrices such as `--button-color-*` or repeated `.color-primary` blocks.
6. Support every shared `ColorVariant`: palette colors (`primary`, `secondary`, `tertiary`, `neutral`) and status colors (`glitch`, `hazard`, `secured`, `intel`). Do not special-case status colors in a component. Web receives complete `--color-<color>-<shade>` ramps and generated `--appearance-*` rules from `useThemeVariables`; mobile resolves the same colors through `Theme.color()` and `Theme.resolveAppearance()`.
7. Keep arbitrary runtime overrides, such as `contentShade` and `highlightContentShade`, as narrowly scoped shared appearance override variables only when finite classes cannot represent them. Resolve overrides against the selected `color` or `highlightColor`, including status colors.
8. Give interaction state one owner. When components compose visual primitives, do not independently reconstruct hover, focus, pressed, active, and disabled behavior in both parent and child.
9. Keep platform rendering platform-specific: CSS selectors and SVG rendering on web; `StyleSheet` and press state on mobile. Share only genuine design policy and value resolution.
10. Preserve accessibility, semantic elements, keyboard focus, disabled behavior, Storybook coverage, and existing public APIs unless the old API prevents the correct design. If an API changes, update every caller in the same change.
11. Prefer deletion and direct use of existing appearance variables over adapters, aliases, helpers, or new abstractions.
12. Public components must have `Playground with Live code editor` and `Gallery` stories. Web Playground uses `makeLiveEditStory`. Mobile stories default-export one `MobileStoryDefinition` from `ui/mobile/src/storybook/model.ts`; the explorer derives group and component names from the file path. Extract shared default args and Storybook-compatible controls to the common component's `tinkers.ts`; keep component references, platform-only props and mappings, callbacks, and renderers platform-local. Gallery owns and covers variant, every palette and status color, size, and shape dimensions; expose only controls that the gallery does not fix. Delete redundant disabled, size, shape, and interaction stories.

After editing, review the complete affected state system once, then run `yarn typecheck:web` and `yarn typecheck:mobile:once` when relevant, focused tests, `yarn lint`, and `git diff --check`. Report any tooling failure separately from code failures.
