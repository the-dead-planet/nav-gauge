#### Docs

Types of maplibre web and native are not fully compatible, although layer definitions are mostly thesame.

The files in this folder fix sufficient typing so that the common definitions can be used in both environments without TS errors.

## Image markers

| Element | Rendering |
|---------|-----------|
| Photo | Circle offset toward viewport top, leaving its route position visible. |
| Route anchor | Map-aligned hexagon at the original route coordinate, including when a group expands. Approximately 4 px sides and a nominal 4 px gap to the default circle border on a flat, unrotated map; bearing and pitch change its projected bounds. |
| Decoration colors | Photo outline and route hexagon share the UI design system's [map image-marker policy](../../../../../ui/web/src/design-system/Appearance.mdx#map-image-markers). Selection/drag takes priority over hover. |
| Count badge | One composite symbol image contains the octagon and bold number, so overlapping badges stack as complete units. |
| Count labels | Preload `1`–`9` and `9+`. Standalone photos do not display a badge; groups above nine share `9+`, retaining their actual count internally. |
| Image lifecycle | Composite badges are rasterized in memory; no temporary files. Replace the fixed ten-image set when resolved theme colors change, removing the old map images. |

Anchors and photos have distinct feature IDs for MapLibre's updateable GeoJSON index, but retain the same `imageId` for interaction. Mirror hover and drag feature state to the corresponding anchor ID. Filter anchor features out of photo, badge, and playback layers. Drag coordinates compensate for the grab offset; completed drags clear selection and group expansion, while taps preserve selection behavior.

Badges render inside MapLibre, not as DOM/native overlays, so they appear in map recordings. The separate photo-outline overlap issue requires composite thumbnail variants and is not solved by composite count badges.

### Regenerating assets

From the workspace root, run `yarn tsx scripts/app/generate-image-badge.ts <path-to-NotoSans-Bold.ttf>`. Use Noto Sans Bold from [notofonts/noto-fonts](https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSans). The generated assets contain outlined digits and the hexagon SDF; runtime rendering does not need that font file.
