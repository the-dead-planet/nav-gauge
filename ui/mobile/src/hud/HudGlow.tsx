import { FC } from "react";
import { Polygon } from "react-native-svg";

export const HudGlow: FC<{
    points: string;
    color: string;
    strokeWidth: number;
}> = ({ points, color, strokeWidth }) => (
    <>
        <Polygon
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 12}
            strokeOpacity={0.08}
            vectorEffect="non-scaling-stroke"
        />
        <Polygon
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 6}
            strokeOpacity={0.15}
            vectorEffect="non-scaling-stroke"
        />
        <Polygon
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 2}
            strokeOpacity={0.3}
            vectorEffect="non-scaling-stroke"
        />
    </>
);
