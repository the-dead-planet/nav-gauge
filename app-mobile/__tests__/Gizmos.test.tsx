import { fireEvent, render } from "@testing-library/react-native";
import { test } from "@jest/globals";
import {
    buttonCorners,
    ButtonCorners,
    fillVariantOptions,
    Orientation,
    Theme,
    ThemeAppearanceState,
    ThemeContext,
    ThemeMode,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Button } from "@the-dead-planet/nav-gauge-ui-mobile/src/gizmos/button";
import { Chip } from "@the-dead-planet/nav-gauge-ui-mobile/src/gizmos/chip";
import { ResizeHandle } from "@the-dead-planet/nav-gauge-ui-mobile/src/gizmos/resize-handle";
import { ResizeHandleGrip } from "@the-dead-planet/nav-gauge-ui-mobile/src/gizmos/resize-handle/ResizeHandleGrip";

jest.mock(
    "@the-dead-planet/nav-gauge-ui-mobile/src/gizmos/resize-handle/ResizeHandleGrip",
    () => ({
        ResizeHandleGrip: jest.fn(() => null),
    }),
);

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};
const modes: ThemeMode[] = ["light", "dark"];
const cases: { corners: ButtonCorners; mode: ThemeMode }[] = modes.flatMap(
    (mode) => buttonCorners.map((corners) => ({ mode, corners })),
);

describe("Gizmo interaction ownership", () => {
    test.each(fillVariantOptions)(
        '%s button and chip labels do not add automatic shadows',
        async (variant) => {
            const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
            const content = (disabled = false) => (
                <ThemeContext.Provider value={theme}>
                    <Button variant={variant} color="primary" disabled={disabled}>
                        Button label
                    </Button>
                    <Chip variant={variant} color="primary">
                        Chip label
                    </Chip>
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            for (const label of ['Button label', 'Chip label']) {
                expect(screen.getByText(label)).not.toHaveStyle({
                    textShadowColor: theme.color('primary', 800),
                });
            }
            await screen.rerender(content(true));
            expect(screen.getByText('Button label')).not.toHaveStyle({
                textShadowColor: theme.color('primary', 800),
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
        "$corners in $mode respects theme overrides, focus, press, highlight and disabled",
        async ({ corners, mode }) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
            );
            const onPress = jest.fn();
            const resolvedMode = mode === 'light' ? 'dark' : 'light';
            const content = (
                highlighted = false,
                disabled = false,
                overrideGlyphs = true,
                overrideTheme = true,
            ) => (
                <ThemeContext.Provider value={theme}>
                    <Button
                        themeMode={overrideTheme ? resolvedMode : undefined}
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
                color: theme.color("intel", resolvedMode === "light" ? 700 : 200),
            });
            await fireEvent(screen.getByRole("button"), "blur");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("intel", resolvedMode === "light" ? 700 : 200),
            });
            await screen.rerender(content(true, true));
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("glitch", resolvedMode === "light" ? 300 : 700),
            });
            await fireEvent.press(screen.getByRole("button"));
            expect(onPress).not.toHaveBeenCalled();
            await screen.rerender(content(true, false, false, false));
            expect(screen.getByText('Telemetry')).toHaveStyle({
                color: theme.color('intel', mode === 'light' ? 700 : 200),
            });
            await screen.unmount();
            theme.destroy();
        },
    );
});
