import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { TextArea } from './TextArea';
import { Fieldset } from '../fieldset';
import { Text } from '../../typography';
import { ColorVariant, SizeVariant, SurfaceFillVariant } from '@ui';

const meta = {
    title: 'Forms/TextArea',
    component: TextArea,
} satisfies Meta<typeof TextArea>;

export default meta;

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const TextAreaInteractive = {
    render: () => {
        const [value, setValue] = useState('Some text');
        const [color, setColor] = useState<ColorVariant>('neutral');
        const [size, setSize] = useState<SizeVariant>('sm');
        const [variant, setVariant] = useState<SurfaceFillVariant>('fill-inverse');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, maxWidth: 320 }}>
                <TextArea
                    id="interactive"
                    label="Label"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    color={color}
                    size={size}
                    variant={variant}
                    disabled={disabled}
                />

                <Fieldset label="Color">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {allColors.map(c => (
                            <label key={c}>
                                <input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />
                                {c}
                            </label>
                        ))}
                    </div>
                </Fieldset>

                <Fieldset label="Size">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {allSizes.map(s => (
                            <label key={s}>
                                <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
                                {s}
                            </label>
                        ))}
                    </div>
                </Fieldset>

                <Fieldset label="Variant">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {allVariants.map(v => (
                            <label key={v}>
                                <input type="radio" name="variant" checked={variant === v} onChange={() => setVariant(v)} />
                                {v}
                            </label>
                        ))}
                    </div>
                </Fieldset>

                <label>
                    <input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />
                    Disabled
                </label>

                <Fieldset label="All colors">
                    {allColors.map(c => (
                        <TextArea key={c} id={`color-${c}`} label={c} value="text" onChange={() => {}} color={c} size={size} />
                    ))}
                </Fieldset>

                <Fieldset label="All sizes">
                    {allSizes.map(s => (
                        <TextArea key={s} id={`size-${s}`} label={s} value="text" onChange={() => {}} size={s} />
                    ))}
                </Fieldset>

                <Text>Current value: {value}</Text>
            </div>
        );
    },
};
