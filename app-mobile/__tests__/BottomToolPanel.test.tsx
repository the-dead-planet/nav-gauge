import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { BottomToolPanel } from "../src/machine/tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanel";
import { BottomToolPanelHeaderContainer } from "../src/machine/tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanelHeaderContainer";

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
        expect(StyleSheet.flatten(ancestor.props.style)?.filter).toBeUndefined();
        ancestor = ancestor.parent;
    }
    expect(
        screen.container.queryAll(
            (element) => StyleSheet.flatten(element.props.style)?.filter,
        ),
    ).toHaveLength(1);
    await screen.unmount();
});

test.each([
    [false, false, false, 140, 100],
    [true, false, false, 40, undefined],
    [false, true, false, undefined, 110],
    [true, true, false, undefined, 110],
    [false, false, true, 140, undefined],
    [true, true, true, undefined, undefined],
])(
    "matches web spacers (joined=%s, left=%s, right=%s)",
    async (joinHeaderButtons, left, right, leftWidth, rightWidth) => {
        const screen = await render(
            <BottomToolPanelHeaderContainer
                sideActions={null}
                joinHeaderButtons={joinHeaderButtons}
                joined={joinHeaderButtons || left || right}
                bothSidePanels={left && right}
                onlyLeftPanel={left && !right}
                onlyRightPanel={right && !left}
            >
                {null}
            </BottomToolPanelHeaderContainer>,
        );
        const spacers = screen.container.queryAll(
            (element) =>
                StyleSheet.flatten(element.props.style)?.borderBottomWidth === 2,
        );
        expect(StyleSheet.flatten(spacers[0].props.style)).toMatchObject(
            leftWidth === undefined ? { flex: 1 } : { width: leftWidth },
        );
        expect(StyleSheet.flatten(spacers[spacers.length - 1].props.style)).toMatchObject(
            rightWidth === undefined ? { flex: 1 } : { width: rightWidth },
        );
        await screen.unmount();
    },
);
