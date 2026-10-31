import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    OctagonProps,
    ThemeContext,
    useTheme,
} from "@ui";
import { HudSurface } from "../HudSurface";
import { useHudInteraction } from "../useHudInteraction";
import { OctagonalSurface } from "../octagonal-panel/OctagonalSurface";
import octagonal from "../octagonal-panel/octagonal-panel.module.css";
import styles from "./octagon.module.css";

export const Octagon: FC<OctagonProps & ComponentProps<"div">> = ({
    themeMode,
    color = DEFAULT_COLOR,
    highlightColor = color,
    variant = DEFAULT_SURFACE_VARIANT,
    size = DEFAULT_SIZE,
    strokeWidth,
    interactive = false,
    activeGlow = "none",
    highlighted = false,
    disabled = false,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    role,
    tabIndex,
    style,
    className,
    children,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const interaction = useHudInteraction({
        disabled,
        onClick,
        onKeyDown,
        onKeyUp,
        onBlur,
        role,
        tabIndex,
    });
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        disabled ? "disabled" : highlighted ? "active-pressed" : "default",
    );
    const dimension = theme.sizes.control[size].height;
    return (
        <ThemeContext.Provider value={theme}>
            <HudSurface
                as="div"
                {...props}
                {...interaction}
                variant={variant}
                color={color}
                highlightColor={highlightColor}
                interactive={interactive || !!onClick}
                highlighted={highlighted}
                disabled={disabled}
                activeGlow={activeGlow}
                data-glyphs-glow={appearance.effects.glyphsGlow || undefined}
                className={classNames(
                    styles.octagon,
                    styles[`size-${size}`],
                    octagonal.root,
                    className,
                )}
                style={
                    {
                        ...style,
                        ...(strokeWidth === undefined
                            ? undefined
                            : {
                                  "--appearance-border-width-scale": Math.max(
                                      0,
                                      strokeWidth,
                                  ),
                              }),
                    } as CSSProperties
                }
            >
                <OctagonalSurface
                    width={dimension}
                    height={dimension}
                    size={size}
                    appearance={appearance}
                    strokeWidth={strokeWidth}
                    regular
                    showGlow={activeGlow !== "none"}
                />
                <div className={styles.content}>{children}</div>
            </HudSurface>
        </ThemeContext.Provider>
    );
};
