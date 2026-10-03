import { FC, useState } from "react";
import { StyleSheet, Switch, TextInput, View } from "react-native";
import { Button } from "../../button";
import { Text } from "../../typography";
import { ColorRamp } from "./ColorRamp";

const styles = StyleSheet.create({
    container: { gap: 16, padding: 24 },
    row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 8 },
    input: { borderColor: "#888", borderWidth: 1, color: "#fff", padding: 8 },
});

export const Playground: FC = () => {
    const [value, setValue] = useState("rgb(67, 105, 255)");
    const [label, setLabel] = useState("Color");
    const [opacityLabel, setOpacityLabel] = useState("Opacity");
    const [size, setSize] = useState<"xs" | "sm" | "md">("sm");
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={styles.container}>
            <ColorRamp
                value={value}
                label={label}
                opacityLabel={opacityLabel}
                size={size}
                disabled={disabled}
                onChange={setValue}
            />
            <Text>{value}</Text>
            <TextInput style={styles.input} value={label} onChangeText={setLabel} />
            <TextInput style={styles.input} value={opacityLabel} onChangeText={setOpacityLabel} />
            <View style={styles.row}>
                {(["xs", "sm", "md"] as const).map((nextSize) => (
                    <Button key={nextSize} size="xs" onPress={() => setSize(nextSize)}>{nextSize}</Button>
                ))}
                <Text>Disabled</Text>
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>
        </View>
    );
};
