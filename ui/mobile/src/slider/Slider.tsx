import { FC, forwardRef, useMemo } from "react";
import { Platform, ViewStyle } from "react-native";
import RNRCSlider from "@react-native-community/slider";
import { SliderProps, useTheme } from "@ui";

const thumbSizes: Record<string, number> = { xs: 12, sm: 14, md: 17 };
const sliderHeights: Record<string, number> = { xs: 16, sm: 22, md: 28 };

function thumbUri(size: number, fill: string, stroke: string): string {
    const half = size / 2;
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="${size - 2}" height="${size - 2}" fill="${fill}" stroke="${stroke}" stroke-width="2" transform="rotate(45 ${half} ${half})"/>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const Slider = forwardRef<any, SliderProps & { style?: ViewStyle }>(({
    color = 'neutral',
    highlightColor: hlColor,
    size = 'md',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    disabled = false,
    style,
}, ref) => {
    const theme = useTheme();
    const highlightColor = hlColor || color;
    const isLight = theme.mode === 'light';
    const thumbSize = thumbSizes[size];

    const trackBg = theme.color(color, 500, isLight ? 0.15 : 0.3);
    const hlTrackColor = theme.color(highlightColor, isLight ? 600 : 300);
    const fillColor = theme.color(color, 800);
    const strokeColor = theme.color(color, 500);
    const thumb = useMemo(() => ({ uri: thumbUri(thumbSize, fillColor, strokeColor) }), [thumbSize, fillColor, strokeColor]);

    const sliderStyle: ViewStyle = {
        height: sliderHeights[size],
        ...style,
    };

    return (
        <RNRCSlider
            ref={ref as any}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={onChange}
            disabled={disabled}
            minimumTrackTintColor={hlTrackColor}
            maximumTrackTintColor={trackBg}
            thumbImage={Platform.OS !== 'android' ? thumb : undefined}
            thumbTintColor={Platform.OS === 'android' ? fillColor : undefined}
            style={sliderStyle}
        />
    );
});

Slider.displayName = 'Slider';
