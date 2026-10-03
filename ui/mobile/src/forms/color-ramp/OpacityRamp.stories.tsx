import { FC, useState } from "react";
import { StyleSheet, Switch, TextInput, View } from "react-native";
import { Button } from "../../button";
import { Text } from "../../typography";
import { OpacityRamp } from "./OpacityRamp";

const styles = StyleSheet.create({
    container: { gap: 16, padding: 24 },
    row: { alignItems: "center", flexDirection: "row", gap: 8 },
    input: { borderColor: "#888", borderWidth: 1, color: "#fff", padding: 8 },
});

export const Playground: FC = () => {
    const [color, setColor] = useState("rgb(67, 105, 255)");
    const [value, setValue] = useState(0.6);
    const [label, setLabel] = useState("Opacity");
    const [size, setSize] = useState<"xs" | "sm" | "md">("sm");
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={styles.container}>
            <OpacityRamp color={color} value={value} label={label} size={size} disabled={disabled} onChange={setValue} />
            <Text>{value}</Text>
            <TextInput style={styles.input} value={color} onChangeText={setColor} />
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
            <OpacityRamp key={size} color="#4369ff" value={0.6} size={size} onChange={() => {}} />
        ))}
        <OpacityRamp color="#4369ff" value={0.6} disabled onChange={() => {}} />
    </View>
);
