---
description: Create a UI component using the shared cross-platform design and appearance system.
agent: build
---

Create this UI component: $ARGUMENTS

Load and follow the `add-ui-component` skill. Also apply these appearance requirements:

1. Search for an existing component or primitive to reuse, extend, or compose before creating anything.
2. Read `ui/web/src/design-system/Overview.mdx`, the relevant linked design-system documentation, and `ui/web/src/design-system/colors/Colors.mdx` before designing variants or states.
3. Analyze the UI-layer responsibilities and import direction in `.opencode/rules/architecture.mdc`. State which existing layer owns the component and why before editing: `design-system`, `chassis`/`motion`, `hud`, `gizmos`, `rigs`, `forms`, or `assemblies`. Place it in the lowest layer that owns its semantics, not beside superficially similar markup.
4. If no existing layer semantically fits, explain the missing responsibility before creating a new layer. Do not create a layer for one component unless the responsibility is genuinely distinct and reusable. When adding a layer, define its import position and update `.opencode/rules/architecture.mdc`, `docs/assets/ui-architecture.drawio`, and the generated `docs/assets/ui-architecture.svg`.
5. For reusable cross-platform components, put the shared public API and platform-neutral value logic in `@ui/common`; add thin renderers in `@web-ui` and `@mobile-ui`.
6. Export the component and shared API through the existing component, layer, and package barrels.
7. Use existing appearance props and variant types. Default to `ghost` when the component supports it; otherwise default to `fill-inverse`. Do not create parallel color, size, active, disabled, or variant types.
8. Support every shared `ColorVariant`: palette colors (`primary`, `secondary`, `tertiary`, `neutral`) and status colors (`glitch`, `hazard`, `secured`, `intel`). Do not create component-local status mappings or semantic aliases.
9. On web, apply the shared appearance classes and consume semantic `--appearance-<variant>-<state>-<channel>` variables directly. Full `--color-<color>-<shade>` ramps and appearance rules are generated centrally by `useThemeVariables`; do not create component-specific palette matrices, mode matrices, or aliases such as `--<component>-color-*`.
10. Use inline style only for truly arbitrary runtime values that finite appearance classes cannot represent, such as `contentShade` or `highlightContentShade`. Resolve the shade against the selected `color` or `highlightColor`, including status colors, and name its narrowly scoped shared appearance override variable.
11. On mobile, resolve the same common theme/appearance values directly. Keep transient pressed/hovered/focused UI state in the component that renders it.
12. Implement each state once: default, hover/focus, pressed/persistent active, and disabled. Disabled wins; transient interaction overrides persistent active; use `highlightColor ?? color` for interactive states.
13. If the component composes a shape primitive, assign interaction state to one owner. The visual primitive should render geometry rather than duplicate the control's content state machine.
14. Add matching web and mobile stories. `Playground with Live code editor` and `Gallery` are mandatory for public reusable components. Web Playground must use `makeLiveEditStory`. Mobile stories default-export one `MobileStoryDefinition` from `ui/mobile/src/storybook/model.ts`; derive the group and component name from the file path rather than repeating them in metadata. Extract shared default args and Storybook-compatible controls to the common component's `tinkers.ts`; keep component references, platform-only props and mappings, callbacks, and renderers platform-local. Disable callback controls that are not meaningful to invoke manually.
15. Gallery must systematically cover every supported variant, every palette and status color, size, shape, active state, and disabled state using existing gallery helpers where they fit. Disable controls for dimensions the Gallery owns so its output is deterministic.
16. Add another named story only when it demonstrates distinct behavior that Playground and Gallery cannot reasonably expose. Do not create separate disabled, sizes, shapes, or interaction stories when those cases belong in Gallery or its controls.

Keep the implementation minimal, accessible, mobile-first, and consistent with package import direction. Run `yarn typecheck:web` and `yarn typecheck:mobile:once` when relevant, focused tests, `yarn lint`, and `git diff --check` after implementation.
