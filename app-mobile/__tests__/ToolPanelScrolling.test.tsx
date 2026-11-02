import { ReactNode } from "react";
import { test } from "@jest/globals";
import { render, within } from "@testing-library/react-native";
import { SideToolPanel } from "../src/machine/tool-panels/side-panels/SideToolPanel";
import { SecondaryBottomToolPanel } from "../src/machine/tool-panels/bottom-panels/secondary-bottom-panel/SecondaryBottomToolPanel";

jest.mock("@apparatus", () => {
    const { Text } =
        jest.requireActual<typeof import("react-native")>("react-native");
    const toolPanel = {
        placement: "left",
        headerComponent: () => <Text>Tool heading</Text>,
        contentComponent: () => <Text>Tool controls</Text>,
    };

    return {
        assignSideToolPanelRef: () => () => undefined,
        swapSideToolPanelPlacement: () => () => undefined,
        useSideToolPanel: () => ({
            show: true,
            toolPanel,
            currentWidth: 320,
            handleSidePanelActiveIdChange: jest.fn(),
        }),
        useSecondaryBottomToolPanel: () => ({
            show: true,
            toolPanel,
            effectiveHeight: 240,
            handleToolSelect: jest.fn(),
        }),
    };
});

jest.mock("@mobile-apparatus", () => ({
    useMobileMachineWard: () => ({
        toolsStation: {
            bottomSecondaryToolPanelSizeRef: { current: null },
        },
    }),
}));

jest.mock("@ui", () => ({
    useTheme: () => ({
        resolveAppearance: () => ({ surface: "#ffffff" }),
        color: () => "#000000",
    }),
    withColorOpacity: (color: string) => color,
}));

jest.mock("@mobile-ui", () => ({
    Menu: () => null,
    MenuItem: () => null,
    resolveElevationStyle: () => ({}),
}));

jest.mock("../src/machine/tool-panels/useAnimatedSize", () => ({
    useAnimatedSize: (size: number) => size,
}));

jest.mock("../src/machine/tool-panels/panel-header/ToolPanelHeader", () => ({
    ToolPanelHeader: ({ headerControls }: { headerControls?: ReactNode }) => (
        <>{headerControls}</>
    ),
}));

jest.mock(
    "../src/machine/tool-panels/side-panels/SideToolPanelResizeHandle",
    () => ({
        SideToolPanelResizeHandle: () => null,
    }),
);

jest.mock(
    "../src/machine/tool-panels/bottom-panels/secondary-bottom-panel/SecondaryBottomToolPanelResizeHandle",
    () => ({
        BottomSecondaryToolPanelResizeHandle: () => null,
    }),
);

test.each(["left", "right", "bottom"])(
    "keeps the %s panel heading outside its only scroll view",
    async (placement) => {
        const properties = {
            activeId: "controls",
            onActiveIdChange: jest.fn(),
        };
        const screen = await render(
            placement === "bottom" ? (
                <SecondaryBottomToolPanel {...properties} />
            ) : (
                <SideToolPanel
                    {...properties}
                    placement={placement === "left" ? "left" : "right"}
                />
            ),
        );
        const scrollViews = screen.container.queryAll((element) =>
            element.type.endsWith("ScrollView"),
        );
        expect(scrollViews).toHaveLength(1);
        const scrollView = scrollViews[0];

        expect(within(scrollView).getByText("Tool controls")).toBeTruthy();
        expect(within(scrollView).queryByText("Tool heading")).toBeNull();
        expect(screen.getByText("Tool heading")).toBeTruthy();
        await screen.unmount();
    },
);
