# Architectures

## API

To be implemented later.

## Apps

All code lives under `/`. Import direction: `tinker-chest` → `ui` → `apparatus` → `gears` → `app`.

- `tinker-chest/` — foundational utilities (single package, no internal deps)
- `ui/{common,web,mobile}/` — reusable UI and design tokens;
- `apparatus/{common,web,mobile}/` — shared logic (common split from platform)
- `gears/*/{common,web,mobile}/` — pluggable features
- `app-{web,mobile}/` — application shells

Platform packages import only matching platform and common packages. Common packages never import platform implementations.

The diagram and package responsibilities are also available in Storybook under **Application → App Architecture**.

### Import sequence diagram

This diagram was created in [draw.io](https://app.diagrams.net).

![Diagram](/docs/assets/architecture.svg)

[Edit source](/docs/assets/architecture.drawio)

### UI layering diagram

The UI library is split into ordered layers; a layer may only import from the layers below it.

![UI layering diagram](/docs/assets/ui-architecture.svg)

[Edit source](/docs/assets/ui-architecture.drawio)

## Scripts

This space is for scripts to run ad-hoc.
