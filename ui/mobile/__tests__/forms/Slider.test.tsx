import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { test } from "@jest/globals";
import { AccessibilityInfo, Animated, StyleSheet } from "react-native";
import {
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Slider } from "../src/forms/slider/Slider";

jest.mock(
    "../src/design-system/icons",
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

test("native slider labels stay independent while the thumb animates once and number controls update values", async () => {
    const theme = new Theme(
        themeSpecifications[ThemeName.Default].light,
        media,
        false,
    );
    const preference = jest
        .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
        .mockResolvedValue(false);
    const animation = {
        start: jest.fn(),
        stop: jest.fn(),
        reset: jest.fn(),
    };
    const timing = jest.spyOn(Animated, "timing").mockReturnValue(animation);
    const onChange = jest.fn();
    const content = (disabled = false) => (
        <ThemeContext.Provider value={theme}>
            <Slider
                label="Position"
                value={50}
                onChange={onChange}
                activeGlow="animate-borders-glow"
                showNumberInput
                disabled={disabled}
            />
        </ThemeContext.Provider>
    );

    try {
        const screen = await render(content());
        const labelColor = StyleSheet.flatten(
            screen.getByText("Position").props.style,
        ).color;
        await fireEvent(screen.getByRole("adjustable"), "focus");
        expect(
            StyleSheet.flatten(screen.getByText("Position").props.style).color,
        ).toBe(labelColor);
        await waitFor(() => expect(timing).toHaveBeenCalledTimes(1));
        expect(timing).toHaveBeenCalledWith(
            expect.any(Animated.Value),
            expect.objectContaining({
                duration: 400,
                toValue: 1,
                useNativeDriver: false,
            }),
        );
        expect(animation.start).toHaveBeenCalledTimes(1);
        await fireEvent.changeText(screen.getByLabelText("Position (#)"), "75");
        expect(onChange).toHaveBeenLastCalledWith(75);
        await screen.rerender(content(true));
        expect(animation.stop).toHaveBeenCalled();
        expect(
            screen.getByRole("adjustable").props.accessibilityState.disabled,
        ).toBe(true);
        await screen.unmount();
    } finally {
        timing.mockRestore();
        preference.mockRestore();
        theme.destroy();
    }
});
