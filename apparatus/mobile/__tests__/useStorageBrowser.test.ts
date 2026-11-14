import { act, renderHook } from "@testing-library/react-native";
import {
    getStorageDebugFolders,
    readStorageDebugFolder,
} from "../src/storage-debug/storage-files";
import { StorageFolder, StorageListing } from "../src/storage-debug/model";
import { useStorageBrowser } from "../src/storage-debug/useStorageBrowser";

jest.mock("../src/storage-debug/storage-files", () => ({
    getStorageDebugFolders: jest.fn(),
    readStorageDebugFolder: jest.fn(),
}));

const root: StorageFolder = { label: "Internal", path: "/app" };
const empty: StorageListing = { exists: true, entries: [] };

beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(getStorageDebugFolders).mockReturnValue([root]);
    jest.mocked(readStorageDebugFolder).mockResolvedValue(empty);
});

test("opens folders, refreshes, and goes up without leaving its root", async () => {
    const { result, unmount } = await renderHook(useStorageBrowser);
    expect(readStorageDebugFolder).not.toHaveBeenCalled();
    await act(() => result.current.openFolder(root, "/app/cache"));
    expect(readStorageDebugFolder).toHaveBeenLastCalledWith(
        "/app",
        "/app/cache",
    );
    expect(result.current.listing).toEqual(empty);
    await act(() => result.current.refresh());
    expect(readStorageDebugFolder).toHaveBeenCalledTimes(2);
    await act(() => result.current.goUp());
    expect(result.current.location?.path).toBe("/app");
    await act(() => result.current.goUp());
    expect(result.current.location).toBeNull();
    expect(result.current.listing).toBeNull();
    await unmount();
});

test("ignores late folder results after navigation", async () => {
    let finishRead: (listing: StorageListing) => void = () => {};
    jest.mocked(readStorageDebugFolder).mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                finishRead = resolve;
            }),
    );
    const { result, unmount } = await renderHook(useStorageBrowser);
    await act(() => result.current.openFolder(root));
    expect(result.current.loading).toBe(true);
    await act(() => result.current.goUp());
    await act(() => finishRead(empty));
    expect(result.current.location).toBeNull();
    expect(result.current.listing).toBeNull();
    expect(result.current.loading).toBe(false);
    await unmount();
});

test("shows filesystem errors and can recover on refresh", async () => {
    jest.mocked(readStorageDebugFolder).mockRejectedValueOnce(
        new Error("Permission denied"),
    );
    const { result, unmount } = await renderHook(useStorageBrowser);
    await act(() => result.current.openFolder(root));
    expect(result.current.error).toBe("Permission denied");
    expect(result.current.loading).toBe(false);
    await act(() => result.current.refresh());
    expect(result.current.error).toBeNull();
    expect(result.current.listing).toEqual(empty);
    await unmount();
});
