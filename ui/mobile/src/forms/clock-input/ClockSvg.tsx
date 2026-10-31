import { FC } from "react";
import Svg, { Circle, G, Path } from "react-native-svg";
import { PointerCoords, ResolvedThemeAppearance } from "@ui";
import { ClockTicks } from "./ClockTicks";
import { ClockPointer } from "./ClockPointer";
import { ClockThumb } from "./ClockThumb";

interface Props {
    svgSize: number;
    viewBox: string;
    center: number;
    outerRadius: number;
    strokeWidth: number;
    hands: PointerCoords[];
    centerDotRadius: number;
    thumbRadius: number;
    min: number;
    max: number;
    fullCircle: boolean;
    wedge: string;
    appearance: ResolvedThemeAppearance;
    glyphs: string;
    thumbIcon?: string;
}

export const ClockSvg: FC<Props> = ({
    svgSize,
    viewBox,
    center,
    outerRadius,
    strokeWidth,
    hands,
    centerDotRadius,
    thumbRadius,
    min,
    max,
    fullCircle,
    wedge,
    appearance,
    glyphs,
    thumbIcon,
}) => (
    <Svg
        width={svgSize}
        height={svgSize}
        viewBox={viewBox}
        accessible={false}
        color={glyphs}
    >
        {fullCircle ? (
            <Circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill={appearance.surface}
                stroke={appearance.border.color}
                strokeWidth={appearance.border.width}
            />
        ) : (
            <Path
                d={wedge}
                fill={appearance.surface}
                stroke={appearance.border.color}
                strokeWidth={appearance.border.width}
            />
        )}
        <ClockTicks
            center={center}
            outerRadius={outerRadius}
            strokeWidth={strokeWidth}
            min={min}
            max={max}
        />
        {hands.map((hand, index) => (
            <G key={index}>
                <ClockPointer
                    center={center}
                    pointerX={hand.x}
                    pointerY={hand.y}
                    strokeWidth={strokeWidth}
                    centerDotRadius={centerDotRadius}
                />
                <ClockThumb
                    center={center}
                    pointerX={hand.x}
                    pointerY={hand.y}
                    thumbRadius={thumbRadius}
                    strokeWidth={strokeWidth}
                    icon={thumbIcon}
                    glyphs={glyphs}
                />
            </G>
        ))}
    </Svg>
);
