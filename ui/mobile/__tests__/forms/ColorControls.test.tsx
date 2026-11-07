import {
    act,
    fireEvent,
    render,
    renderHook,
} from "@testing-library/react-native";
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    PanResponder,
} from "react-native";
import {
    fillVariantOptions,
    Orientation,
    Theme,
    ThemeAppearanceState,
    ThemeContext,
    ThemeName,
    themeSpecifications,
    parseColor,
    toHexColor,
    useColorRampState,
} from "@ui";
import { ColorInput } from "../../src/forms/color-input/ColorInput";
import { ColorButton } from "../../src/forms/color-button/ColorButton";
import { useRampResponder } from "../../src/forms/color-ramp/useRampResponder";
import { HueRamp } from "../../src/forms/color-ramp/HueRamp";
import { OpacityRamp } from "../../src/forms/color-ramp/OpacityRamp";

jest.mock("../../src/rigs/popup", () => ({ Popup: () => null }));
jest.mock("../../src/design-system/icons", () => ({ Icon: () => null }));

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

test("color ramp hue survives RGB quantization, hex echoes and achromatic edits", async () => {
    const onChange = jest.fn();
    const hook = await renderHook(
        (value: string) => useColorRampState(value, onChange),
        { initialProps: "#2467ab" },
    );
    const hue = hook.result.current.hue;
    await act(() => hook.result.current.changeSaturationValue(0.41, 0.67));
    await hook.rerender(toHexColor(parseColor(onChange.mock.calls[0][0])));
    expect(hook.result.current.hue).toBe(hue);
    await hook.rerender("#000000");
    await act(() => hook.result.current.changeHue(280));
    expect(hook.result.current.hue).toBe(280);
    await hook.rerender("#00ff00");
    expect(hook.result.current.hue).toBe(120);
    await hook.unmount();
});

test("color fields follow shared policy with disabled above highlight above focus", async () => {
    for (const mode of ["light", "dark"] as const) {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default][mode],
            media,
            false,
        );
        try {
            const color = mode === "light" ? "primary" : "glitch";
            for (const variant of fillVariantOptions) {
                const content = (highlighted = false, disabled = false) => (
                    <ThemeContext.Provider value={theme}>
                        <ColorInput
                            label="Color"
                            value="#336699"
                            color={color}
                            highlightColor="hazard"
                            glyphsShade={600}
                            highlightGlyphsShade={200}
                            variant={variant}
                            highlighted={highlighted}
                            disabled={disabled}
                            showColorButton={false}
                            onChange={() => {}}
                        />
                    </ThemeContext.Provider>
                );
                const screen = await render(content());
                const check = (state: ThemeAppearanceState) => {
                    const appearance = theme.resolveAppearance(
                        variant,
                        color,
                        "hazard",
                        state,
                        600,
                        200,
                    );
                    const input = screen.getByLabelText("Color");
                    expect(input).toHaveStyle({ color: appearance.glyphs });
                    expect(input.parent).toHaveStyle({
                        backgroundColor: appearance.surface,
                        borderColor: appearance.border.color,
                        borderWidth: appearance.border.width,
                    });
                };
                check("default");
                await fireEvent(screen.getByLabelText("Color"), "pointerEnter");
                check("hover-focus");
                await fireEvent(screen.getByLabelText("Color"), "pointerLeave");
                check("default");
                const label = screen.getByText("Color");
                const labelStyle = label.props.style;
                await fireEvent(screen.getByLabelText("Color"), "focus");
                check("hover-focus");
                expect(screen.getByText("Color").props.style).toEqual(
                    labelStyle,
                );
                await fireEvent(screen.getByLabelText("Color"), "pressIn");
                check("active-pressed");
                await fireEvent(screen.getByLabelText("Color"), "pressOut");
                await screen.rerender(content(true));
                check("active-pressed");
                await screen.rerender(content(true, true));
                check("disabled");
                expect(screen.getByLabelText("Color")).toBeDisabled();
                await screen.unmount();
            }
        } finally {
            theme.destroy();
        }
    }
});

test("linear color ramps share themed sizing, clamp adjustments and ignore disabled actions", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    try {
        for (const kind of ["hue", "opacity"] as const) {
            const onChange = jest.fn();
            const content = (disabled = false) => (
                <ThemeContext.Provider value={theme}>
                    {kind === "hue" ? (
                        <HueRamp
                            value={358}
                            size="lg"
                            disabled={disabled}
                            onChange={onChange}
                        />
                    ) : (
                        <OpacityRamp
                            color="#336699"
                            value={0.98}
                            size="lg"
                            disabled={disabled}
                            onChange={onChange}
                        />
                    )}
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            expect(screen.getByRole("adjustable")).toHaveStyle({
                height: theme.sizes.control.lg.height / 2,
            });
            await fireEvent(
                screen.getByRole("adjustable"),
                "accessibilityAction",
                { nativeEvent: { actionName: "increment" } },
            );
            expect(onChange).toHaveBeenLastCalledWith(kind === "hue" ? 360 : 1);
            await screen.rerender(content(true));
            await fireEvent(
                screen.getByRole("adjustable"),
                "accessibilityAction",
                { nativeEvent: { actionName: "decrement" } },
            );
            expect(onChange).toHaveBeenCalledTimes(1);
            await screen.unmount();
        }
    } finally {
        theme.destroy();
    }
});

test("a selected swatch keeps its value and disabled wins over selection and focus", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    try {
        const onPress = jest.fn();
        const content = (disabled = false) => (
            <ThemeContext.Provider value={theme}>
                <ColorButton
                    value="#336699"
                    label="Swatch"
                    selected
                    disabled={disabled}
                    onPress={onPress}
                />
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        await fireEvent(screen.getByRole("button"), "focus");
        expect(screen.getByRole("button")).toHaveStyle({
            backgroundColor: "#336699",
            outlineWidth: 2,
        });
        await screen.rerender(content(true));
        const disabled = theme.resolveAppearance(
            "default",
            "neutral",
            "neutral",
            "disabled",
        );
        expect(screen.getByRole("button")).toHaveStyle({
            borderColor: disabled.border.color,
            outlineWidth: 0,
        });
        await fireEvent.press(screen.getByRole("button"));
        expect(onPress).not.toHaveBeenCalled();
        await screen.unmount();
    } finally {
        theme.destroy();
    }
});

test("ramp responders stop emitting when disabled during an existing gesture", async () => {
    const create = jest.spyOn(PanResponder, "create");
    const onChange = jest.fn();
    try {
        const hook = await renderHook(
            (disabled: boolean) => useRampResponder(disabled, onChange),
            { initialProps: false },
        );
        await act(() =>
            hook.result.current.onLayout({
                nativeEvent: { layout: { width: 100 } },
            } as LayoutChangeEvent),
        );
        const handlers = create.mock.calls[0][0];
        const event = {
            nativeEvent: { locationX: 25, locationY: 10 },
        } as GestureResponderEvent;
        const gesture = {} as Parameters<
            NonNullable<typeof handlers.onPanResponderGrant>
        >[1];
        await act(() => handlers.onPanResponderGrant?.(event, gesture));
        expect(onChange).toHaveBeenLastCalledWith(0.25, 10);
        expect(hook.result.current.state).toBe("active-pressed");
        await hook.rerender(true);
        await act(() => handlers.onPanResponderMove?.(event, gesture));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(hook.result.current.state).toBe("disabled");
        await hook.unmount();
    } finally {
        create.mockRestore();
    }
});
