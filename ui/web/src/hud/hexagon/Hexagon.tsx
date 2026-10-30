import { ComponentProps, CSSProperties, FC } from "react";
import {
    DEFAULT_SIZE,
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    HexagonProps,
    useTheme,
    DEFAULT_HEXAGON_SHAPE,
} from "@ui";
import classNames from "classnames";
import styles from "./hexagon.module.css";
import { useHudInteraction } from "../useHudInteraction";
import { HudSurface } from "../HudSurface";
import { HexagonSurface } from "./HexagonSurface";

export const Hexagon: FC<HexagonProps & ComponentProps<"div">> = ({
    shape = DEFAULT_HEXAGON_SHAPE,
    strokeWidth,
    interactive = false,
    activeGlow = "none",
    color = DEFAULT_COLOR,
    highlightColor,
    size = DEFAULT_SIZE,
    variant = DEFAULT_SURFACE_VARIANT,
    highlighted = false,
    disabled = false,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    role,
    tabIndex,
    className,
    style,
    children,
    ...props
}) => {
    const theme = useTheme();
    const effects = theme.resolveAppearance(
        variant,
        color,
        highlightColor ?? color,
    ).effects;
    const interaction = useHudInteraction({
        disabled,
        onClick,
        onKeyDown,
        onKeyUp,
        onBlur,
        role,
        tabIndex,
    });

    return (
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
            data-glyphs-glow={effects.glyphsGlow || undefined}
            className={classNames(
                styles.hexagon,
                styles[shape],
                styles[`size-${size}`],
                { [styles["depth-inset"]]: effects.depth === "inset" },
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
            <HexagonSurface
                shape={shape}
                strokeWidth={strokeWidth}
                effects={effects}
            >
                {children}
            </HexagonSurface>
        </HudSurface>
    );
};
