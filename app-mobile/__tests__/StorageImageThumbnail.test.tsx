import { fireEvent, render } from "@testing-library/react-native";
import { StorageImageThumbnail } from "../src/machine/debug/files/StorageImageThumbnail";

jest.mock("@mobile-ui", () => {
    const { Text } =
        jest.requireActual<typeof import("react-native")>("react-native");
    return { Text };
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
