import { FC } from "react";
import classNames from "classnames";
import { TICK_COUNT, STEP_DEG, MAJOR_TICK_INTERVAL, clockAngleToRadians } from "@ui";
import styles from './clock-input.module.css';

const tickMajorLengths: Record<string, number> = { xs: 4, sm: 5, md: 6 };
const tickMinorLengths: Record<string, number> = { xs: 2, sm: 2.5, md: 3 };

interface Props {
    center: number;
    outerRadius: number;
    size: string;
    strokeWidth: number;
    min: number;
    max: number;
}

export const ClockTicks: FC<Props> = ({
    center,
    outerRadius,
    size,
    strokeWidth,
    min,
    max,
}) => (
    <>
        {Array.from({ length: TICK_COUNT }, (_, i) => {
            const angleDeg = i * STEP_DEG;
            if (angleDeg < min || angleDeg > max) {
                return null;
            }
            const isMajor = i % MAJOR_TICK_INTERVAL === 0;
            const tickLen = isMajor
                ? tickMajorLengths[size]
                : tickMinorLengths[size];
            const tickWidth = isMajor ? strokeWidth : strokeWidth * 0.6;
            const rad = clockAngleToRadians(angleDeg);
            const innerR = outerRadius - tickLen;
            const x1 = center + Math.cos(rad) * innerR;
            const y1 = center + Math.sin(rad) * innerR;
            const x2 = center + Math.cos(rad) * outerRadius;
            const y2 = center + Math.sin(rad) * outerRadius;

            return (
                <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={tickWidth}
                    className={classNames(
                        styles.tick,
                        isMajor ? styles['tick-major'] : styles['tick-minor']
                    )}
                    strokeLinecap="round"
                />
            );
        })}
    </>
);
