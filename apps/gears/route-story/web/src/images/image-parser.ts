import maplibregl from "maplibre-gl";
import EXIF from 'exif-js';
import { ExifData, MarkerImage } from '@apparatus';
import { IMAGE_SIZE } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { getExifError, getExifLngLat, LngLat } from "@tinker-chest";

export interface WebMarkerImage extends MarkerImage {
    marker?: maplibregl.Marker;
    bitmap?: ImageBitmap;
    markerElement?: HTMLDivElement;
}

export interface LoadedImageData extends Omit<WebMarkerImage, 'progress' | 'error' | 'featureId' | 'data' | 'lngLat'> {
    lngLat: LngLat;
    featureId: number;
    data: string;
    bitmap: ImageBitmap;
}

export const parseImage = async (
    file: File,
    e: ProgressEvent<FileReader>
): Promise<{
    data?: string;
    bitmap?: ImageBitmap;
    exif?: ExifData;
    error?: string;
    lngLat?: LngLat;
}> => {
    const buffer = await file.arrayBuffer();
    const exif = EXIF.readFromBinaryFile(buffer) as false | ExifData;

    let bitmap: ImageBitmap | undefined;
    try {
        bitmap = await resizeImage(e.target?.result, {
            targetSize: IMAGE_SIZE,
            keepAspectRatio: false,
            shape: 'circle'
        });
    } catch (err) {
        console.error('Error resizing image', err);
    }

    // TODO: Derive timezone
    return {
        data: e.target?.result?.toString(),
        bitmap,
        lngLat: getExifLngLat(exif || undefined),
        error: getExifError(exif),
    };
};

/**
 * @param e File progress event
 * @param size Defaults to 200px
 * @returns Resized image
 */
const resizeImage = (
    result?: FileReader['result'],
    options: {
        targetSize?: number;
        shape?: 'circle' | 'square',
        keepAspectRatio?: boolean,
    } = {}
): Promise<ImageBitmap> => {
    const {
        targetSize = 200,
        shape = 'square',
        keepAspectRatio = false
    } = options;

    return new Promise((resolve, reject) => {
        if (!result) {
            reject();
            return;
        }

        let img = new Image();

        img.onload = () => {
            const sourceSize = Math.min(img.width, img.height);
            const sourceX = (img.width - sourceSize) / 2;
            const sourceY = (img.height - sourceSize) / 2;
            let sourceWidth = sourceSize;
            let sourceHeight = sourceSize;
            let targetWidth = targetSize;
            let targetHeight = targetSize;

            if (keepAspectRatio) {
                sourceWidth = img.width;
                sourceHeight = img.height;
                const scale = Math.min(targetSize / img.width, targetSize / img.height, 1);
                targetWidth = img.width * scale;
                targetHeight = img.height * scale;
            }

            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d")!;

            if (shape === 'circle') {
                ctx.beginPath();
                ctx.arc(
                    targetWidth / 2,
                    targetHeight / 2,
                    Math.min(targetWidth, targetHeight) / 2,
                    0,
                    Math.PI * 2
                );
                ctx.closePath();
                ctx.clip();
            }

            ctx.drawImage(
                img,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                targetWidth,
                targetHeight
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject();
                    return;
                }
                createImageBitmap(blob).then(resolve);
            }, "image/png");
        };

        img.src = result.toString();
    });
};
