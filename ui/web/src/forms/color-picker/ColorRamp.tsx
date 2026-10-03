import { FC, useEffect, useState } from "react";
import { ColorRampProps, hsvToRgb, parseColor, rgbToHsv, toCssColor } from "@ui";
import { HueRamp } from "./HueRamp";
import { OpacityRamp } from "./OpacityRamp";
import { SaturationValueRamp } from "./SaturationValueRamp";
import styles from './color-ramp.module.css';

export const ColorRamp: FC<ColorRampProps> = ({
    value,
    label = 'Color',
    opacityLabel,
    size = 'sm',
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

    const emitColor = (h: number, s: number, v: number) => {
        onChange(toCssColor({ ...hsvToRgb({ h, s, v }), a: parsedColor.a }));
    };

    return (
        <div className={`${styles.container} ${styles[`size-${size}`]} ${disabled ? styles.disabled : ''}`}>
            <SaturationValueRamp
                hue={hue}
                saturation={hsvColor.s}
                brightness={hsvColor.v}
                label={label}
                size={size}
                disabled={disabled}
                onChange={(saturation, brightness) => emitColor(hue, saturation, brightness)}
            />
            <HueRamp value={hue} label={label} size={size} disabled={disabled} onChange={(nextHue) => {
                setHue(nextHue);
                emitColor(nextHue, hsvColor.s, hsvColor.v);
            }} />
            <OpacityRamp
                color={toCssColor({ ...parsedColor, a: 1 })}
                value={parsedColor.a}
                label={opacityLabel ?? `${label} opacity`}
                size={size}
                disabled={disabled}
                onChange={(alpha) => onChange(toCssColor({ ...parsedColor, a: alpha }))}
            />
        </div>
    );
};
