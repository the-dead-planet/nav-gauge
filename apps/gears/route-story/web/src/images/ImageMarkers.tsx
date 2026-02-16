import { FC } from "react";
import { OverlayComponentProps } from "@apparatus";
import { ImageMarker, MarkerImageData } from "./ImageMarker";
import { GeoJson } from "@tinker-chest";
import { WebMarkerImage } from "./image-parser";

interface Props {
    geojson: GeoJson;
    images: WebMarkerImage[];
    onUpdateImageFeatureId: (imageId: number, featureId: number) => void;
}

export const ImageMarkers: FC<OverlayComponentProps<maplibregl.Map> & Props> = ({
    map,
    geojson,
    images,
    onUpdateImageFeatureId
}) => {
    const markerImages = images.filter((image) => !!image.marker && 'markerElement' in image && !!image.markerElement) as MarkerImageData[];

    return markerImages.map((image) => (
        <ImageMarker
            key={image.id}
            map={map}
            image={image}
            geojson={geojson}
            onUpdateImageFeatureId={onUpdateImageFeatureId}
        />
    ));
};
