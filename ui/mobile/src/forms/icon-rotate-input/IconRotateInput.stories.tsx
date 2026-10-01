import { FC, useState } from "react";
import { ScrollView, View, StyleSheet, Switch } from "react-native";
import { IconRotateInput } from "./IconRotateInput";
import { Button } from "../../button";
import { Text } from "../../typography";
import { ColorVariant, NumberInputPlacement, SizeVariant } from "@ui";
import { Icons } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
    },
});

const allSizes: SizeVariant[] = ['sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const numberInputPlacements: NumberInputPlacement[] = ['start', 'end', 'above', 'below'];

export const AllColors: FC = () => {
    const [angle, setAngle] = useState(45);
    const [size, setSize] = useState<SizeVariant>('md');
    const [disabled, setDisabled] = useState(false);
    const [showStepControls, setShowStepControls] = useState(false);
    const [showNumberInput, setShowNumberInput] = useState(false);
    const [numberInputPlacement, setNumberInputPlacement] = useState<NumberInputPlacement>('end');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={[styles.row, { marginBottom: 12 }]}>
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
            <View style={styles.row}>
                <Text>Disabled</Text>
                <Button
                    variant={disabled ? 'fill' : 'ghost'}
                    color="primary"
                    size="xs"
                    corners="rounded"
                    active={disabled}
                    onPress={() => setDisabled((d) => !d)}
                >
                    {String(disabled)}
                </Button>
            </View>
            <View style={styles.row}>
                <Text>Options</Text>
                <Text>Show plus/minus</Text>
                <Switch value={showStepControls} onValueChange={setShowStepControls} />
                <Text>Show number input</Text>
                <Switch value={showNumberInput} onValueChange={setShowNumberInput} />
            </View>
            <View style={styles.row}>
                <Text>Number input placement</Text>
                {numberInputPlacements.map((placement) => (
                    <Button key={placement} size="xs" active={numberInputPlacement === placement} onPress={() => setNumberInputPlacement(placement)}>
                        {placement}
                    </Button>
                ))}
            </View>

            <View style={{ marginTop: 8 }}>
                <Text style={{ marginBottom: 8 }}>size: {size} | angle: {angle}°</Text>
                {allColors.map((color) => (
                    <View key={color} style={styles.row}>
                        <View style={styles.cell}>
                            <IconRotateInput
                                icon={Icons.NounProject.CameraVideoFront}
                                value={angle}
                                onChange={setAngle}
                                color={color}
                                size={size}
                                disabled={disabled}
                                showNumberInput={showNumberInput}
                                showStepControls={showStepControls}
                                numberInputPlacement={numberInputPlacement}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
