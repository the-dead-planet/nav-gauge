import { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { getResizeHandleGripPoints, ResolvedThemeAppearance, ResizeHandleGripProps } from "@ui";

const styles = StyleSheet.create({
    grip: {
        position: 'absolute',
    },
    horizontalGrip: {
        left: '50%',
        transform: [{ translateX: -9 }, { translateY: -18 }],
    },
    verticalGrip: {
        top: '50%',
        transform: [{ translateX: -18 }, { translateY: -9 }],
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
            width={isHorizontal ? 18 : 36}
            height={isHorizontal ? 36 : 18}
            viewBox={isHorizontal ? '0 0 8 24' : '0 0 24 8'}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
        >
            <Polygon
                points={getResizeHandleGripPoints(direction, gripSide)}
                fill={appearance.surface}
                stroke={appearance.border.color}
                strokeWidth={appearance.border.width}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="miter"
            />
        </Svg>
    );
};
