import {
    formatFileSize,
    isImageFile,
} from "../src/machine/debug/files/file-presentation";

test.each([
    [0, "0 B"],
    [1023, "1023 B"],
    [1024, "1 KB"],
    [1536, "1.5 KB"],
    [1024 ** 2, "1 MB"],
    [1024 ** 3, "1 GB"],
])("formats %s bytes as %s", (bytes, expected) => {
    expect(formatFileSize(bytes).replaceAll(",", "")).toBe(expected);
});

test("recognizes image extensions without confusing route or database files", () => {
    expect(isImageFile("photo.JPG")).toBe(true);
    expect(isImageFile("route.gpx")).toBe(false);
    expect(isImageFile("data.db")).toBe(false);
});
