import { FC } from "react";
import { Circle } from "react-native-svg";
import { useTheme, ColorVariant, SurfaceFillVariant } from "@ui";

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    thumbRadius: number;
    isDragging: boolean;
    strokeWidth: number;
    color: ColorVariant;
    activeHighlight: ColorVariant;
    variant: SurfaceFillVariant;
    isLight: boolean;
}

export const ClockThumb: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    thumbRadius,
    isDragging,
    strokeWidth,
    color,
    activeHighlight,
    variant,
    isLight,
}) => {
    const theme = useTheme();
    const useDark = variant === 'fill';
    const thumbFill = useDark ? theme.color(color, 500) : theme.color(color, 800);
    const thumbStroke = useDark ? theme.color(color, 800) : theme.color(color, 500);
    const thumbFillActive = useDark ? theme.color(color, 100) : theme.color(activeHighlight, 900);
    const thumbStrokeActive = useDark ? theme.color(color, 800) : theme.color(activeHighlight, isLight ? 600 : 300);

    return (
        <Circle
            cx={center + pointerX}
            cy={center + pointerY}
            r={thumbRadius}
            fill={isDragging ? thumbFillActive : thumbFill}
            stroke={isDragging ? thumbStrokeActive : thumbStroke}
            strokeWidth={strokeWidth}
        />
    );
};
