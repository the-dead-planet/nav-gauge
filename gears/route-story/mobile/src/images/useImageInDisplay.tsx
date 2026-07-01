import { useState, useEffect } from "react";
import { useSubjectState } from "@tinker-chest";
import { Animatrix, ImagesLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { MobileMarkerImageData } from "./image-parser";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";

export const useImageInDisplay = (
    map: MobileMap,
    animatrix: Animatrix,
    playerOperator: PlayerOperator<MobileMap, DocumentPickerResponse, MobileMarkerImageData>,
): number => {
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [imageInDisplayIconSize, setImageInDisplayIconSize] = useState(ImagesLayers.imageInDisplay.layout["icon-size"]);

    useEffect(() => {
        if (displayImageId === null) {
            return;
        }
        playerOperator.animateDisplayImage({ width: map.width, height: map.height }, setImageInDisplayIconSize);

        return () => {
            playerOperator.cleanupAnimateDisplayImage(setImageInDisplayIconSize);
        };
    }, [displayImageId]);

    return imageInDisplayIconSize;
};
