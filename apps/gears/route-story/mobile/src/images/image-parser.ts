import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { IMAGE_IN_DISPLAY_SIZE, IMAGE_THUMBNAIL_SIZE } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { getResizeDimensions } from '@the-dead-planet/nav-gauge-gears-route-story-common/src/file-parser';

export interface MobileMarkerImageData {
    fullSize?: string;
    thumbnail?: string;
    uri: string;
}

export const filePrefix = 'file://';

export const prependFilePrefix = (filePath: string): string => {
    return `${filePrefix}${filePath}`;
};

export const extractFilePathFromData = (data: string): string => {
    return data.replace(filePrefix, '');
}

const getTempSubfolder = () => `${RNFS.TemporaryDirectoryPath}/images`;

/**
 * Clears old files and recreates an empty folder to store current session files.
 */
export const resetTempSubfolder = async () => {
    const subfolderPath = getTempSubfolder();
    try {
        const exists = await RNFS.exists(subfolderPath);
        if (exists) {
            await RNFS.unlink(subfolderPath);
        }
        await RNFS.mkdir(subfolderPath);
    } catch (err) {
        console.error("Error creating caches subfolder", err);
    }
};

export const removeIfExists = async (path: string): Promise<void> => {
    const exists = await RNFS.exists(path);
    if (exists) {
        await RNFS.unlink(path);
    }
};

/**
 * Creates two cached copies with reduced file size: thumbnail and full size.
 * @returns Destination paths to cached images
 */
export const cacheReducedImage = async (
    file: DocumentPickerResponse,
    onError?: (error: Error) => void,
): Promise<{ fullSize?: string; thumbnail?: string; }> => {
    return Promise.all([
        reduceSize(file.uri, IMAGE_IN_DISPLAY_SIZE),
        reduceSize(file.uri, IMAGE_THUMBNAIL_SIZE),
    ])
        .then(([fullSize, thumbnail]) => ({ fullSize, thumbnail }))
        .catch((err) => {
            onError?.(err);
            return {};
        });
};

/**
 * Target size will be used to set the lower size of height/width (the other will keep ratio).
 * @returns Uri of the resized file
 */
export const reduceSize = async (
    uri: string,
    targetSize: number,
    options: { quality?: number } = {}
): Promise<string> => {
    const img = await determineSize(uri);
    const { targetWidth, targetHeight } = getResizeDimensions(img, targetSize);
    const { quality = 80 } = options;
    const rotation = 0;
    const resizedFile = await ImageResizer.createResizedImage(
        uri,
        targetWidth,
        targetHeight,
        'JPEG',
        quality,
        rotation,
        getTempSubfolder(),
        false,
        { mode: 'cover' }
    );
    
    return resizedFile.uri;
};

export const determineSize = async (uri: string): Promise<{ width: number; height: number; }> => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
    });
};
