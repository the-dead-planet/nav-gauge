import { CSSProperties, FC } from "react";
import {
    colorRampThumbSizes,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    OpacityRampProps,
    sliderRampHeights,
    useTheme,
} from "@ui";
import styles from "./color-ramp.module.css";

export const OpacityRamp: FC<OpacityRampProps> = ({
    color,
    value,
    label = "Opacity",
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
}) => {
    const theme = useTheme();
    return (
        <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={value}
            disabled={disabled}
            aria-label={label}
            data-appearance-mode={theme.mode}
            data-appearance-variant="default"
            data-appearance-color={DEFAULT_COLOR}
            data-appearance-highlight={DEFAULT_COLOR}
            className={`${styles.control} ${styles["linear-ramp"]} ${styles.opacity}`}
            style={
                {
                    "--opacity-color": color,
                    "--thumb-size": `${colorRampThumbSizes[size]}px`,
                    "--ramp-height": `${sliderRampHeights[size]}px`,
                } as CSSProperties
            }
            onChange={(event) => onChange(Number(event.target.value))}
        />
    );
};
