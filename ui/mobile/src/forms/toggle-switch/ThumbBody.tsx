import { FC, useId } from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Polygon, Stop } from "react-native-svg";

interface ThumbBodyProps {
    width: number;
    height: number;
    color: string;
    points: string;
    orientation: 'horizontal' | 'vertical';
}

export const ThumbBody: FC<ThumbBodyProps> = ({ width, height, color, points, orientation }) => {
    const gradientId = useId();
    const isHorizontal = orientation === 'horizontal';

    return (
        <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={StyleSheet.absoluteFill}
        >
            <Defs>
                <LinearGradient
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2={isHorizontal ? '0' : '1'}
                    y2={isHorizontal ? '1' : '0'}
                >
                    <Stop offset="0%" stopColor="white" stopOpacity={0.2} />
                    <Stop offset="100%" stopColor="black" stopOpacity={0.2} />
                </LinearGradient>
            </Defs>
            <Polygon points={points} fill={color} />
            <Polygon points={points} fill={`url(#${gradientId})`} />
        </Svg>
    );
};
