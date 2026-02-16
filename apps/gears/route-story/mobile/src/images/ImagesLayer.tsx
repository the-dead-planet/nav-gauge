import { FC } from "react";
import { OverlayComponentProps, useSubjectState } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps> = ({
    map,
    data$,
    images$
}) => {
    const [images] = useSubjectState(images$);
    const imagesWithData = images.filter((image) => !!image.data && !!image.lngLat);

    if (imagesWithData.length === 0) {
        return null;
    }

    return (
        <>
            <Images
                images={Object.fromEntries(imagesWithData.map((image) => [`image-${image.id}`, {
                    uri: image.data
                }]))}
            />
            <ShapeSource
                id="markerSource"
                shape={{
                    type: 'FeatureCollection',
                    features: imagesWithData.map((image) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [image.lngLat!.lng, image.lngLat!.lat],
                        },
                        properties: {
                            imageName: `image-${image.id}`
                        }
                    }))
                }}
            >
                <SymbolLayer
                    id="markerLayer"
                    style={{
                        iconImage: ['get', 'imageName'],
                        iconSize: .05,
                    }}
                />
            </ShapeSource>
        </>
    );
};
