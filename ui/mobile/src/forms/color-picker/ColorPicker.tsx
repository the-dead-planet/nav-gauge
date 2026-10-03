import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ColorPickerProps, getThemeColorSwatches, toCssColor, parseColor, useTheme } from "@ui";
import { ColorButton } from "../color-button";
import { ColorInput } from "../color-input";
import { ColorRamp } from "../color-ramp";

export const ColorPicker: FC<ColorPickerProps> = ({
    label = 'Color',
    value,
    onChange,
    opacityLabel,
    size = 'sm',
    variant = 'fill-inverse',
    disabled = false,
}) => {
    const theme = useTheme();
    const parsed = parseColor(value);
    const swatches = getThemeColorSwatches(theme);

    const handleSwatch = (swatchColor: string) => {
        onChange(toCssColor({ ...parseColor(swatchColor), a: parsed.a }));
    };

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

            <View style={styles['swatch-grid']}>
                {swatches.map((swatch) => (
                    <ColorButton
                        key={swatch.label}
                        value={swatch.color}
                        label={swatch.label}
                        size={size}
                        selected={value === swatch.color}
                        disabled={disabled}
                        onPress={() => handleSwatch(swatch.color)}
                    />
                ))}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    'swatch-grid': {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
});
