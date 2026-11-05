import { FC } from "react";
import { StyleSheet, View } from "react-native";
import {
    ClockDurationNumberInputsProps,
    getCompanionNumberInputWidth,
    useClockDurationInput,
} from "@ui";
import { NumberInput } from "../number-input";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        minWidth: 0,
        gap: 8,
    },
    vertical: {
        width: "100%",
    },
    input: {
        flex: 1,
        minWidth: 0,
    },
});

export const ClockDurationNumberInputs: FC<ClockDurationNumberInputsProps> = ({
    value,
    min,
    onChange,
    ariaLabel = "Duration",
    numberInputPlacement = "end",
    ...appearanceProps
}) => {
    const { minutes, seconds, onMinutesChange, onSecondsChange } =
        useClockDurationInput({ value, min, onChange });
    const disabled = appearanceProps.disabled || !onChange;
    const vertical =
        numberInputPlacement === "above" || numberInputPlacement === "below";

    return (
        <View style={[styles.container, vertical && styles.vertical]}>
            <View style={vertical && styles.input}>
                <NumberInput
                    width={getCompanionNumberInputWidth(numberInputPlacement)}
                    {...appearanceProps}
                    value={minutes}
                    onChange={onMinutesChange}
                    min={0}
                    step={1}
                    disabled={disabled}
                    showStepControls
                    ariaLabel={`${ariaLabel} (minutes)`}
                    unit="min"
                />
            </View>
            <View style={vertical && styles.input}>
                <NumberInput
                    width={getCompanionNumberInputWidth(numberInputPlacement)}
                    {...appearanceProps}
                    value={seconds}
                    onChange={onSecondsChange}
                    min={0}
                    max={59}
                    step={1}
                    disabled={disabled}
                    showStepControls
                    ariaLabel={`${ariaLabel} (seconds)`}
                    unit="s"
                />
            </View>
        </View>
    );
};
