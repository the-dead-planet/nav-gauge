import { render } from "@testing-library/react-native";
import { View } from "react-native";
import { Machine } from "../src/machine/Machine";
import { LayoutMenu } from "../src/layout/top-bar/menu/LayoutMenu";

let mockIsDev = true;

jest.mock("@mobile-apparatus", () => ({
    useMobileMachineWard: () => ({
        isDev: mockIsDev,
        individuator: {
            translationKey: {},
        },
        translationKey: { Files: "files" },
    }),
    T: ({ t }: { t: string }) => (t === "files" ? "Files" : null),
}));
jest.mock("@apparatus", () => ({
    getMachineMenuLinks: () => ({}),
    useTranslation: () => "Menu",
}));
jest.mock("@mobile-ui", () => {
    const { View, Text } =
        jest.requireActual<typeof import("react-native")>("react-native");
    return { Menu: View, MenuItem: Text, Stories: View };
});
jest.mock("@react-navigation/native", () => {
    const { View } =
        jest.requireActual<typeof import("react-native")>("react-native");
    return { NavigationContainer: View };
});
jest.mock("@react-navigation/native-stack", () => {
    const { View } =
        jest.requireActual<typeof import("react-native")>("react-native");
    return {
        createNativeStackNavigator: () => ({
            Navigator: View,
            Screen: ({ name }: { name: string }) => (
                <View testID={`screen-${name}`} />
            ),
        }),
    };
});
jest.mock("../src/navigation", () => ({ navigationRef: {} }));
jest.mock("../src/machine/MapSection", () => ({ MapSection: () => null }));
jest.mock("../src/machine/NotFoundScreen", () => ({
    NotFoundScreen: () => null,
}));
jest.mock("../src/machine/debug/files/FilesScreen", () => ({
    FilesScreen: () => null,
}));
jest.mock("../src/layout/top-bar/menu/settings/SettingsDialog", () => ({
    SettingsDialog: () => null,
}));

test.each([false, true])(
    "Files menu and route are available only in development (dev=%s)",
    async (isDev) => {
        mockIsDev = isDev;
        const screen = await render(
            <View>
                <Machine onNavigate={jest.fn()} onNavigateBack={jest.fn()} />
                <LayoutMenu onNavigate={jest.fn()} />
            </View>,
        );
        expect(!!screen.queryByText("Files")).toBe(isDev);
        expect(!!screen.queryByTestId("screen-Files")).toBe(isDev);
        await screen.unmount();
    },
);
