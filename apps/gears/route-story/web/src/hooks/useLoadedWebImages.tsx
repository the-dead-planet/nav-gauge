import { useMemo } from "react";
import { LoadedImageData, WebMarkerImage } from "../images/image-parser";

/**
 * @returns Filtered images with valid data and assignment to a feature id.
 */
export const useLoadedWebImages = (images: WebMarkerImage[]) => {
    const loadedImages: LoadedImageData[] = useMemo(() => images.filter(({ progress, error, ...image }) =>
        progress === 100 && image.bitmap && image.data && image.featureId !== undefined
    ) as LoadedImageData[], [images]);

    return loadedImages;
};
