import { useEffect } from "react";
import { useStateWarden, useSubjectState } from "@apparatus";
import { imageLayerIds, ImagesLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { WebMarkerImageData } from "./image-parser";

export const useImageInDisplay = (
    map: maplibregl.Map,
    playerOperator: PlayerOperator<maplibregl.Map, File, WebMarkerImageData>,
) => {
    const { animatrix } = useStateWarden();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const isInDisplay = displayImageId !== null;

    useEffect(() => {
        map.getLayer(imageLayerIds.imageInDisplay)?.setFilter(ImagesLayers.imageInDisplay.getFilter(displayImageId));
    }, [displayImageId]);

    useEffect(() => {
        const updateIconSize = (value: number) => {
            if (map.getLayer(imageLayerIds.imageInDisplay)) {
                map.setLayoutProperty(imageLayerIds.imageInDisplay, 'icon-size', value);
            }
        }

        if (isInDisplay) {
            const canvas = map.getCanvas();
            playerOperator.animateDisplayImage({
                width: canvas.width,
                height: canvas.height,
                devicePixelRatio: window.devicePixelRatio
            }, updateIconSize)
        }

        return () => {
            playerOperator.cleanupAnimateDisplayImage(updateIconSize);
        };
    }, [isInDisplay]);

    return null;
};
