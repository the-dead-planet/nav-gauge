import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorButton } from './ColorButton';
import { Span } from '../../typography';
import { sizeControl, sizeOptions } from '../../storybook/controls';

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
        size: sizeControl,
        selected: { control: 'boolean' },
        onClick: { control: false },
    },
} satisfies Meta<typeof ColorButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colors: Story = {
    render: () => {
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

        return (
            <div style={{ display: 'grid', gap: 12, padding: 24 }}>
                {sizeOptions.map((size, i) => (
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
