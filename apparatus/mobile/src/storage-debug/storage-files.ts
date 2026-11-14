import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { StorageFolder, StorageListing } from "./model";

export const getStorageDebugFolders = (): StorageFolder[] => {
    const internalPath =
        Platform.OS === "android"
            ? RNFS.DocumentDirectoryPath.slice(
                  0,
                  RNFS.DocumentDirectoryPath.lastIndexOf("/"),
              )
            : RNFS.DocumentDirectoryPath;
    const folders: StorageFolder[] = [
        {
            label: "Internal app storage",
            path: internalPath,
        },
        {
            label: "Image cache",
            path: `${RNFS.TemporaryDirectoryPath}/images`,
        },
        {
            label: "External app files",
            path: RNFS.ExternalDirectoryPath,
        },
        {
            label: "External app cache",
            path: RNFS.ExternalCachesDirectoryPath,
        },
        {
            label: "Recordings",
            path: RNFS.DownloadDirectoryPath
                ? `${RNFS.DownloadDirectoryPath}/NavGauge`
                : "",
        },
    ];
    return folders.filter(
        (folder, index) =>
            folder.path &&
            folders.findIndex(({ path }) => path === folder.path) === index,
    );
};

export const readStorageDebugFolder = async (
    root: string,
    path: string,
): Promise<StorageListing> => {
    if (
        (path !== root && !path.startsWith(`${root}/`)) ||
        path.split("/").some((part) => part === ".." || part === ".")
    ) {
        throw new Error("Folder is outside the selected app storage root.");
    }
    if (!(await RNFS.exists(path))) {
        return { entries: [], exists: false };
    }
    const items = await RNFS.readDir(path);
    const entries = items.map((item) => ({
        name: item.name,
        path: item.path,
        size: item.size,
        modified: item.mtime,
        isDirectory: item.isDirectory(),
    }));
    entries.sort(
        (first, second) =>
            Number(second.isDirectory) - Number(first.isDirectory) ||
            first.name.localeCompare(second.name),
    );
    return { entries, exists: true };
};
