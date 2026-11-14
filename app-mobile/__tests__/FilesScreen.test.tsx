import { fireEvent, render } from "@testing-library/react-native";
import { StorageFolder, useStorageBrowser } from "@mobile-apparatus";
import { FilesScreen } from "../src/machine/debug/files/FilesScreen";

const mockRoot: StorageFolder = {
    label: "Image cache",
    path: "/app/cache/images",
};
const mockFolderSummary = {
    status: "ready",
    files: 3,
    folders: 2,
    totalBytes: 4096,
    imageFiles: 1,
    imageBytes: 1024,
    asyncStorageFiles: 1,
    asyncStorageBytes: 1024,
};
const mockBrowser: ReturnType<typeof useStorageBrowser> = {
    folders: [mockRoot],
    location: null,
    listing: { exists: true, entries: [] },
    loading: false,
    error: null,
    refreshVersion: 0,
    openFolder: jest.fn(),
    goUp: jest.fn(),
    refresh: jest.fn(),
};

jest.mock("@mobile-apparatus", () => ({
    useStorageBrowser: () => mockBrowser,
    useStorageFolderSummary: () => mockFolderSummary,
    getStorageUsageTotals: jest.requireActual<
        typeof import("../../apparatus/mobile/src/storage-debug/storage-usage")
    >("../../apparatus/mobile/src/storage-debug/storage-usage")
        .getStorageUsageTotals,
}));
jest.mock("../src/machine/debug/files/useFilesBackNavigation", () => ({
    useFilesBackNavigation: jest.fn(),
}));
jest.mock("@mobile-ui", () => {
    const { View, Text, Pressable, TextInput } =
        jest.requireActual<typeof import("react-native")>("react-native");
    return {
        Text,
        StoryBackground: View,
        StoryHeader: ({ title }: { title: string }) => <Text>{title}</Text>,
        Button: ({
            children,
            ...props
        }: Omit<import("react-native").PressableProps, "children"> & {
            children: import("react").ReactNode;
        }) => (
            <Pressable {...props}>
                <Text>{children}</Text>
            </Pressable>
        ),
        Panel: Pressable,
        TextInput: ({
            label,
            onChange,
            value,
        }: {
            label: string;
            onChange: (value: string) => void;
            value: string;
        }) => (
            <TextInput
                accessibilityLabel={label}
                onChangeText={onChange}
                value={value}
            />
        ),
        Tile: ({
            name,
            children,
            actions,
        }: {
            name: string;
            children: import("react").ReactNode;
            actions: (
                size: string,
                variants: { active: string },
            ) => import("react").ReactNode;
        }) => (
            <View>
                <Text>{name}</Text>
                {children}
                {actions("sm", { active: "fill" })}
            </View>
        ),
    };
});

beforeEach(() => {
    jest.clearAllMocks();
    mockBrowser.location = null;
    mockBrowser.folders = [mockRoot];
    mockBrowser.listing = { exists: true, entries: [] };
});

test("shows the storage breakdown and opens locations", async () => {
    mockBrowser.folders = [
        mockRoot,
        {
            label: "Recordings",
            path: "/downloads/NavGauge",
            isDownload: true,
        },
    ];
    const screen = await render(<FilesScreen />);
    expect(screen.getByText("6 files · 8 KB total")).toBeTruthy();
    for (const label of ['Downloads', 'AsyncStorage', 'Image files', 'Remaining']) {
        expect(screen.getByText(new RegExp(`^• ${label}`))).toBeTruthy();
    }
    await fireEvent.press(screen.getByLabelText("Browse Image cache"));
    expect(mockBrowser.openFolder).toHaveBeenCalledWith(mockRoot);
    await screen.unmount();
});

test("shows image details inline, searches, opens only folders, and refreshes", async () => {
    mockBrowser.location = { root: mockRoot, path: mockRoot.path };
    mockBrowser.listing = {
        exists: true,
        entries: [
            {
                name: "nested",
                path: `${mockRoot.path}/nested`,
                size: 0,
                isDirectory: true,
            },
            {
                name: "photo.jpg",
                path: `${mockRoot.path}/photo.jpg`,
                size: 2048,
                isDirectory: false,
                modified: new Date("2026-11-14T10:00:00Z"),
            },
        ],
    };
    const screen = await render(<FilesScreen />);
    expect(screen.getByLabelText("Thumbnail of photo.jpg")).toBeTruthy();
    expect(
        screen.getByText(`${mockRoot.path}/photo.jpg`).props.selectable,
    ).toBe(true);
    expect(screen.getByText(/^2 KB · Modified /)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Open folder nested"));
    expect(mockBrowser.openFolder).toHaveBeenCalledWith(
        mockRoot,
        `${mockRoot.path}/nested`,
    );
    await fireEvent.changeText(
        screen.getByLabelText("Search this folder"),
        "PHOTO",
    );
    expect(screen.queryByLabelText("Open folder nested")).toBeNull();
    expect(screen.getByText("photo.jpg")).toBeTruthy();
    await fireEvent.press(screen.getByText("Refresh"));
    expect(mockBrowser.refresh).toHaveBeenCalled();
    await screen.unmount();
});
