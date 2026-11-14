import { StorageFolderSummary } from "../src/storage-debug/model";
import { getStorageUsageTotals } from "../src/storage-debug/storage-usage";

const app: StorageFolderSummary = {
    status: "ready",
    files: 5,
    folders: 3,
    totalBytes: 9216,
    imageFiles: 2,
    imageBytes: 2048,
    asyncStorageFiles: 2,
    asyncStorageBytes: 5120,
};
const downloads: StorageFolderSummary = {
    status: "ready",
    files: 2,
    folders: 0,
    totalBytes: 4096,
    imageFiles: 2,
    imageBytes: 4096,
    asyncStorageFiles: 0,
    asyncStorageBytes: 0,
};

test("deduplicates nested shortcuts and puts downloads in one category even when they contain images", () => {
    const totals = getStorageUsageTotals(
        [
            { label: "Internal", path: "/app" },
            { label: "Image shortcut", path: "/app/images" },
            { label: "Downloads", path: "/downloads", isDownload: true },
        ],
        {
            "/app": app,
            "/app/images": downloads,
            "/downloads": downloads,
        },
    );
    expect(totals).toEqual({
        total: { files: 7, bytes: 13312 },
        downloads: { files: 2, bytes: 4096 },
        asyncStorage: { files: 2, bytes: 5120 },
        images: { files: 2, bytes: 2048 },
        remaining: { files: 1, bytes: 2048 },
        counting: false,
        unavailable: false,
    });
});

test("reports pending and unreadable locations rather than claiming a complete total", () => {
    const folders = [
        { label: "Internal", path: "/app" },
        { label: "Other", path: "/app-other" },
    ];
    expect(getStorageUsageTotals(folders, { "/app": app }).counting).toBe(true);
    const totals = getStorageUsageTotals(folders, {
        "/app": app,
        "/app-other": { status: "unavailable" },
    });
    expect(totals.unavailable).toBe(true);
    expect(totals.total).toEqual({ files: 5, bytes: 9216 });
});
