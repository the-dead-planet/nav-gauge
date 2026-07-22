import { FC } from "react";
import { Line } from "react-native-svg";
import { TICK_COUNT, STEP_DEG, MAJOR_TICK_INTERVAL, clockAngleToRadians, useTheme, ColorVariant, SurfaceFillVariant } from "@ui";

const tickMajorLengths: Record<string, number> = { xs: 3.5, sm: 6, md: 7 };
const tickMinorLengths: Record<string, number> = { xs: 2, sm: 3.5, md: 4 };

interface Props {
    center: number;
    outerRadius: number;
    size: string;
    strokeWidth: number;
    min: number;
    max: number;
    color: ColorVariant;
    activeHighlight: ColorVariant;
    variant: SurfaceFillVariant;
    isLight: boolean;
}

export const ClockTicks: FC<Props> = ({
    center,
    outerRadius,
    size,
    strokeWidth,
    min,
    max,
    color,
    activeHighlight,
    variant,
    isLight,
}) => {
    const theme = useTheme();

    const useDark = variant === 'fill';
    const useRegular = variant === 'fill-inverse';

    const defaultTickColor = theme.color(color, 500, isLight ? 0.35 : 0.5);
    const tickColor = useDark ? theme.color(color, 800) : defaultTickColor;
    const tickMajorColor = useDark ? theme.color(color, 800) : theme.color(activeHighlight, isLight ? 500 : 300);
    const tickMinorOpacity = (useDark || useRegular) ? 0.5 : (isLight ? 0.3 : 0.5);

    const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
        const angleDeg = i * STEP_DEG;
        const isMajor = i % MAJOR_TICK_INTERVAL === 0;
        const tickLen = isMajor ? tickMajorLengths[size] : tickMinorLengths[size];
        const tickWidth = isMajor ? strokeWidth : strokeWidth * 0.6;
        const rad = clockAngleToRadians(angleDeg);
        const innerR = outerRadius - tickLen;

        return {
            x1: center + Math.cos(rad) * innerR,
            y1: center + Math.sin(rad) * innerR,
            x2: center + Math.cos(rad) * outerRadius,
            y2: center + Math.sin(rad) * outerRadius,
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
                    stroke={tick.isMajor ? tickMajorColor : tickColor}
                    strokeWidth={tick.width}
                    strokeLinecap="round"
                    opacity={tick.isMajor ? 1 : tickMinorOpacity}
                />
            ))}
        </>
    );
};
