import { fireEvent, render } from "@testing-library/react-native";
import { PanResponder, StyleSheet } from "react-native";
import {
    Orientation,
    getCompanionNumberInputWidth,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { ClockInput } from "../../src/forms/clock-input/ClockInput";
import { ClockSliceInput } from "../../src/forms/clock-input/ClockSliceInput";
import { ClockDurationInput } from "../../src/forms/clock-input/ClockDurationInput";

jest.mock("../../src/design-system/icons", () => ({
    Icon: () => null,
}));

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

test("all clock labels ignore transient dial state and honor explicit highlighted and disabled appearance", async () => {
    for (const mode of ["light", "dark"] as const) {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default][mode],
            media,
            false,
        );
        try {
            for (const Clock of [
                ClockInput,
                ClockSliceInput,
                ClockDurationInput,
            ]) {
                const content = (highlighted = false, disabled = false) => (
                    <ThemeContext.Provider value={theme}>
                        <Clock
                            value={45}
                            onChange={() => {}}
                            label="Clock"
                            formatValue={() => "Value"}
                            color="intel"
                            highlightColor="hazard"
                            glyphsShade={600}
                            highlightGlyphsShade={300}
                            highlighted={highlighted}
                            disabled={disabled}
                        />
                    </ThemeContext.Provider>
                );
                const screen = await render(content());
                const defaultColor = theme.resolveAppearance(
                    undefined,
                    "intel",
                    "hazard",
                    "default",
                    600,
                    300,
                ).glyphs;
                for (const event of ["hoverIn", "focus"]) {
                    await fireEvent(screen.getByRole("adjustable"), event);
                    expect(screen.getByText(/^Clock/)).toHaveStyle({
                        color: defaultColor,
                    });
                    expect(screen.getByText("Value")).toHaveStyle({
                        color: defaultColor,
                    });
                }
                await screen.rerender(content(true));
                const highlightedColor = theme.resolveAppearance(
                    undefined,
                    "intel",
                    "hazard",
                    "active-pressed",
                    600,
                    300,
                ).glyphs;
                expect(screen.getByText(/^Clock/)).toHaveStyle({
                    color: highlightedColor,
                });
                expect(screen.getByText("Value")).toHaveStyle({
                    color: highlightedColor,
                });
                await screen.rerender(content(true, true));
                const disabledColor = theme.resolveAppearance(
                    undefined,
                    "intel",
                    "hazard",
                    "disabled",
                    600,
                    300,
                ).glyphs;
                expect(screen.getByText(/^Clock/)).toHaveStyle({
                    color: disabledColor,
                });
                expect(screen.getByText("Value")).toHaveStyle({
                    color: disabledColor,
                });
                await screen.unmount();
            }
        } finally {
            theme.destroy();
        }
    }
});

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
    "%s duration fields share companion sizing and only stretch in vertical layouts",
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
        expect(flex).toBe(0);
        expect(
            screen.getByLabelText("Duration (minutes)").parent?.parent,
        ).toHaveStyle({
            width: getCompanionNumberInputWidth(numberInputPlacement),
        });
        expect(
            screen.getByLabelText("Duration (seconds)").parent?.parent,
        ).toHaveStyle({
            width: getCompanionNumberInputWidth(numberInputPlacement),
        });
        expect(StyleSheet.flatten(fields?.props.style).width).toBe(
            vertical ? "100%" : undefined,
        );
        await screen.unmount();
        theme.destroy();
    },
);

test("angle and slice numeric fields display and edit their configured units", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    try {
        for (const Clock of [ClockInput, ClockSliceInput]) {
            const onChange = jest.fn();
            const screen = await render(
                <ThemeContext.Provider value={theme}>
                    <Clock
                        value={30}
                        min={0}
                        max={60}
                        step={6}
                        onChange={onChange}
                        showNumberInput
                        numberInputScale={6}
                        numberInputUnit="s"
                        ariaLabel="Pause"
                    />
                </ThemeContext.Provider>,
            );
            expect(screen.getByLabelText("Pause (#)").props.value).toBe("5");
            expect(screen.getByText("s")).toBeTruthy();
            await fireEvent.changeText(screen.getByLabelText("Pause (#)"), "7");
            expect(onChange).toHaveBeenLastCalledWith(42);
            await screen.unmount();
        }
    } finally {
        theme.destroy();
    }
});

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
