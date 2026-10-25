import { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { getResizeHandleGripPoints, ResolvedThemeAppearance, ResizeHandleGripProps } from "@ui";

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

export const ResizeHandleGrip: FC<ResizeHandleGripProps & { appearance: ResolvedThemeAppearance }> = ({
    direction = 'horizontal',
    side,
    appearance,
    position,
}) => {
    const gripSide = side ?? (direction === 'horizontal' ? 'right' : 'top');

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
                fill={appearance.surface}
                stroke={appearance.glyphs}
                strokeWidth={2}
                strokeLinejoin="miter"
            />
        </Svg>
    );
};
