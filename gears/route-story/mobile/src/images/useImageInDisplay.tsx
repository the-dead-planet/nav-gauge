import { useState, useEffect } from "react";
import { useSubjectState } from "@tinker-chest";
import { Animatrix, ImagesLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-apparatus";
import { MobilePlayerOperator } from "../model";

export const useImageInDisplay = (
    map: MobileMap,
    animatrix: Animatrix,
    playerOperator: MobilePlayerOperator,
): number => {
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [imageInDisplayIconSize, setImageInDisplayIconSize] = useState(ImagesLayers.imageInDisplay.layout["icon-size"]);

    useEffect(() => {
        if (displayImageId === null) {
            return;
        }
        playerOperator.animateDisplayImage({ width: map.mapSize$.value.width, height: map.mapSize$.value.height }, setImageInDisplayIconSize);

        return () => {
            playerOperator.cleanupAnimateDisplayImage(setImageInDisplayIconSize);
        };
    }, [displayImageId]);

    return imageInDisplayIconSize;
};
