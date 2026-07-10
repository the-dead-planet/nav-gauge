import { FC } from "react";
import { Circle, Line } from "react-native-svg";

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    strokeWidth: number;
    isDragging: boolean;
    centerDotRadius: number;
    pointerColor: string;
    pointerActiveColor: string;
    centerDotFill: string;
}

export const ClockPointer: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    strokeWidth,
    isDragging,
    centerDotRadius,
    pointerColor,
    pointerActiveColor,
    centerDotFill,
}) => (
    <>
        <Line
            x1={center}
            y1={center}
            x2={center + pointerX}
            y2={center + pointerY}
            stroke={isDragging ? pointerActiveColor : pointerColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
        <Circle
            cx={center}
            cy={center}
            r={centerDotRadius}
            fill={centerDotFill}
        />
    </>
);
