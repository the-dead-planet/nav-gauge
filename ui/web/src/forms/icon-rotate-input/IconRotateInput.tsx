import { ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    IconRotateInputProps,
    getClockGeometry,
    useTheme,
} from "@ui";
import { RotationArrows } from "./RotationArrows";
import { RotateIconWrapper } from "./RotateIconWrapper";
import { RotateA11yInput } from "./RotateA11yInput";
import { useRotationPointer } from "./useRotationPointer";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";
import styles from "./icon-rotate-input.module.css";

export const IconRotateInput: FC<
    IconRotateInputProps & Omit<ComponentProps<"div">, "onChange" | "value">
> = ({
    icon,
    value = 0,
    onChange,
    valueAdjustment = 0,
    themeMode,
    color = DEFAULT_COLOR,
    highlightColor = color,
    glyphsShade,
    highlightGlyphsShade,
    highlighted = false,
    size = DEFAULT_SIZE,
    min = 0,
    max = 360,
    step = 1,
    disabled = false,
    id,
    label,
    showNumberInput = false,
    showStepControls = false,
    numberInputPlacement = "end",
    ariaLabel,
    className,
    style,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const controlSize = theme.sizes.control[size];
    const { svgSize, center, outerRadius } = getClockGeometry(
        controlSize.height,
        "angle",
    );
    const rotation = useRotationPointer({
        value,
        onChange,
        min,
        max,
        step,
        disabled,
    });
    const appearanceProps = {
        themeMode,
        color,
        highlightColor,
        glyphsShade,
        highlightGlyphsShade,
        highlighted,
        disabled: rotation.disabled,
        size,
    };
    const rotateControl = (
        <div
            {...props}
            {...rotation.pointerHandlers}
            className={styles["visual-container"]}
        >
            <RotationArrows
                svgSize={svgSize}
                center={center}
                outerRadius={outerRadius}
            />
            <RotateIconWrapper
                icon={icon}
                iconSize={controlSize.iconSize}
                displayAngle={rotation.displayAngle + valueAdjustment}
            />
        </div>
    );

    return (
        <div
            data-appearance-mode={theme.mode}
            data-appearance-variant="default"
            data-appearance-color={color}
            data-appearance-highlight={highlightColor}
            data-highlighted={highlighted || undefined}
            data-dragging={rotation.dragging || undefined}
            data-disabled={rotation.disabled || undefined}
            data-size={size}
            className={classNames(styles.container, className)}
            style={
                {
                    ...style,
                    "--appearance-default-glyphs-override":
                        glyphsShade === undefined
                            ? undefined
                            : theme.color(color, glyphsShade),
                    "--appearance-hover-focus-glyphs-override":
                        highlightGlyphsShade === undefined
                            ? undefined
                            : theme.color(highlightColor, highlightGlyphsShade),
                    "--appearance-active-pressed-glyphs-override":
                        highlightGlyphsShade === undefined
                            ? undefined
                            : theme.color(highlightColor, highlightGlyphsShade),
                } as CSSProperties
            }
        >
            <RotateA11yInput
                {...appearanceProps}
                id={inputId}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                label={label}
                showValue={!showNumberInput}
                ariaLabel={ariaLabel}
            />
            <div
                className={classNames(
                    styles["control-row"],
                    showNumberInput &&
                        styles[`number-input-${numberInputPlacement}`],
                )}
            >
                {showStepControls ? (
                    <StepControls
                        {...appearanceProps}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        step={step}
                        ariaLabel={ariaLabel ?? label}
                    >
                        {rotateControl}
                    </StepControls>
                ) : (
                    rotateControl
                )}
                {showNumberInput ? (
                    <NumberInput
                        {...appearanceProps}
                        value={value}
                        onChange={(newValue) => onChange?.(newValue)}
                        min={min}
                        max={max}
                        step={step}
                        showStepControls
                        ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                    />
                ) : null}
            </div>
        </div>
    );
};
