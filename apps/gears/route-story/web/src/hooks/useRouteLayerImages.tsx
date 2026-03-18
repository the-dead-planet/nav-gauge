import { useEffect } from "react";

export interface ImageParams {
    data: string;
    width: number;
    height: number;
}

export interface MapImageDatum {
    iconImageName: string;
    data: ImageBitmap | ImageParams;
    metadata?: Partial<maplibregl.StyleImageMetadata>
}

export interface MapImageData {
    fullSize: MapImageDatum;
    thumbnail: MapImageDatum;
}

/**
 * @param data Array of tuples [full size, thumbnail] 
 */
export const useRouteLayerImages = (
    map: maplibregl.Map,
    data: MapImageData[]
) => {
    useEffect(() => {
        const abortController = new AbortController();
        const imagesData = data.flatMap((el): MapImageDatum[] => Object.values(el));

        for (const { data, iconImageName, metadata } of imagesData) {
            if (abortController.signal.aborted) {
                break;
            }

            if (map.hasImage(iconImageName)) {
                map.removeImage(iconImageName);
            }

            if ('data' in data) {
                const image = new Image(data.width, data.height);

                image.onload = () => {
                    if (abortController.signal.aborted) {
                        return;
                    }
                    if (map.hasImage(iconImageName)) {
                        map.removeImage(iconImageName);
                    }
                    map.addImage(iconImageName, image, metadata);
                }

                image.src = data.data;
            } else {
                const bitmap = data;
                map.addImage(iconImageName, bitmap, metadata);
            }
        }

        return () => {
            abortController.abort();

            for (const { iconImageName } of imagesData) {
                if (map.hasImage(iconImageName)) {
                    map.removeImage(iconImageName);
                }
            }
        };
    }, [map, data]);

    return null;
};
