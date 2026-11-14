import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";
import { useSubjectState } from "@tinker-chest";
import { resolveMapImageMarkerColors, useTheme } from "@ui";
import {
    draggingImage$,
    draggingPlacement$,
    getImageDragPreviewSource,
    getImageSource,
    imageSourceIds,
    imageLayerIds,
    ImagesLayers,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const ImageDragPreview = ({
    source,
    visible,
}: {
    source: ReturnType<typeof getImageSource>;
    visible: boolean;
}) => {
    const theme = useTheme();
    const { activeColor } = resolveMapImageMarkerColors(theme);
    const [image] = useSubjectState(draggingImage$);
    const [placement] = useSubjectState(draggingPlacement$);
    return (
        <GeoJSONSource
            id={imageSourceIds.dragPreview}
            data={getImageDragPreviewSource(
                source,
                image?.id ?? null,
                visible ? placement : null,
            )}
        >
            <Layer
                type="symbol"
                id={imageLayerIds.dragAnchor}
                afterId={imageLayerIds.thumbnails}
                filter={ImagesLayers.anchors.filter}
                layout={ImagesLayers.anchors.layout}
                paint={ImagesLayers.anchors.getPaint(
                    activeColor,
                    activeColor,
                    activeColor,
                )}
            />
            <Layer
                type="circle"
                id={imageLayerIds.thumbnailsHighlightOutline}
                afterId={imageLayerIds.dragAnchor}
                filter={ImagesLayers.thumbnailsHighlightOutline.filter}
                paint={ImagesLayers.thumbnailsHighlightOutline.getPaint(
                    activeColor,
                )}
            />
            <Layer
                type="symbol"
                id={imageLayerIds.thumbnailsHighlight}
                afterId={imageLayerIds.thumbnailsHighlightOutline}
                filter={ImagesLayers.thumbnailsHighlight.filter}
                layout={ImagesLayers.thumbnailsHighlight.layout}
                paint={ImagesLayers.thumbnailsHighlight.paint}
            />
        </GeoJSONSource>
    );
};
