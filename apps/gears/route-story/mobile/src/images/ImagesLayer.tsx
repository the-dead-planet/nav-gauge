import { FC, useMemo } from "react";
import { OverlayComponentProps, useLoadedImages, useSubjectState } from "@apparatus";
import { getIconImageId, getImageSource, IMAGE_PROPERTY, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps> = ({
    map,
    data$,
    images$
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedImages(images);

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
                        iconSize: .05,
                    }}
                />
            </ShapeSource>
        </>
    );
};
