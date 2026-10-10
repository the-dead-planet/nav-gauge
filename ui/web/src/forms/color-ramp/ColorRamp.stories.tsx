import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorRamp } from './ColorRamp';
import { sizeControl, sizeOptions } from '../../storybook/controls';

const meta = {
    title: 'Forms/ColorRamp',
    component: ColorRamp,
    args: {
        value: 'rgb(67, 105, 255)',
        label: 'Color',
        opacityLabel: 'Opacity',
        size: 'sm',
        disabled: false,
        onChange: () => {},
    },
    argTypes: {
        value: { control: 'color' },
        label: { control: 'text' },
        opacityLabel: { control: 'text' },
        size: sizeControl,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return <ColorRamp {...args} value={value} onChange={setValue} />;
    },
};

export const Gallery: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: 16 }}>
            {sizeOptions.map((size) => <ColorRamp key={size} {...args} size={size} onChange={() => {}} />)}
            <ColorRamp {...args} disabled onChange={() => {}} />
        </div>
    ),
};
