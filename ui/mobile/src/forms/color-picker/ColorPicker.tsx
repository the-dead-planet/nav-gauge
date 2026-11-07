import { FC } from "react";
import { StyleSheet, View } from "react-native";
import {
    ColorPickerProps,
    getColorPickerSwatches,
    useTheme,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
} from "@ui";
import { ColorButton } from "../color-button";
import { ColorInput } from "../color-input";
import { ColorRamp } from "../color-ramp";

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    "swatch-grid": {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
    },
});

export const ColorPicker: FC<ColorPickerProps> = ({
    label = "Color",
    value,
    onChange,
    opacityLabel,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    disabled = false,
}) => {
    const theme = useTheme();
    const swatches = getColorPickerSwatches(theme, value);

    return (
        <View style={styles.container}>
            <ColorRamp
                value={value}
                label={label}
                opacityLabel={opacityLabel}
                size={size}
                disabled={disabled}
                onChange={onChange}
            />
            <ColorInput
                label={label}
                value={value}
                onChange={onChange}
                size={size}
                variant={variant}
                disabled={disabled}
                showColorButton={false}
                showFormatSelect
            />

            <View style={styles["swatch-grid"]}>
                {swatches.map((swatch) => (
                    <ColorButton
                        key={swatch.label}
                        value={swatch.color}
                        label={swatch.label}
                        size={size}
                        selected={swatch.selected}
                        disabled={disabled}
                        onPress={() => onChange(swatch.value)}
                    />
                ))}
            </View>
        </View>
    );
};
