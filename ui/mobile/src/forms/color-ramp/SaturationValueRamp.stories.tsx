import { FC, useState } from "react";
import { StyleSheet, Switch, TextInput, View } from "react-native";
import { Button } from "../../button";
import { Text } from "../../typography";
import { SaturationValueRamp } from "./SaturationValueRamp";

const styles = StyleSheet.create({
    container: { gap: 16, padding: 24 },
    row: { alignItems: "center", flexDirection: "row", gap: 8 },
    input: { borderColor: "#888", borderWidth: 1, color: "#fff", padding: 8 },
});

export const Playground: FC = () => {
    const [hue, setHue] = useState(210);
    const [saturation, setSaturation] = useState(0.7);
    const [brightness, setBrightness] = useState(0.8);
    const [label, setLabel] = useState("Color");
    const [size, setSize] = useState<"xs" | "sm" | "md">("sm");
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={styles.container}>
            <SaturationValueRamp
                hue={hue}
                saturation={saturation}
                brightness={brightness}
                label={label}
                size={size}
                disabled={disabled}
                onChange={(nextSaturation, nextBrightness) => {
                    setSaturation(nextSaturation);
                    setBrightness(nextBrightness);
                }}
            />
            <Text>{saturation.toFixed(2)}, {brightness.toFixed(2)}</Text>
            <TextInput style={styles.input} value={String(hue)} keyboardType="numeric" onChangeText={(value) => setHue(Number(value) || 0)} />
            <TextInput style={styles.input} value={label} onChangeText={setLabel} />
            <View style={styles.row}>
                {(["xs", "sm", "md"] as const).map((item) => (
                    <Button key={item} size="xs" onPress={() => setSize(item)}>{item}</Button>
                ))}
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>
        </View>
    );
};

export const Gallery: FC = () => (
    <View style={styles.container}>
        {(["xs", "sm", "md"] as const).map((size) => (
            <SaturationValueRamp key={size} hue={210} saturation={0.7} brightness={0.8} size={size} onChange={() => {}} />
        ))}
        <SaturationValueRamp hue={210} saturation={0.7} brightness={0.8} disabled onChange={() => {}} />
    </View>
);
