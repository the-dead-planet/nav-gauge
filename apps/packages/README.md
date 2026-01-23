# Packages

Common packages with logic or state management reusable between web and mobile apps.


## Components 

- [Apparatus](/apps/packages/apparatus/README.md)
- [Tinker chest](/apps/packages/tinker-chest/README.md)

## Dependencies

Packages must only implement [TypeScript](https://www.typescriptlang.org) logic which works well in both web and mobile environments. They **cannot** use web or mobile specific dependencies and types, such as [react-dom](https://react.dev/reference/react-dom) or [react-native](https://reactnative.dev).

The main dependencies here are [React](https://react.dev) and [Rxjs](https://rxjs.dev) for state management.

React hooks are allowed as long as they don't use any elements from DOM or web/mobile specific frameworks.

## Import sequence

See [architecture](/docs/architecture.md).
