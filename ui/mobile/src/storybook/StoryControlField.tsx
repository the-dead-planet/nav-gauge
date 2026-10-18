import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { type StoryControl } from '@ui';
import { Text } from '../design-system/typography';
import { Dropdown } from '../forms/dropdown';
import { NumberInput } from '../forms/number-input';
import { TextInput } from '../forms/text-input';
import { ToggleSwitch } from '../forms/toggle-switch';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        flex: 1,
    },
    input: {
        flex: 1,
    },
});

interface Props {
    name: string;
    control: StoryControl;
    value: unknown;
    onChange: (value: unknown) => void;
}

export const StoryControlField: FC<Props> = ({ name, control, value, onChange }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{control.name ?? name}</Text>
        <View style={styles.input}>
            {control.control === 'boolean' ? (
                <ToggleSwitch checked={Boolean(value)} onChange={onChange} />
            ) : typeof control.control === 'object' ? (
                <NumberInput
                    value={typeof value === 'number' ? value : 0}
                    min={control.control.min}
                    max={control.control.max}
                    step={control.control.step}
                    onChange={onChange}
                    ariaLabel={control.name ?? name}
                />
            ) : control.control === 'select' ? (
                <Dropdown
                    value={value}
                    options={control.options.map((option) => ({
                        label: String(option),
                        value: control.mapping && Object.prototype.hasOwnProperty.call(control.mapping, String(option))
                            ? control.mapping[String(option)]
                            : option,
                    }))}
                    onChange={onChange}
                />
            ) : (
                <TextInput value={typeof value === 'string' ? value : ''} onChange={onChange} />
            )}
        </View>
    </View>
);
