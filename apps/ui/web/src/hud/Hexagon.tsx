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

const POINTY_TOP_OVER = "50,-10 103.3,15 103.3,85 50,110 -3.3,85 -3.3,15";
const FLAT_TOP_OVER = "110,50 85,103.3 15,103.3 -10,50 15,-3.3 85,-3.3";

const POINTY_TOP_IN = "50,8 85.3,33 85.3,67 50,92 14.7,67 14.7,33";
const FLAT_TOP_IN = "92,50 67,85.3 33,85.3 8,50 33,14.7 67,14.7";

export const Hexagon: FC<HexagonProps & Props & ComponentProps<'svg'>> = ({
    shape = "pointy-top",
    strokeWidth = 2,
    interactive = false,
    hoverStyle = "glow",
    color,
    highlightColor,
    size,
    variant,
    themeMode,
    className,
    style,
    children,
    ...props
}) => {
    const theme = useTheme();
    const isPointy = shape === "pointy-top";
    const points = isPointy ? POINTY_TOP : FLAT_TOP;
    const overPoints = isPointy ? POINTY_TOP_OVER : FLAT_TOP_OVER;
    const inPoints = isPointy ? POINTY_TOP_IN : FLAT_TOP_IN;
    const viewBox = isPointy ? "6.7 0 86.6 100" : "0 6.7 100 86.6";
    const filterId = useId();
    const clipPathId = useId();
    const shadowBlurId = useId();
    const resolvedMode = themeMode !== undefined ? (themeMode ? 'dark' : 'light') : theme.mode;

    return (
        <div
            className={classNames(
                styles.hexagon,
                styles[shape],
                variant && styles[`variant-${variant}`],
                color && styles[`color-${color}`],
                (highlightColor || color) && styles[`highlight-${highlightColor || color}`],
                size && styles[`size-${size}`],
                styles[`mode-${resolvedMode}`],
                {
                    [styles[`hover-style-${hoverStyle}`]]: interactive,
                },
                className
            )}
            style={{
                ...style,
                "--hex-filter": `url(#${filterId})`,
            } as CSSProperties}
        >
            <svg
                viewBox={viewBox}
                className={styles.svg}
                {...props}
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
                {variant === "inset" ? (
                    <>
                        <g clipPath={`url(#${clipPathId})`}>
                            <polygon
                                points={points}
                                className={styles.insetBg}
                            />
                            <polygon
                                points={overPoints}
                                fill="none"
                                className={styles.insetDark}
                                filter={`url(#${shadowBlurId})`}
                            />
                            <polygon
                                points={inPoints}
                                fill="none"
                                className={styles.insetLight}
                                filter={`url(#${shadowBlurId})`}
                            />
                        </g>
                        <polygon
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                        />
                    </>
                ) : (
                    <>
                        <polygon
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className={styles.polygonBase}
                        />
                        <polygon
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className={styles.polygonGlow}
                        />
                    </>
                )}
            </svg>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
