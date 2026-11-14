export const formatFileSize = (bytes: number): string => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
};

export { isStorageImageFile as isImageFile } from "@the-dead-planet/nav-gauge-apparatus-mobile/src/storage-debug/image-files";
