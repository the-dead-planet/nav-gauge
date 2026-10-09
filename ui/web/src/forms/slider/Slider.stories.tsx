import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, FillVariant } from '@ui';
import { Slider } from './Slider';
import { Text } from '../../typography';
import { useState } from 'react';
import { colorOptions as allColors, fillVariantOptions as allVariants, sizeOptions as allSizes } from '../../storybook/controls';

const meta = {
    title: 'Forms/Slider',
    component: Slider,
    args: { value: 50, min: 0, max: 100, color: 'primary', size: 'sm', variant: 'fill-inverse', onChange: () => {} },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery = {
    render: () => {
        const [value, setValue] = useState(50);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [variant, setVariant] = useState<FillVariant>('fill-inverse');
        const [showStepControls, setShowStepControls] = useState(false);
        const [showNumberInput, setShowNumberInput] = useState(false);

        return (
            <div style={{ display: 'grid', gap: 32, padding: 24, maxWidth: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Text>Size</Text>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Text>Variant</Text>
                    {allVariants.map((item) => (
                        <button
                            key={item}
                            onClick={() => setVariant(item)}
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                background: variant === item ? '#666' : '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: 4,
                                fontSize: 12,
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Text>Options</Text>
                    <label><input type="checkbox" checked={showStepControls} onChange={(event) => setShowStepControls(event.target.checked)} /> Show plus/minus</label>
                    <label><input type="checkbox" checked={showNumberInput} onChange={(event) => setShowNumberInput(event.target.checked)} /> Show number input</label>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                    <Text>size: {size}</Text>
                    <Slider value={value} onChange={setValue} min={0} max={100} size={size} variant={variant} showNumberInput={showNumberInput} showStepControls={showStepControls} />
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                    {allColors.map((color) => (
                        <Slider
                            key={color}
                            value={value}
                            onChange={setValue}
                            color={color}
                            size={size}
                            variant={variant}
                            showNumberInput={showNumberInput}
                            showStepControls={showStepControls}
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
                            variant={variant}
                            disabled
                            showNumberInput={showNumberInput}
                            showStepControls={showStepControls}
                        />
                    ))}
                </div>
            </div>
        );
    },
};

