import { LoadedImageData, MarkerImage } from "@apparatus";
import { useMemo } from "react";
import { MobileMarkerImageData } from "./image-parser";

/**
 * @returns Filtered images with valid data and assignment to a feature id.
 */
export const useLoadedMobileImages = (images: MarkerImage<MobileMarkerImageData>[]) => {
    const loadedImages: LoadedImageData<MobileMarkerImageData>[] = useMemo(() => images.filter(({ progress, error, ...image }) =>
        progress === 100 && !!image.data?.thumbnail && !!image.data.fullSize && image.featureId !== undefined
    ) as LoadedImageData<MobileMarkerImageData>[], [images]);

    return loadedImages;
};
