import { FC } from "react";
import { Line } from "react-native-svg";
import {
    TICK_COUNT,
    STEP_DEG,
    MAJOR_TICK_INTERVAL,
    radialLineCoords,
} from "@ui";

interface Props {
    center: number;
    outerRadius: number;
    strokeWidth: number;
    min: number;
    max: number;
}

export const ClockTicks: FC<Props> = ({
    center,
    outerRadius,
    strokeWidth,
    min,
    max,
}) => {
    const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
        const angleDeg = i * STEP_DEG;
        const isMajor = i % MAJOR_TICK_INTERVAL === 0;
        const tickLen = strokeWidth * (isMajor ? 5 : 2.5);
        const tickWidth = isMajor ? strokeWidth : strokeWidth * 0.6;
        const innerR = outerRadius - tickLen;

        const coordinates = radialLineCoords(
            angleDeg,
            center,
            innerR,
            outerRadius,
        );

        return {
            ...coordinates,
            width: tickWidth,
            isMajor,
            angleDeg,
        };
    }).filter((tick) => tick.angleDeg >= min && tick.angleDeg <= max);

    return (
        <>
            {ticks.map((tick, i) => (
                <Line
                    key={i}
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    stroke="currentColor"
                    strokeWidth={tick.width}
                    strokeLinecap="round"
                    opacity={tick.isMajor ? 1 : 0.5}
                />
            ))}
        </>
    );
};
