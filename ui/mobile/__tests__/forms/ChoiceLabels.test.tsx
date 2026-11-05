import { fireEvent, render } from "@testing-library/react-native";
import {
    fillVariantOptions,
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Checkbox } from "../../src/forms/checkbox/Checkbox";
import { Radio } from "../../src/forms/radio/Radio";

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

test("checkbox and radio captions use typography appearance independently of variant, hover, focus, and press", async () => {
    for (const mode of ["light", "dark"] as const) {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default][mode],
            media,
            false,
        );
        try {
            for (const Choice of [Checkbox, Radio]) {
                for (const variant of fillVariantOptions) {
                    const onChange = jest.fn();
                    const content = (highlighted = false, disabled = false) => (
                        <ThemeContext.Provider value={theme}>
                            <Choice
                                variant={variant}
                                color="intel"
                                highlightColor="hazard"
                                glyphsShade={600}
                                highlightGlyphsShade={300}
                                checked
                                onChange={onChange}
                                highlighted={highlighted}
                                disabled={disabled}
                            >
                                Caption
                            </Choice>
                        </ThemeContext.Provider>
                    );
                    const screen = await render(content());
                    const role = Choice === Checkbox ? "checkbox" : "radio";
                    const defaultColor = theme.resolveAppearance(
                        undefined,
                        "intel",
                        "hazard",
                        "default",
                        600,
                        300,
                    ).glyphs;
                    expect(screen.getByText("Caption")).toHaveStyle({
                        color: defaultColor,
                    });
                    for (const event of ["hoverIn", "focus", "pressIn"]) {
                        await fireEvent(screen.getByRole(role), event);
                        expect(screen.getByText("Caption")).toHaveStyle({
                            color: defaultColor,
                        });
                    }
                    await fireEvent.press(screen.getByRole(role));
                    expect(onChange).toHaveBeenCalledTimes(1);
                    await screen.rerender(content(true));
                    expect(screen.getByText("Caption")).toHaveStyle({
                        color: theme.resolveAppearance(
                            undefined,
                            "intel",
                            "hazard",
                            "active-pressed",
                            600,
                            300,
                        ).glyphs,
                    });
                    await screen.rerender(content(true, true));
                    expect(screen.getByText("Caption")).toHaveStyle({
                        color: theme.resolveAppearance(
                            undefined,
                            "intel",
                            "hazard",
                            "disabled",
                            600,
                            300,
                        ).glyphs,
                    });
                    await fireEvent.press(screen.getByRole(role));
                    expect(onChange).toHaveBeenCalledTimes(1);
                    await screen.unmount();
                }
            }
        } finally {
            theme.destroy();
        }
    }
});
