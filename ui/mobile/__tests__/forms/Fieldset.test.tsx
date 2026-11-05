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
import {
    AccessibilityInfo,
    Animated,
    StyleSheet,
    Text,
    TextInput,
} from "react-native";

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
        "animates only the clip, retains panel contents and respects reduced motion (%s)",
        async (reducedMotion) => {
            const preference = jest
                .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
                .mockResolvedValue(reducedMotion);
            const configureAnimation = jest
                .spyOn(Animated, "timing")
                .mockImplementation((value, configuration) => ({
                    start: () => {
                        if (
                            value instanceof Animated.Value &&
                            typeof configuration.toValue === "number"
                        ) {
                            value.setValue(configuration.toValue);
                        }
                    },
                    stop: jest.fn(),
                    reset: jest.fn(),
                }));
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
                false,
            );
            try {
                const onExpandedChange = jest.fn();
                const content = (extraContent = false) => (
                    <ThemeContext.Provider value={theme}>
                        <Fieldset
                            label="Telemetry"
                            onExpandedChange={onExpandedChange}
                        >
                            <TextInput
                                accessibilityLabel="Reading"
                                defaultValue="Retained"
                            />
                            {extraContent ? <Text>New details</Text> : null}
                        </Fieldset>
                    </ThemeContext.Provider>
                );
                const screen = await render(content());
                const reading = screen.getByLabelText("Reading");
                let clip = reading.parent;
                while (clip && clip.props.collapsable !== false) {
                    clip = clip.parent;
                }
                if (!clip) {
                    throw new Error("Native collapse viewport is missing");
                }
                const panel = clip.children[0];
                if (!panel || typeof panel === "string") {
                    throw new Error("Fieldset panel is missing");
                }
                const measure = (height: number) =>
                    fireEvent(panel, "layout", {
                        nativeEvent: {
                            layout: { x: 0, y: 0, width: 200, height },
                        },
                    });
                await measure(120);
                expect(clip).toHaveStyle({ height: 120 });
                expect(panel).toHaveStyle({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                });
                expect(clip.props.collapsable).toBe(false);
                expect(configureAnimation).not.toHaveBeenCalled();
                await fireEvent.press(screen.getByRole("button"));
                expect(clip).toHaveStyle({ height: 0 });
                expect(screen.queryByLabelText("Reading")).toBeNull();
                expect(
                    screen.getByLabelText("Reading", {
                        includeHiddenElements: true,
                    }),
                ).toBe(reading);
                if (reducedMotion) {
                    expect(configureAnimation).not.toHaveBeenCalled();
                } else {
                    expect(configureAnimation).toHaveBeenCalledTimes(1);
                    expect(configureAnimation).toHaveBeenLastCalledWith(
                        expect.any(Animated.Value),
                        expect.objectContaining({
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: false,
                        }),
                    );
                }
                await screen.rerender(content(true));
                await measure(220);
                expect(clip).toHaveStyle({ height: 0 });
                expect(configureAnimation).toHaveBeenCalledTimes(
                    reducedMotion ? 0 : 1,
                );
                await fireEvent.press(screen.getByRole("button"));
                expect(screen.getByLabelText("Reading")).toBe(reading);
                expect(clip).toHaveStyle({ height: 220 });
                expect(screen.getByText("New details")).toBeTruthy();
                expect(
                    StyleSheet.flatten(panel.props.style).minHeight,
                ).toBeUndefined();
                if (reducedMotion) {
                    expect(configureAnimation).not.toHaveBeenCalled();
                } else {
                    expect(configureAnimation).toHaveBeenCalledTimes(2);
                }
                for (let cycle = 0; cycle < 2; cycle += 1) {
                    await fireEvent.press(screen.getByRole("button"));
                    expect(clip).toHaveStyle({ height: 0 });
                    expect(panel).toHaveStyle({ position: "absolute" });
                    await fireEvent.press(screen.getByRole("button"));
                    expect(clip).toHaveStyle({ height: 220 });
                    expect(screen.getByLabelText("Reading")).toBe(reading);
                    expect(screen.getByText("New details")).toBeTruthy();
                }
                expect(configureAnimation).toHaveBeenCalledTimes(
                    reducedMotion ? 0 : 6,
                );
                await screen.unmount();
            } finally {
                configureAnimation.mockRestore();
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
