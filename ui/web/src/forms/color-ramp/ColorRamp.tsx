import { FC } from "react";
import { ColorRampProps, DEFAULT_SIZE, useColorRampState } from "@ui";
import { HueRamp } from "./HueRamp";
import { OpacityRamp } from "./OpacityRamp";
import { SaturationValueRamp } from "./SaturationValueRamp";
import styles from './color-ramp.module.css';

export const ColorRamp: FC<ColorRampProps> = ({
    value,
    label = 'Color',
    opacityLabel,
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
}) => {
    const ramp = useColorRampState(value, onChange);

    return (
        <div className={`${styles.container} ${styles[`size-${size}`]} ${disabled ? styles.disabled : ''}`}>
            <SaturationValueRamp
                hue={ramp.hue}
                saturation={ramp.saturation}
                brightness={ramp.brightness}
                label={label}
                size={size}
                disabled={disabled}
                onChange={ramp.changeSaturationValue}
            />
            <HueRamp value={ramp.hue} label={label} size={size} disabled={disabled} onChange={ramp.changeHue} />
            <OpacityRamp
                color={ramp.opaqueColor}
                value={ramp.opacity}
                label={opacityLabel ?? `${label} opacity`}
                size={size}
                disabled={disabled}
                onChange={ramp.changeOpacity}
            />
        </div>
    );
};
