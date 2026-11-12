import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
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
}: {
    source: ReturnType<typeof getImageSource>;
}) => {
    const theme = useTheme();
    const [image] = useSubjectState(draggingImage$);
    const [placement] = useSubjectState(draggingPlacement$);
    return (
        <GeoJSONSource
            id={imageSourceIds.dragPreview}
            data={getImageDragPreviewSource(
                source,
                image?.id ?? null,
                placement,
            )}
        >
            <Layer
                type="circle"
                id={imageLayerIds.thumbnailsHighlightOutline}
                afterId={imageLayerIds.thumbnails}
                filter={ImagesLayers.thumbnailsHighlightOutline.filter}
                paint={ImagesLayers.thumbnailsHighlightOutline.getPaint(
                    theme.color("tertiary", 500),
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
