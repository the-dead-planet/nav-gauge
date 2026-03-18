import { FC, useMemo, useState, useEffect } from "react";
import { Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import {
    IMAGE_MARKER_SIZE,
    getIconImageId,
    getImageIconSize,
    getImageSource,
    RouteToolProps,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
    IMAGE_THUMBNAIL_SIZE,
    IMAGE_IN_DISPLAY_SIZE
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { MobileMarkerImageData } from "./image-parser";
import { useLoadedMobileImages } from "./useLoadedMobileImages";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    map,
    data$,
    images$,
    playerOperator
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedMobileImages(images);
    const { animatrix } = useStateWarden();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const isInDisplay = displayImageId !== null;
    const [iconSize, setIconSize] = useState(getImageIconSize(IMAGE_IN_DISPLAY_SIZE, IMAGE_MARKER_SIZE));

    useEffect(() => {
        if (isInDisplay) {
            playerOperator.animateDisplayImage({ width: map.width, height: map.height }, setIconSize)
        }

        return () => {
            playerOperator.cleanupAnimateDisplayImage(setIconSize);
        };
    }, [isInDisplay]);

    const sourceDataGeojson = useMemo(
        () => getImageSource(loadedImages, geojson),
        [loadedImages, geojson]
    );

    const imageSources = Object.fromEntries(
        loadedImages.flatMap((loadedImage) => {
            const thumbnail = [getIconImageId(loadedImage, { thumbnail: true }), { uri: loadedImage.data.image }];
            const image = [getIconImageId(loadedImage), { uri: loadedImage.data.image }];
            if (displayImageId === loadedImage.id) {
                return [image, thumbnail]
            }
            return [thumbnail];
        })
    );

    if (loadedImages.length === 0) {
        return null;
    }

    return (
        <>
            <Images images={imageSources} />
            <ShapeSource id="markerSource" shape={sourceDataGeojson}            >
                <SymbolLayer
                    id="markerLayer"
                    style={{
                        iconImage: ['get', IMAGE_THUMBNAIL_PROPERTY],
                        iconSize: getImageIconSize(IMAGE_THUMBNAIL_SIZE, IMAGE_MARKER_SIZE),
                        iconAllowOverlap: true
                    }}
                />
                <SymbolLayer
                    id="markerLayerFullSize"
                    filter={['==', ['get', 'imageId'], displayImageId ?? -1]}
                    style={{
                        iconImage: ['get', IMAGE_PROPERTY],
                        iconSize: iconSize,
                        iconAllowOverlap: true
                    }}
                />
            </ShapeSource>
        </>
    );
};
