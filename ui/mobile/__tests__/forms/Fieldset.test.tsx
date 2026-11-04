import { fireEvent, render } from "@testing-library/react-native";
import {
    FieldsetProps,
    Orientation,
    surfaceVariantOptions,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from "@ui";
import { Fieldset } from "../../src/forms/fieldset";
import { AccessibilityInfo, Animated, TextInput } from "react-native";

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

describe("Fieldset", () => {
    beforeEach(() => {
        jest.spyOn(
            AccessibilityInfo,
            "isReduceMotionEnabled",
        ).mockResolvedValue(false);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test.each([false, true])(
        "transitions measured content height and respects reduced motion (%s)",
        async (reducedMotion) => {
            const preference = jest
                .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
                .mockResolvedValue(reducedMotion);
            const animation = {
                start: jest.fn(),
                stop: jest.fn(),
                reset: jest.fn(),
            };
            const timing = jest
                .spyOn(Animated, "timing")
                .mockReturnValue(animation);
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
                false,
            );
            try {
                const screen = await render(
                    <ThemeContext.Provider value={theme}>
                        <Fieldset label="Telemetry">
                            <TextInput
                                accessibilityLabel="Reading"
                                defaultValue="Retained"
                            />
                        </Fieldset>
                    </ThemeContext.Provider>,
                );
                const reading = screen.getByLabelText("Reading");
                const measure = (height: number) =>
                    fireEvent(reading.parent!, "layout", {
                        nativeEvent: {
                            layout: { x: 0, y: 0, width: 200, height },
                        },
                    });
                await measure(120);
                timing.mockClear();
                await fireEvent.press(screen.getByRole("button"));
                expect(screen.queryByLabelText("Reading")).toBeNull();
                expect(
                    screen.getByLabelText("Reading", {
                        includeHiddenElements: true,
                    }),
                ).toBe(reading);
                if (reducedMotion) {
                    expect(timing).not.toHaveBeenCalled();
                } else {
                    expect(timing).toHaveBeenLastCalledWith(
                        expect.any(Animated.Value),
                        expect.objectContaining({
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: false,
                        }),
                    );
                }
                await measure(180);
                await fireEvent.press(screen.getByRole("button"));
                expect(screen.getByLabelText("Reading")).toBe(reading);
                if (reducedMotion) {
                    expect(timing).not.toHaveBeenCalled();
                } else {
                    expect(animation.stop).toHaveBeenCalled();
                    expect(timing).toHaveBeenLastCalledWith(
                        expect.any(Animated.Value),
                        expect.objectContaining({
                            toValue: 180,
                            useNativeDriver: false,
                        }),
                    );
                    await measure(220);
                    expect(timing).toHaveBeenLastCalledWith(
                        expect.any(Animated.Value),
                        expect.objectContaining({ toValue: 220 }),
                    );
                }
                await screen.unmount();
            } finally {
                timing.mockRestore();
                preference.mockRestore();
                theme.destroy();
            }
        },
    );

    test.each(surfaceVariantOptions)(
        "uses one ghost disclosure for the %s container",
        async (variant) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
                false,
            );
            const content = (props: Partial<FieldsetProps> = {}) => (
                <ThemeContext.Provider value={theme}>
                    <Fieldset
                        label="Telemetry"
                        variant={variant}
                        color="glitch"
                        highlightColor="intel"
                        {...props}
                    />
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            const label = () => screen.getByText("TELEMETRY");
            const glyphs = (
                state:
                    "default" | "hover-focus" | "active-pressed" | "disabled",
            ) =>
                theme.resolveAppearance("ghost", "glitch", "intel", state)
                    .glyphs;
            expect(label()).toHaveStyle({ color: glyphs("default") });
            await fireEvent(screen.getByRole("button"), "focus");
            expect(label()).toHaveStyle({ color: glyphs("hover-focus") });
            await fireEvent(screen.getByRole("button"), "pressIn");
            expect(label()).toHaveStyle({ color: glyphs("active-pressed") });
            await screen.rerender(content({ highlighted: true }));
            expect(label()).toHaveStyle({ color: glyphs("active-pressed") });
            await screen.rerender(
                content({ highlighted: true, disabled: true }),
            );
            expect(label()).toHaveStyle({ color: glyphs("disabled") });
            await screen.unmount();
            theme.destroy();
        },
    );

    it("toggles synchronously, honors controlled expansion and keeps content mounted", async () => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].light,
            media,
            false,
        );
        const onExpandedChange = jest.fn();
        const content = (props: Partial<FieldsetProps> = {}) => (
            <ThemeContext.Provider value={theme}>
                <Fieldset
                    label="Telemetry"
                    onExpandedChange={onExpandedChange}
                    {...props}
                >
                    <TextInput
                        accessibilityLabel="Reading"
                        defaultValue="Retained"
                    />
                </Fieldset>
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        const reading = screen.getByLabelText("Reading");
        await fireEvent.press(screen.getByRole("button"));
        expect(onExpandedChange).toHaveBeenLastCalledWith(false);
        expect(screen.getByRole("button")).toBeCollapsed();
        expect(screen.queryByLabelText("Reading")).toBeNull();
        expect(
            screen.getByLabelText("Reading", { includeHiddenElements: true }),
        ).toBe(reading);
        await fireEvent.press(screen.getByRole("button"));
        expect(screen.getByLabelText("Reading")).toBe(reading);
        await screen.rerender(content({ expanded: true }));
        await fireEvent.press(screen.getByRole("button"));
        expect(onExpandedChange).toHaveBeenLastCalledWith(false);
        expect(screen.getByRole("button")).toBeExpanded();
        await screen.rerender(content({ expanded: false }));
        expect(screen.queryByLabelText("Reading")).toBeNull();
        await screen.rerender(content({ expanded: false, expandable: false }));
        expect(screen.queryByRole("button")).toBeNull();
        expect(screen.getByLabelText("Reading")).toBe(reading);
        onExpandedChange.mockClear();
        await screen.rerender(content({ disabled: true }));
        await fireEvent.press(screen.getByRole("button"));
        expect(onExpandedChange).not.toHaveBeenCalled();
        await screen.unmount();
        theme.destroy();
    });
});
