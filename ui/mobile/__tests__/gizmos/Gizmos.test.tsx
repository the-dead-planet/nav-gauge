import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import {
    buttonCorners,
    CornerVariant,
    fillVariantOptions,
    Orientation,
    RESIZE_HANDLE_TOUCH_SIZE,
    Theme,
    ThemeAppearanceState,
    ThemeContext,
    ThemeMode,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Button } from "../../src/gizmos/button";
import { Chip } from "../../src/gizmos/chip";
import { ResizeHandle } from "../../src/gizmos/resize-handle";
import { ResizeHandleGrip } from "../../src/gizmos/resize-handle/ResizeHandleGrip";

jest.mock("../../src/gizmos/resize-handle/ResizeHandleGrip", () => ({
    ResizeHandleGrip: jest.fn(() => null),
}));

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};
const modes: ThemeMode[] = ["light", "dark"];
const cases: { corners: CornerVariant; mode: ThemeMode }[] = modes.flatMap(
    (mode) => buttonCorners.map((corners) => ({ mode, corners })),
);

describe("Gizmo interaction ownership", () => {
    test.each(["horizontal", "vertical"] as const)(
        "%s resize handle reserves the configured touch target around each grip",
        async (direction) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
            );
            const screen = await render(
                <ThemeContext.Provider value={theme}>
                    <ResizeHandle
                        direction={direction}
                        onDrag={jest.fn()}
                        tooltip="Resize panel"
                    />
                </ThemeContext.Provider>,
            );
            expect(screen.getByRole("adjustable")).toHaveStyle(
                direction === "horizontal"
                    ? { width: RESIZE_HANDLE_TOUCH_SIZE }
                    : { height: RESIZE_HANDLE_TOUCH_SIZE },
            );
            const targets = screen.container.queryAll((element) => {
                const style = StyleSheet.flatten(element.props.style);
                return (
                    style?.width === RESIZE_HANDLE_TOUCH_SIZE &&
                    style?.height === RESIZE_HANDLE_TOUCH_SIZE
                );
            });
            expect(targets).toHaveLength(1);
            expect(targets[0].props.collapsable).toBe(false);
            await screen.unmount();
            theme.destroy();
        },
    );

    test.each(fillVariantOptions)(
        "%s button and chip labels do not add automatic shadows",
        async (variant) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
            );
            const content = (disabled = false) => (
                <ThemeContext.Provider value={theme}>
                    <Button
                        variant={variant}
                        color="primary"
                        disabled={disabled}
                    >
                        Button label
                    </Button>
                    <Chip variant={variant} color="primary">
                        Chip label
                    </Chip>
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            for (const label of ["Button label", "Chip label"]) {
                expect(screen.getByText(label)).not.toHaveStyle({
                    textShadowColor: theme.color("primary", 800),
                });
            }
            await screen.rerender(content(true));
            expect(screen.getByText("Button label")).not.toHaveStyle({
                textShadowColor: theme.color("primary", 800),
            });
            await screen.unmount();
            theme.destroy();
        },
    );

    test.each(fillVariantOptions)(
        "resize grip %s follows the handle state without owning interaction",
        async (variant) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].dark,
                media,
            );
            const onDrag = jest.fn();
            const content = (disabled = false) => (
                <ThemeContext.Provider value={theme}>
                    <ResizeHandle
                        direction="horizontal"
                        color="neutral"
                        highlightColor="secondary"
                        variant={variant}
                        tooltip="Resize panel"
                        onDrag={onDrag}
                        disabled={disabled}
                    />
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            const expectGrip = (state: ThemeAppearanceState) => {
                const appearance = theme.resolveAppearance(
                    variant,
                    "neutral",
                    "secondary",
                    state,
                );
                expect(
                    jest.mocked(ResizeHandleGrip).mock.lastCall?.[0].appearance,
                ).toEqual(appearance);
            };
            expectGrip("default");
            expect(screen.queryAllByRole("button")).toHaveLength(0);
            await fireEvent(screen.getByRole("adjustable"), "focus");
            expectGrip("hover-focus");
            await screen.rerender(content(true));
            expectGrip("disabled");
            await fireEvent(
                screen.getByRole("adjustable"),
                "accessibilityAction",
                { nativeEvent: { actionName: "increment" } },
            );
            expect(onDrag).not.toHaveBeenCalled();
            await screen.unmount();
            theme.destroy();
        },
    );

    test.each(cases)(
        "$corners in $mode respects the provider, focus, press, highlight and disabled",
        async ({ corners, mode }) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
            );
            const onPress = jest.fn();
            const resolvedMode = mode === "light" ? "dark" : "light";
            const content = (
                highlighted = false,
                disabled = false,
                overrideGlyphs = true,
                overrideTheme = true,
            ) => (
                <ThemeContext.Provider
                    value={overrideTheme ? theme.forMode(resolvedMode) : theme}
                >
                    <Button
                        corners={corners}
                        color="glitch"
                        highlightColor="intel"
                        variant="outline"
                        glyphsShade={500}
                        highlightGlyphsShade={overrideGlyphs ? 100 : undefined}
                        highlighted={highlighted}
                        disabled={disabled}
                        onPress={onPress}
                    >
                        Telemetry
                    </Button>
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            expect(screen.getAllByRole("button")).toHaveLength(1);
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("glitch", 500),
            });
            await fireEvent(screen.getByRole("button"), "focus");
            expect(screen.getByRole("button")).toHaveStyle({ outlineWidth: 2 });
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("intel", 100),
            });
            await fireEvent(screen.getByRole("button"), "pressIn");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("intel", 100),
            });
            await screen.rerender(content(true, false, false));
            await fireEvent(screen.getByRole("button"), "pressOut");
            await fireEvent(screen.getByRole("button"), "focus");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color(
                    "intel",
                    resolvedMode === "light" ? 700 : 200,
                ),
            });
            await fireEvent(screen.getByRole("button"), "blur");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color(
                    "intel",
                    resolvedMode === "light" ? 700 : 200,
                ),
            });
            await screen.rerender(content(true, true));
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color(
                    "glitch",
                    resolvedMode === "light" ? 300 : 700,
                ),
            });
            await fireEvent.press(screen.getByRole("button"));
            expect(onPress).not.toHaveBeenCalled();
            await screen.rerender(content(true, false, false, false));
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("intel", mode === "light" ? 700 : 200),
            });
            await screen.unmount();
            theme.destroy();
        },
    );
});
