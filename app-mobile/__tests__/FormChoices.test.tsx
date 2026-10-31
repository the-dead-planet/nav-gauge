import { fireEvent, render } from "@testing-library/react-native";
import { test } from "@jest/globals";
import {
    appearanceColorOptions,
    buttonCorners,
    fillVariantOptions,
    sizeOptions,
    Orientation,
    Theme,
    ThemeAppearanceState,
    ThemeContext,
    ThemeMode,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Checkbox } from "@the-dead-planet/nav-gauge-ui-mobile/src/forms/checkbox";
import { Radio } from "@the-dead-planet/nav-gauge-ui-mobile/src/forms/radio";
import { Text } from "@the-dead-planet/nav-gauge-ui-mobile/src/design-system/typography";
import { HexagonSurface } from "@the-dead-planet/nav-gauge-ui-mobile/src/hud/hexagon/HexagonSurface";

jest.mock(
    "@the-dead-planet/nav-gauge-ui-mobile/src/hud/hexagon/HexagonSurface",
    () => ({
        HexagonSurface: jest.fn(() => null),
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
const cases = modes.flatMap((mode) =>
    fillVariantOptions.flatMap((variant) =>
        buttonCorners.map((corners) => ({ mode, variant, corners })),
    ),
);

describe("Form choice appearance ownership", () => {
    test.each(sizeOptions)(
        "%s choices reserve the control height and inset the box by one gap",
        async (size) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
                false,
            );
            const controlSize = theme.sizes.control[size];
            for (const [Control, role] of [
                [Checkbox, "checkbox"],
                [Radio, "radio"],
            ] as const) {
                const screen = await render(
                    <ThemeContext.Provider value={theme}>
                        <Control checked size={size} onChange={() => {}}>
                            Choice
                        </Control>
                    </ThemeContext.Provider>,
                );
                const control = screen.getByRole(role);
                expect(control).toHaveStyle({
                    minHeight: controlSize.height,
                    gap: controlSize.gap,
                });
                expect(control.children[0]).toHaveStyle({
                    width: controlSize.height - controlSize.gap,
                    height: controlSize.height - controlSize.gap,
                });
                await screen.unmount();
            }
            theme.destroy();
        },
    );

    test.each(modes)(
        "overrides the form choice and nested label without changing its %s parent",
        async (mode) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
                false,
            );
            const overrides: (ThemeMode | undefined)[] = [
                undefined,
                "light",
                "dark",
            ];
            for (const [Control, role] of [
                [Checkbox, "checkbox"],
                [Radio, "radio"],
            ] as const) {
                const content = (themeMode?: ThemeMode, disabled = false) => (
                    <ThemeContext.Provider value={theme}>
                        <Control
                            themeMode={themeMode}
                            checked
                            color="glitch"
                            highlightColor="intel"
                            highlighted
                            disabled={disabled}
                            onChange={() => {}}
                        >
                            <Text color="glitch">Nested label</Text>
                        </Control>
                        <Text color="glitch">Sibling</Text>
                    </ThemeContext.Provider>
                );
                const screen = await render(content());
                for (const themeMode of overrides) {
                    const resolvedTheme = theme.forMode(themeMode);
                    await screen.rerender(content(themeMode));
                    expect(screen.getByRole(role).children[0]).toHaveStyle({
                        backgroundColor: resolvedTheme.resolveAppearance(
                            "fill-inverse",
                            "glitch",
                            "intel",
                            "active-pressed",
                        ).surface,
                    });
                    expect(screen.getByText("Nested label")).toHaveStyle({
                        color: resolvedTheme.resolveAppearance(
                            undefined,
                            "glitch",
                        ).glyphs,
                    });
                    expect(screen.getByText("Sibling")).toHaveStyle({
                        color: theme.resolveAppearance(undefined, "glitch")
                            .glyphs,
                    });
                    await screen.rerender(content(themeMode, true));
                    expect(screen.getByRole(role).children[0]).toHaveStyle({
                        backgroundColor: resolvedTheme.resolveAppearance(
                            "fill-inverse",
                            "glitch",
                            "intel",
                            "disabled",
                        ).surface,
                    });
                }
                await screen.unmount();
            }
            theme.destroy();
        },
    );

    test.each(cases)(
        "$corners $variant in $mode follows shared policy through focus, press, highlight and disabled",
        async ({ mode, variant, corners }) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
                false,
            );
            for (const [Control, role] of [
                [Checkbox, "checkbox"],
                [Radio, "radio"],
            ] as const) {
                jest.mocked(HexagonSurface).mockClear();
                const onChange = jest.fn();
                const content = (
                    color = appearanceColorOptions[0],
                    highlighted = false,
                    disabled = false,
                    overrides = false,
                    checked = false,
                ) => (
                    <ThemeContext.Provider value={theme}>
                        <Control
                            color={color}
                            highlightColor="intel"
                            variant={variant}
                            size="lg"
                            corners={corners}
                            checked={checked}
                            highlighted={highlighted}
                            disabled={disabled}
                            glyphsShade={overrides ? 500 : undefined}
                            highlightGlyphsShade={overrides ? 100 : undefined}
                            onChange={onChange}
                        >
                            Choice
                        </Control>
                    </ThemeContext.Provider>
                );
                const screen = await render(content());
                expect(screen.getAllByRole(role)).toHaveLength(1);
                const expectAppearance = (
                    state: ThemeAppearanceState,
                    color = appearanceColorOptions[0],
                ) => {
                    const appearance = theme.resolveAppearance(
                        variant,
                        color,
                        "intel",
                        state,
                    );
                    expect(screen.getByRole(role).children[0]).toHaveStyle({
                        width: 28,
                        height: 28,
                        borderRadius: corners === "circle" ? 14 : 0,
                        backgroundColor:
                            corners === "hexagon"
                                ? "transparent"
                                : appearance.surface,
                        borderColor: appearance.border.color,
                        borderWidth:
                            corners === "hexagon" ? 0 : appearance.border.width,
                    });
                    if (corners === "hexagon") {
                        expect(
                            jest.mocked(HexagonSurface).mock.lastCall?.[0],
                        ).toMatchObject({
                            appearance,
                            showGlow: false,
                        });
                    } else {
                        expect(HexagonSurface).not.toHaveBeenCalled();
                    }
                    expect(screen.getByText("Choice")).toHaveStyle({
                        color: theme.resolveAppearance(
                            undefined,
                            color,
                            "intel",
                            state,
                        ).glyphs,
                    });
                };
                for (const color of appearanceColorOptions) {
                    await screen.rerender(content(color));
                    expectAppearance("default", color);
                }
                await screen.rerender(content());
                await fireEvent(screen.getByRole(role), "focus");
                expectAppearance("hover-focus");
                expect(screen.getByRole(role).children[0]).toHaveStyle({
                    outlineWidth: 2,
                });
                await fireEvent(screen.getByRole(role), "pressIn");
                expectAppearance("active-pressed");
                await fireEvent(screen.getByRole(role), "pressOut");
                expectAppearance("hover-focus");
                await screen.rerender(content(undefined, true));
                expectAppearance("active-pressed");
                await fireEvent(screen.getByRole(role), "blur");
                await fireEvent(screen.getByRole(role), "hoverIn");
                expectAppearance("active-pressed");
                await screen.rerender(content(undefined, true, false, true));
                expect(screen.getByText("Choice")).toHaveStyle({
                    color: theme.color("intel", 100),
                });
                await screen.rerender(content(undefined, true, true, true));
                expectAppearance("disabled");
                await fireEvent.press(screen.getByRole(role));
                expect(onChange).not.toHaveBeenCalled();
                await screen.rerender(content(undefined, false, false, true));
                expect(screen.getByText("Choice")).toHaveStyle({
                    color: theme.color(appearanceColorOptions[0], 500),
                });
                await fireEvent.press(screen.getByRole(role));
                expect(onChange).toHaveBeenLastCalledWith(true);
                await screen.rerender(
                    content(undefined, false, false, false, true),
                );
                if (role === "radio") {
                    const markerSize = theme.sizes.control.lg.iconSize / 2;
                    const marker = screen
                        .getByRole(role)
                        .queryAll(
                            (node) =>
                                node.props.style?.width === markerSize &&
                                node.props.style?.height === markerSize,
                        )[0];
                    expect(marker).toHaveStyle({
                        width: markerSize,
                        height: markerSize,
                        borderRadius: corners === "circle" ? markerSize / 2 : 0,
                        backgroundColor:
                            corners === "hexagon"
                                ? "transparent"
                                : theme.resolveAppearance(
                                      variant,
                                      appearanceColorOptions[0],
                                      "intel",
                                  ).glyphs,
                    });
                    expect(
                        marker.queryAll(
                            (node) => typeof node.props.d === "string",
                        ),
                    ).toHaveLength(corners === "hexagon" ? 1 : 0);
                }
                await fireEvent.press(screen.getByRole(role));
                expect(onChange).toHaveBeenLastCalledWith(role === "radio");
                await screen.unmount();
            }
            theme.destroy();
        },
    );
});
