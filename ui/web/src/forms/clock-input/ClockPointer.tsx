import { FC } from "react";
import styles from "./clock-input.module.css";

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    strokeWidth: number;
    centerDotRadius: number;
}

export const ClockPointer: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    strokeWidth,
    centerDotRadius,
}) => (
    <>
        <line
            x1={center}
            y1={center}
            x2={center + pointerX}
            y2={center + pointerY}
            className={styles.pointer}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
        <circle
            cx={center}
            cy={center}
            r={centerDotRadius}
            className={styles["center-dot"]}
        />
    </>
);
