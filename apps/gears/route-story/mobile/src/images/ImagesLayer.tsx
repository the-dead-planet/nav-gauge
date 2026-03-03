import { FC, useMemo, useState, useEffect } from "react";
import { OverlayComponentProps, useLoadedImages, useStateWarden, useSubjectState } from "@apparatus";
import {
    DEFAULT_IMAGE_SIZE,
    getIconImageId,
    getImageIconSize,
    getImageSource,
    IMAGE_PROPERTY,
    IMAGE_SIZE,
    RouteToolProps
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap>> = ({
    map,
    data$,
    images$,
    playerOperator
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedImages(images);
    const { animatrix } = useStateWarden();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const isInDisplay = displayImageId !== null;
    const [iconSize, setIconSize] = useState(.05);

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

    if (loadedImages.length === 0) {
        return null;
    }

    return (
        <>
            <Images
                images={Object.fromEntries(
                    loadedImages.map((image) => [getIconImageId(image), { uri: image.data }])
                )}
            />
            <ShapeSource
                id="markerSource"
                shape={sourceDataGeojson}
            >
                <SymbolLayer
                    id="markerLayer"
                    style={{
                        iconImage: ['get', IMAGE_PROPERTY],
                        iconSize: [
                            'case',
                            ['==', ['get', 'imageId'], displayImageId ?? '-1'],
                            iconSize,
                            getImageIconSize(IMAGE_SIZE, DEFAULT_IMAGE_SIZE)
                        ],
                        iconAllowOverlap: true
                    }}
                />
            </ShapeSource>
        </>
    );
};
