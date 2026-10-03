import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { OpacityRamp } from './OpacityRamp';

const meta = {
    title: 'Forms/ColorRampOpacity',
    component: OpacityRamp,
    args: { color: 'rgb(67, 105, 255)', value: 0.6, label: 'Opacity', size: 'sm', disabled: false, onChange: () => {} },
    argTypes: {
        color: { control: 'color' },
        value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
        label: { control: 'text' },
        size: { control: 'select', options: ['xs', 'sm', 'md'] },
        disabled: { control: 'boolean' },
        onChange: { control: false },
    },
} satisfies Meta<typeof OpacityRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);
        useEffect(() => setValue(args.value), [args.value]);
        return <OpacityRamp {...args} value={value} onChange={setValue} />;
    },
};

export const Gallery: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: 16, padding: 24 }}>
            {(['xs', 'sm', 'md'] as const).map((size) => (
                <OpacityRamp key={size} {...args} size={size} onChange={() => {}} />
            ))}
            <OpacityRamp {...args} disabled onChange={() => {}} />
        </div>
    ),
};
