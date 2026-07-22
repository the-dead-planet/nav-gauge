import { FC } from "react";
import { describeArc } from "@ui";
import styles from './clock-input.module.css';

interface Props {
    center: number;
    outerRadius: number;
    strokeWidth: number;
    min: number;
    max: number;
    isFullCircle?: boolean;
}

export const ClockDial: FC<Props> = ({
    center,
    outerRadius,
    strokeWidth,
    min,
    max,
    isFullCircle = false,
}) => {
    if (isFullCircle) {
        return (
            <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="none"
                className={styles.dial}
                strokeWidth={strokeWidth}
            />
        );
    }

    return (
        <path
            d={describeArc(center, center, outerRadius, min, max)}
            fill="none"
            className={styles.dial}
            strokeWidth={strokeWidth}
        />
    );
};
