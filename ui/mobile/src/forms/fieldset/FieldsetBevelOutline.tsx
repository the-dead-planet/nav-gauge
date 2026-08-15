import { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { ColorVariant, useTheme } from "@ui";

const styles = StyleSheet.create({
    bevelOutline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    }
});

interface Props {
    containerWidth: number;
    containerHeight: number;
    bevel: number;
    color?: ColorVariant;
}

export const FieldsetBevelOutline: FC<Props> = ({
    containerWidth,
    containerHeight,
    bevel,
    color,
}) => {
    const theme = useTheme();

    const borderColor = color
        ? theme.color(color)
        : theme.isLight
            ? theme.color('grey', 300)
            : theme.color('grey', 700);

    if (containerWidth === 0 || containerHeight === 0) {
        return null
    }

    return (
        <Svg
            viewBox={`0 0 ${containerWidth} ${containerHeight}`}
            style={styles.bevelOutline}
        >
            <Polygon
                points={containerWidth > 0 && containerHeight > 0
                    ? `${bevel},0 ${containerWidth - bevel},0 ${containerWidth},${bevel} ${containerWidth},${containerHeight - bevel} ${containerWidth - bevel},${containerHeight} ${bevel},${containerHeight} 0,${containerHeight - bevel} 0,${bevel}`
                    : ''}
                fill="none"
                stroke={borderColor}
                strokeWidth={1}
            />
        </Svg>
    );
};
