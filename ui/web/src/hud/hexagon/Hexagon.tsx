import { ComponentProps, CSSProperties, FC, useId } from "react";
import { DEFAULT_SIZE, DEFAULT_SURFACE_VARIANT, HexagonProps, useTheme } from "@ui";
import classNames from "classnames";
import styles from "./hexagon.module.css";

interface Props {
    className?: string;
    style?: CSSProperties;
}

const POINTY_TOP = "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25";
const FLAT_TOP = "100,50 75,93.3 25,93.3 0,50 25,6.7 75,6.7";

export const Hexagon: FC<HexagonProps & Props & ComponentProps<'div'>> = ({
    shape = "pointy-top",
    strokeWidth = 2,
    interactive = false,
    activeGlow = "none",
    color = 'neutral',
    highlightColor,
    size = DEFAULT_SIZE,
    variant = DEFAULT_SURFACE_VARIANT,
    highlighted = false,
    disabled = false,
    onClick,
    className,
    style,
    children,
    ...props
}) => {
    const theme = useTheme();
    const effects = theme.resolveAppearance(
        variant,
        color,
        highlightColor || color,
        'default',
    ).effects;
    const isPointy = shape === "pointy-top";
    const points = isPointy ? POINTY_TOP : FLAT_TOP;
    const viewBox = isPointy ? "6.7 0 86.6 100" : "0 6.7 100 86.6";
    const filterId = useId();
    const insetRecessGradientId = useId();
    const insetClipPathId = useId();
    const insetShadowPoints = isPointy
        ? '93.3,25 50,0 6.7,25 6.7,75'
        : '75,6.7 25,6.7 0,50 25,93.3';
    const insetHighlightPoints = isPointy
        ? '93.3,25 93.3,75 50,100 6.7,75'
        : '75,6.7 100,50 75,93.3 25,93.3';
    const maskPoints = isPointy
        ? '50,0 100,25 100,75 50,100 0,75 0,25'
        : '100,50 75,100 25,100 0,50 25,0 75,0';
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${maskPoints}" fill="white"/></svg>`)}")`;

    return (
        <div
            onClick={disabled ? undefined : onClick}
            data-appearance-variant={variant}
            data-appearance-color={color}
            data-appearance-highlight={highlightColor || color}
            aria-disabled={!disabled || !(interactive || onClick) ? undefined : true}
            className={classNames(
                styles.hexagon,
                styles[shape],
                size && styles[`size-${size}`],
                {
                    [styles['highlighted']]: highlighted && !disabled,
                    [styles['disabled']]: disabled,
                    [styles['interactive']]: !disabled && (interactive || onClick),
                    [styles[`glow-style-${activeGlow}`]]: !disabled && interactive,
                    [styles['depth-inset']]: effects.depth === 'inset',
                },
                className
            )}
            style={{
                ...style,
                "--hex-filter": `url(#${filterId})`,
            } as CSSProperties}
            {...props}
        >
            {effects.backdropBlur > 0 ? (
                <div
                    className={styles.backdrop}
                    style={{
                        maskImage: backdropMask,
                        WebkitMaskImage: backdropMask,
                        backdropFilter: `blur(${effects.backdropBlur}px)`,
                    }}
                />
            ) : null}
            <svg
                viewBox={viewBox}
                className={styles.svg}
            >
                <defs>
                    <clipPath id={insetClipPathId}>
                        <polygon points={points} />
                    </clipPath>
                    <radialGradient id={insetRecessGradientId}>
                        <stop offset="0" className={styles['inset-recess-center']} />
                        <stop offset=".65" className={styles['inset-recess-center']} />
                        <stop offset="1" className={styles['inset-recess-edge']} />
                    </radialGradient>
                    <filter
                        id={filterId}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="2"
                            result="blur1"
                        />
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="6"
                            result="blur2"
                        />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <polygon
                    points={points}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className={styles['polygon-base']}
                />
                <polygon
                    points={points}
                    fill={`url(#${insetRecessGradientId})`}
                    className={styles['polygon-inset-recess']}
                />
                <polyline
                    points={insetShadowPoints}
                    fill="none"
                    strokeWidth={strokeWidth * 10}
                    clipPath={`url(#${insetClipPathId})`}
                    className={`${styles['polygon-inset-shadow-edges']} ${styles['polygon-inset-edge-fade']}`}
                />
                <polyline
                    points={insetHighlightPoints}
                    fill="none"
                    strokeWidth={strokeWidth * 10}
                    clipPath={`url(#${insetClipPathId})`}
                    className={`${styles['polygon-inset-highlight-edges']} ${styles['polygon-inset-edge-fade']}`}
                />
                <polyline
                    points={insetShadowPoints}
                    fill="none"
                    strokeWidth={strokeWidth * 3}
                    clipPath={`url(#${insetClipPathId})`}
                    className={styles['polygon-inset-shadow-edges']}
                />
                <polyline
                    points={insetHighlightPoints}
                    fill="none"
                    strokeWidth={strokeWidth * 3}
                    clipPath={`url(#${insetClipPathId})`}
                    className={styles['polygon-inset-highlight-edges']}
                />
                <polygon
                    points={points}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className={styles['polygon-glow']}
                />
            </svg>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
