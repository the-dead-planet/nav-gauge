import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorButton } from './ColorButton';
import { SizeVariant } from '@ui';
import { Span } from '../../typography';

const meta = {
    title: 'Forms/ColorButton',
    component: ColorButton,
    args: {
        value: '#336699',
        label: 'Color',
        size: 'sm',
        selected: false,
        disabled: false,
    },
    argTypes: {
        value: { control: 'color' },
        label: { control: 'text' },
        size: { control: 'select', options: ['xs', 'sm', 'md'] },
        selected: { control: 'boolean' },
        disabled: { control: 'boolean' },
        onClick: { control: false },
    },
} satisfies Meta<typeof ColorButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const sizes: SizeVariant[] = ['xs', 'sm', 'md'];

export const Colors: Story = {
    render: () => {
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

        return (
            <div style={{ display: 'grid', gap: 12, padding: 24 }}>
                {sizes.map((size, i) => (
                    <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ColorButton
                            label={size}
                            size={size}
                            value='rgb(255, 102, 0)'
                            selected={selectedIndex === i}
                            onClick={() => setSelectedIndex(i)}
                        />
                        <Span>{size}</Span>
                    </div>
                ))}
            </div>
        );
    },
};
