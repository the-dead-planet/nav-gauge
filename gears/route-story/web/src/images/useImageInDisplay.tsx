import type * as maplibregl from "maplibre-gl";
import { useEffect } from "react";
import { useSubjectState } from "@tinker-chest";
import { Animatrix, imageLayerIds, ImagesLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebPlayerOperator } from "../model";

export const useImageInDisplay = (
    map: maplibregl.Map,
    animatrix: Animatrix,
    playerOperator: WebPlayerOperator,
) => {
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
