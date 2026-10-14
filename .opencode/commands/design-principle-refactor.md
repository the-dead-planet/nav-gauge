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
5. Use the common theme/appearance model as the source of truth on both platforms. Web components must consume shared `--appearance-*` variables directly. Do not introduce or retain component-specific color/variant matrices such as `--button-color-*` or repeated `.color-primary` blocks.
6. Keep arbitrary runtime overrides, such as custom content shades, as narrowly scoped shared appearance override variables only when finite classes cannot represent them.
7. Give interaction state one owner. When components compose visual primitives, do not independently reconstruct hover, focus, pressed, active, and disabled behavior in both parent and child.
8. Keep platform rendering platform-specific: CSS selectors and SVG rendering on web; `StyleSheet` and press state on mobile. Share only genuine design policy and value resolution.
9. Preserve accessibility, semantic elements, keyboard focus, disabled behavior, Storybook coverage, and existing public APIs unless the old API prevents the correct design.
10. Prefer deletion and direct use of existing appearance variables over adapters, aliases, helpers, or new abstractions.
11. Normalize public component stories to `Playground with Live code editor` and `Gallery`. Web Playground uses `makeLiveEditStory`; both platforms use representative default `args`. Configure finite union props with shared controls or explicit `options`/`mapping` only when inference is insufficient. Gallery owns and covers variant, color, size, shape, active, and disabled dimensions and disables those controls. Delete redundant disabled, size, shape, and interaction stories; keep an extra story only for behavior Playground and Gallery cannot reasonably demonstrate.

After editing, review the complete affected state system once, then run relevant web/mobile typechecks, focused tests, `yarn lint`, and `git diff --check`. Report any tooling failure separately from code failures.
