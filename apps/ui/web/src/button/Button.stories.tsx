import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, ButtonCorners, ButtonVariant } from '@ui';
import { Button } from './Button';
import { Text } from '../typography';
import { useState } from 'react';

const meta = {
    title: 'Button',
    component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonStory = {
    name: 'Button',
    args: {
        children: 'Press',
    },
    argTypes: {
        color: {
            control: 'select',
            options: ['(default)', 'primary', 'secondary', 'tertiary', 'neutral'],
            mapping: { '(default)': undefined },
        },
        highlightColor: {
            control: 'select',
            options: ['(default)', 'primary', 'secondary', 'tertiary', 'neutral'],
            mapping: { '(default)': undefined },
        },
        variant: {
            control: 'select',
            options: ['(default)', 'ghost', 'fill', 'outline', 'inset'],
            mapping: { '(default)': undefined },
        },
        size: {
            control: 'select',
            options: ['(default)', 'xs', 'sm', 'md'],
            mapping: { '(default)': undefined },
        },
        corners: {
            control: 'select',
            options: ['(default)', 'square', 'rounded', 'circle'],
            mapping: { '(default)': undefined },
        },
        active: {
            control: 'boolean',
        },
    },
    render: (args: Record<string, unknown>) => (
        <Button
            color={args.color as ColorVariant | undefined}
            highlightColor={args.highlightColor as ColorVariant | undefined}
            variant={args.variant as ButtonVariant | undefined}
            size={args.size as SizeVariant | undefined}
            corners={args.corners as ButtonCorners | undefined}
            active={args.active as boolean | undefined}
        >
            {args.children as string}
        </Button>
    ),
} satisfies Story;

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: ButtonVariant[] = ['ghost', 'fill', 'outline', 'inset'];
const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle'];

export const AllVariants = {
    render: () => {
        const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);

        return (
            <>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700 }}>Active highlightColor: {highlightColor ?? 'default'}</span>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            variant="ghost"
                            color="neutral"
                            size="xs"
                            corners="rounded"
                            active={highlightColor === c}
                            onClick={() => setHighlightColor(c)}
                        >
                            {c ?? 'default'}
                        </Button>
                    ))}
                </div>
                <div style={{ display: 'grid', gap: 40 }}>
                    {allSizes.map((size) => (
                        <div key={size}>
                            <Text>{size}</Text>
                            <div style={{ display: 'grid', gap: 20 }}>
                                {allCorners.map((corners) => (
                                    <div key={corners} style={{ display: 'grid', gap: 12 }}>
                                        <Text>{corners}</Text>
                                        <div style={{ display: 'grid', gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                                            {allVariants.map((variant) => (
                                                <Text key={variant}>{variant}</Text>
                                            ))}
                                        </div>
                                        {allColors.map((color) => (
                                            <div key={color} style={{ display: 'grid', gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                                                {allVariants.map((variant) => (
                                                    <Button
                                                        key={variant}
                                                        variant={variant}
                                                        color={color}
                                                        corners={corners}
                                                        size={size}
                                                        highlightColor={highlightColor}
                                                    >
                                                        {color}
                                                    </Button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    },
} satisfies Story;

const sizes: (SizeVariant | undefined)[] = [undefined, 'xs', 'sm', 'md'];

export const AllSizes = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sizes.map((size) => (
                <Button key={size ?? 'default'} variant="outline" size={size}>
                    {size ?? 'default'}
                </Button>
            ))}
        </div>
    ),
} satisfies Story;
