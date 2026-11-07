import { ComponentProps, FC } from "react";
import {
    ColorRampSliderProps,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_VARIANT,
    useTheme,
} from "@ui";
import classNames from "classnames";
import styles from "./color-ramp.module.css";

export const ColorRampSlider: FC<
    ColorRampSliderProps & Pick<ComponentProps<"input">, "className" | "style">
> = ({
    value,
    max,
    step,
    label,
    valueText,
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
    className,
    style,
}) => {
    const theme = useTheme();
    return (
        <input
            type="range"
            min={0}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            aria-label={label}
            aria-valuetext={valueText}
            data-size={size}
            data-appearance-mode={theme.mode}
            data-appearance-variant={DEFAULT_VARIANT}
            data-appearance-color={DEFAULT_COLOR}
            data-appearance-highlight={DEFAULT_COLOR}
            className={classNames(
                styles.control,
                styles["linear-ramp"],
                className,
            )}
            style={style}
            onChange={(event) => onChange(Number(event.currentTarget.value))}
        />
    );
};
