import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { Text } from '../../typography';
import { ColorVariant, SizeVariant } from '@ui';
import styles from './checkbox.stories.module.css';
import { colorOptions as allColors, fillVariantOptions as allVariants, sizeOptions as allSizes } from '../../storybook/controls';

const meta = {
    title: 'Forms/Checkbox',
    component: Checkbox,
    args: { children: 'Checkbox', checked: false, color: 'primary', contentShade: 700, highlightContentShade: 200, size: 'sm', variant: 'fill', onChange: () => {} },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery = {
    render: () => {
        const [checked, setChecked] = useState(false);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [color, setColor] = useState<ColorVariant>('primary');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
                <Checkbox
                    size={size}
                    color={color}
                    contentShade={700}
                    highlightContentShade={200}
                    checked={checked}
                    onChange={setChecked}
                >
                    {checked ? 'Checked' : 'Unchecked'}
                </Checkbox>

                <Checkbox
                    className={styles['custom-label-color']}
                    color="primary"
                    checked={checked}
                    onChange={setChecked}
                >
                    Custom label color
                </Checkbox>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <fieldset>
                        <legend>Size</legend>
                        {allSizes.map(s => (
                            <label key={s} style={{ marginRight: 8 }}>
                                <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
                                {s}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Color</legend>
                        {allColors.map(c => (
                            <label key={c} style={{ marginRight: 8 }}>
                                <input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />
                                {c}
                            </label>
                        ))}
                    </fieldset>
                </div>

                <Text style={{ fontWeight: 700, marginTop: 16 }}>All combinations (checked)</Text>
                {allVariants.map(variant => allSizes.map(s => (
                    <div key={`${variant}-${s}`} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Text style={{ width: 100 }}>{variant} {s}</Text>
                        {allColors.map(c => (
                            <Checkbox key={c} variant={variant} size={s} color={c} checked onChange={() => { }}>
                                {c}
                            </Checkbox>
                        ))}
                    </div>
                )))}

                <Text style={{ fontWeight: 700, marginTop: 16 }}>All combinations (unchecked)</Text>
                {allSizes.map(s => (
                    <div key={s} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Text style={{ width: 40 }}>{s}</Text>
                        {allColors.map(c => (
                            <Checkbox key={c} size={s} color={c} checked={false} onChange={() => { }}>
                                {c}
                            </Checkbox>
                        ))}
                    </div>
                ))}
            </div>
        );
    },
};
