import { Platform } from "react-native";
import RNFS from "react-native-fs";
import {
    getStorageDebugFolders,
    readStorageDebugFolder,
} from "../src/storage-debug/storage-files";

jest.mock("react-native-fs", () => ({
    DocumentDirectoryPath: "/data/user/0/com.app/files",
    TemporaryDirectoryPath: "/data/user/0/com.app/cache",
    ExternalDirectoryPath: "/storage/emulated/0/Android/data/com.app/files",
    ExternalCachesDirectoryPath:
        "/storage/emulated/0/Android/data/com.app/cache",
    DownloadDirectoryPath: "/storage/emulated/0/Download",
    exists: jest.fn(),
    readDir: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

test("covers internal storage, external files/cache and recordings, with an image shortcut", () => {
    const originalPlatform = Platform.OS;
    Platform.OS = "android";
    try {
        expect(getStorageDebugFolders().map(({ path }) => path)).toEqual([
            "/data/user/0/com.app",
            "/data/user/0/com.app/cache/images",
            "/storage/emulated/0/Android/data/com.app/files",
            "/storage/emulated/0/Android/data/com.app/cache",
            "/storage/emulated/0/Download/NavGauge",
        ]);
    } finally {
        Platform.OS = originalPlatform;
    }
});

test("lists folders first, then alphabetic files, retaining size and modification time", async () => {
    const modified = new Date("2026-11-14T10:00:00Z");
    const entry = (name: string, isDirectory = false) => ({
        name,
        path: `/app/cache/${name}`,
        size: 128,
        mtime: modified,
        ctime: undefined,
        isFile: () => !isDirectory,
        isDirectory: () => isDirectory,
    });
    jest.mocked(RNFS.exists).mockResolvedValueOnce(true);
    jest.mocked(RNFS.readDir).mockResolvedValueOnce([
        entry("z.jpg"),
        entry("images", true),
        entry("a.gpx"),
    ]);

    const listing = await readStorageDebugFolder("/app", "/app/cache");

    expect(listing.exists).toBe(true);
    expect(listing.entries.map(({ name }) => name)).toEqual([
        "images",
        "a.gpx",
        "z.jpg",
    ]);
    expect(listing.entries[1]).toEqual({
        name: "a.gpx",
        path: "/app/cache/a.gpx",
        size: 128,
        modified,
        isDirectory: false,
    });
});

test("reports missing folders without creating or reading them", async () => {
    jest.mocked(RNFS.exists).mockResolvedValueOnce(false);
    await expect(readStorageDebugFolder("/app", "/app/cache")).resolves.toEqual(
        { entries: [], exists: false },
    );
    expect(RNFS.readDir).not.toHaveBeenCalled();
});

test.each(["/app-other", "/app/../other", "/app/./cache", "/other"])(
    "rejects paths outside the selected root: %s",
    async (path) => {
        await expect(readStorageDebugFolder("/app", path)).rejects.toThrow(
            "outside",
        );
        expect(RNFS.exists).not.toHaveBeenCalled();
        expect(RNFS.readDir).not.toHaveBeenCalled();
    },
);

test("propagates permission and cleanup races for the browser to display", async () => {
    jest.mocked(RNFS.exists).mockResolvedValueOnce(true);
    jest.mocked(RNFS.readDir).mockRejectedValueOnce(
        new Error("Permission denied"),
    );
    await expect(readStorageDebugFolder("/app", "/app/cache")).rejects.toThrow(
        "Permission denied",
    );
});
