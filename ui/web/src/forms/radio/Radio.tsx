import { ChangeEvent, ComponentProps, FC, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    DEFAULT_GLYPH_CORNERS,
    hexagonGeometry,
    RadioProps,
    useTheme,
} from "@ui";
import { HexagonSurface } from "../../hud/hexagon/HexagonSurface";
import { Label } from "../../design-system/typography";
import styles from "./radio.module.css";

interface Props {
    labelledBy?: string;
}

export const Radio: FC<
    Omit<ComponentProps<"label">, "onChange"> & RadioProps & Props
> = ({
    id,
    labelledBy,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    variant = DEFAULT_FILL_VARIANT,
    size = DEFAULT_SIZE,
    corners = DEFAULT_GLYPH_CORNERS,
    checked,
    highlighted = false,
    onChange,
    disabled = false,
    children,
    className,
    style,
    onKeyDown,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...props
}) => {
    const generatedId = useId();
    const effectiveId = id || generatedId;
    const theme = useTheme();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented && e.key === "Enter" && !disabled) {
            e.preventDefault();
            onChange(true);
        }
    };

    return (
        <Label
            color={color}
            highlightColor={highlightColor}
            shade={glyphsShade}
            highlightShade={highlightGlyphsShade}
            highlighted={highlighted}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            htmlFor={effectiveId}
            data-disabled={disabled}
            data-size={size}
            className={classNames(styles["radio"], className)}
            style={style}
            {...props}
        >
            <input
                id={effectiveId}
                type="radio"
                className={styles["input"]}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy ?? ariaLabelledBy}
            />
            <span
                className={classNames(styles.box, styles[`corners-${corners}`])}
                data-appearance-variant={variant}
                aria-hidden="true"
            >
                {corners === "hexagon" ? (
                    <HexagonSurface
                        effects={theme.appearancePolicies[variant].effects}
                        paintClassName={styles.paint}
                    />
                ) : null}
                {checked ? (
                    <span className={styles.marker}>
                        {corners === "hexagon" ? (
                            <svg
                                viewBox={hexagonGeometry["flat-top"].viewBox}
                                width="100%"
                                height="100%"
                                aria-hidden="true"
                            >
                                <polygon
                                    points={hexagonGeometry["flat-top"].points}
                                />
                            </svg>
                        ) : null}
                    </span>
                ) : null}
            </span>
            {children ? (
                <span className={styles["label"]}>{children}</span>
            ) : null}
        </Label>
    );
};
