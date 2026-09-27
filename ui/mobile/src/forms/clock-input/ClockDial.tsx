import { FC } from "react";
import { Circle, Path } from "react-native-svg";
import { describeArc, useTheme, ColorVariant, SurfaceFillVariant } from "@ui";
import { TRANSLUCENT_OPACITY } from "../../tinkers";

interface Props {
    center: number;
    outerRadius: number;
    strokeWidth: number;
    min: number;
    max: number;
    color: ColorVariant;
    variant: SurfaceFillVariant;
    isFullCircle?: boolean;
}

export const ClockDial: FC<Props> = ({
    center,
    outerRadius,
    strokeWidth,
    min,
    max,
    color,
    variant,
    isFullCircle = false,
}) => {
    const theme = useTheme();

    const useDark = variant === 'fill';

    const defaultDialColor = theme.color(color, 500, theme.isLight ? 0.25 : 0.35);
    const dialColor = useDark
        ? theme.color(color, theme.isLight ? 100 : (color === 'neutral' ? 800 : 900))
        : variant === 'fill-inverse' ? theme.color(color, 500) : defaultDialColor;

    const bgCircleFill = variant === 'fill'
        ? theme.color(color, 500)
        : variant === 'fill-inverse'
            ? theme.color(color, theme.isLight ? 100 : (color === 'neutral' ? 800 : 900))
            : theme.color(color, 500, TRANSLUCENT_OPACITY);

    return (
        <>
            {isFullCircle && (
                <Circle
                    cx={center}
                    cy={center}
                    r={outerRadius + strokeWidth}
                    fill={bgCircleFill}
                />
            )}
            {isFullCircle ? (
                <Circle
                    cx={center}
                    cy={center}
                    r={outerRadius}
                    fill="none"
                    stroke={dialColor}
                    strokeWidth={strokeWidth}
                />
            ) : (
                <Path
                    d={describeArc(center, center, outerRadius, min, max)}
                    fill="none"
                    stroke={dialColor}
                    strokeWidth={strokeWidth}
                />
            )}
        </>
    );
};
