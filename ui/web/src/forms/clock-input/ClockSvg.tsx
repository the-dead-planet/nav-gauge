import { FC, ReactNode, SVGProps } from "react";
import { PointerCoords } from "@ui";
import { ClockTicks } from "./ClockTicks";
import { ClockPointer } from "./ClockPointer";
import { ClockThumb } from "./ClockThumb";
import styles from "./clock-input.module.css";

interface Props {
    svgSize: number;
    viewBox: string;
    pointerEvents: SVGProps<SVGSVGElement>;
    children: ReactNode;
    center: number;
    outerRadius: number;
    strokeWidth: number;
    hands: PointerCoords[];
    centerDotRadius: number;
    thumbRadius: number;
    min: number;
    max: number;
    thumbIcon?: string;
}

export const ClockSvg: FC<Props> = ({
    svgSize,
    viewBox,
    pointerEvents,
    children,
    center,
    outerRadius,
    strokeWidth,
    hands,
    centerDotRadius,
    thumbRadius,
    min,
    max,
    thumbIcon,
}) => (
    <svg
        width={svgSize}
        height={svgSize}
        viewBox={viewBox}
        className={styles.svg}
        {...pointerEvents}
        aria-hidden="true"
    >
        {children}
        <ClockTicks
            center={center}
            outerRadius={outerRadius}
            strokeWidth={strokeWidth}
            min={min}
            max={max}
        />
        {hands.map((hand, index) => (
            <g key={index}>
                <ClockPointer
                    center={center}
                    pointerX={hand.x}
                    pointerY={hand.y}
                    strokeWidth={strokeWidth}
                    centerDotRadius={centerDotRadius}
                />
                <ClockThumb
                    center={center}
                    pointerX={hand.x}
                    pointerY={hand.y}
                    thumbRadius={thumbRadius}
                    strokeWidth={strokeWidth}
                    icon={thumbIcon}
                />
            </g>
        ))}
    </svg>
);
