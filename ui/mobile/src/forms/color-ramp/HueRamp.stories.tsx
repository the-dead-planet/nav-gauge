import { FC, useState } from "react";
import { StyleSheet, Switch, TextInput, View } from "react-native";
import { Button } from "../../button";
import { Text } from "../../typography";
import { HueRamp } from "./HueRamp";
import { sizeOptions } from "@ui";

const styles = StyleSheet.create({
    container: { gap: 16, padding: 24 },
    row: { alignItems: "center", flexDirection: "row", gap: 8 },
    input: { borderColor: "#888", borderWidth: 1, color: "#fff", padding: 8 },
});

export const Playground: FC = () => {
    const [value, setValue] = useState(210);
    const [label, setLabel] = useState("Color");
    const [size, setSize] = useState<"xs" | "sm" | "md" | "lg">("sm");
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={styles.container}>
            <HueRamp value={value} label={label} size={size} disabled={disabled} onChange={setValue} />
            <Text>{value}</Text>
            <TextInput style={styles.input} value={label} onChangeText={setLabel} />
            <View style={styles.row}>
                {sizeOptions.map((item) => (
                    <Button key={item} size="xs" onPress={() => setSize(item)}>{item}</Button>
                ))}
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>
        </View>
    );
};

export const Gallery: FC = () => (
    <View style={styles.container}>
        {sizeOptions.map((size) => (
            <HueRamp key={size} value={210} size={size} onChange={() => {}} />
        ))}
        <HueRamp value={210} disabled onChange={() => {}} />
    </View>
);
