import { FC } from "react";
import { StyleSheet, View } from "react-native";
import {
    DEFAULT_SIZE,
    getClockGeometry,
    IconRotateControlRowProps,
    useTheme,
} from "@ui";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";

const styles = StyleSheet.create({
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
    end: {
        flexDirection: "row",
    },
    numberInput: {
        width: 80,
    },
    verticalNumberInput: {
        alignSelf: "stretch",
    },
});

export const IconRotateControlRow: FC<IconRotateControlRowProps> = ({
    value,
    onChange,
    min,
    max,
    step,
    label,
    ariaLabel,
    showNumberInput = false,
    showStepControls = false,
    stepControlsProps,
    numberInputPlacement = "end",
    children,
    ...appearanceProps
}) => {
    const theme = useTheme().forMode(appearanceProps.themeMode);
    const controlHeight =
        theme.sizes.control[appearanceProps.size ?? DEFAULT_SIZE].height;
    const { svgSize } = getClockGeometry(controlHeight, "angle");
    const stepControlHeight =
        theme.sizes.control[
            stepControlsProps?.size ?? appearanceProps.size ?? DEFAULT_SIZE
        ].height;
    const vertical =
        numberInputPlacement === "above" || numberInputPlacement === "below";

    return (
        <View
            style={[
                styles.row,
                showNumberInput && styles[numberInputPlacement],
            ]}
        >
            {showStepControls ? (
                <View style={{ width: svgSize + stepControlHeight * 2 + 8 }}>
                    <StepControls
                        {...appearanceProps}
                        {...stepControlsProps}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        step={step}
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
                        onChange={(next) => onChange?.(next)}
                        min={min}
                        max={max}
                        step={step}
                        disabled={appearanceProps.disabled || !onChange}
                        showStepControls
                        ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                    />
                </View>
            ) : null}
        </View>
    );
};
