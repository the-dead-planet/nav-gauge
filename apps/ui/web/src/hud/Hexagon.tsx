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
    const insetFilterLightId = useId();
    const insetFilterDarkId = useId();
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
                "--inset-filter-light": `url(#${insetFilterLightId})`,
                "--inset-filter-dark": `url(#${insetFilterDarkId})`,
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
                    <filter
                        id={insetFilterLightId}
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                    >
                        <feOffset dx="4" dy="4" in="SourceAlpha" result="off1"/>
                        <feGaussianBlur stdDeviation="3" in="off1" result="blur1"/>
                        <feComposite operator="out" in="blur1" in2="SourceAlpha" result="shadow1"/>
                        <feFlood flood-color="black" flood-opacity="0.18" result="color1"/>
                        <feComposite operator="in" in="color1" in2="shadow1" result="darkshadow"/>

                        <feOffset dx="-2" dy="-2" in="SourceAlpha" result="off2"/>
                        <feGaussianBlur stdDeviation="2" in="off2" result="blur2"/>
                        <feComposite operator="out" in="blur2" in2="SourceAlpha" result="shadow2"/>
                        <feFlood flood-color="white" flood-opacity="0.35" result="color2"/>
                        <feComposite operator="in" in="color2" in2="shadow2" result="lightshadow"/>

                        <feMerge>
                            <feMergeNode in="SourceGraphic"/>
                            <feMergeNode in="darkshadow"/>
                            <feMergeNode in="lightshadow"/>
                        </feMerge>
                    </filter>
                    <filter
                        id={insetFilterDarkId}
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                    >
                        <feOffset dx="4" dy="4" in="SourceAlpha" result="off1"/>
                        <feGaussianBlur stdDeviation="3" in="off1" result="blur1"/>
                        <feComposite operator="out" in="blur1" in2="SourceAlpha" result="shadow1"/>
                        <feFlood flood-color="black" flood-opacity="0.80" result="color1"/>
                        <feComposite operator="in" in="color1" in2="shadow1" result="darkshadow"/>

                        <feOffset dx="-2" dy="-2" in="SourceAlpha" result="off2"/>
                        <feGaussianBlur stdDeviation="2" in="off2" result="blur2"/>
                        <feComposite operator="out" in="blur2" in2="SourceAlpha" result="shadow2"/>
                        <feFlood flood-color="white" flood-opacity="0.08" result="color2"/>
                        <feComposite operator="in" in="color2" in2="shadow2" result="lightshadow"/>

                        <feMerge>
                            <feMergeNode in="SourceGraphic"/>
                            <feMergeNode in="darkshadow"/>
                            <feMergeNode in="lightshadow"/>
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
