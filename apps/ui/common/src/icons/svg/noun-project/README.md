# Noun project

## Attribution

Refer to https://thenounproject.com/pricing/
It is required to list creator names of each used icon.
The name should be added in the storybook icons page. This page should be linked in the legal section of the applications.

## Icon processing

SVG icons from the free tier include `<text>` elements with `Created by <name>` and `from Noun Project`. 
The width, height and viewbox are not set to standard `24x24px`. 
After adding new icons in the [raw folder](/apps/ui/common/src/icons/svg/noun-project/raw/) run the [process-icons](/apps/ui/common/src/icons/svg/noun-project/process-icons.ts) script to generate processed icons and the registry with creator names to use on the storybook page. Icons to use in the app will end up in the [output folder](/apps/ui/common/src/icons/svg/noun-project/output/)

From the [apps](/apps) folder run:

```bash
yarn icons
```
