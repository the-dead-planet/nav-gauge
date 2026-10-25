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
import { Panel } from "@the-dead-planet/nav-gauge-ui-mobile/src/hud/panel";
import { BevelPanel } from "@the-dead-planet/nav-gauge-ui-mobile/src/hud/bevel-panel";
import { NotchedPanel } from "@the-dead-planet/nav-gauge-ui-mobile/src/hud/notched-panel";
import { Hexagon } from "@the-dead-planet/nav-gauge-ui-mobile/src/hud/hexagon";

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
    { name: "BevelPanel", Component: BevelPanel },
    { name: "NotchedPanel", Component: NotchedPanel },
    { name: "Hexagon", Component: Hexagon },
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
