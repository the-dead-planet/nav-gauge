import maplibregl from "maplibre-gl";
import EXIF from 'exif-js';
import { ExifData, glitchmitter } from '@apparatus';
import { FULL_SIZE_IMAGE_SIZE, MAP_THUMBNAIL_SIZE   } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { getExifError, getExifLngLat, LngLat } from "@tinker-chest";
import { getResizeDimensions } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/file-parser";

export interface WebMarkerImageData {
    data?: string;
    marker?: maplibregl.Marker;
    bitmap?: ImageBitmap;
    thumbnailBitmap?: ImageBitmap;
    markerElement?: HTMLDivElement;
}

export const parseImage = async (
    e: ProgressEvent<FileReader>,
    file: File,
    options: { shape?: ResizeImageOptions['shape'] } = {}
): Promise<{
    data?: string;
    bitmap?: ImageBitmap;
    thumbnailBitmap?: ImageBitmap;
    exif?: ExifData;
    error?: string;
    lngLat?: LngLat;
}> => {
    const { shape } = options;
    const buffer = await file.arrayBuffer();
    const exif = EXIF.readFromBinaryFile(buffer) as false | ExifData;

    let bitmap: ImageBitmap | undefined;
    let thumbnailBitmap: ImageBitmap | undefined;
    try {
        // TODO: Only leave full size original ratio and add shape processing in the component - user can select what shapes they want for thumbnails and display
        [bitmap, thumbnailBitmap] = await Promise.all([
            resizeImage(e.target?.result, { targetSize: FULL_SIZE_IMAGE_SIZE }),
            resizeImage(e.target?.result, { targetSize: MAP_THUMBNAIL_SIZE  , shape }),
        ]);
    } catch (err) {
        glitchmitter.transmit('Error resizing image', err);
    }

    // TODO: Derive timezone
    return {
        data: e.target?.result?.toString(),
        bitmap,
        thumbnailBitmap,
        lngLat: getExifLngLat(exif || undefined),
        error: getExifError(exif),
    };
};

export interface ResizeImageOptions {
    targetSize?: number;
    shape?: 'circle' | 'square',
}

/**
 * @param e File progress event
 * @param size Defaults to 200px
 * @returns Resized image
 */
const resizeImage = (
    result?: FileReader['result'],
    options: ResizeImageOptions = {}
): Promise<ImageBitmap> => {
    const { targetSize = 200, shape } = options;
    const keepAspectRatio: boolean = shape === 'square' || shape === 'circle';

    return new Promise((resolve, reject) => {
        if (!result) {
            reject();
            return;
        }

        const img = new Image();

        img.onload = () => {
            const {
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                targetWidth,
                targetHeight,
            } = getResizeDimensions(img, targetSize, { keepAspectRatio });

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
