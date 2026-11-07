import { FC } from "react";
import { HueRampProps } from "@ui";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ColorRampSlider } from "./ColorRampSlider";

export const HueRamp: FC<HueRampProps> = ({ label = "Color", ...props }) => (
    <ColorRampSlider
        {...props}
        label={`${label} hue`}
        max={360}
        step={1}
        accessibilityStep={5}
    >
        <Svg width="100%" height="100%" pointerEvents="none">
            <Defs>
                <LinearGradient id="hue" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#f00" />
                    <Stop offset="0.167" stopColor="#ff0" />
                    <Stop offset="0.333" stopColor="#0f0" />
                    <Stop offset="0.5" stopColor="#0ff" />
                    <Stop offset="0.667" stopColor="#00f" />
                    <Stop offset="0.833" stopColor="#f0f" />
                    <Stop offset="1" stopColor="#f00" />
                </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#hue)" />
        </Svg>
    </ColorRampSlider>
);
