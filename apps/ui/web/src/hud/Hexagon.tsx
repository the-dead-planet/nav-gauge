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
    const points = shape === "pointy-top" ? POINTY_TOP : FLAT_TOP;
    const filterId = useId();
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
                    [styles.interactive]: interactive,
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
                viewBox="0 0 100 100"
                className={styles.svg}
                {...props}
            >
                <defs>
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
            </svg>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
