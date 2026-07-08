import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, SurfaceFillVariant } from '@ui';
import { AngleInput } from './AngleInput';
import { Text } from '../typography';
import { useState } from 'react';

const meta = {
    title: 'AngleInput',
    component: AngleInput,
} satisfies Meta<typeof AngleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const AngleInputVariants = {
    args: {
        value: 0,
    },
    render: () => {
        const [value, setValue] = useState(45);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ padding: 24, maxWidth: 800 }}>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
                    <button
                        onClick={() => setDisabled((d) => !d)}
                        style={{
                            padding: '4px 12px',
                            cursor: 'pointer',
                            background: disabled ? '#c44' : '#333',
                            color: '#fff',
                            border: '1px solid #555',
                            borderRadius: 4,
                            fontSize: 12,
                        }}
                    >
                        disabled: {String(disabled)}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block' }}>size: {size} | value: {value}°</Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`,
                                gap: 16,
                            }}
                        >
                            {allVariants.map((variant) => (
                                <Text key={variant} style={{ textAlign: 'center', fontSize: 11 }}>
                                    {variant}
                                </Text>
                            ))}
                        </div>
                        {allColors.map((color) => (
                            <div
                                key={color}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`,
                                    gap: 16,
                                    marginTop: 8,
                                }}
                            >
                                {allVariants.map((variant) => (
                                    <AngleInput
                                        key={variant}
                                        value={value}
                                        onChange={setValue}
                                        color={color}
                                        variant={variant}
                                        size={size}
                                        label={color}
                                        disabled={disabled}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    },
} satisfies Story;
