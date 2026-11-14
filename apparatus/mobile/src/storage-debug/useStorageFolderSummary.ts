import { useEffect, useState } from "react";
import { StorageFolderSummary } from "./model";
import { readStorageDebugFolder } from "./storage-files";
import { isStorageImageFile } from "./image-files";

export const useStorageFolderSummary = (
    path: string,
    refreshVersion = 0,
): StorageFolderSummary => {
    const [summary, setSummary] = useState<StorageFolderSummary>({
        status: "loading",
    });

    useEffect(() => {
        let isCurrent = true;
        setSummary({ status: "loading" });
        const scan = async (): Promise<StorageFolderSummary> => {
            const summary: Extract<StorageFolderSummary, { status: "ready" }> =
                {
                    status: "ready",
                    files: 0,
                    folders: 0,
                    totalBytes: 0,
                    imageFiles: 0,
                    imageBytes: 0,
                    asyncStorageFiles: 0,
                    asyncStorageBytes: 0,
                };
            const directories = [path];
            while (directories.length > 0 && isCurrent) {
                const directory = directories.pop();
                if (directory === undefined) {
                    break;
                }
                const listing = await readStorageDebugFolder(path, directory);
                if (!listing.exists) {
                    if (directory === path) {
                        return { status: "missing" };
                    }
                    throw new Error(
                        "Folder changed during storage scan. Refresh to try again.",
                    );
                }
                for (const entry of listing.entries) {
                    if (entry.isDirectory) {
                        summary.folders++;
                        directories.push(entry.path);
                    } else {
                        summary.files++;
                        summary.totalBytes += entry.size;
                        if (entry.path.includes("/databases/async-storage/")) {
                            summary.asyncStorageFiles++;
                            summary.asyncStorageBytes += entry.size;
                        } else if (isStorageImageFile(entry.name)) {
                            summary.imageFiles++;
                            summary.imageBytes += entry.size;
                        }
                    }
                }
            }
            return summary;
        };
        void scan()
            .then((summary) => {
                if (isCurrent) {
                    setSummary(summary);
                }
            })
            .catch(() => {
                if (isCurrent) {
                    setSummary({ status: "unavailable" });
                }
            });
        return () => {
            isCurrent = false;
        };
    }, [path, refreshVersion]);

    return summary;
};
