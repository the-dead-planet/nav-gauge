import { FC } from "react";
import { OpacityRampProps } from "@ui";
import Svg, {
    Defs,
    LinearGradient,
    Pattern,
    Rect,
    Stop,
} from "react-native-svg";
import { ColorRampSlider } from "./ColorRampSlider";

export const OpacityRamp: FC<OpacityRampProps> = ({
    color,
    label = "Opacity",
    ...props
}) => (
    <ColorRampSlider
        {...props}
        label={label}
        max={1}
        step={0.01}
        accessibilityStep={0.05}
        valueText={`${Math.round(props.value * 100)}%`}
    >
        <Svg width="100%" height="100%" pointerEvents="none">
            <Defs>
                <Pattern
                    id="checkerboard"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                >
                    <Rect width="8" height="8" fill="#fff" />
                    <Rect width="4" height="4" fill="#bbb" />
                    <Rect x="4" y="4" width="4" height="4" fill="#bbb" />
                </Pattern>
                <LinearGradient id="opacity" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={color} stopOpacity="0" />
                    <Stop offset="1" stopColor={color} stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#checkerboard)" />
            <Rect width="100%" height="100%" fill="url(#opacity)" />
        </Svg>
    </ColorRampSlider>
);
