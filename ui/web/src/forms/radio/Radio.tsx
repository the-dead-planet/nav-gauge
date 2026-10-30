import { ChangeEvent, ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    DEFAULT_GLYPH_CORNERS,
    hexagonGeometry,
    RadioProps,
    ThemeContext,
    useTheme,
} from "@ui";
import styles from "./radio.module.css";
import { HexagonSurface } from "../../hud/hexagon/HexagonSurface";

interface Props {
    labelledBy?: string;
}

export const Radio: FC<
    Omit<ComponentProps<"label">, "onChange"> & RadioProps & Props
> = ({
    themeMode,
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
        const theme = useTheme().forMode(themeMode);

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
            <ThemeContext.Provider value={theme}>
                <label
                    onKeyDown={handleKeyDown}
                    htmlFor={effectiveId}
                    data-appearance-mode={theme.mode}
                    data-appearance-variant="default"
                    data-appearance-color={color}
                    data-appearance-highlight={highlightColor}
                    data-highlighted={highlighted}
                    data-disabled={disabled}
                    className={classNames(
                        styles["radio"],
                        styles[`size-${size}`],
                        className,
                    )}
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
                        className={classNames(
                            styles.box,
                            styles[`corners-${corners}`],
                        )}
                        data-appearance-variant={variant}
                        aria-hidden="true"
                    >
                        {corners === "hexagon" ? (
                            <HexagonSurface effects={theme.appearancePolicies[variant].effects} paintClassName={styles.paint} />
                        ) : null}
                        {checked ? (
                            <span className={styles.marker}>
                                {corners === "hexagon" ? (
                                    <svg
                                        viewBox={
                                            hexagonGeometry["flat-top"].viewBox
                                        }
                                        width="100%"
                                        height="100%"
                                        aria-hidden="true"
                                    >
                                        <polygon
                                            points={
                                                hexagonGeometry["flat-top"].points
                                            }
                                        />
                                    </svg>
                                ) : null}
                            </span>
                        ) : null}
                    </span>
                    {children ? (
                        <span className={styles["label"]}>{children}</span>
                    ) : null}
                </label>
            </ThemeContext.Provider>
        );
    };
