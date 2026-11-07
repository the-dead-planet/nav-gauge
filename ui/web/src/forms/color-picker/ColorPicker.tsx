import { FC } from "react";
import {
    ColorPickerProps,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getColorPickerSwatches,
    useTheme,
} from "@ui";
import { ColorButton } from "../color-button";
import { ColorInput } from "../color-input";
import { ColorRamp } from "../color-ramp";
import styles from "./color-picker.module.css";

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

            <div className={styles["swatch-grid"]}>
                {swatches.map((swatch) => (
                    <ColorButton
                        key={swatch.label}
                        value={swatch.color}
                        label={swatch.label}
                        size={size}
                        selected={swatch.selected}
                        disabled={disabled}
                        onClick={() => onChange(swatch.value)}
                    />
                ))}
            </div>
        </div>
    );
};
