import type { Meta } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant } from '@ui';
import { Slider } from './Slider';
import { Text } from '../../typography';
import { useState } from 'react';

const meta = {
    title: 'Forms/Slider',
    component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;

const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const SliderVariants = {
    render: () => {
        const [value, setValue] = useState(50);
        const [size, setSize] = useState<SizeVariant>('sm');

        return (
            <div style={{ display: 'grid', gap: 32, padding: 24, maxWidth: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {allSizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSize(s)}
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                background: size === s ? '#666' : '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: 4,
                                fontSize: 12,
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                    <Text>size: {size}</Text>
                    <Slider value={value} onChange={setValue} min={0} max={100} size={size} />
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                    {allColors.map((color) => (
                        <Slider
                            key={color}
                            value={value}
                            onChange={setValue}
                            color={color}
                            size={size}
                        />
                    ))}
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                    <Text>disabled</Text>
                    {allColors.map((color) => (
                        <Slider
                            key={color}
                            value={30}
                            color={color}
                            size={size}
                            disabled
                        />
                    ))}
                </div>
            </div>
        );
    },
};

