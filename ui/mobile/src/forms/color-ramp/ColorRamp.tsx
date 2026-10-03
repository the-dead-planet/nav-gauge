import { ColorRampProps, useColorRampState } from "@ui";
import { FC } from "react";
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
    const ramp = useColorRampState(value, onChange);

    return (
        <View style={styles.container}>
            <SaturationValueRamp
                hue={ramp.hue}
                saturation={ramp.saturation}
                brightness={ramp.brightness}
                label={label}
                size={size}
                disabled={disabled}
                onChange={ramp.changeSaturationValue}
            />
            <HueRamp
                value={ramp.hue}
                label={label}
                size={size}
                disabled={disabled}
                onChange={ramp.changeHue}
            />
            <OpacityRamp
                color={ramp.opaqueColor}
                value={ramp.opacity}
                label={opacityLabel ?? `${label} opacity`}
                size={size}
                disabled={disabled}
                onChange={ramp.changeOpacity}
            />
        </View>
    );
};
