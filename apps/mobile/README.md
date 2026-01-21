# Mobile application

Mobile version of the application.

## Components

Mobile application consists of the main app and the mobile UI library.

## Import sequence

Mobile app can import the (common) UI, mobile UI, apparatus and tinker chest.
It cannot be imported back to other components.

## Tests

### Unit tests

Write unit tests for logic using mocha and chai in folders `test/**/*.ts`.
Write component rendering tests using jest in folders `__tests__/**/*.tsx`.