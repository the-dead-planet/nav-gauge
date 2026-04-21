export const THUMBNAIL_IMAGE_SIZE = 50;
export const FULL_SIZE_IMAGE_SIZE = 800;

export const MAP_THUMBNAIL_SIZE = 3 * THUMBNAIL_IMAGE_SIZE;

export const getImageIconSize = (
    imageSize: number,
    desiredSize: number,
): number => {
    return 1 / (imageSize / desiredSize);
};
