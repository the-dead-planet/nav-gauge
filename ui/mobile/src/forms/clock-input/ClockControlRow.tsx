import { FC } from "react";
import { StyleSheet, View } from "react-native";
import {
    ClockControlRowProps,
    DEFAULT_SIZE,
    getClockGeometry,
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
    },
    fullWidth: {
        width: "100%",
    },
    start: { flexDirection: "row-reverse" },
    above: { flexDirection: "column-reverse" },
    below: { flexDirection: "column" },
    end: { flexDirection: "row" },
    numberInput: {
        width: 120,
        minWidth: 120,
    },
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
    showStepControls = false,
    numberInputPlacement = "end",
    children,
    ...appearanceProps
}) => {
    const theme = useTheme();
    const duration = mode === "duration";
    const vertical =
        numberInputPlacement === "above" || numberInputPlacement === "below";
    const controlHeight =
        theme.sizes.control[appearanceProps.size ?? DEFAULT_SIZE].height;
    const { svgSize } = getClockGeometry(controlHeight, mode);

    return (
        <View
            style={[
                styles.row,
                duration && showNumberInput && styles.fullWidth,
                showNumberInput && styles[numberInputPlacement],
            ]}
        >
            {showStepControls ? (
                <View style={{ width: svgSize + controlHeight * 2 + 8 }}>
                    <StepControls
                        color={appearanceProps.color}
                        size={appearanceProps.size}
                        variant={appearanceProps.variant}
                        value={value}
                        min={min}
                        max={duration ? undefined : max}
                        step={step}
                        onChange={onChange}
                        disabled={appearanceProps.disabled}
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
                        value={value}
                        min={min}
                        onChange={onChange}
                        ariaLabel={ariaLabel}
                        numberInputPlacement={numberInputPlacement}
                    />
                ) : (
                    <View
                        style={[
                            styles.numberInput,
                            vertical && styles.fullWidth,
                        ]}
                    >
                        <NumberInput
                            {...appearanceProps}
                            value={value}
                            onChange={(next) => onChange?.(next)}
                            min={min}
                            max={max}
                            step={step}
                            disabled={appearanceProps.disabled || !onChange}
                            showStepControls
                            ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                        />
                    </View>
                )
            ) : null}
        </View>
    );
};
