import { act, render } from "@testing-library/react-native";
import { View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { Machine } from "../src/machine/Machine";
import { LayoutMenu } from "../src/layout/top-bar/menu/LayoutMenu";

let mockIsDev = true;
const mockSettings = new BehaviorSubject({ debugMode: false });

jest.mock("@mobile-apparatus", () => ({
    useMobileMachineWard: () => ({
        isDev: mockIsDev,
        individuator: {
            settings$: mockSettings,
            translationKey: {},
        },
        translationKey: {},
    }),
    T: () => null,
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
jest.mock("../src/machine/files/FilesScreen", () => ({
    FilesScreen: () => null,
}));
jest.mock("../src/layout/top-bar/menu/settings/SettingsDialog", () => ({
    SettingsDialog: () => null,
}));

test.each([
    [false, false, false],
    [false, true, false],
    [true, false, false],
    [true, true, true],
])(
    "Files menu and route require dev=%s and debug=%s",
    async (isDev, debugMode, visible) => {
        mockIsDev = isDev;
        mockSettings.next({ debugMode });
        const screen = await render(
            <View>
                <Machine onNavigate={jest.fn()} onNavigateBack={jest.fn()} />
                <LayoutMenu onNavigate={jest.fn()} />
            </View>,
        );
        expect(!!screen.queryByText("Files")).toBe(visible);
        expect(!!screen.queryByTestId("screen-Files")).toBe(visible);
        if (visible) {
            await act(() => mockSettings.next({ debugMode: false }));
            expect(screen.queryByText("Files")).toBeNull();
            expect(screen.queryByTestId("screen-Files")).toBeNull();
        }
        await screen.unmount();
    },
);
