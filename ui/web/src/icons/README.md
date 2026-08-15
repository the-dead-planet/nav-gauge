# Icons

## Requirements

### Size

Width, height and viewbox should be 24x24.

### Colors

Set colors (fill, stroke, etc.,) to `"currentColor"`.

### Exports

Add the icon to the [svg folder](/ui/web/src/icons/svg/) and export the string in the [svg index](/ui/web/src/icons/svg/index.ts) file:

```
export { default as Example } from './example.svg';
```

Export the component in the [components.ts](/ui/web/src/icons/components.ts) file:

```
import example from './example.svg';

export const ExampleIcon: FC<IconProps> = (props) => <Icon src={example} {...props} />;
```
