import { ComponentType, FC } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
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
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    start: {
        flexDirection: "row-reverse",
    },
    above: {
        flexDirection: "column-reverse",
    },
    below: {
        flexDirection: "column",
    },
    numberInput: {
        width: 80,
    },
    verticalNumberInput: {
        alignSelf: "stretch",
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
    themeMode,
    color = DEFAULT_COLOR,
    highlightColor = color,
    glyphsShade,
    highlightGlyphsShade,
    highlighted = false,
    size = DEFAULT_SIZE,
    min = 0,
    max = 360,
    step = 1,
    disabled = false,
    label,
    showNumberInput = false,
    showStepControls = false,
    numberInputPlacement = "end",
    ariaLabel,
    style,
}) => {
    const theme = useTheme().forMode(themeMode);
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
        undefined,
        color,
        highlightColor,
        state,
        glyphsShade,
        highlightGlyphsShade,
    );
    const appearanceProps = {
        themeMode,
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
    const vertical =
        numberInputPlacement === "above" || numberInputPlacement === "below";

    return (
        <View style={[styles.container, style]}>
            <RotateLabel
                {...appearanceProps}
                label={label}
                displayWrapped={value}
                showValue={!showNumberInput}
            />
            <View
                style={[
                    styles.row,
                    showNumberInput &&
                        styles[
                            numberInputPlacement === "end"
                                ? "row"
                                : numberInputPlacement
                        ],
                ]}
            >
                {showStepControls ? (
                    <StepControls
                        {...appearanceProps}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        step={step}
                        ariaLabel={ariaLabel ?? label}
                    >
                        {visualControl}
                    </StepControls>
                ) : (
                    visualControl
                )}
                {showNumberInput ? (
                    <View
                        style={
                            vertical
                                ? styles.verticalNumberInput
                                : styles.numberInput
                        }
                    >
                        <NumberInput
                            {...appearanceProps}
                            value={value}
                            onChange={(newValue) => onChange?.(newValue)}
                            min={min}
                            max={max}
                            step={step}
                            showStepControls
                            ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                        />
                    </View>
                ) : null}
            </View>
        </View>
    );
};
