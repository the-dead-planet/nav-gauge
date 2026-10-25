import { FC } from "react";
import classNames from "classnames";
import {
    DEFAULT_SIZE,
    DEFAULT_COLOR,
    defaultHudDecorationCorners,
    hudDecorationPaths,
    HudDecorationProps,
} from "@ui";
import styles from "./hud-decoration.module.css";

export const HudDecoration: FC<HudDecorationProps> = ({
    children,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    activeGlow = "none",
    corners = defaultHudDecorationCorners,
}) => (
    <div className={styles.wrapper}>
        {children}
        <svg
            className={classNames(styles.decoration, styles[`size-${size}`])}
            data-appearance-variant="default"
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
