import { ComponentType } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import {
    AppearancePropsBase,
    FillVariant,
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Panel } from "../../src/hud/panel";
import { HexagonalPanel } from "../../src/hud/hexagonal-panel";
import { OctagonalPanel } from "../../src/hud/octagonal-panel";
import { Octagon } from "../../src/hud/octagon";
import { NotchedPanel } from "../../src/hud/notched-panel";
import { Hexagon } from "../../src/hud/hexagon";

const surfaces: {
    name: string;
    Component: ComponentType<
        AppearancePropsBase<FillVariant> & {
            interactive: boolean;
            children: string;
            onPress: () => void;
        }
    >;
}[] = [
    { name: "Panel", Component: Panel },
    { name: "HexagonalPanel", Component: HexagonalPanel },
    { name: "NotchedPanel", Component: NotchedPanel },
    { name: "Hexagon", Component: Hexagon },
    { name: "Octagon", Component: Octagon },
];

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

describe("HUD appearance ownership", () => {
    it("keeps OctagonalPanel presentational while honoring highlighted, disabled and theme mode", async () => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].light,
            media,
            false,
        );
        const content = (disabled = false) => (
            <ThemeContext.Provider value={theme.forMode("dark")}>
                <OctagonalPanel
                    color="glitch"
                    highlightColor="intel"
                    highlighted
                    disabled={disabled}
                >
                    Preview
                </OctagonalPanel>
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        expect(screen.queryAllByRole("button")).toHaveLength(0);
        expect(screen.getByText("Preview")).toHaveStyle({
            color: theme
                .forMode("dark")
                .resolveAppearance(
                    "ghost",
                    "glitch",
                    "intel",
                    "active-pressed",
                ).glyphs,
        });
        await screen.rerender(content(true));
        expect(screen.getByText("Preview")).toHaveStyle({
            color: theme
                .forMode("dark")
                .resolveAppearance(
                    "ghost",
                    "glitch",
                    "intel",
                    "disabled",
                ).glyphs,
        });
        await screen.unmount();
        theme.destroy();
    });
    test.each(surfaces)(
        "$name keeps disabled above highlighted, pressed and focus",
        async ({ Component }) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].dark,
                media,
            );
            const onPress = jest.fn();
            const content = (highlighted = false, disabled = false) => (
                <ThemeContext.Provider value={theme}>
                    <Component
                        variant="fill-inverse"
                        color="glitch"
                        highlightColor="secured"
                        interactive
                        highlighted={highlighted}
                        disabled={disabled}
                        onPress={onPress}
                    >
                        Telemetry
                    </Component>
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            const button = screen.getByRole("button");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.resolveAppearance(
                    "fill-inverse",
                    "glitch",
                    "secured",
                ).glyphs,
            });
            await fireEvent(button, "focus");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.resolveAppearance(
                    "fill-inverse",
                    "glitch",
                    "secured",
                    "hover-focus",
                ).glyphs,
            });
            await fireEvent(button, "pressIn");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.resolveAppearance(
                    "fill-inverse",
                    "glitch",
                    "secured",
                    "active-pressed",
                ).glyphs,
            });
            await screen.rerender(content(true));
            await fireEvent(button, "pressOut");
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.resolveAppearance(
                    "fill-inverse",
                    "glitch",
                    "secured",
                    "active-pressed",
                ).glyphs,
            });
            await screen.rerender(content(true, true));
            expect(screen.getByText("Telemetry")).toHaveStyle({
                color: theme.resolveAppearance(
                    "fill-inverse",
                    "glitch",
                    "secured",
                    "disabled",
                ).glyphs,
            });
            await fireEvent.press(screen.getByRole("button"));
            expect(onPress).not.toHaveBeenCalled();
            await screen.unmount();
            theme.destroy();
        },
    );
});
