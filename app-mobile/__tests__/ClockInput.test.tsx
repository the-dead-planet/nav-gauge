import { fireEvent, render } from "@testing-library/react-native";
import { test } from "@jest/globals";
import { PanResponder, StyleSheet } from "react-native";
import {
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { ClockInput } from "@the-dead-planet/nav-gauge-ui-mobile/src/forms/clock-input/ClockInput";
import { ClockSliceInput } from "@the-dead-planet/nav-gauge-ui-mobile/src/forms/clock-input/ClockSliceInput";
import { ClockDurationInput } from "@the-dead-planet/nav-gauge-ui-mobile/src/forms/clock-input/ClockDurationInput";

jest.mock(
    "@the-dead-planet/nav-gauge-ui-mobile/src/design-system/icons",
    () => ({
        Icon: () => null,
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

test("native clocks retain their drag responder through controlled updates and disabling", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    const createResponder = jest.spyOn(PanResponder, "create");

    try {
        for (const Clock of [ClockInput, ClockSliceInput, ClockDurationInput]) {
            createResponder.mockClear();
            const content = (value: number, disabled = false) => (
                <ThemeContext.Provider value={theme}>
                    <Clock
                        value={value}
                        onChange={() => {}}
                        disabled={disabled}
                    />
                </ThemeContext.Provider>
            );
            const screen = await render(content(30));
            const responder = createResponder.mock.results[0].value;
            const getDragTarget = () => {
                const target = screen.getByRole("adjustable").children[0];
                if (!target || typeof target === "string") {
                    throw new Error("Clock gesture view is missing");
                }
                return target;
            };
            const control = getDragTarget();
            expect(control.props.collapsable).toBe(false);
            expect(control.props.onResponderGrant).toBe(
                responder.panHandlers.onResponderGrant,
            );
            expect(control.props.onResponderMove).toBe(
                responder.panHandlers.onResponderMove,
            );
            expect(control.props.onStartShouldSetResponder()).toBe(true);

            await screen.rerender(content(60));
            expect(getDragTarget().props.onResponderMove).toBe(
                responder.panHandlers.onResponderMove,
            );
            await screen.rerender(content(60, true));
            expect(getDragTarget().props.onStartShouldSetResponder()).toBe(
                false,
            );
            await screen.unmount();
        }
    } finally {
        createResponder.mockRestore();
        theme.destroy();
    }
});

test.each(["start", "end", "above", "below"] as const)(
    "%s duration fields only flex into remaining space beside the dial",
    async (numberInputPlacement) => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].light,
            media,
            false,
        );
        const screen = await render(
            <ThemeContext.Provider value={theme}>
                <ClockDurationInput
                    value={15000}
                    onChange={() => {}}
                    showNumberInput
                    showStepControls
                    numberInputPlacement={numberInputPlacement}
                    ariaLabel="Duration"
                />
            </ThemeContext.Provider>,
        );
        const fields =
            screen.getByLabelText("Duration (minutes)").parent?.parent?.parent
                ?.parent;
        expect(fields).toHaveStyle({ flexDirection: "row", gap: 8 });
        const flex = StyleSheet.flatten(fields?.props.style).flex ?? 0;
        const vertical =
            numberInputPlacement === "above" ||
            numberInputPlacement === "below";
        expect(flex).toBe(vertical ? 0 : 1);
        await screen.unmount();
        theme.destroy();
    },
);

test("duration number fields update their own unit and preserve the minimum duration", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    const onChange = jest.fn();
    const content = (value: number) => (
        <ThemeContext.Provider value={theme}>
            <ClockDurationInput
                value={value}
                min={2000}
                onChange={onChange}
                showNumberInput
                ariaLabel="Duration"
            />
        </ThemeContext.Provider>
    );
    const screen = await render(content(75000));
    await fireEvent.changeText(
        screen.getByLabelText("Duration (minutes)"),
        "2",
    );
    expect(onChange).toHaveBeenLastCalledWith(135000);
    await fireEvent.changeText(
        screen.getByLabelText("Duration (seconds)"),
        "30",
    );
    expect(onChange).toHaveBeenLastCalledWith(90000);
    await screen.rerender(content(2000));
    await fireEvent.changeText(
        screen.getByLabelText("Duration (seconds)"),
        "0",
    );
    expect(onChange).toHaveBeenLastCalledWith(2000);
    await screen.unmount();
    theme.destroy();
});
