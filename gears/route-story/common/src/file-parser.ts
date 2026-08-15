export const getResizeDimensions = (
    img: { width: number; height: number },
    targetSize: number,
    { keepAspectRatio }: { keepAspectRatio?: boolean } = {}
) => {
    const sourceWidth = img.width;
    const sourceHeight = img.height;

    if (keepAspectRatio) {
        const sourceSize = Math.min(img.width, img.height);

        return {
            sourceX: (sourceWidth - sourceSize) / 2,
            sourceY: (sourceHeight - sourceSize) / 2,
            sourceWidth: sourceSize,
            sourceHeight: sourceSize,
            targetWidth: targetSize,
            targetHeight: targetSize,
        }
    }

    const scale = Math.min(
        targetSize / sourceWidth,
        targetSize / sourceHeight, 1
    );

    return {
        sourceX: 0,
        sourceY: 0,
        sourceWidth,
        sourceHeight,
        targetWidth: sourceWidth * scale,
        targetHeight: sourceHeight * scale,
    }
};
