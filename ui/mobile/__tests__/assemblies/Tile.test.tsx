import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import {
    actionButtonVariants,
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Tile } from "../../src/assemblies/tile/Tile";

test("Tile content follows its Panel's single interaction owner and action policy", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        {
            initial: () => ({
                orientation: Orientation.Landscape,
                windowWidth: 800,
                windowHeight: 600,
            }),
            subscribe: () => ({ unsubscribe: () => undefined }),
        },
        false,
    );
    const actions = jest.fn(() => (
        <>
            <Text>Secondary</Text>
            <Text>Primary</Text>
        </>
    ));
    const content = (highlighted = false, disabled = false) => (
        <ThemeContext.Provider value={theme}>
            <Tile
                name="Navigation"
                description="Map controls"
                actions={actions}
                panelProps={{
                    variant: "fill",
                    color: "glitch",
                    highlightColor: "hazard",
                    highlighted,
                    disabled,
                    accessibilityLabel: "Tile",
                    onPress: () => {},
                }}
            />
        </ThemeContext.Provider>
    );
    try {
        const screen = await render(content());
        const secondaryCell = screen.getByText("Secondary").parent;
        const primaryCell = screen.getByText("Primary").parent;
        const footer = primaryCell?.parent;
        const body = screen.getByText("Navigation").parent?.parent;
        expect(secondaryCell).toHaveStyle({ flex: 1 });
        expect(primaryCell).toHaveStyle({ flex: 1 });
        expect(secondaryCell).not.toBe(primaryCell);
        expect(footer).toHaveStyle({ flexDirection: "row", flexShrink: 0 });
        expect(footer?.parent).toBe(body?.parent);
        const padding = Number.parseInt(Theme.spacing.sm, 10);
        expect(body).toHaveStyle({ padding });
        expect(body?.parent).not.toHaveStyle({ padding });
        const check = (
            state: "default" | "hover-focus" | "active-pressed" | "disabled",
        ) => {
            const appearance = theme.resolveAppearance(
                "fill",
                "glitch",
                "hazard",
                state,
            );
            expect(screen.getByText("Navigation")).toHaveStyle({
                color: appearance.glyphs,
            });
            expect(screen.getByText("Map controls")).toHaveStyle({
                color: appearance.glyphs,
            });
        };
        check("default");
        expect(actions).toHaveBeenLastCalledWith(
            "sm",
            actionButtonVariants.fill,
        );
        await fireEvent(screen.getByLabelText("Tile"), "hoverIn");
        check("hover-focus");
        await screen.rerender(content(true));
        check("active-pressed");
        await screen.rerender(content(true, true));
        check("disabled");
        await screen.unmount();
    } finally {
        theme.destroy();
    }
});
