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
    variant: SurfaceFillVariant;
    isLight: boolean;
}

export const ClockThumb: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    thumbRadius,
    strokeWidth,
    color,
    variant,
    isLight,
}) => {
    const theme = useTheme();
    const useDark = variant === 'fill';
    const fillContentColor = theme.color(color, isLight ? 100 : (color === 'neutral' ? 800 : 900));
    const thumbFill = useDark ? theme.color(color, 500) : fillContentColor;
    const thumbStroke = useDark ? fillContentColor : theme.color(color, 500);

    return (
        <Circle
            cx={center + pointerX}
            cy={center + pointerY}
            r={thumbRadius}
            fill={thumbFill}
            stroke={thumbStroke}
            strokeWidth={strokeWidth}
        />
    );
};
