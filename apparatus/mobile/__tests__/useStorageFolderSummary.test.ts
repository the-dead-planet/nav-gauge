import { act, renderHook } from "@testing-library/react-native";
import { StorageFolderSummary, StorageListing } from "../src/storage-debug/model";
import { readStorageDebugFolder } from "../src/storage-debug/storage-files";
import { useStorageFolderSummary } from "../src/storage-debug/useStorageFolderSummary";

jest.mock("../src/storage-debug/storage-files", () => ({
    readStorageDebugFolder: jest.fn(),
}));

beforeEach(() => jest.resetAllMocks());

test("counts nested files, image bytes, and AsyncStorage databases including companion files", async () => {
    const listings: Record<string, StorageListing> = {
        "/app": {
            exists: true,
            entries: [
                {
                    name: "photo.jpg",
                    path: "/app/photo.jpg",
                    size: 1024,
                    isDirectory: false,
                },
                {
                    name: "route.gpx",
                    path: "/app/route.gpx",
                    size: 2048,
                    isDirectory: false,
                },
                {
                    name: "images",
                    path: "/app/images",
                    size: 4096,
                    isDirectory: true,
                },
                {
                    name: "databases",
                    path: "/app/databases",
                    size: 4096,
                    isDirectory: true,
                },
            ],
        },
        "/app/images": {
            exists: true,
            entries: [
                {
                    name: "nested.jpg",
                    path: "/app/images/nested.jpg",
                    size: 1024,
                    isDirectory: false,
                },
            ],
        },
        "/app/databases": {
            exists: true,
            entries: [
                {
                    name: "async-storage",
                    path: "/app/databases/async-storage",
                    size: 4096,
                    isDirectory: true,
                },
            ],
        },
        "/app/databases/async-storage": {
            exists: true,
            entries: [
                {
                    name: "nav-gauge.sqlite",
                    path: "/app/databases/async-storage/nav-gauge.sqlite",
                    size: 4096,
                    isDirectory: false,
                },
                {
                    name: "nav-gauge.sqlite-wal",
                    path: "/app/databases/async-storage/nav-gauge.sqlite-wal",
                    size: 1024,
                    isDirectory: false,
                },
            ],
        },
    };
    jest.mocked(readStorageDebugFolder).mockImplementation(
        async (_root, path) => listings[path],
    );
    const { result, unmount } = await renderHook(() =>
        useStorageFolderSummary("/app"),
    );
    expect(result.current).toEqual({
        status: "ready",
        files: 5,
        folders: 3,
        totalBytes: 9216,
        imageFiles: 2,
        imageBytes: 2048,
        asyncStorageFiles: 2,
        asyncStorageBytes: 5120,
    });
    expect(readStorageDebugFolder).toHaveBeenCalledTimes(4);
    expect(readStorageDebugFolder).toHaveBeenCalledWith("/app", "/app");
    await unmount();
});

test("distinguishes missing and unreadable folders from empty folders", async () => {
    jest.mocked(readStorageDebugFolder)
        .mockResolvedValueOnce({ exists: false, entries: [] })
        .mockRejectedValueOnce(new Error("Permission denied"))
        .mockResolvedValueOnce({ exists: true, entries: [] });
    const { result, rerender, unmount } = await renderHook<StorageFolderSummary, { revision: number }>(
        ({ revision }) => useStorageFolderSummary("/app", revision),
        { initialProps: { revision: 0 } },
    );
    expect(result.current).toEqual({ status: "missing" });
    await rerender({ revision: 1 });
    expect(result.current).toEqual({ status: "unavailable" });
    await rerender({ revision: 2 });
    expect(result.current).toEqual({
        status: "ready",
        files: 0,
        folders: 0,
        totalBytes: 0,
        imageFiles: 0,
        imageBytes: 0,
        asyncStorageFiles: 0,
        asyncStorageBytes: 0,
    });
    await unmount();
});

test("keeps pending counts in loading state and ignores stale results after refresh", async () => {
    let finishOldRead: (listing: StorageListing) => void = () => {};
    jest.mocked(readStorageDebugFolder)
        .mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finishOldRead = resolve;
                }),
        )
        .mockResolvedValueOnce({ exists: true, entries: [] });
    const { result, rerender, unmount } = await renderHook<StorageFolderSummary, { revision: number }>(
        ({ revision }) => useStorageFolderSummary("/app", revision),
        { initialProps: { revision: 0 } },
    );
    expect(result.current).toEqual({ status: "loading" });
    await rerender({ revision: 1 });
    await act(() => finishOldRead({ exists: false, entries: [] }));
    expect(result.current).toEqual({
        status: "ready",
        files: 0,
        folders: 0,
        totalBytes: 0,
        imageFiles: 0,
        imageBytes: 0,
        asyncStorageFiles: 0,
        asyncStorageBytes: 0,
    });
    await unmount();
});
