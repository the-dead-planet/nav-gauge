import { FC } from "react";
import { Pressable, View } from "react-native";
import {
    ClockInputProps,
    ClockMode,
    getClockDrawing,
    millisecondsToDurationParts,
    ResolvedThemeAppearance,
} from "@ui";
import { ClockSvg } from "./ClockSvg";
import { useClockDrag } from "./useClockDrag";
import { useHudInteraction } from "../../hud/useHudInteraction";

interface Props extends Pick<
    ClockInputProps,
    | "id"
    | "value"
    | "formatValue"
    | "label"
    | "ariaLabel"
    | "disabled"
    | "thumbIcon"
> {
    mode: ClockMode;
    min: number;
    max: number;
    drawing: ReturnType<typeof getClockDrawing>;
    gesture: ReturnType<typeof useClockDrag>;
    interaction: ReturnType<typeof useHudInteraction>["interaction"];
    focused: boolean;
    appearance: ResolvedThemeAppearance;
    glyphs: string;
}

export const ClockDial: FC<Props> = ({
    id,
    value,
    formatValue,
    label,
    ariaLabel,
    disabled,
    thumbIcon,
    mode,
    min,
    max,
    drawing,
    gesture,
    interaction,
    focused,
    appearance,
    glyphs,
}) => {
    const duration = mode === "duration";
    const { minutes, seconds } = millisecondsToDurationParts(value);
    const { viewBox } = drawing;

    return (
        <Pressable
            nativeID={id}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={
                ariaLabel ?? label ?? (duration ? "Duration" : "Angle")
            }
            accessibilityState={{ disabled }}
            accessibilityValue={{
                min,
                max: duration ? undefined : max,
                now: value,
                text: duration
                    ? `${minutes} min ${seconds} s`
                    : (formatValue?.(value) ?? `${value}°`),
            }}
            accessibilityActions={[
                { name: "increment" },
                { name: "decrement" },
            ]}
            onAccessibilityAction={gesture.onAccessibilityAction}
            disabled={disabled}
            onHoverIn={interaction.onHoverIn}
            onHoverOut={interaction.onHoverOut}
            onFocus={interaction.onFocus}
            onBlur={interaction.onBlur}
            style={{
                outlineStyle: "solid",
                outlineWidth: focused ? 2 : 0,
                outlineColor: appearance.effects.glowColor,
                outlineOffset: 2,
            }}
        >
            <View
                ref={gesture.viewRef}
                collapsable={false}
                {...gesture.panHandlers}
            >
                <ClockSvg
                    {...drawing}
                    viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                    appearance={appearance}
                    glyphs={glyphs}
                    thumbIcon={thumbIcon}
                />
            </View>
        </Pressable>
    );
};
