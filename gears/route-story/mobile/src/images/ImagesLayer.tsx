import { FC, useEffect, useState } from "react";
import { PixelRatio } from "react-native";
import { Layer, Images, GeoJSONSource, ImageEntry } from "@maplibre/maplibre-react-native";
import { Cartomancer, OverlayComponentProps, FeatureStateProps } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import {
    getIconImageId,
    getImageSource,
    ImagesLayers,
    imageLayerIds,
    imageSourceIds,
    draggingImage$,
    draggingClosestFeature$,
    DRAGGED_IMAGE_ID,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
    updateImageFeatureId,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-apparatus";
import { useLoadedMobileImages } from "./useLoadedMobileImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { findThumbnailsWithinBuffer } from "../tinkers";
import { MobileRouteStoryProps } from "../model";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & MobileRouteStoryProps> = ({
    map,
    animatrix,
    data$,
    images$,
    playerOperator
}) => {
    const { cartomancer } = useMobileMachineWard();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const [draggingClosestFeature] = useSubjectState(draggingClosestFeature$);
    const loadedImages = useLoadedMobileImages(images);

    const [sourceDataGeojson, setSourceDataGeojson] = useState(getImageSource(loadedImages, geojson));

    useEffect(() => {
        const draggingImage = draggingImage$.value;
        const draggedImage = draggingImage !== null && draggingImage.interaction === 'player'
            ? loadedImages.find((candidate) => candidate.id === draggingImage.id)
            : undefined;

        if (!draggedImage || !geojson || !draggingClosestFeature) {
            setSourceDataGeojson(getImageSource(loadedImages, geojson));
            return;
        }

        const updated: typeof sourceDataGeojson = getImageSource(loadedImages, geojson);
        for (const feature of updated.features) {
            if (feature.id === draggedImage.id) {
                feature.properties[FeatureStateProps.Dragging] = true;
            }
        }
        updated.features.push({
            type: 'Feature',
            id: -1,
            geometry: draggingClosestFeature.geometry,
            properties: {
                imageId: DRAGGED_IMAGE_ID,
                [IMAGE_PROPERTY]: getIconImageId(draggedImage),
                [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(draggedImage, { thumbnail: true }),
            },
        });
        setSourceDataGeojson(updated);
    }, [loadedImages, geojson, draggingClosestFeature]);

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
                draggingImage$.next({ id: imageFeature.properties.imageId, interaction: 'map' });
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
