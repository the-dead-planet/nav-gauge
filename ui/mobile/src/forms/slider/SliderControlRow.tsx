import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { DEFAULT_SIZE, SliderControlRowProps, useTheme } from "@ui";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    numberInput: {
        width: 80,
        flexShrink: 0,
    },
});

export const SliderControlRow: FC<SliderControlRowProps> = ({
    value,
    onChange,
    min,
    max,
    step,
    ariaLabel,
    showNumberInput = false,
    showStepControls = false,
    stepControlsProps,
    variant,
    children,
    ...appearanceProps
}) => {
    const controlSize =
        useTheme().sizes.control[appearanceProps.size ?? DEFAULT_SIZE];

    return (
        <View
            style={[
                styles.row,
                { gap: controlSize.gap, minHeight: controlSize.height },
            ]}
        >
            {showStepControls ? (
                <StepControls
                    {...appearanceProps}
                    {...stepControlsProps}
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    step={step}
                    disabled={
                        appearanceProps.disabled || stepControlsProps?.disabled
                    }
                    ariaLabel={ariaLabel}
                >
                    {children}
                </StepControls>
            ) : (
                children
            )}
            {showNumberInput ? (
                <View style={styles.numberInput}>
                    <NumberInput
                        {...appearanceProps}
                        variant={variant}
                        value={value}
                        onChange={(nextValue) => onChange?.(nextValue)}
                        min={min}
                        max={max}
                        step={step}
                        disabled={appearanceProps.disabled || !onChange}
                        showStepControls
                        ariaLabel={`${ariaLabel ?? "Slider"} (#)`}
                    />
                </View>
            ) : null}
        </View>
    );
};
