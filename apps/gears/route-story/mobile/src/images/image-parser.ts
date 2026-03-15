import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { IMAGE_IN_DISPLAY_SIZE } from '@the-dead-planet/nav-gauge-gears-route-story-common';

export const filePrefix = 'file://';

export const createDataFromFilePath = (filePath: string): string => {
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
 * Creates a cached copy with reduced file size.
 * @returns Destination path
 */
export const cacheReducedImage = async (file: DocumentPickerResponse): Promise<string | null> => {
    const destPath = `${getTempSubfolder()}/${file.name}`;

    try {
        const destPath = `${getTempSubfolder()}/${file.name}`;
        const reducedFileUri = await reduceSize(file.uri, IMAGE_IN_DISPLAY_SIZE);
        await removeIfExists(destPath); // to prevent from iOS throwing
        await RNFS.copyFile(reducedFileUri, destPath);
    } catch (err) {
        console.error('Error while reducing image size', err);
        return null;
    }

    return destPath;
};

/**
 * Target size will be used to set the lower size of height/width (the other will keep ratio).
 * @returns Uri of the resized file
 */
export const reduceSize = async (uri: string, targetSize: number): Promise<string> => {
    const { width, height } = await determineSize(uri);
    const scale = width > height ? width / height : height / width;
    const quality = 80;
    const rotation = 0;
    const resizedFile = await ImageResizer.createResizedImage(
        uri,
        width < height ? targetSize : targetSize / scale,
        height < width ? targetSize : targetSize / scale,
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
