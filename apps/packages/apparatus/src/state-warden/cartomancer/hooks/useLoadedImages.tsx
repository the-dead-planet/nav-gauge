import { useMemo } from "react";
import { LoadedImageData, MarkerImage } from "../model";

export const useLoadedImages = (images: MarkerImage[]) => {
    const loadedImages: LoadedImageData[] = useMemo(() => images.filter(({ progress, error, ...image }) =>
        progress === 100 && image.data && image.featureId !== undefined
    ) as LoadedImageData[], [images]);

    return loadedImages;
};
