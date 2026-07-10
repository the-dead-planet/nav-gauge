import { FC } from "react";
import { Circle } from "react-native-svg";

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    thumbRadius: number;
    isDragging: boolean;
    strokeWidth: number;
    thumbFill: string;
    thumbStroke: string;
    thumbFillActive: string;
    thumbStrokeActive: string;
}

export const ClockThumb: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    thumbRadius,
    isDragging,
    strokeWidth,
    thumbFill,
    thumbStroke,
    thumbFillActive,
    thumbStrokeActive,
}) => (
    <Circle
        cx={center + pointerX}
        cy={center + pointerY}
        r={thumbRadius}
        fill={isDragging ? thumbFillActive : thumbFill}
        stroke={isDragging ? thumbStrokeActive : thumbStroke}
        strokeWidth={strokeWidth}
    />
);
