import { FC, useState } from "react";
import { ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { ColorVariant, FillVariant, SizeVariant } from "@ui";
import { Button } from "../../button";
import { Text } from "../../typography";
import { ColorInput } from "./ColorInput";

const styles = StyleSheet.create({
    container: { gap: 16, padding: 16 },
    row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 8 },
    input: { borderColor: "#888", borderWidth: 1, color: "#fff", padding: 8 },
});

export const Playground: FC = () => {
    const [value, setValue] = useState("#ff6600");
    const [label, setLabel] = useState("Border color");
    const [color, setColor] = useState<ColorVariant>("neutral");
    const [highlightColor, setHighlightColor] = useState<ColorVariant>("neutral");
    const [size, setSize] = useState<SizeVariant>("sm");
    const [variant, setVariant] = useState<FillVariant>("fill-inverse");
    const [disabled, setDisabled] = useState(false);
    const [showColorButton, setShowColorButton] = useState(true);
    const [showValueInput, setShowValueInput] = useState(true);
    const [showFormatSelect, setShowFormatSelect] = useState(false);
    const colors: ColorVariant[] = ["neutral", "primary", "secondary", "tertiary"];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ColorInput
                label={label}
                value={value}
                color={color}
                highlightColor={highlightColor}
                size={size}
                variant={variant}
                disabled={disabled}
                showColorButton={showColorButton}
                showValueInput={showValueInput}
                showFormatSelect={showFormatSelect}
                onChange={setValue}
            />
            <Text>{value}</Text>
            <TextInput style={styles.input} value={label} onChangeText={setLabel} />
            <View style={styles.row}>
                {colors.map((item) => <Button key={`color-${item}`} size="xs" onPress={() => setColor(item)}>{item}</Button>)}
                {colors.map((item) => <Button key={`highlight-${item}`} size="xs" onPress={() => setHighlightColor(item)}>H {item}</Button>)}
                {(["xs", "sm", "md"] as const).map((item) => <Button key={item} size="xs" onPress={() => setSize(item)}>{item}</Button>)}
                {(["fill", "fill-inverse", "fill-translucent"] as const).map((item) => <Button key={item} size="xs" onPress={() => setVariant(item)}>{item}</Button>)}
            </View>
            {[
                ["Disabled", disabled, setDisabled],
                ["Color button", showColorButton, setShowColorButton],
                ["Value input", showValueInput, setShowValueInput],
                ["Format select", showFormatSelect, setShowFormatSelect],
            ].map(([text, enabled, setEnabled]) => (
                <View key={text as string} style={styles.row}>
                    <Text>{text as string}</Text>
                    <Switch value={enabled as boolean} onValueChange={setEnabled as (value: boolean) => void} />
                </View>
            ))}
        </ScrollView>
    );
};
