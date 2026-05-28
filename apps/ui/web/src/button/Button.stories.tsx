import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, ButtonEffect, ButtonCorners, ButtonVariant } from '@ui';
import { Button } from './Button';
import { Text } from '../typography';

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
        highlightEffects: {
            control: 'check',
            options: ['color', 'fill', 'outline'],
        },
        activeEffects: {
            control: 'check',
            options: ['color', 'fill', 'outline'],
        },
    },
    render: (args: Record<string, unknown>) => (
        <Button
            color={args.color as ColorVariant | undefined}
            variant={args.variant as 'ghost' | 'fill' | 'outline' | 'inset' | undefined}
            size={args.size as SizeVariant | undefined}
            corners={args.corners as 'square' | 'rounded' | 'circle' | undefined}
            active={args.active as boolean | undefined}
            highlightEffects={args.highlightEffects as ButtonEffect[] | undefined}
            activeEffects={args.activeEffects as ButtonEffect[] | undefined}
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
    render: () => (
        <div style={{ display: 'grid', gap: 40 }}>
            {allSizes.map((size) => (
                <div style={{ display: 'grid', gap: 20 }}>
                    <Text>{size}</Text>
                    {allCorners.map((corners) => (
                        <div style={{ display: 'grid', gap: 20 }}>
                            <Text>{corners}</Text>
                            {allColors.map((color) => (
                                <div>
                                    <Text>{size} {corners} {color}</Text>
                                    <div style={{ display: 'grid', gap: 8 }}>
                                        {allVariants.map((variant) => (
                                            <Button
                                                key={`${size}-${corners}-${color}-${variant}`}
                                                variant={variant}
                                                color={color}
                                                corners={corners}
                                                size={size}
                                            >
                                                {variant}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    ),
} satisfies Story;

const sizes: (SizeVariant | undefined)[] = [undefined, 'xs', 'sm', 'md'];

export const AllSizes = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sizes.map((size) => (
                <Button key={size ?? 'default'} size={size}>
                    {size ?? 'default'}
                </Button>
            ))}
        </div>
    ),
} satisfies Story;
