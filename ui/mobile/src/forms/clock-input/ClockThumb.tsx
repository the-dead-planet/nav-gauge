import { FC } from "react";
import { Circle, G, SvgUri } from "react-native-svg";

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    thumbRadius: number;
    strokeWidth: number;
    icon?: string;
    glyphs: string;
}

export const ClockThumb: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    thumbRadius,
    strokeWidth,
    icon,
    glyphs,
}) => (
    <G>
        <Circle
            cx={center + pointerX}
            cy={center + pointerY}
            r={thumbRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
        />
        {icon ? (
            <SvgUri
                uri={icon}
                x={center + pointerX - thumbRadius * 2}
                y={center + pointerY - thumbRadius * 2}
                width={thumbRadius * 4}
                height={thumbRadius * 4}
                color={glyphs}
                fill={glyphs}
            />
        ) : null}
    </G>
);
