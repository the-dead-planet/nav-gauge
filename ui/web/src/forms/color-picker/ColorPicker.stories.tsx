import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorPicker } from './ColorPicker';

const meta = {
    title: 'Forms/ColorPicker',
    component: ColorPicker,
    args: {
        label: 'Line color',
        opacityLabel: 'Opacity',
        value: 'rgba(255, 102, 0, 0.8)',
        size: 'sm',
        variant: 'fill-inverse',
        disabled: false,
        onChange: () => {},
    },
    argTypes: {
        label: { control: 'text' },
        opacityLabel: { control: 'text' },
        value: { control: 'color' },
        size: { control: 'select', options: ['xs', 'sm', 'md'] },
        variant: { control: 'select', options: ['fill', 'fill-inverse', 'fill-translucent'] },
        disabled: { control: 'boolean' },
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return <ColorPicker {...args} value={value} onChange={setValue} />;
    },
};
