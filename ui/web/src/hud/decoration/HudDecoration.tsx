import { CSSProperties, FC } from "react";
import {
    DEFAULT_SIZE,
    DEFAULT_COLOR,
    defaultHudDecorationCorners,
    hudDecorationPaths,
    hudDecorationSizes,
    HudDecorationProps,
    DEFAULT_VARIANT,
} from "@ui";
import styles from "./hud-decoration.module.css";

export const HudDecoration: FC<HudDecorationProps> = ({
    children,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    activeGlow = "none",
    corners = defaultHudDecorationCorners,
}) => {
    const { offset, strokeWidth } = hudDecorationSizes[size];

    return (
        <div className={styles.wrapper}>
            {children}
            <svg
                className={styles.decoration}
                style={
                    { "--decoration-offset": `${offset}px` } as CSSProperties
                }
                strokeWidth={strokeWidth}
                data-size={size}
                data-appearance-variant={DEFAULT_VARIANT}
                data-appearance-color={color}
                data-appearance-highlight={color}
                data-glow={activeGlow}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                {corners.map((corner) => (
                    <path
                        key={corner}
                        d={hudDecorationPaths[corner]}
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </svg>
        </div>
    );
};
