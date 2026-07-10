import { FC } from "react";
import { Circle, Path } from "react-native-svg";
import { describeArc } from "@ui";

interface Props {
    center: number;
    outerRadius: number;
    strokeWidth: number;
    min: number;
    max: number;
    dialColor: string;
    isFullCircle?: boolean;
}

export const ClockDial: FC<Props> = ({
    center,
    outerRadius,
    strokeWidth,
    min,
    max,
    dialColor,
    isFullCircle = false,
}) => {
    if (isFullCircle) {
        return (
            <Circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="none"
                stroke={dialColor}
                strokeWidth={strokeWidth}
            />
        );
    }

    return (
        <Path
            d={describeArc(center, center, outerRadius, min, max)}
            fill="none"
            stroke={dialColor}
            strokeWidth={strokeWidth}
        />
    );
};
