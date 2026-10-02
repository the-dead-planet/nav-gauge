import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ColorPickerProps, getThemeColorSwatches, hslToRgb, rgbToHsl, toCssColor, parseColor, useTheme } from "@ui";
import { Slider } from "../slider";
import { ColorButton } from "../color-button";
import { ColorInput } from "../color-input";

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
    const { h, s, l } = rgbToHsl(parsed);
    const swatches = getThemeColorSwatches(theme);

    const handleHsl = (nextH: number, nextS: number, nextL: number) => {
        onChange(toCssColor({ ...hslToRgb({ h: nextH, s: nextS, l: nextL }), a: parsed.a }));
    };

    const handleSwatch = (swatchColor: string) => {
        onChange(toCssColor({ ...parseColor(swatchColor), a: parsed.a }));
    };

    const handleAlpha = (nextAlpha: number) => {
        onChange(toCssColor({ ...parsed, a: nextAlpha }));
    };

    return (
        <View style={styles.container}>
            <ColorInput
                label={label}
                value={value}
                onChange={onChange}
                size={size}
                variant={variant}
                disabled={disabled}
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

            <Slider
                min={0}
                max={360}
                step={1}
                value={h}
                onChange={(nextH) => handleHsl(nextH, s, l)}
                label="Hue"
                size={size}
                variant={variant}
                disabled={disabled}
                showStepControls
                showNumberInput
            />
            <Slider
                min={0}
                max={100}
                step={1}
                value={s}
                onChange={(nextS) => handleHsl(h, nextS, l)}
                label="Saturation"
                size={size}
                variant={variant}
                disabled={disabled}
                showStepControls
                showNumberInput
            />
            <Slider
                min={0}
                max={100}
                step={1}
                value={l}
                onChange={(nextL) => handleHsl(h, s, nextL)}
                label="Lightness"
                size={size}
                variant={variant}
                disabled={disabled}
                showStepControls
                showNumberInput
            />
            <Slider
                min={0}
                max={1}
                step={0.05}
                value={parsed.a}
                onChange={handleAlpha}
                label={opacityLabel}
                size={size}
                variant={variant}
                disabled={disabled}
                showStepControls
                showNumberInput
            />
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
