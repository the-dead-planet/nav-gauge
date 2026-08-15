import { FC } from "react";
import Svg, { Circle, G, Path } from "react-native-svg";
import { describeArcPath, arrowHead, ARROW_SWEEP, ARROW_GAP } from "@ui";

interface Props {
    svgSize: number;
    center: number;
    outerRadius: number;
    ringStroke: string;
    arrowStroke: string;
}

export const RotationArrows: FC<Props> = ({
    svgSize,
    center,
    outerRadius,
    ringStroke,
    arrowStroke,
}) => {
    const arrowRadius = outerRadius - 2;
    const arrowStart1 = 90 + ARROW_GAP / 2;
    const arrowEnd1 = arrowStart1 + ARROW_SWEEP;
    const arrowStart2 = 270 + ARROW_GAP / 2;
    const arrowEnd2 = arrowStart2 + ARROW_SWEEP;

    return (
        <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <G>
                <Circle
                    cx={center}
                    cy={center}
                    r={outerRadius}
                    fill="none"
                    stroke={ringStroke}
                    strokeWidth={1}
                />
                <Path
                    d={describeArcPath(center, center, arrowRadius, arrowStart1, arrowEnd1)}
                    fill="none"
                    stroke={arrowStroke}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                />
                <Path
                    d={arrowHead(center, center, arrowRadius, arrowStart1, 'start')}
                    fill="none"
                    stroke={arrowStroke}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d={arrowHead(center, center, arrowRadius, arrowEnd1, 'end')}
                    fill="none"
                    stroke={arrowStroke}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d={describeArcPath(center, center, arrowRadius, arrowStart2, arrowEnd2)}
                    fill="none"
                    stroke={arrowStroke}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                />
                <Path
                    d={arrowHead(center, center, arrowRadius, arrowStart2, 'start')}
                    fill="none"
                    stroke={arrowStroke}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d={arrowHead(center, center, arrowRadius, arrowEnd2, 'end')}
                    fill="none"
                    stroke={arrowStroke}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </G>
        </Svg>
    );
};
