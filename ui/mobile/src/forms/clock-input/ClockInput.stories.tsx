import { FC, useState } from 'react';
import { ScrollView, View, StyleSheet, Switch } from 'react-native';
import { ClockInput } from './ClockInput';
import { ClockSliceInput } from './ClockSliceInput';
import { DurationClockInput } from './DurationClockInput';
import { Button } from '../../button';
import { Text } from '../../typography';
import { ColorVariant, SizeVariant, FillVariant, CLOCK_INPUT_RANGE, NumberInputPlacement } from '@ui';

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
    },
    headerLabel: {
        textAlign: 'center',
        fontSize: 11,
    },
});

const allSizes: SizeVariant[] = ['sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: FillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];
const numberInputPlacements: NumberInputPlacement[] = ['start', 'end', 'above', 'below'];

const ClockInputStoryOptions: FC<{
    showStepControls: boolean;
    setShowStepControls: (value: boolean) => void;
    showNumberInput: boolean;
    setShowNumberInput: (value: boolean) => void;
    numberInputPlacement: NumberInputPlacement;
    setNumberInputPlacement: (value: NumberInputPlacement) => void;
}> = ({ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }) => (
    <>
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
    </>
);

export const PitchConstrained: FC = () => {
    const pitchRange: [number, number] = [0, 85];
    const [value, setValue] = useState(30);
    const [size, setSize] = useState<SizeVariant>('sm');
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
                <Button
                    variant={disabled ? 'fill' : 'ghost'}
                    color="primary"
                    size="xs"
                    corners="rounded"
                    active={disabled}
                    onPress={() => setDisabled((d) => !d)}
                >
                    disabled: {String(disabled)}
                </Button>
            </View>
            <ClockInputStoryOptions {...{ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }} />

            <View style={[styles.section, { marginTop: 8 }]}>
                <Text style={{ marginBottom: 8 }}>
                    pitch range [{pitchRange[0]}–{pitchRange[1]}] | value: {value}°
                </Text>
                <View style={styles.row}>
                    {allVariants.map((variant) => (
                        <View key={variant} style={styles.cell}>
                            <Text style={styles.headerLabel}>{variant}</Text>
                        </View>
                    ))}
                </View>
                {allColors.map((color) => (
                    <View key={color} style={styles.row}>
                        {allVariants.map((variant) => (
                            <View key={variant} style={styles.cell}>
                                <ClockInput
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    variant={variant}
                                    size={size}
                                    label={color}
                                    disabled={disabled}
                                    showNumberInput={showNumberInput}
                                    showStepControls={showStepControls}
                                    numberInputPlacement={numberInputPlacement}
                                    min={pitchRange[0]}
                                    max={pitchRange[1]}
                                />
                            </View>
                        ))}
                    </View>
                ))}
                <View style={{ marginTop: 16 }}>
                    <Text style={{ marginBottom: 8 }}>
                        full range [{CLOCK_INPUT_RANGE[0]}–{CLOCK_INPUT_RANGE[1]}] for comparison
                    </Text>
                    <ClockInput
                        value={value}
                        onChange={setValue}
                        size={size}
                        disabled={disabled}
                        label="full"
                        showNumberInput={showNumberInput}
                        showStepControls={showStepControls}
                        numberInputPlacement={numberInputPlacement}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export const AllVariants: FC = () => {
    const [value, setValue] = useState(45);
    const [size, setSize] = useState<SizeVariant>('sm');
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
                <Button
                    variant={disabled ? 'fill' : 'ghost'}
                    color="primary"
                    size="xs"
                    corners="rounded"
                    active={disabled}
                    onPress={() => setDisabled((d) => !d)}
                >
                    disabled: {String(disabled)}
                </Button>
            </View>
            <ClockInputStoryOptions {...{ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }} />

            <View style={[styles.section, { marginTop: 8 }]}>
                <Text style={{ marginBottom: 8 }}>
                    size: {size} | value: {value}°
                </Text>
                <View style={styles.row}>
                    {allVariants.map((variant) => (
                        <View key={variant} style={styles.cell}>
                            <Text style={styles.headerLabel}>{variant}</Text>
                        </View>
                    ))}
                </View>
                {allColors.map((color) => (
                    <View key={color} style={styles.row}>
                        {allVariants.map((variant) => (
                            <View key={variant} style={styles.cell}>
                                <ClockInput
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    variant={variant}
                                    size={size}
                                    label={color}
                                    disabled={disabled}
                                    showNumberInput={showNumberInput}
                                    showStepControls={showStepControls}
                                    numberInputPlacement={numberInputPlacement}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export const SliceVariants: FC = () => {
    const pitchRange: [number, number] = [0, 85];
    const [value, setValue] = useState(30);
    const [size, setSize] = useState<SizeVariant>('sm');
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
                    disabled: {String(disabled)}
                </Button>
            </View>
            <ClockInputStoryOptions {...{ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }} />

            <View style={[styles.section, { marginTop: 8 }]}>
                <Text style={{ marginBottom: 8 }}>
                    pitch [{pitchRange[0]}–{pitchRange[1]}] | value: {value}°
                </Text>
                <View style={styles.row}>
                    {allVariants.map((variant) => (
                        <View key={variant} style={styles.cell}>
                            <Text style={styles.headerLabel}>{variant}</Text>
                        </View>
                    ))}
                </View>
                {allColors.map((color) => (
                    <View key={color} style={styles.row}>
                        {allVariants.map((variant) => (
                            <View key={variant} style={styles.cell}>
                                <ClockSliceInput
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    variant={variant}
                                    size={size}
                                    label={color}
                                    disabled={disabled}
                                    min={pitchRange[0]}
                                    max={pitchRange[1]}
                                    showNumberInput={showNumberInput}
                                    showStepControls={showStepControls}
                                    numberInputPlacement={numberInputPlacement}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={{ marginBottom: 8 }}>varying ranges</Text>
                <View style={styles.row}>
                    {(
                        [
                            [0, 30],
                            [0, 60],
                            [0, 85],
                        ] as [number, number][]
                    ).map(([lo, hi]) => (
                        <View key={`${lo}-${hi}`} style={styles.cell}>
                            <ClockSliceInput
                                value={Math.min(value, hi)}
                                onChange={(v) => setValue(v)}
                                color="primary"
                                size={size}
                                label={`${lo}–${hi}`}
                                disabled={disabled}
                                min={lo}
                                max={hi}
                                showNumberInput={showNumberInput}
                                showStepControls={showStepControls}
                                numberInputPlacement={numberInputPlacement}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export const DurationVariants: FC = () => {
    const [value, setValue] = useState(15000);
    const [size, setSize] = useState<SizeVariant>('sm');
    const [disabled, setDisabled] = useState(false);
    const [showStepControls, setShowStepControls] = useState(false);
    const [showNumberInput, setShowNumberInput] = useState(false);
    const [numberInputPlacement, setNumberInputPlacement] = useState<NumberInputPlacement>('end');

    const minutes = Math.floor(value / 60000);
    const seconds = Math.round((value % 60000) / 1000);

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
                    disabled: {String(disabled)}
                </Button>
            </View>

            <View style={styles.section}>
                <Text style={{ marginBottom: 8 }}>
                    size: {size} | value: {value / 1000}s ({minutes}m {seconds}s)
                </Text>
                <View style={styles.row}>
                    {allVariants.map((variant) => (
                        <View key={variant} style={styles.cell}>
                            <Text style={styles.headerLabel}>{variant}</Text>
                        </View>
                    ))}
                </View>
                <ClockInputStoryOptions {...{ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }} />

                {allColors.map((color) => (
                    <View key={color} style={styles.row}>
                        {allVariants.map((variant) => (
                            <View key={variant} style={[styles.cell, showNumberInput && { minWidth: 300 }]}>
                                <DurationClockInput
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    variant={variant}
                                    size={size}
                                    disabled={disabled}
                                    showNumberInput={showNumberInput}
                                    showStepControls={showStepControls}
                                    numberInputPlacement={numberInputPlacement}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
