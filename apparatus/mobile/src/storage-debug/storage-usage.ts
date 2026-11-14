import { StorageFileTotal, StorageFolder, StorageFolderSummary } from "./model";

export const getStorageUsageTotals = (
    folders: StorageFolder[],
    summaries: Record<string, StorageFolderSummary>,
) => {
    const total: StorageFileTotal = {
        files: 0,
        bytes: 0,
    };
    const downloads: StorageFileTotal = {
        files: 0,
        bytes: 0,
    };
    const asyncStorage: StorageFileTotal = {
        files: 0,
        bytes: 0,
    };
    const images: StorageFileTotal = {
        files: 0,
        bytes: 0,
    };
    let counting = false;
    let unavailable = false;
    const roots = folders.filter(
        (folder) =>
            !folders.some(
                (parent) =>
                    parent.path !== folder.path &&
                    folder.path.startsWith(`${parent.path}/`),
            ),
    );

    for (const folder of roots) {
        const summary = summaries[folder.path];
        if (!summary || summary.status === "loading") {
            counting = true;
        } else if (summary.status === "unavailable") {
            unavailable = true;
        } else if (summary.status === "ready") {
            total.files += summary.files;
            total.bytes += summary.totalBytes;
            if (folder.isDownload) {
                downloads.files += summary.files;
                downloads.bytes += summary.totalBytes;
            } else {
                asyncStorage.files += summary.asyncStorageFiles;
                asyncStorage.bytes += summary.asyncStorageBytes;
                images.files += summary.imageFiles;
                images.bytes += summary.imageBytes;
            }
        }
    }
    const remaining: StorageFileTotal = {
        files:
            total.files - downloads.files - asyncStorage.files - images.files,
        bytes:
            total.bytes - downloads.bytes - asyncStorage.bytes - images.bytes,
    };
    return {
        total,
        downloads,
        asyncStorage,
        images,
        remaining,
        counting,
        unavailable,
    };
};
