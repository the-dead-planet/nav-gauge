import { FC } from "react";
import { Circle, Line } from "react-native-svg";
import { useTheme, ColorVariant, SurfaceFillVariant } from "@ui";

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    strokeWidth: number;
    isDragging: boolean;
    centerDotRadius: number;
    color: ColorVariant;
    activeHighlight: ColorVariant;
    variant: SurfaceFillVariant;
    isLight: boolean;
}

export const ClockPointer: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    strokeWidth,
    isDragging,
    centerDotRadius,
    color,
    activeHighlight,
    variant,
    isLight,
}) => {
    const theme = useTheme();

    const useDark = variant === 'fill';
    const useRegular = variant === 'fill-inverse';

    const fillContentColor = theme.color(color, isLight ? 100 : (color === 'neutral' ? 800 : 900));
    const pointerColor = useDark ? fillContentColor : theme.color(activeHighlight, 500);
    const pointerActiveColor = useDark ? fillContentColor : theme.color(activeHighlight, 300);
    const centerDotFill = (useDark || useRegular)
        ? (useDark ? fillContentColor : theme.color(color, 500))
        : theme.color(color, 500);

    return (
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
};
