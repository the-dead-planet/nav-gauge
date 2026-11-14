import { useMemo } from "react";
import { Map } from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { resolveMapImageMarkerColors, useTheme } from "@ui";
import {
    draggingImage$,
    draggingPlacement$,
    getImageDragPreviewSource,
    getImageSource,
    imageSourceIds,
    layerOrder,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { getImageDragPreviewLayers } from "./images-layers";

export const ImageDragPreview = ({
    map,
    source,
    visible,
}: {
    map: Map;
    source: ReturnType<typeof getImageSource>;
    visible: boolean;
}) => {
    const theme = useTheme();
    const { activeColor: color } = resolveMapImageMarkerColors(theme);
    const [image] = useSubjectState(draggingImage$);
    const [placement] = useSubjectState(draggingPlacement$);
    const mapLayerData = useMemo(
        (): MapLayerData => ({
            sourceId: imageSourceIds.dragPreview,
            source: {
                type: "geojson",
                data: { type: "FeatureCollection", features: [] },
            },
            layers: getImageDragPreviewLayers(color),
        }),
        [color],
    );
    const updatedData = useMemo(
        () => ({
            sourceId: imageSourceIds.dragPreview,
            data: getImageDragPreviewSource(
                source,
                image?.id ?? null,
                visible ? placement : null,
            ),
        }),
        [source, image, placement, visible],
    );

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            updatedData={updatedData}
            layerOrder={layerOrder}
        />
    );
};
