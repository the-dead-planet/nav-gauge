import { LoadedImageData, MarkerImage } from "@apparatus";
import { useMemo } from "react";
import { WebMarkerImageData } from "../images/image-parser";

/**
 * @returns Filtered images with valid data and assignment to a feature id.
 */
export const useLoadedWebImages = (images: MarkerImage<WebMarkerImageData>[]) => {
    const loadedImages: LoadedImageData<WebMarkerImageData>[] = useMemo(() => images.filter(({ progress, error, ...image }) =>
        progress === 100 && image.data?.bitmap && image.data.thumbnailBitmap && image.data.data && image.featureId !== undefined
    ) as LoadedImageData<WebMarkerImageData>[], [images]);

    return loadedImages;
};
