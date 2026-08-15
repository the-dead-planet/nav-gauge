# Architectures

## API

To be implemented later.

## Apps

All code lives under `/`. Import direction: `tinker-chest` → `apparatus` → `gears` → `app`.

- `tinker-chest/` — foundational utilities (single package, no internal deps)
- `apparatus/{common,web,mobile}/` — shared logic (common split from platform)
- `gears/*/{common,web,mobile}/` — pluggable features
- `ui/{common,web,mobile}/` — UI library, can import from anywhere
- `app-{web,mobile}/` — application shells

The import sequence is shown in the diagram below.

### Import sequence diagram

This diagram was created in [draw.io](https://app.diagrams.net).

![Diagram](/docs/assets/architecture.svg)

[Edit source](/docs/assets/architecture.drawio)

## Scripts

This space is for scripts to run ad-hoc.