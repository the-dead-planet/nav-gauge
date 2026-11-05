import { ComponentType, FC } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    IconRotateInputProps,
    getClockGeometry,
    snapRotation,
    useTheme,
} from "@ui";
import { SvgProps } from "react-native-svg";
import { RotationArrows } from "./RotationArrows";
import { RotateIconWrapper } from "./RotateIconWrapper";
import { RotateLabel } from "./RotateLabel";
import { useRotationGesture } from "./useRotationGesture";
import { useHudInteraction } from "../../hud/useHudInteraction";
import { IconRotateControlRow } from "./IconRotateControlRow";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 4,
    },
    dial: {
        flexShrink: 0,
        borderRadius: "50%",
        outlineStyle: "solid",
        outlineOffset: 2,
    },
});

interface Props extends Omit<IconRotateInputProps, "icon"> {
    icon?: ComponentType<SvgProps>;
    style?: ViewStyle;
}

export const IconRotateInput: FC<Props> = ({
    icon,
    value = 0,
    onChange,
    valueAdjustment = 0,
    color = DEFAULT_COLOR,
    highlightColor = color,
    glyphsShade,
    highlightGlyphsShade,
    highlighted = false,
    variant = DEFAULT_SURFACE_VARIANT,
    size = DEFAULT_SIZE,
    min = 0,
    max = 360,
    step = 1,
    disabled = false,
    label,
    showNumberInput = false,
    showStepControls = false,
    stepControlsProps,
    numberInputPlacement = "end",
    ariaLabel,
    style,
}) => {
    const theme = useTheme();
    const controlSize = theme.sizes.control[size];
    const { svgSize, center, outerRadius } = getClockGeometry(
        controlSize.height,
        "angle",
    );
    const rotation = useRotationGesture({
        value,
        onChange,
        min,
        max,
        step,
        disabled,
    });
    const { state, interaction, focused } = useHudInteraction({
        disabled: rotation.disabled,
        highlighted: highlighted || rotation.dragging,
    });
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        state,
        glyphsShade,
        highlightGlyphsShade,
    );
    const appearanceProps = {
        color,
        highlightColor,
        glyphsShade,
        highlightGlyphsShade,
        highlighted,
        size,
        disabled: rotation.disabled,
    };
    const visualControl = (
        <Pressable
            {...interaction}
            {...rotation.panHandlers}
            ref={rotation.target}
            collapsable={false}
            disabled={rotation.disabled}
            accessibilityRole="adjustable"
            accessibilityLabel={ariaLabel ?? label ?? "Angle"}
            accessibilityState={{ disabled: rotation.disabled }}
            accessibilityValue={{ min, max, now: value, text: `${value}°` }}
            accessibilityActions={[
                { name: "increment" },
                { name: "decrement" },
            ]}
            onAccessibilityAction={(event) => {
                const action = event.nativeEvent.actionName;
                if (
                    !rotation.disabled &&
                    (action === "increment" || action === "decrement")
                ) {
                    onChange?.(
                        snapRotation(
                            value + (action === "increment" ? step : -step),
                            min,
                            max,
                            step,
                        ),
                    );
                }
            }}
            style={[
                styles.dial,
                {
                    width: svgSize,
                    height: svgSize,
                    backgroundColor: appearance.surface,
                    borderColor: appearance.border.color,
                    borderWidth: appearance.border.width,
                    boxShadow:
                        appearance.effects.depth === "inset"
                            ? `3px 3px 4px ${appearance.effects.inset.shadow} inset, -2px -2px 4px ${appearance.effects.inset.highlight} inset`
                            : undefined,
                    outlineWidth: focused ? 2 : 0,
                    outlineColor: appearance.effects.glowColor,
                },
            ]}
        >
            <RotationArrows
                svgSize={svgSize}
                center={center}
                outerRadius={outerRadius}
                ringStroke={appearance.glyphs}
                arrowStroke={appearance.glyphs}
            />
            <RotateIconWrapper
                icon={icon}
                iconSize={controlSize.iconSize}
                svgSize={svgSize}
                displayAngle={rotation.displayAngle + valueAdjustment}
                iconColor={appearance.glyphs}
            />
        </Pressable>
    );

    return (
        <View style={[styles.container, style]}>
            <RotateLabel
                {...appearanceProps}
                label={label}
                displayWrapped={value}
                showValue={!showNumberInput}
            />
            <IconRotateControlRow
                {...appearanceProps}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                label={label}
                ariaLabel={ariaLabel}
                showNumberInput={showNumberInput}
                showStepControls={showStepControls}
                stepControlsProps={stepControlsProps}
                numberInputPlacement={numberInputPlacement}
            >
                {visualControl}
            </IconRotateControlRow>
        </View>
    );
};
