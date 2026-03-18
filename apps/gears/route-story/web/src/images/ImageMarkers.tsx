import { FC } from "react";
import { MarkerImage, OverlayComponentProps } from "@apparatus";
import { ImageMarker } from "./ImageMarker";
import { GeoJson } from "@tinker-chest";
import { WebMarkerImageData } from "./image-parser";

interface Props {
    geojson: GeoJson;
    images: MarkerImage<WebMarkerImageData>[];
    onUpdateImageFeatureId: (imageId: number, featureId: number) => void;
}

export const ImageMarkers: FC<OverlayComponentProps<maplibregl.Map> & Props> = ({
    map,
    geojson,
    images,
    onUpdateImageFeatureId
}) => {
    return images
        .filter((image) => !!image.data?.data && !!image.data.marker && !!image.data.markerElement)
        .map((image) => (
            <ImageMarker
                key={image.id}
                map={map}
                imageId={image.id}
                data={image.data?.data!}
                marker={image.data?.marker!}
                markerElement={image.data?.markerElement!}
                geojson={geojson}
                onUpdateImageFeatureId={onUpdateImageFeatureId}
            />
        ));
};
