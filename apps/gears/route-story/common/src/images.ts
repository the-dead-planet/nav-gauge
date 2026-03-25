export const THUMBNAIL_SIZE = 50;
export const IMAGE_THUMBNAIL_SIZE = 3 * THUMBNAIL_SIZE;
export const IMAGE_IN_DISPLAY_SIZE = 800;

export const getImageIconSize = (
    imageSize: number,
    desiredSize: number,
): number => {
    return 1 / (imageSize / desiredSize);
};
