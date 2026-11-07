import { CSSProperties, FC } from "react";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_VARIANT,
    saturationValueRampHeights,
    SaturationValueRampProps,
    useTheme,
} from "@ui";
import { useSaturationValueRampInteraction } from "./useSaturationValueRampInteraction";
import styles from "./color-ramp.module.css";

export const SaturationValueRamp: FC<SaturationValueRampProps> = ({
    hue,
    saturation,
    brightness,
    label = "Color",
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
}) => {
    const theme = useTheme();
    const interaction = useSaturationValueRampInteraction({
        hue,
        saturation,
        brightness,
        disabled,
        onChange,
    });

    return (
        <div
            {...interaction}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={`${label} saturation and brightness`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(saturation * 100)}
            aria-valuetext={`${Math.round(saturation * 100)}% saturation, ${Math.round(brightness * 100)}% brightness`}
            aria-disabled={disabled}
            data-appearance-mode={theme.mode}
            data-size={size}
            data-appearance-variant={DEFAULT_VARIANT}
            data-appearance-color={DEFAULT_COLOR}
            data-appearance-highlight={DEFAULT_COLOR}
            className={`${styles.control} ${styles.ramp}`}
            style={
                {
                    "--ramp-hue": `hsl(${hue}, 100%, 50%)`,
                    "--ramp-height": `${saturationValueRampHeights[size]}px`,
                } as CSSProperties
            }
        >
            <span
                className={styles.thumb}
                style={{
                    left: `${saturation * 100}%`,
                    top: `${(1 - brightness) * 100}%`,
                }}
            />
        </div>
    );
};
