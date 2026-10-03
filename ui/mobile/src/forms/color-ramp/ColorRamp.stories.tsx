import { FC, useState } from "react";
import { Text } from "../../typography";
import { StyleSheet, View } from "react-native";
import { ColorRamp } from "./ColorRamp";
import { HueRamp } from "./HueRamp";
import { OpacityRamp } from "./OpacityRamp";
import { SaturationValueRamp } from "./SaturationValueRamp";

const styles = StyleSheet.create({
    container: {
        gap: 16,
        padding: 24,
    },
});

export const Interactive: FC = () => {
    const [value, setValue] = useState("rgb(67, 105, 255)");
    return (
        <View style={styles.container}>
            <ColorRamp value={value} onChange={setValue} />
            <Text>{value}</Text>
            <ColorRamp value="#888888" size="xs" disabled onChange={() => {}} />
        </View>
    );
};

export const StandaloneRamps: FC = () => {
    const [hue, setHue] = useState(210);
    const [saturation, setSaturation] = useState(0.7);
    const [brightness, setBrightness] = useState(0.9);
    const [opacity, setOpacity] = useState(0.6);

    return (
        <View style={styles.container}>
            <SaturationValueRamp
                hue={hue}
                saturation={saturation}
                brightness={brightness}
                onChange={(nextSaturation, nextBrightness) => {
                    setSaturation(nextSaturation);
                    setBrightness(nextBrightness);
                }}
            />
            <HueRamp value={hue} onChange={setHue} />
            <OpacityRamp
                color={`hsl(${hue}, 100%, 50%)`}
                value={opacity}
                onChange={setOpacity}
            />
            <Text>{`H ${Math.round(hue)} S ${Math.round(saturation * 100)} V ${Math.round(brightness * 100)} A ${Math.round(opacity * 100)}`}</Text>
        </View>
    );
};
