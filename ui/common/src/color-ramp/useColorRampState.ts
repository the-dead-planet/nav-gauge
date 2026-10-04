import { useEffect, useRef } from "react";
import { hsvToRgb, parseColor, rgbToHsv, toCssColor } from "../colors";

interface ColorRampState {
    hue: number;
    saturation: number;
    brightness: number;
    opacity: number;
    opaqueColor: string;
    changeSaturationValue: (saturation: number, brightness: number) => void;
    changeHue: (hue: number) => void;
    changeOpacity: (opacity: number) => void;
}

export const useColorRampState = (
    value: string,
    onChange: (value: string) => void,
): ColorRampState => {
    const color = parseColor(value);
    const hsvColor = rgbToHsv(color);
    const hueReference = useRef(hsvColor.h);

    useEffect(() => {
        if (hsvColor.s > 0) {
            hueReference.current = hsvColor.h;
        }
    }, [hsvColor.h, hsvColor.s]);

    const hue = hsvColor.s > 0 ? hsvColor.h : hueReference.current;
    const emitColor = (nextHue: number, saturation: number, brightness: number) => {
        onChange(toCssColor({ ...hsvToRgb({ h: nextHue, s: saturation, v: brightness }), a: color.a }));
    };

    return {
        hue,
        saturation: hsvColor.s,
        brightness: hsvColor.v,
        opacity: color.a,
        opaqueColor: toCssColor({ ...color, a: 1 }),
        changeSaturationValue: (saturation, brightness) => {
            emitColor(hue, saturation, brightness);
        },
        changeHue: (nextHue) => {
            hueReference.current = nextHue;
            emitColor(nextHue, hsvColor.s, hsvColor.v);
        },
        changeOpacity: (opacity) => {
            onChange(toCssColor({ ...color, a: opacity }));
        },
    };
};
