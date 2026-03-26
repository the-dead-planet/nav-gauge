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
    DRAGGED_IMAGE_ID,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { MobileMarkerImageData } from "./image-parser";
import { useLoadedMobileImages } from "./useLoadedMobileImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { FeatureProperties } from "@tinker-chest";
import { findThumbnailsWithinBuffer } from "../tinkers";
import { PixelRatio } from "react-native";

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
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useState<Map<string, Set<string | number>>>(new Map());
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
        const id = 'route-story-thumbnails-layer';

        // Start
        // TODO: Test if long press is better
        const nextPanResponderStartHandlers = new Map(map.onPanResponderStartHandlers$.value);
        nextPanResponderStartHandlers.set(id, async (lngLat) => {
            const imageFeature = findThumbnailsWithinBuffer(lngLat, cartomancer.zoom$.value, loadedImages, geojson, { devicePixelRatio: PixelRatio.get() })[0];
            if (imageFeature) {
                map.scrollEnabled$.next(false);
                setDraggingImageId(imageFeature.properties.id);
            }
        });
        map.onPanResponderStartHandlers$.next(nextPanResponderStartHandlers);

        // Move
        const nextPanResponderMoveHandlers = new Map(map.onPanResponderMoveHandlers$.value);
        nextPanResponderMoveHandlers.set(id, async (lngLat) => {
            const id = draggingImageId$.value;
            if (!geojson || id === null) {
                return;
            }
            const [_id, feature] = Cartomancer.getClosestFeature(geojson, { lng: lngLat[0], lat: lngLat[1] });
            const image = loadedImages.find((image) => image.id === draggingImageId);
            if (!image) {
                return;
            }
            const updated = {
                ...sourceDataGeojson,
                features: sourceDataGeojson.features.concat([{
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        imageId: DRAGGED_IMAGE_ID,
                        [IMAGE_PROPERTY]: getIconImageId(image),
                        [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                    }
                }])
            };
            // TODO:

            setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, new Set([id])]]));
        });
        map.onPanResponderMoveHandlers$.next(nextPanResponderMoveHandlers);

        // End
        const nextPanResponderEndHandlers = new Map(map.onPanResponderEndHandlers$.value);
        nextPanResponderEndHandlers.set(id, async (_lngLat) => {
            map.scrollEnabled$.next(true);
            if (draggingImageId$.value !== null) {
                setHighlightIdsBySourceId(new Map());
                setDraggingImageId(null);
            }
        });
        map.onPanResponderEndHandlers$.next(nextPanResponderEndHandlers);

        return () => {
            const nextPanResponderStartHandlers = new Map(map.onPanResponderStartHandlers$.value);
            nextPanResponderStartHandlers.delete(id);
            map.onPanResponderStartHandlers$.next(nextPanResponderStartHandlers);

            const nextPanResponderMoveHandlers = new Map(map.onPanResponderMoveHandlers$.value);
            nextPanResponderMoveHandlers.delete(id);
            map.onPanResponderMoveHandlers$.next(nextPanResponderMoveHandlers);

            const nextPanResponderEndHandlers = new Map(map.onPanResponderEndHandlers$.value);
            nextPanResponderEndHandlers.delete(id);
            map.onPanResponderEndHandlers$.next(nextPanResponderEndHandlers);
        };
    }, [map, loadedImages, geojson]);

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
