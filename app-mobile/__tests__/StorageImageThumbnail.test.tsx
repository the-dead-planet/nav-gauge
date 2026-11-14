import { fireEvent, render } from "@testing-library/react-native";
import { StorageImageThumbnail } from "../src/machine/debug/files/StorageImageThumbnail";

jest.mock("@mobile-ui", () => {
    const { Text } =
        jest.requireActual<typeof import("react-native")>("react-native");
    return { Text };
});

test("displays an existing file with native downsampling rather than generating a copy", async () => {
    const screen = await render(
        <StorageImageThumbnail path="/cache/photo.jpg" name="photo.jpg" />,
    );
    const image = screen.getByLabelText("Thumbnail of photo.jpg");
    expect(image.props.source).toEqual({ uri: "file:///cache/photo.jpg" });
    expect(image.props.resizeMethod).toBe("resize");
    expect(image.props.resizeMode).toBe("contain");
    await screen.unmount();
});

test("shows an unavailable placeholder if cleanup removes an image", async () => {
    const screen = await render(
        <StorageImageThumbnail path="/cache/photo.jpg" name="photo.jpg" />,
    );
    await fireEvent(screen.getByLabelText("Thumbnail of photo.jpg"), "error", {
        nativeEvent: { error: "Missing file" },
    });
    expect(screen.getByText("Image unavailable")).toBeTruthy();
    expect(screen.queryByLabelText("Thumbnail of photo.jpg")).toBeNull();
    await screen.unmount();
});
