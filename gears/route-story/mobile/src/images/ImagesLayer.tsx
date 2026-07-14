import { FC, useEffect, useState } from "react";
import { PixelRatio } from "react-native";
import { Layer, Images, GeoJSONSource, ImageEntry } from "@maplibre/maplibre-react-native";
import { Cartomancer, OverlayComponentProps, useMachineWard, FeatureStateProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import {
    getIconImageId,
    getImageSource,
    RouteStoryProps,
    ImagesLayers,
    imageLayerIds,
    imageSourceIds,
    draggingImage$,
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

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    map,
    animatrix,
    data$,
    images$,
    playerOperator
}) => {
    const { cartomancer } = useMachineWard();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedMobileImages(images);

    const [sourceDataGeojson, setSourceDataGeojson] = useState(getImageSource(loadedImages, geojson));

    useEffect(() => {
        setSourceDataGeojson(getImageSource(loadedImages, geojson));
    }, [loadedImages, geojson]);

    const imageSources: { [key in string]: ImageEntry } = Object.fromEntries(
        loadedImages.flatMap((loadedImage) => {
            const thumbnail: [string, ImageEntry] = [getIconImageId(loadedImage, { thumbnail: true }), { source: { uri: loadedImage.data.thumbnail } }];
            const fullSize: [string, ImageEntry] = [getIconImageId(loadedImage), { source: { uri: loadedImage.data.fullSize } }];

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
                map.dragPan$.next(false);
                draggingImage$.next({ id: imageFeature.properties.imageId, interaction: 'map'});
            }
        });
        map.onPanResponderStartHandlers$.next(nextPanResponderStartHandlers);

        // Move
        const nextPanResponderMoveHandlers = new Map(map.onPanResponderMoveHandlers$.value);
        nextPanResponderMoveHandlers.set(id, async (lngLat) => {
            const draggingImage = draggingImage$.value;
            if (!geojson || draggingImage === null) {
                return;
            }
            const [_id, feature] = Cartomancer.getClosestFeature(geojson, { lng: lngLat[0], lat: lngLat[1] });
            const image = loadedImages.find((image) => image.id === draggingImage.id);
            if (!image) {
                return;
            }
            const updated: typeof sourceDataGeojson = getImageSource(loadedImages, geojson);
            for (const feature of updated.features) {
                if (feature.id === draggingImage.id) {
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
            const draggingImage = draggingImage$.value;

            map.dragPan$.next(true);
            draggingImage$.next(null);
            setSourceDataGeojson(getImageSource(loadedImages, geojson));

            if (!geojson) {
                return;
            }
            const [id, _feature] = Cartomancer.getClosestFeature(geojson, { lng: lngLat[0], lat: lngLat[1] });
            const image = loadedImages.find((image) => image.id === draggingImage?.id);
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

    const imageInDisplayIconSize = useImageInDisplay(map, animatrix, playerOperator);

    return (
        <>
            <Images images={imageSources} />
            <GeoJSONSource id={imageSourceIds.thumbnails} data={sourceDataGeojson}>
                <Layer
                    type="circle"
                    id={imageLayerIds.thumbnailsOutline}
                    paint={ImagesLayers.thumbnailsOutline.paint}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnails}
                    filter={ImagesLayers.thumbnails.filter}
                    layout={ImagesLayers.thumbnails.layout}
                    paint={ImagesLayers.thumbnails.paint}
                />
                <Layer
                    type="circle"
                    id={imageLayerIds.thumbnailsHighlightOutline}
                    filter={ImagesLayers.thumbnailsHighlightOutline.filter}
                    paint={ImagesLayers.thumbnailsHighlightOutline.paint}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnailsHighlight}
                    filter={ImagesLayers.thumbnailsHighlight.filter}
                    layout={ImagesLayers.thumbnailsHighlight.layout}
                    paint={ImagesLayers.thumbnailsHighlight.paint}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.imageInDisplay}
                    filter={ImagesLayers.imageInDisplay.getFilter(displayImageId)}
                    layout={{
                        ...ImagesLayers.imageInDisplay.layout,
                        'icon-size': imageInDisplayIconSize,
                    }}
                />
            </GeoJSONSource>
        </>
    );
};
