import { FC, useMemo, useState, useEffect } from "react";
import { Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useLoadedImages, useStateWarden, useSubjectState } from "@apparatus";
import {
    IMAGE_MARKER_SIZE,
    getIconImageId,
    getImageIconSize,
    getImageSource,
    IMAGE_PROPERTY,
    IMAGE_IN_DISPLAY_SIZE,
    RouteToolProps
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap, DocumentPickerResponse>> = ({
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
                            getImageIconSize(IMAGE_IN_DISPLAY_SIZE, IMAGE_MARKER_SIZE)
                        ],
                        iconAllowOverlap: true
                    }}
                />
            </ShapeSource>
        </>
    );
};
