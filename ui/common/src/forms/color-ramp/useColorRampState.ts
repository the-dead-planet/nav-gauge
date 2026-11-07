import { useEffect, useRef, useState } from "react";
import {
    hsvToRgb,
    parseColor,
    rgbToHsv,
    toCssColor,
} from "../../design-system/colors";

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
    const [hueIntent, setHueIntent] = useState(hsvColor.h);
    const emittedColorReference = useRef<string | null>(null);
    const serializedColor = toCssColor(color);
    const isEmittedColor = serializedColor === emittedColorReference.current;

    useEffect(() => {
        if (!isEmittedColor) {
            if (hsvColor.s > 0) {
                setHueIntent(hsvColor.h);
            }
            emittedColorReference.current = null;
        }
    }, [hsvColor.h, hsvColor.s, isEmittedColor]);

    const hue = isEmittedColor || hsvColor.s === 0 ? hueIntent : hsvColor.h;
    const emitValue = (value: string) => {
        emittedColorReference.current = value;
        onChange(value);
    };
    const emitColor = (
        nextHue: number,
        saturation: number,
        brightness: number,
    ) => {
        setHueIntent(nextHue);
        emitValue(
            toCssColor({
                ...hsvToRgb({ h: nextHue, s: saturation, v: brightness }),
                a: color.a,
            }),
        );
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
            emitColor(nextHue, hsvColor.s, hsvColor.v);
        },
        changeOpacity: (opacity) => {
            emitValue(toCssColor({ ...color, a: opacity }));
        },
    };
};
