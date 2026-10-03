import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { HueRamp } from './HueRamp';

const meta = {
    title: 'Forms/ColorRampHue',
    component: HueRamp,
    args: { value: 210, label: 'Color', size: 'sm', disabled: false, onChange: () => {} },
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 360, step: 1 } },
        label: { control: 'text' },
        size: { control: 'select', options: ['xs', 'sm', 'md'] },
        disabled: { control: 'boolean' },
        onChange: { control: false },
    },
} satisfies Meta<typeof HueRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);
        useEffect(() => setValue(args.value), [args.value]);
        return <HueRamp {...args} value={value} onChange={setValue} />;
    },
};

export const Gallery: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: 16, padding: 24 }}>
            {(['xs', 'sm', 'md'] as const).map((size) => (
                <HueRamp key={size} {...args} size={size} onChange={() => {}} />
            ))}
            <HueRamp {...args} disabled onChange={() => {}} />
        </div>
    ),
};
