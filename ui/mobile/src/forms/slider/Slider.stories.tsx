import { FC, useState } from "react";
import { ScrollView, View, StyleSheet, Switch } from "react-native";
import { Slider } from "./Slider";
import { Button } from "../../button";
import { Text } from "../../typography";
import { ColorVariant, SizeVariant, FillVariant } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    sizeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
});

const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: FillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const AllVariants: FC = () => {
    const [value, setValue] = useState(50);
    const [size, setSize] = useState<SizeVariant>('sm');
    const [variant, setVariant] = useState<FillVariant>('fill-inverse');
    const [showStepControls, setShowStepControls] = useState(false);
    const [showNumberInput, setShowNumberInput] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.sizeRow}>
                <Text>Size</Text>
                {allSizes.map((s) => (
                    <Button
                        key={s}
                        variant={size === s ? 'fill' : 'ghost'}
                        color="primary"
                        size="xs"
                        corners="rounded"
                        active={size === s}
                        onPress={() => setSize(s)}
                    >
                        {s}
                    </Button>
                ))}
            </View>
            <View style={styles.sizeRow}>
                <Text>Variant</Text>
                {allVariants.map((item) => (
                    <Button
                        key={item}
                        variant={variant === item ? 'fill' : 'ghost'}
                        color="primary"
                        size="xs"
                        active={variant === item}
                        onPress={() => setVariant(item)}
                    >
                        {item}
                    </Button>
                ))}
            </View>
            <View style={styles.sizeRow}>
                <Text>Options</Text>
                <Text>Show plus/minus</Text>
                <Switch value={showStepControls} onValueChange={setShowStepControls} />
                <Text>Show number input</Text>
                <Switch value={showNumberInput} onValueChange={setShowNumberInput} />
            </View>
            <View style={styles.section}>
                <Text style={{ marginBottom: 4 }}>size: {size}</Text>
                <Slider value={value} onChange={setValue} min={0} max={100} size={size} variant={variant} showNumberInput={showNumberInput} showStepControls={showStepControls} />
            </View>
            <View style={styles.section}>
                {allColors.map((color) => (
                    <Slider
                        key={color}
                        value={value}
                        onChange={setValue}
                        color={color}
                        size={size}
                        variant={variant}
                        style={{ marginVertical: 4 }}
                        showNumberInput={showNumberInput}
                        showStepControls={showStepControls}
                    />
                ))}
            </View>
            <View style={styles.section}>
                <Text style={{ marginBottom: 4 }}>disabled</Text>
                {allColors.map((color) => (
                    <Slider
                        key={color}
                        value={30}
                        color={color}
                        size={size}
                        variant={variant}
                        disabled
                        style={{ marginVertical: 4 }}
                        showNumberInput={showNumberInput}
                        showStepControls={showStepControls}
                    />
                ))}
            </View>
        </ScrollView>
    );
};
