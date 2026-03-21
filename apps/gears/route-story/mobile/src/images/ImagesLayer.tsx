import { FC, useMemo, useState, useEffect } from "react";
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
    const [iconSize, setIconSize] = useState(ImagesLayers.imageInDisplay.iconSize);

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
            const thumbnail = [getIconImageId(loadedImage, { thumbnail: true }), { uri: loadedImage.data.thumbnail }];
            const fullSize = [getIconImageId(loadedImage), { uri: loadedImage.data.fullSize }];
            if (displayImageId === loadedImage.id) {
                return [fullSize, thumbnail]
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
            <ShapeSource id={imageSourceIds.thumbnails} shape={sourceDataGeojson}>
                <CircleLayer
                    id={imageLayerIds.thumbnailsOutline}
                    style={ImagesLayers.thumbnailsOutline}
                />
                <SymbolLayer
                    id={imageLayerIds.thumbnails}
                    style={ImagesLayers.thumbnails}
                />
                <CircleLayer
                    id={imageLayerIds.thumbnailsHighlightOutline}
                    style={ImagesLayers.thumbnailsHighlightOutline}
                />
                <SymbolLayer
                    id={imageLayerIds.thumbnailsHighlight}
                    style={ImagesLayers.thumbnailsHighlight}
                />
                <SymbolLayer
                    id={imageLayerIds.imageInDisplay}
                    filter={['==', ['get', 'imageId'], displayImageId ?? -1]}
                    style={{
                        ...ImagesLayers.imageInDisplay,
                        iconSize: iconSize,
                    }}
                />
            </ShapeSource>
        </>
    );
};
