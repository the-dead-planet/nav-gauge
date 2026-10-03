import { FC } from "react";
import { ColorPickerProps, getThemeColorSwatches, parseColor, toCssColor, useTheme } from "@ui";
import { ColorButton } from "../color-button";
import { ColorInput } from "../color-input";
import { ColorRamp } from "../color-ramp";
import styles from './color-picker.module.css';

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

    const handleSwatchChange = (color: string) => {
        onChange(toCssColor({ ...parseColor(color), a: parsed.a }));
    };

    return (
        <div className={styles.container}>
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

            <div className={styles['swatch-grid']}>
                {swatches.map((swatch) => (
                    <ColorButton
                        key={swatch.label}
                        value={swatch.color}
                        label={swatch.label}
                        size={size}
                        selected={value === swatch.color}
                        disabled={disabled}
                        onClick={() => handleSwatchChange(swatch.color)}
                    />
                ))}
            </div>
        </div>
    );
};
