import { LoadedImageData, MarkerImage } from "@apparatus";
import { useMemo } from "react";
import { MobileMarkerImageData } from "./image-parser";

export type LoadedMobileImageData = Omit<LoadedImageData<MobileMarkerImageData>, "data"> & {
    data: {
        fullSize: string;
        thumbnail: string;
        uri: string;
    }
}
/**
 * @returns Filtered images with valid data and assignment to a feature id.
 */
export const useLoadedMobileImages = (images: MarkerImage<MobileMarkerImageData>[]) => {
    const loadedImages: LoadedMobileImageData[] = useMemo(() => images.filter(({ progress, error, ...image }) =>
        progress === 100 && !!image.data?.thumbnail && !!image.data.fullSize && image.featureId !== undefined
    ) as LoadedMobileImageData[], [images]);

    return loadedImages;
};
