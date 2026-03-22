import { FC, useMemo } from "react";
import { CircleLayer, Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import {
    getIconImageId,
    getImageSource,
    RouteToolProps,
    ImagesLayers,
    imageLayerIds,
    imageSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { MobileMarkerImageData } from "./image-parser";
import { useLoadedMobileImages } from "./useLoadedMobileImages";
import { useImageInDisplay } from "./useImageInDisplay";

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

    const sourceDataGeojson = useMemo(
        () => getImageSource(loadedImages, geojson),
        [loadedImages, geojson]
    );

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
