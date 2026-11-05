import { FC } from "react";
import { StyleSheet, View } from "react-native";
import {
    ClockControlRowProps,
    DEFAULT_SIZE,
    getClockGeometry,
    getClockNumberInputProps,
    getCompanionNumberInputWidth,
    useTheme,
} from "@ui";
import { ClockDurationNumberInputs } from "./ClockDurationNumberInputs";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        maxWidth: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexWrap: "wrap",
    },
    fullWidth: {
        width: "100%",
    },
    start: { flexDirection: "row-reverse" },
    above: { flexDirection: "column-reverse" },
    below: { flexDirection: "column" },
    end: { flexDirection: "row" },
});

export const ClockControlRow: FC<ClockControlRowProps> = ({
    mode,
    value,
    min,
    max,
    step,
    onChange,
    label,
    ariaLabel,
    showNumberInput = false,
    numberInputScale,
    numberInputUnit,
    showStepControls = false,
    stepControlsProps,
    variant,
    numberInputPlacement = "end",
    children,
    ...appearanceProps
}) => {
    const theme = useTheme();
    const duration = mode === "duration";
    const numberInput = getClockNumberInputProps({
        value,
        min,
        max,
        step,
        onChange,
        numberInputScale,
        numberInputUnit,
    });
    const controlHeight =
        theme.sizes.control[appearanceProps.size ?? DEFAULT_SIZE].height;
    const { svgSize } = getClockGeometry(controlHeight, mode);
    const stepControlHeight =
        theme.sizes.control[
            stepControlsProps?.size ?? appearanceProps.size ?? DEFAULT_SIZE
        ].height;

    return (
        <View
            style={[
                styles.row,
                duration && showNumberInput && styles.fullWidth,
                showNumberInput && styles[numberInputPlacement],
            ]}
        >
            {showStepControls ? (
                <View style={{ width: svgSize + stepControlHeight * 2 + 8 }}>
                    <StepControls
                        {...appearanceProps}
                        {...stepControlsProps}
                        value={value}
                        min={min}
                        max={duration ? undefined : max}
                        step={step}
                        onChange={onChange}
                        disabled={
                            appearanceProps.disabled ||
                            stepControlsProps?.disabled
                        }
                        ariaLabel={ariaLabel ?? label}
                    >
                        {children}
                    </StepControls>
                </View>
            ) : (
                children
            )}
            {showNumberInput ? (
                duration ? (
                    <ClockDurationNumberInputs
                        {...appearanceProps}
                        variant={variant}
                        value={value}
                        min={min}
                        onChange={onChange}
                        ariaLabel={ariaLabel}
                        numberInputPlacement={numberInputPlacement}
                    />
                ) : (
                    <NumberInput
                        width={getCompanionNumberInputWidth(
                            numberInputPlacement,
                        )}
                        {...appearanceProps}
                        variant={variant}
                        {...numberInput}
                        disabled={appearanceProps.disabled || !onChange}
                        showStepControls
                        ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                    />
                )
            ) : null}
        </View>
    );
};
