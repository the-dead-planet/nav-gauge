import { FC } from "react";
import { Circle, Line } from "react-native-svg";

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
        <Line
            x1={center}
            y1={center}
            x2={center + pointerX}
            y2={center + pointerY}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
        <Circle
            cx={center}
            cy={center}
            r={centerDotRadius}
            fill="currentColor"
        />
    </>
);
