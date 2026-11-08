import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { BottomToolPanel } from "../src/machine/tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanel";

jest.mock("@apparatus", () => ({
    assignBottomToolPanelRef: () => () => undefined,
    useBottomToolPanel: () => ({ show: true }),
    PANEL_HEADER_CURVE_SIZES: jest.requireActual(
        "../../apparatus/common/src/machine-ward/machine-layout/tinkers/tool-panel-size",
    ).PANEL_HEADER_CURVE_SIZES,
}));

jest.mock("@mobile-apparatus", () => ({
    useMobileMachineWard: () => ({ toolsStation: {} }),
}));

jest.mock("@ui", () => ({
    useTheme: () => ({
        resolveAppearance: () => ({ surface: "#ffffff" }),
        color: () => "#000000",
    }),
    withColorOpacity: (color: string) => color,
}));

jest.mock("@mobile-ui", () => ({
    resolveElevationStyle: () => ({ filter: [{ brightness: 1 }] }),
}));

jest.mock("../src/machine/tool-panels/useAnimatedSize", () => ({
    useAnimatedSize: (size: number) => size,
}));

jest.mock(
    "../src/machine/tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanelHeader",
    () => {
        const { Text } =
            jest.requireActual<typeof import("react-native")>("react-native");
        return { BottomToolPanelHeader: () => <Text>Panel buttons</Text> };
    },
);

jest.mock(
    "../src/machine/tool-panels/bottom-panels/primary-bottom-panel/curve/Curves",
    () => ({ Curves: () => null }),
);

test("keeps the collapsed header outside the filtered panel background", async () => {
    const screen = await render(
        <BottomToolPanel activeId={null} onActiveIdChange={jest.fn()} />,
    );
    let ancestor = screen.getByText("Panel buttons").parent;
    while (ancestor) {
        expect(
            StyleSheet.flatten(ancestor.props.style)?.filter,
        ).toBeUndefined();
        ancestor = ancestor.parent;
    }
    expect(
        screen.container.queryAll(
            (element) => StyleSheet.flatten(element.props.style)?.filter,
        ),
    ).toHaveLength(1);
    await screen.unmount();
});
