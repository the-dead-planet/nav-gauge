import {
    ColorRampProps,
    hsvToRgb,
    parseColor,
    rgbToHsv,
    toCssColor,
} from "@ui";
import { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { HueRamp } from "./HueRamp";
import { OpacityRamp } from "./OpacityRamp";
import { SaturationValueRamp } from "./SaturationValueRamp";

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
});

export const ColorRamp: FC<ColorRampProps> = ({
    value,
    label = "Color",
    opacityLabel,
    size = "sm",
    disabled = false,
    onChange,
}) => {
    const parsedColor = parseColor(value);
    const hsvColor = rgbToHsv(parsedColor);
    const [hue, setHue] = useState(hsvColor.h);

    useEffect(() => {
        if (hsvColor.s > 0) {
            setHue(hsvColor.h);
        }
    }, [hsvColor.h, hsvColor.s]);

    const emitColor = (
        nextHue: number,
        saturation: number,
        brightness: number,
    ) => {
        onChange(
            toCssColor({
                ...hsvToRgb({ h: nextHue, s: saturation, v: brightness }),
                a: parsedColor.a,
            }),
        );
    };

    return (
        <View style={styles.container}>
            <SaturationValueRamp
                hue={hue}
                saturation={hsvColor.s}
                brightness={hsvColor.v}
                label={label}
                size={size}
                disabled={disabled}
                onChange={(saturation, brightness) =>
                    emitColor(hue, saturation, brightness)
                }
            />
            <HueRamp
                value={hue}
                label={label}
                size={size}
                disabled={disabled}
                onChange={(nextHue) => {
                    setHue(nextHue);
                    emitColor(nextHue, hsvColor.s, hsvColor.v);
                }}
            />
            <OpacityRamp
                color={toCssColor({ ...parsedColor, a: 1 })}
                value={parsedColor.a}
                label={opacityLabel ?? `${label} opacity`}
                size={size}
                disabled={disabled}
                onChange={(alpha) => onChange(toCssColor({ ...parsedColor, a: alpha }))}
            />
        </View>
    );
};
