import { FC } from "react";
import { ColorPickerProps, getThemeColorSwatches, parseColor, toCssColor, useTheme } from "@ui";
import { ColorButton } from "../color-button";
import { ColorInput } from "../color-input";
import { Slider } from "../slider";
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

    const handleSwatch = (swatchColor: string) => {
        onChange(toCssColor({ ...parseColor(swatchColor), a: parsed.a }));
    };

    const handleColorInput = (color: string) => {
        onChange(toCssColor({ ...parseColor(color), a: parsed.a }));
    };

    const handleAlpha = (nextAlpha: number) => {
        onChange(toCssColor({ ...parsed, a: nextAlpha }));
    };

    return (
        <div className={styles.container}>
            <ColorInput
                label={label}
                value={value}
                onChange={handleColorInput}
                size={size}
                variant={variant}
                disabled={disabled}
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
                        onClick={() => handleSwatch(swatch.color)}
                    />
                ))}
            </div>

            <div className={styles['ramp']}>
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
                    aria-label={label ? `${label} opacity` : 'Opacity'}
                />
            </div>
        </div>
    );
};
