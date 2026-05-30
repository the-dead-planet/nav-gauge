import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, ButtonCorners, ButtonVariant, Icons } from '@ui';
import { Button } from './Button';
import { Text } from '../typography';
import { useState } from 'react';

const meta = {
    title: 'Button',
    component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: ButtonVariant[] = ['ghost', 'fill', 'outline', 'inset'];
const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle'];

export const ButtonVariants = {
    render: () => {
        const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);

        return (
            <>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700 }}>Active highlightColor: {highlightColor ?? 'default'}</span>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            icon={Icons.Beaker}
                            variant="ghost"
                            color={c}
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
                                                        icon={Icons.Beaker}
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
