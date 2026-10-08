import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorInput } from './ColorInput';
import { colorControl, fillVariantControl, sizeControl } from '../../storybook/controls';

const meta = {
    title: 'Forms/ColorInput',
    component: ColorInput,
    args: {
        id: 'color-input-playground',
        label: 'Border color',
        value: '#ff6600',
        color: 'neutral',
        highlightColor: 'neutral',
        size: 'sm',
        variant: 'fill-inverse',
        disabled: false,
        showColorButton: true,
        showValueInput: true,
        showFormatSelect: false,
        onChange: () => {},
    },
    argTypes: {
        value: { control: 'color' },
        color: colorControl,
        highlightColor: colorControl,
        size: sizeControl,
        variant: fillVariantControl,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return <ColorInput {...args} value={value} onChange={setValue} />;
    },
};
