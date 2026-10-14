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
5. Put the shared public API and platform-neutral value logic in `@ui/common`; add thin renderers in `@web-ui` and `@mobile-ui` for reusable components.
6. Use existing appearance props and variant types. Do not create parallel color, size, active, disabled, or variant types.
7. On web, apply the shared appearance classes and consume semantic `--appearance-<variant>-<state>-<channel>` variables directly. Do not create component-specific palette matrices, mode matrices, or aliases such as `--<component>-color-*`.
8. Use inline style only for truly arbitrary runtime values that finite appearance classes cannot represent, such as a caller-selected shade. Name those as narrowly scoped shared appearance override variables.
9. On mobile, resolve the same common theme/appearance values directly. Keep transient pressed/hovered/focused UI state in the component that renders it.
10. Implement each state once: default, hover/focus, pressed/persistent active, and disabled. Disabled wins; transient interaction overrides persistent active; use `highlightColor ?? color` for interactive states.
11. If the component composes a shape primitive, assign interaction state to one owner. The visual primitive should render geometry rather than duplicate the control's content state machine.
12. Add matching web and mobile stories. Public reusable components have exactly two default stories: `Playground with Live code editor` and `Gallery`. Web Playground must use `makeLiveEditStory`; both platforms must provide representative default `args`. Configure finite union props with the shared controls from `ui/web/src/storybook/controls.ts` or explicit `options`/`mapping` when Storybook cannot infer them. Specify only non-inferable `argTypes`, and disable callback controls that are not meaningful to invoke manually.
13. Gallery must systematically cover every supported variant, color, size, shape, active state, and disabled state using existing gallery helpers where they fit. Disable controls for dimensions the Gallery owns so its output is deterministic.
14. Add another named story only when it demonstrates distinct behavior that Playground and Gallery cannot reasonably expose. Do not create separate disabled, sizes, shapes, or interaction stories when those cases belong in Gallery or its controls.

Keep the implementation minimal, accessible, mobile-first, and consistent with package import direction. Run relevant web/mobile typechecks, focused tests, `yarn lint`, and `git diff --check` after implementation.
