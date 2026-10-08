# UI libraries

- [Common UI](/ui/common/README.md)
- [Mobile UI](/ui/mobile/README.md)
- [Web UI](/ui/web/README.md)

## Import sequence

See [ARCHITECTURES](/docs/ARCHITECTURES.md).

## Surface variants

Variant names describe the same visual treatment across components and platforms. Components should use the shared `FillVariant` or `SurfaceVariant` types from `@ui` rather than defining local variant names.

| Variant | Text and icons | Background | Border |
| --- | --- | --- | --- |
| `fill` | Palette contrast shade | Shade `500` | None |
| `fill-inverse` | `900` in light mode, `100` in dark mode | `100` in light mode, `900` in dark mode | Shade `500` |
| `fill-translucent` | Shade `500` | Shade `500` at 24% | Shade `500` at 30% |
| `ghost` | Shade `500` | Transparent | None |
| `outline` | Shade `500` | Transparent | Shade `500` |
| `inset` | Shade `500` | Transparent or a subtle shade `500` tint | Inset border and shadow |

`FillVariant` contains `fill`, `fill-inverse`, and `fill-translucent`. `SurfaceVariant` adds `ghost`, `outline`, and `inset` for components that support borderless or recessed surfaces.

Web `fill-translucent` surfaces use `backdrop-filter: blur(6px)`. Native mobile surfaces use the translucent fill without backdrop blur.

Text and icons use the same foreground color unless the component has a distinct affordance, such as a dropdown chevron. Such affordances may use shade `500` to preserve their accent role.

### Interaction states

- `highlightColor` supplies hover, focus, active, and selected accents. It defaults to `color`.
- Focus changes the border or focus ring, not the resting text color.
- Disabled components do not use opacity. In light mode they use shade `300` text, icons, and borders on a shade `200` surface. In dark mode they use shade `700` text, icons, and borders on a shade `800` surface.
- Labels follow the disabled foreground shade of their control.

See the [color Storybook documentation](/ui/web/src/colors/Colors.mdx) for palette shade roles and visual examples.
