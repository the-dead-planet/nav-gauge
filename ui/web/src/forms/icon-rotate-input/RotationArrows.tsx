import { FC } from "react";
import { describeArcPath, arrowHead, ARROW_SWEEP, ARROW_GAP } from "@ui";
import styles from './icon-rotate-input.module.css';

interface Props {
    svgSize: number;
    center: number;
    outerRadius: number;
}

export const RotationArrows: FC<Props> = ({
    svgSize,
    center,
    outerRadius,
}) => {
    const arrowRadius = outerRadius - 2;
    const arrowStart1 = 90 + ARROW_GAP / 2;
    const arrowEnd1 = arrowStart1 + ARROW_SWEEP;
    const arrowStart2 = 270 + ARROW_GAP / 2;
    const arrowEnd2 = arrowStart2 + ARROW_SWEEP;

    return (
        <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className={styles['overlay-svg']}
            aria-hidden="true"
        >
            <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="none"
                className={styles['overlay-ring']}
                strokeWidth={1}
                opacity={0.3}
            />
            <path
                d={describeArcPath(center, center, arrowRadius, arrowStart1, arrowEnd1)}
                fill="none"
                className={styles['overlay-arrows']}
                strokeWidth={1.5}
                strokeLinecap="round"
            />
            <path
                d={arrowHead(center, center, arrowRadius, arrowStart1, 'start')}
                fill="none"
                className={styles['overlay-arrows']}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={arrowHead(center, center, arrowRadius, arrowEnd1, 'end')}
                fill="none"
                className={styles['overlay-arrows']}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={describeArcPath(center, center, arrowRadius, arrowStart2, arrowEnd2)}
                fill="none"
                className={styles['overlay-arrows']}
                strokeWidth={1.5}
                strokeLinecap="round"
            />
            <path
                d={arrowHead(center, center, arrowRadius, arrowStart2, 'start')}
                fill="none"
                className={styles['overlay-arrows']}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={arrowHead(center, center, arrowRadius, arrowEnd2, 'end')}
                fill="none"
                className={styles['overlay-arrows']}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
