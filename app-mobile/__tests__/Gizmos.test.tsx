import { fireEvent, render } from "@testing-library/react-native";
import {
    buttonCorners,
    ButtonCorners,
    Orientation,
    Theme,
    ThemeContext,
    ThemeMode,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Button } from "@the-dead-planet/nav-gauge-ui-mobile/src/gizmos/button";

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
    test.each(cases)(
        "$corners in $mode respects focus, press, persistent highlight, overrides and disabled",
        async ({ corners, mode }) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
            );
            const onPress = jest.fn();
            const content = (
                highlighted = false,
                disabled = false,
                overrideGlyphs = true,
            ) => (
                <ThemeContext.Provider value={theme}>
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
                color: theme.color("intel", mode === "light" ? 700 : 200),
            });
            await fireEvent(screen.getByRole("button"), "blur");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("intel", mode === "light" ? 700 : 200),
            });
            await screen.rerender(content(true, true));
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.color("glitch", mode === "light" ? 300 : 700),
            });
            await fireEvent.press(screen.getByRole("button"));
            expect(onPress).not.toHaveBeenCalled();
            await screen.unmount();
            theme.destroy();
        },
    );
});
