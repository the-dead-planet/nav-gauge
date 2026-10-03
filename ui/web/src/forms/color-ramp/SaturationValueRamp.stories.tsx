import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { SaturationValueRamp } from './SaturationValueRamp';

const meta = {
    title: 'Forms/ColorRampSaturation',
    component: SaturationValueRamp,
    args: { hue: 210, saturation: 0.7, brightness: 0.8, label: 'Color', size: 'sm', disabled: false, onChange: () => {} },
    argTypes: {
        hue: { control: { type: 'range', min: 0, max: 360, step: 1 } },
        saturation: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
        brightness: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
        label: { control: 'text' },
        size: { control: 'select', options: ['xs', 'sm', 'md'] },
        disabled: { control: 'boolean' },
        onChange: { control: false },
    },
} satisfies Meta<typeof SaturationValueRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [saturation, setSaturation] = useState(args.saturation);
        const [brightness, setBrightness] = useState(args.brightness);
        useEffect(() => setSaturation(args.saturation), [args.saturation]);
        useEffect(() => setBrightness(args.brightness), [args.brightness]);
        return (
            <SaturationValueRamp
                {...args}
                saturation={saturation}
                brightness={brightness}
                onChange={(nextSaturation, nextBrightness) => {
                    setSaturation(nextSaturation);
                    setBrightness(nextBrightness);
                }}
            />
        );
    },
};

export const Gallery: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: 16, padding: 24 }}>
            {(['xs', 'sm', 'md'] as const).map((size) => (
                <SaturationValueRamp key={size} {...args} size={size} onChange={() => {}} />
            ))}
            <SaturationValueRamp {...args} disabled onChange={() => {}} />
        </div>
    ),
};
