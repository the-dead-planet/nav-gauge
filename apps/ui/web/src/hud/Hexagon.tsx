import { CSSProperties, FC, useId } from "react";
import { HexagonHoverStyle, HexagonProps } from "@ui";
import classNames from "classnames";
import styles from "./hexagon.module.css";

interface Props {
    className?: string;
    style?: CSSProperties;
}

const POINTY_TOP = "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25";
const FLAT_TOP = "100,50 75,93.3 25,93.3 0,50 25,6.7 75,6.7";

const HOVER_STYLE_MAP: Record<HexagonHoverStyle, string> = {
    glow: styles.glow,
    fill: styles.fill,
    "animate-borders": styles["animate-borders"],
};

export const Hexagon: FC<HexagonProps & Props> = ({
    variant = "pointy-top",
    strokeWidth = 2,
    interactive = false,
    hoverStyle = "glow",
    color,
    className,
    style,
    children
}) => {
    const points = variant === "pointy-top" ? POINTY_TOP : FLAT_TOP;
    const filterId = useId();
    const hexColor = color ? `var(--color-${color})` : undefined;

    return (
        <div
            className={classNames(
                styles.hexagon,
                styles[variant],
                {
                    [styles.interactive]: interactive,
                },
                interactive && HOVER_STYLE_MAP[hoverStyle],
                className
            )}
            style={{ ...style, "--hex-filter": `url(#${filterId})`, color: hexColor } as React.CSSProperties}
        >
            <svg
                viewBox="0 0 100 100"
                className={styles.svg}
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
                    className={styles.polygon}
                />
            </svg>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
