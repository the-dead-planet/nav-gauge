import { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { getResizeHandleGripPoints, ResizeHandleGripProps, useTheme } from "@ui";

const styles = StyleSheet.create({
    grip: {
        position: 'absolute',
    },
    horizontalGrip: {
        left: 6,
        transform: [{ translateY: -12 }],
    },
    verticalGrip: {
        top: 6,
        transform: [{ translateX: -12 }],
    },
});

export const ResizeHandleGrip: FC<ResizeHandleGripProps> = ({
    direction = 'horizontal',
    side,
    color = 'neutral',
    isDragging,
    position,
}) => {
    const theme = useTheme();
    const gripSide = side ?? (direction === 'horizontal' ? 'right' : 'top');

    const gripFill = isDragging
        ? theme.color('secondary', theme.isLight ? 200 : 900, 0.8)
        : theme.color(color, theme.isLight ? 200 : 900, 0.8);
    const gripColor = isDragging
        ? theme.color('secondary')
        : theme.color(color, theme.isLight ? 500 : 600, 0.5);
    const isHorizontal = direction === 'horizontal';

    return (
        <Svg
            key={position}
            style={[
                styles.grip,
                isHorizontal ? styles.horizontalGrip : styles.verticalGrip,
                isHorizontal ? { top: `${position}%` } : { left: `${position}%` },
            ]}
            width={isHorizontal ? 12 : 24}
            height={isHorizontal ? 24 : 12}
            viewBox={isHorizontal ? '0 0 8 24' : '0 0 24 8'}
            pointerEvents="none"
        >
            <Polygon
                points={getResizeHandleGripPoints(direction, gripSide)}
                fill={gripFill}
                stroke={gripColor}
                strokeWidth={2}
                strokeLinejoin="miter"
            />
        </Svg>
    );
};
