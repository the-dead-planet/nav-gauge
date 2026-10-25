import { ComponentProps, CSSProperties, FC, useId } from "react";
import {
    DEFAULT_SIZE,
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    hexagonGeometry,
    HexagonProps,
    useTheme,
} from "@ui";
import classNames from "classnames";
import styles from "./hexagon.module.css";
import surface from "../surface.module.css";
import { useHudInteraction } from "../useHudInteraction";
import { HudSurface } from '../HudSurface';

export const Hexagon: FC<HexagonProps & ComponentProps<"div">> = ({
    shape = "pointy-top",
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
    const { points, viewBox, maskPoints, shadowPoints, highlightPoints } =
        hexagonGeometry[shape];
    const insetRecessGradientId = useId();
    const insetClipPathId = useId();
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${maskPoints}" fill="white"/></svg>`)}")`;

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
            {effects.backdropBlur > 0 ? (
                <div
                    className={styles.backdrop}
                    style={{
                        maskImage: backdropMask,
                        WebkitMaskImage: backdropMask,
                    }}
                    aria-hidden="true"
                />
            ) : null}
            <svg
                viewBox={viewBox}
                className={surface.drawing}
                aria-hidden="true"
            >
                <defs>
                    <clipPath id={insetClipPathId}>
                        <polygon points={points} />
                    </clipPath>
                    <radialGradient id={insetRecessGradientId}>
                        <stop
                            offset="0"
                            className={styles["inset-recess-center"]}
                        />
                        <stop
                            offset=".65"
                            className={styles["inset-recess-center"]}
                        />
                        <stop
                            offset="1"
                            className={styles["inset-recess-edge"]}
                        />
                    </radialGradient>
                </defs>
                <polygon
                    points={points}
                    strokeWidth={strokeWidth ?? 1}
                    className={classNames(styles["polygon-glow"], surface.glow)}
                />
                <polygon
                    points={points}
                    className={classNames(
                        styles["polygon-base"],
                        surface.paint,
                    )}
                />
                {effects.depth === "inset" ? (
                    <>
                        <polygon
                            points={points}
                            fill={`url(#${insetRecessGradientId})`}
                        />
                        <polyline
                            points={shadowPoints}
                            fill="none"
                            strokeWidth={10}
                            clipPath={`url(#${insetClipPathId})`}
                            className={classNames(
                                styles["inset-shadow"],
                                styles.fade,
                            )}
                        />
                        <polyline
                            points={highlightPoints}
                            fill="none"
                            strokeWidth={10}
                            clipPath={`url(#${insetClipPathId})`}
                            className={classNames(
                                styles["inset-highlight"],
                                styles.fade,
                            )}
                        />
                        <polyline
                            points={shadowPoints}
                            fill="none"
                            strokeWidth={3}
                            clipPath={`url(#${insetClipPathId})`}
                            className={styles["inset-shadow"]}
                        />
                        <polyline
                            points={highlightPoints}
                            fill="none"
                            strokeWidth={3}
                            clipPath={`url(#${insetClipPathId})`}
                            className={styles["inset-highlight"]}
                        />
                    </>
                ) : null}
            </svg>
            <div className={styles.content}>{children}</div>
        </HudSurface>
    );
};
