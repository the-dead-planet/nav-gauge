# Icons

## Requirements

### Size

Width, height and viewbox should be 24x24.

### Colors

Color properties should be removed

### Exports

#### Web

Add the icon to the [svg folder](/apps/ui/web/src/icons/svg/) and export the string in the [svg index](/apps/ui/web/src/icons/svg/index.ts) file:

```
export { default as Example } from './example.svg';
```

If it's from The Noun Project, then add it in [the noun project folder index](/apps/ui/common/src/icons/svg/noun-project/index.ts)

#### Mobile

No action needed.

## Sources

### The Noun Project

The Noun Project requires attribution. See how to process icons in [here](/apps/ui/common/src/icons/svg/noun-project/README.md).
https://thenounproject.com


### Other

These sources are free and don't require processing.

https://boxicons.com/icons?free=true
https://lucide.dev/icons/