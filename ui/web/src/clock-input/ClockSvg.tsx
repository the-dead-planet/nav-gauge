import { FC, ReactNode, RefObject } from "react";
import classNames from "classnames";
import { ClockDial } from "./ClockDial";
import { ClockTicks } from "./ClockTicks";
import { ClockPointer } from "./ClockPointer";
import { ClockThumb } from "./ClockThumb";
import styles from './clock-input.module.css';

interface Props {
    svgSize: number;
    viewBox: string;
    svgRef: RefObject<SVGSVGElement | null>;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    isDragging: boolean;
    children: ReactNode;
    center: number;
    outerRadius: number;
    strokeWidth: number;
    pointerX: number;
    pointerY: number;
    centerDotRadius: number;
    thumbRadius: number;
    min: number;
    max: number;
    size: string;
    isFullCircle?: boolean;
}

export const ClockSvg: FC<Props> = ({
    svgSize,
    viewBox,
    svgRef,
    onMouseDown,
    onTouchStart,
    isDragging,
    children,
    center,
    outerRadius,
    strokeWidth,
    pointerX,
    pointerY,
    centerDotRadius,
    thumbRadius,
    min,
    max,
    size,
    isFullCircle,
}) => (
    <svg
        ref={svgRef}
        width={svgSize}
        height={svgSize}
        viewBox={viewBox}
        className={classNames(
            styles.svg,
            { [styles['svg-dragging']]: isDragging }
        )}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        aria-hidden="true"
    >
        {children}
        <ClockDial
            center={center}
            outerRadius={outerRadius}
            strokeWidth={strokeWidth}
            min={min}
            max={max}
            isFullCircle={isFullCircle}
        />
        <ClockTicks
            center={center}
            outerRadius={outerRadius}
            size={size}
            strokeWidth={strokeWidth}
            min={min}
            max={max}
        />
        <ClockPointer
            center={center}
            pointerX={pointerX}
            pointerY={pointerY}
            strokeWidth={strokeWidth}
            isDragging={isDragging}
            centerDotRadius={centerDotRadius}
        />
        <ClockThumb
            center={center}
            pointerX={pointerX}
            pointerY={pointerY}
            thumbRadius={thumbRadius}
            isDragging={isDragging}
            strokeWidth={strokeWidth}
        />
    </svg>
);
