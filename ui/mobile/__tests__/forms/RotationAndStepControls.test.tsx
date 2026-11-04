import {
    act,
    fireEvent,
    render,
    renderHook,
} from "@testing-library/react-native";
import { PanResponder, Text } from "react-native";
import {
    appearanceColorOptions,
    fillVariantOptions,
    getClockGeometry,
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    sizeOptions,
    themeSpecifications,
    useRotationInput,
    useStepRepeat,
} from "@ui";
import { StepControls } from "../../src/forms/step-controls/StepControls";
import { IconRotateInput } from "../../src/forms/icon-rotate-input/IconRotateInput";

jest.mock("../../src/design-system/icons", () => ({ Icon: () => null }));

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

test("rotation uses clock dial geometry and responds to every theme control size", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    try {
        for (const size of sizeOptions) {
            const screen = await render(
                <ThemeContext.Provider value={theme}>
                    <IconRotateInput
                        value={45}
                        onChange={() => {}}
                        size={size}
                    />
                </ThemeContext.Provider>,
            );
            const { svgSize } = getClockGeometry(
                theme.sizes.control[size].height,
                "angle",
            );
            expect(screen.getByRole("adjustable")).toHaveStyle({
                width: svgSize,
                height: svgSize,
            });
            await screen.unmount();
        }
    } finally {
        theme.destroy();
    }
});

test("rotation crosses north smoothly, stops at partial bounds, and ignores disabled moves", async () => {
    const onChange = jest.fn();
    const hook = await renderHook(
        (props: {
            value: number;
            min: number;
            max: number;
            disabled: boolean;
        }) => useRotationInput({ ...props, onChange, step: 5 }),
        { initialProps: { value: 355, min: 0, max: 360, disabled: false } },
    );
    await act(() => hook.result.current.start(355));
    await act(() => hook.result.current.move(5));
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(hook.result.current.displayAngle).toBe(365);
    await hook.rerender({ value: 5, min: 0, max: 360, disabled: true });
    await act(() => hook.result.current.move(15));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(hook.result.current.dragging).toBe(false);
    await act(() => hook.result.current.stop());
    await hook.rerender({ value: 85, min: 20, max: 90, disabled: false });
    await act(() => hook.result.current.start(85));
    await act(() => hook.result.current.move(110));
    expect(onChange).toHaveBeenLastCalledWith(90);
    await act(() => hook.result.current.move(100));
    expect(onChange).toHaveBeenLastCalledWith(80);
    await hook.unmount();
});

test("held steps use current bounds and callbacks, and stop when disabled", async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const updatedOnChange = jest.fn();
    try {
        const hook = await renderHook(
            (props: {
                value: number;
                max: number;
                disabled: boolean;
                onChange: (value: number) => void;
            }) => useStepRepeat(props),
            { initialProps: { value: 1, max: 10, disabled: false, onChange } },
        );
        await act(() => hook.result.current.start(1));
        expect(onChange).toHaveBeenLastCalledWith(2);
        await hook.rerender({
            value: 2,
            max: 3,
            disabled: false,
            onChange: updatedOnChange,
        });
        await act(() => jest.advanceTimersByTime(400));
        expect(updatedOnChange).toHaveBeenLastCalledWith(3);
        await hook.rerender({
            value: 3,
            max: 10,
            disabled: true,
            onChange: updatedOnChange,
        });
        await act(() => jest.advanceTimersByTime(1000));
        expect(updatedOnChange).toHaveBeenCalledTimes(1);
        await hook.unmount();
    } finally {
        jest.useRealTimers();
    }
});

test("step buttons consume the selected appearance across variants, colors, and disabled states", async () => {
    for (const mode of ["light", "dark"] as const) {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default][mode],
            media,
            false,
        );
        try {
            for (const color of appearanceColorOptions) {
                for (const variant of fillVariantOptions) {
                    const content = (disabled = false) => (
                        <ThemeContext.Provider value={theme}>
                            <StepControls
                                value={5}
                                onChange={() => {}}
                                color={color}
                                variant={variant}
                                highlightColor="hazard"
                                highlighted
                                disabled={disabled}
                            >
                                <Text>Value</Text>
                            </StepControls>
                        </ThemeContext.Provider>
                    );
                    const screen = await render(content());
                    const button = screen.getByLabelText("+");
                    const active = theme.resolveAppearance(
                        variant,
                        color,
                        "hazard",
                        "active-pressed",
                    );
                    expect(button).toHaveStyle({
                        backgroundColor: active.surface,
                        borderColor: active.border.color,
                    });
                    await fireEvent(button, "hoverIn");
                    expect(button).toHaveStyle({
                        backgroundColor: active.surface,
                    });
                    await screen.rerender(content(true));
                    const disabled = theme.resolveAppearance(
                        variant,
                        color,
                        "hazard",
                        "disabled",
                    );
                    expect(screen.getByLabelText("+")).toHaveStyle({
                        backgroundColor: disabled.surface,
                        borderColor: disabled.border.color,
                    });
                    expect(screen.getByLabelText("+")).toBeDisabled();
                    await screen.unmount();
                }
            }
        } finally {
            theme.destroy();
        }
    }
});

test("native rotation keeps one responder, exposes adjustable actions, and disables all input", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    const onChange = jest.fn();
    const createResponder = jest.spyOn(PanResponder, "create");
    try {
        const content = (value: number, disabled = false) => (
            <ThemeContext.Provider value={theme}>
                <IconRotateInput
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    color="intel"
                    label="Rotation"
                />
            </ThemeContext.Provider>
        );
        const screen = await render(content(45));
        const dial = screen.getByRole("adjustable");
        expect(dial.props.onStartShouldSetResponder()).toBe(true);
        await fireEvent(dial, "accessibilityAction", {
            nativeEvent: { actionName: "increment" },
        });
        expect(onChange).toHaveBeenLastCalledWith(46);
        await screen.rerender(content(46, true));
        expect(createResponder).toHaveBeenCalledTimes(1);
        expect(
            screen.getByRole("adjustable").props.onStartShouldSetResponder(),
        ).toBe(false);
        expect(screen.getByRole("adjustable")).toBeDisabled();
        await screen.unmount();
    } finally {
        createResponder.mockRestore();
        theme.destroy();
    }
});
