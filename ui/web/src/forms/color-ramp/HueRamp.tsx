import { CSSProperties, FC } from "react";
import {
    colorRampThumbSizes,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    HueRampProps,
    sliderRampHeights,
    useTheme,
} from "@ui";
import styles from "./color-ramp.module.css";

export const HueRamp: FC<HueRampProps> = ({
    value,
    label = "Color",
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
}) => {
    const theme = useTheme();
    return (
        <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={value}
            disabled={disabled}
            aria-label={`${label} hue`}
            data-appearance-mode={theme.mode}
            data-appearance-variant="default"
            data-appearance-color={DEFAULT_COLOR}
            data-appearance-highlight={DEFAULT_COLOR}
            className={`${styles.control} ${styles["linear-ramp"]} ${styles.hue}`}
            style={
                {
                    "--thumb-size": `${colorRampThumbSizes[size]}px`,
                    "--ramp-height": `${sliderRampHeights[size]}px`,
                } as CSSProperties
            }
            onChange={(event) => onChange(Number(event.target.value))}
        />
    );
};
