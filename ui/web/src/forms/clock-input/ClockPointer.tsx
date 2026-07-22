import { FC } from "react";
import classNames from "classnames";
import styles from './clock-input.module.css';

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    strokeWidth: number;
    isDragging: boolean;
    centerDotRadius: number;
}

export const ClockPointer: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    strokeWidth,
    isDragging,
    centerDotRadius,
}) => (
    <>
        <line
            x1={center}
            y1={center}
            x2={center + pointerX}
            y2={center + pointerY}
            className={classNames(
                styles.pointer,
                { [styles['pointer-active']]: isDragging }
            )}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
        <circle
            cx={center}
            cy={center}
            r={centerDotRadius}
            className={styles['center-dot']}
        />
    </>
);
