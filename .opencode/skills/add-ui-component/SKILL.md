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

- `ui/common`: shared components
- `ui/web`: web-specific components
- `ui/mobile`: mobile-specific components

Do not put platform-specific behaviour in `ui/common`.

## After creating

Verify:
- API matches similar components
- existing variants/conventions are reused
- component contains presentation logic only