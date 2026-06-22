import { ComponentProps, CSSProperties, FC, useId } from "react";
import { HexagonProps, useTheme } from "@ui";
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
    glowStyle = "none",
    color = 'neutral',
    highlightColor,
    size,
    variant,
    themeMode,
    active = false,
    onClick,
    className,
    style,
    children,
    ...props
}) => {
    const theme = useTheme();
    const isPointy = shape === "pointy-top";
    const points = isPointy ? POINTY_TOP : FLAT_TOP;
    const viewBox = isPointy ? "6.7 0 86.6 100" : "0 6.7 100 86.6";
    const filterId = useId();
    const clipPathId = useId();
    const shadowBlurId = useId();
    const effectiveMode = themeMode !== undefined ? themeMode : theme.mode;

    return (
        <div
            onClick={onClick}
            className={classNames(
                styles.hexagon,
                styles[shape],
                variant && styles[`variant-${variant}`],
                color && styles[`color-${color}`],
                styles[`highlight-color-${highlightColor || color}`],
                size && styles[`size-${size}`],
                styles[`mode-${effectiveMode}`],
                {
                    [styles['active']]: active,
                    [styles['interactive']]: interactive || onClick,
                    [styles[`glow-style-${glowStyle}`]]: interactive,
                },
                className
            )}
            style={{
                ...style,
                "--hex-filter": `url(#${filterId})`,
            } as CSSProperties}
            {...props}
        >
            <svg
                viewBox={viewBox}
                className={styles.svg}
            >
                <defs>
                    <clipPath id={clipPathId}>
                        <polygon points={points} />
                    </clipPath>
                    <filter
                        id={shadowBlurId}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur stdDeviation="4" />
                    </filter>
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
