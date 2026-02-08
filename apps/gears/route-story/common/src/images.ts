export const IMAGE_SIZE = 800;

export const getImageIconSize = (
    imageSize: number,
    desiredSize: number,
): number => {
    return 1 / (imageSize / desiredSize);
};
