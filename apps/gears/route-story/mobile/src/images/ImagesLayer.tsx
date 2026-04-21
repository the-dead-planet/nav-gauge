import { FC, useEffect, useState } from "react";
import { PixelRatio } from "react-native";
import { CircleLayer, Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import { Cartomancer, FeatureStateProps, OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import {
    getIconImageId,
    getImageSource,
    RouteToolProps,
    ImagesLayers,
    imageLayerIds,
    imageSourceIds,
    draggingImageId$,
    DRAGGED_IMAGE_ID,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
    updateImageFeatureId,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { MobileMarkerImageData } from "./image-parser";
import { useLoadedMobileImages } from "./useLoadedMobileImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { findThumbnailsWithinBuffer } from "../tinkers";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    map,
    data$,
    images$,
    playerOperator
}) => {
    const { animatrix, cartomancer } = useStateWarden();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }, setData] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedMobileImages(images);

    const [sourceDataGeojson, setSourceDataGeojson] = useState(getImageSource(loadedImages, geojson));

    useEffect(() => {
        setSourceDataGeojson(getImageSource(loadedImages, geojson));
    }, [loadedImages, geojson]);

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
        const nextPanResponderStartHandlers = new Map(map.onPanResponderStartHandlers$.value);
        nextPanResponderStartHandlers.set(id, async (lngLat) => {
            const imageFeature = findThumbnailsWithinBuffer(lngLat, cartomancer.zoom$.value, loadedImages, geojson, { devicePixelRatio: PixelRatio.get() })[0];
            if (imageFeature) {
                map.scrollEnabled$.next(false);
                draggingImageId$.next(imageFeature.properties.imageId);
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
            const image = loadedImages.find((image) => image.id === id);
            if (!image) {
                return;
            }
            let updated: typeof sourceDataGeojson = getImageSource(loadedImages, geojson);
            for (const feature of updated.features) {
                if (feature.id === id) {
                    feature.properties[FeatureStateProps.Dragging] = true;
                }
            }
            updated.features.push({
                type: 'Feature',
                id: -1,
                geometry: feature.geometry,
                properties: {
                    imageId: DRAGGED_IMAGE_ID,
                    [IMAGE_PROPERTY]: getIconImageId(image),
                    [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                }
            })
            setSourceDataGeojson(updated);
        });
        map.onPanResponderMoveHandlers$.next(nextPanResponderMoveHandlers);

        // End
        const nextPanResponderEndHandlers = new Map(map.onPanResponderEndHandlers$.value);
        nextPanResponderEndHandlers.set(id, async (lngLat) => {
            const dragImId = draggingImageId$.value;

            map.scrollEnabled$.next(true);
            draggingImageId$.next(null);
            setSourceDataGeojson(getImageSource(loadedImages, geojson));

            if (!geojson) {
                return;
            }
            const [id, _feature] = Cartomancer.getClosestFeature(geojson, { lng: lngLat[0], lat: lngLat[1] });
            const image = loadedImages.find((image) => image.id === dragImId);
            if (!image) {
                return;
            }
            updateImageFeatureId(images$, image.id, id);
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
