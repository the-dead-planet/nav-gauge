import { ComponentProps, FC, useState } from "react";
import { Text } from "../../typography";
import { ScrollView, View, Switch, StyleSheet } from "react-native";
import { TextInput } from "./TextInput";
import { ColorVariant, FillVariant, SizeVariant } from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";

const styles = StyleSheet.create({
    container: { padding: 16, gap: 16 },
    section: { paddingVertical: 12, gap: 8 },
    row: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
    },
    label: { fontSize: 14, fontWeight: "600" },
});

export const Playground: FC = () => {
    const [value, setValue] = useState("Hello");
    const [color, setColor] = useState<ColorVariant>("neutral");
    const [size, setSize] = useState<SizeVariant>("sm");
    const [disabled, setDisabled] = useState(false);

    const allSizes: SizeVariant[] = ["md", "sm", "xs"];
    const allColors: ColorVariant[] = [
        "neutral",
        "primary",
        "secondary",
        "tertiary",
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                label="Label"
                value={value}
                onChange={setValue}
                color={color}
                size={size}
                disabled={disabled}
            />

            <View style={styles.section}>
                <Text style={styles.label}>Current value: {value}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.row}>
                    {allColors.map((c) => (
                        <Switch
                            key={c}
                            value={color === c}
                            onValueChange={() => setColor(c)}
                        />
                    ))}
                </View>
                <Text>{color}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Size</Text>
                <View style={styles.row}>
                    {allSizes.map((s) => (
                        <Switch
                            key={s}
                            value={size === s}
                            onValueChange={() => setSize(s)}
                        />
                    ))}
                </View>
                <Text>{size}</Text>
            </View>

            <View style={styles.row}>
                <Text>Disabled:</Text>
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>All colors</Text>
                {allColors.map((c) => (
                    <TextInput
                        key={c}
                        label={c}
                        value="text"
                        onChange={() => {}}
                        color={c}
                    />
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>All sizes</Text>
                {allSizes.map((s) => (
                    <TextInput
                        key={s}
                        label={s}
                        value="text"
                        onChange={() => {}}
                        size={s}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const colors: ColorVariant[] = ["neutral", "primary", "secondary", "tertiary"];
const sizes: SizeVariant[] = ["xs", "sm", "md"];
const variants: FillVariant[] = ["fill", "fill-inverse", "fill-translucent"];

const GalleryTextInput: FC<ComponentProps<typeof TextInput>> = (props) => {
    const [value, setValue] = useState(props.value);

    return <TextInput {...props} value={value} onChange={setValue} />;
};

export const Gallery: FC = () => (
    <VariantGallery
        sizes={sizes}
        colors={colors}
        variants={variants}
        render={({ color, size, variant }) => (
            <GalleryTextInput
                label="Label"
                value="Text"
                onChange={() => {}}
                color={color}
                size={size}
                variant={variant}
            />
        )}
    />
);
