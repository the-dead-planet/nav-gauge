import { FC, useEffect, useMemo, useState } from "react";
import { CircleLayer, Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import distance from "@turf/distance";
import { Cartomancer, OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import {
    getIconImageId,
    getImageSource,
    RouteToolProps,
    ImagesLayers,
    imageLayerIds,
    imageSourceIds,
    draggingImageId$,
    THUMBNAIL_IMAGE_SIZE,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { MobileMarkerImageData } from "./image-parser";
import { useLoadedMobileImages } from "./useLoadedMobileImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { FeatureProperties } from "@tinker-chest";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    map,
    data$,
    images$,
    playerOperator
}) => {
    const { animatrix, cartomancer } = useStateWarden();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedMobileImages(images);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useState<Map<string, Set<string>>>(new Map());
    const [draggingImageId, setDraggingImageId] = useSubjectState(draggingImageId$);

    const sourceDataGeojson = useMemo(
        () => getImageSource(loadedImages, geojson),
        [loadedImages, geojson]
    );

    const imageSources: { [key in string]: { uri: string } } = Object.fromEntries(
        loadedImages.flatMap((loadedImage) => {
            const thumbnail: [string, { uri: string }] = [getIconImageId(loadedImage, { thumbnail: true }), { uri: loadedImage.data.thumbnail }];
            const fullSize: [string, { uri: string }] = [getIconImageId(loadedImage), { uri: loadedImage.data.fullSize }];

            if (displayImageId === loadedImage.id) {
                return [fullSize, thumbnail]
            }

            return [thumbnail];
        })
    );

    useEffect(() => {
        const id = 'route-story-images-layer';
        const nextPressHandlers = new Map(map.onLongPressHandlers$.value);
        nextPressHandlers.set(id, async (eventFeature) => {
            const c = [eventFeature.geometry.coordinates[0], eventFeature.geometry.coordinates[1]];
            const buffer = Cartomancer.getBufferInMeters(c[1], cartomancer.zoom$.value, Math.round(THUMBNAIL_IMAGE_SIZE / 2));
            const imageFeatures = loadedImages
                .reduce<GeoJSON.Feature<GeoJSON.Point, FeatureProperties>[]>((acc, image) => {
                    const f = geojson?.features.find((f) => f.properties.id === image.featureId);
                    return f ? acc.concat([f]) : acc;
                }, [])
                .filter((f) => distance(c, f.geometry.coordinates, { units: 'meters' }) <= buffer);
            const imageFeature = imageFeatures[0];

            if (imageFeature) {
                map.scrollEnabled$.next(false);
                setDraggingImageId(imageFeature.properties.id);
            }
        });

        map.onLongPressHandlers$.next(nextPressHandlers);

        return () => {
            const nextPressHandlers = new Map(map.onLongPressHandlers$.value);
            nextPressHandlers.delete(id);
            map.onLongPressHandlers$.next(nextPressHandlers);
        };
    }, [map, loadedImages]);

    const imageInDisplayIconSize = useImageInDisplay(map, playerOperator);

    return (
        <>
            <Images images={imageSources} />
            <ShapeSource id={imageSourceIds.thumbnails} shape={sourceDataGeojson}>
                <CircleLayer
                    id={imageLayerIds.thumbnailsOutline}
                    style={ImagesLayers.thumbnailsOutline}
                />
                <SymbolLayer
                    id={imageLayerIds.thumbnails}
                    filter={ImagesLayers.thumbnailsFilter}
                    style={ImagesLayers.thumbnails}
                />
                <CircleLayer
                    id={imageLayerIds.thumbnailsHighlightOutline}
                    filter={ImagesLayers.thumbnailsHighlightOutlineFilter}
                    style={ImagesLayers.thumbnailsHighlightOutline}
                />
                <SymbolLayer
                    id={imageLayerIds.thumbnailsHighlight}
                    filter={ImagesLayers.thumbnailsHighlightFilter}
                    style={ImagesLayers.thumbnailsHighlight}
                />
                <SymbolLayer
                    id={imageLayerIds.imageInDisplay}
                    filter={['==', ['get', 'imageId'], displayImageId ?? -1]}
                    style={{
                        ...ImagesLayers.imageInDisplay,
                        iconSize: imageInDisplayIconSize,
                    }}
                />
            </ShapeSource>
        </>
    );
};
