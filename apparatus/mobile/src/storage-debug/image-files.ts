export const isStorageImageFile = (name: string): boolean =>
    /\.(jpe?g|png|webp|gif|bmp)$/i.test(name);
