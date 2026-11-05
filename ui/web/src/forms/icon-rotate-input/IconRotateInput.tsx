import { ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    IconRotateInputProps,
    getClockGeometry,
    useTheme,
} from "@ui";
import { Label } from "../../design-system/typography";
import { HudSurface } from "../../hud/HudSurface";
import { IconRotateControlRow } from "./IconRotateControlRow";
import { RotationArrows } from "./RotationArrows";
import { RotateIconWrapper } from "./RotateIconWrapper";
import { RotateA11yInput } from "./RotateA11yInput";
import { useRotationPointer } from "./useRotationPointer";
import styles from "./icon-rotate-input.module.css";

export const IconRotateInput: FC<
    IconRotateInputProps & Omit<ComponentProps<"div">, "onChange" | "value">
> = ({
    icon,
    value = 0,
    onChange,
    valueAdjustment = 0,
    color = DEFAULT_COLOR,
    highlightColor = color,
    glyphsShade,
    highlightGlyphsShade,
    highlighted = false,
    variant = DEFAULT_SURFACE_VARIANT,
    size = DEFAULT_SIZE,
    min = 0,
    max = 360,
    step = 1,
    disabled = false,
    id,
    label,
    showNumberInput = false,
    showStepControls = false,
    stepControlsProps,
    numberInputPlacement = "end",
    ariaLabel,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
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
        color,
        highlightColor,
        glyphsShade,
        highlightGlyphsShade,
        highlighted,
        disabled: rotation.disabled,
        size,
    };

    return (
            <div
                data-size={size}
                className={classNames(styles.container, className)}
                style={style}
            >
                {label ? (
                    <Label
                        htmlFor={inputId}
                        color={color}
                        highlightColor={highlightColor}
                        shade={glyphsShade}
                        highlightShade={highlightGlyphsShade}
                        highlighted={highlighted}
                        disabled={rotation.disabled}
                        className={styles.label}
                    >
                        {label}{" "}
                        {!showNumberInput ? <span>{value}°</span> : null}
                    </Label>
                ) : null}
                <IconRotateControlRow
                    {...appearanceProps}
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    step={step}
                    label={label}
                    ariaLabel={ariaLabel}
                    showNumberInput={showNumberInput}
                    showStepControls={showStepControls}
                    stepControlsProps={stepControlsProps}
                    numberInputPlacement={numberInputPlacement}
                >
                    <HudSurface
                        {...props}
                        {...rotation.pointerHandlers}
                        as="div"
                        variant={variant}
                        color={color}
                        highlightColor={highlightColor}
                        highlighted={highlighted || rotation.dragging}
                        disabled={rotation.disabled}
                        size={size}
                        data-dragging={rotation.dragging || undefined}
                        data-depth={
                            theme.appearancePolicies[variant].effects.depth
                        }
                        interactive
                        rectangle
                        className={styles["visual-container"]}
                        style={
                            {
                                width: svgSize,
                                height: svgSize,
                                "--appearance-default-glyphs-override":
                                    glyphsShade === undefined
                                        ? undefined
                                        : theme.color(color, glyphsShade),
                                "--appearance-hover-focus-glyphs-override":
                                    highlightGlyphsShade === undefined
                                        ? undefined
                                        : theme.color(
                                              highlightColor,
                                              highlightGlyphsShade,
                                          ),
                                "--appearance-active-pressed-glyphs-override":
                                    highlightGlyphsShade === undefined
                                        ? undefined
                                        : theme.color(
                                              highlightColor,
                                              highlightGlyphsShade,
                                          ),
                            } as CSSProperties
                        }
                    >
                        <RotateA11yInput
                            id={inputId}
                            min={min}
                            max={max}
                            step={step}
                            value={value}
                            onChange={onChange}
                            disabled={rotation.disabled}
                            label={label}
                            ariaLabel={ariaLabel}
                        />
                        <RotationArrows
                            svgSize={svgSize}
                            center={center}
                            outerRadius={outerRadius}
                        />
                        <RotateIconWrapper
                            icon={icon}
                            iconSize={controlSize.iconSize}
                            displayAngle={
                                rotation.displayAngle + valueAdjustment
                            }
                        />
                    </HudSurface>
                </IconRotateControlRow>
            </div>
    );
};
