import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, ButtonCorners, SurfaceVariant, Icons } from '@ui';
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
const allVariants: SurfaceVariant[] = ['ghost', 'fill', 'outline', 'inset'];
const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle', 'hexagon'];

export const ButtonVariants = {
    render: () => {
        const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);

        return (
            <>
                <Text style={{ fontWeight: 700, marginBottom: 10 }}>Active highlightColor: {highlightColor ?? 'default'}</Text>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            icon={Icons.Beaker}
                            variant="fill"
                            color={c}
                            size="xs"
                            corners="circle"
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
                                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`, gap: 8 }}>
                                            {allVariants.map((variant) => (
                                                <Text key={variant}>{variant}</Text>
                                            ))}
                                        </div>
                                        {allColors.map((color) => (
                                            <div key={color} style={{ display: 'grid', gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`, gap: 8 }}>
                                                {allVariants.map((variant, i) => (
                                                    <Button
                                                        key={variant}
                                                        icon={i % 2 ? Icons.Beaker : Icons.NounProject.LightBulbCogWheel}
                                                        variant={variant}
                                                        color={color}
                                                        corners={corners}
                                                        size={size}
                                                        highlightColor={highlightColor}
                                                    >
                                                        {corners !== 'hexagon' ? color : null}
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
