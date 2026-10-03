import { FC, useState } from "react";
import { ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { Button } from "../../button";
import { Text } from "../../typography";
import { ColorPicker } from "./ColorPicker";

const styles = StyleSheet.create({
    container: { padding: 16, gap: 16 },
    section: { paddingVertical: 12, gap: 8 },
    label: { fontSize: 14, fontWeight: '600' },
    row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 8 },
    input: { borderColor: "#888", borderWidth: 1, color: "#fff", padding: 8 },
});

export const Playground: FC = () => {
    const [value, setValue] = useState('rgba(255, 102, 0, 0.8)');
    const [label, setLabel] = useState("Color");
    const [opacityLabel, setOpacityLabel] = useState("Opacity");
    const [size, setSize] = useState<"xs" | "sm" | "md">("sm");
    const [variant, setVariant] = useState<"fill" | "fill-inverse" | "fill-translucent">("fill-inverse");
    const [disabled, setDisabled] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ColorPicker
                label={label}
                opacityLabel={opacityLabel}
                value={value}
                size={size}
                variant={variant}
                disabled={disabled}
                onChange={setValue}
            />
            <Text style={styles.label}>Current value: {value}</Text>
            <TextInput style={styles.input} value={label} onChangeText={setLabel} />
            <TextInput style={styles.input} value={opacityLabel} onChangeText={setOpacityLabel} />
            <View style={styles.row}>
                {(["xs", "sm", "md"] as const).map((item) => (
                    <Button key={item} size="xs" onPress={() => setSize(item)}>{item}</Button>
                ))}
                {(["fill", "fill-inverse", "fill-translucent"] as const).map((item) => (
                    <Button key={item} size="xs" onPress={() => setVariant(item)}>{item}</Button>
                ))}
                <Text>Disabled</Text>
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>
        </ScrollView>
    );
};
