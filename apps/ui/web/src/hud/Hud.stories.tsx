import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Hexagon } from './Hexagon';
import { FlexBox } from '../flex-box/FlexBox';
import { ColorVariant, GlowStyle, Icons, SizeVariant, SurfaceVariant, useTheme } from '@ui';
import { Text } from '../typography';
import { useState } from 'react';
import { Button } from '../button';

const meta = {
    title: 'Hud',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const allSizes: (SizeVariant | undefined)[] = [undefined, 'md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceVariant[] = ['ghost', 'fill', 'fill-inverse', 'fill-translucent', 'outline', 'inset'];
const allGlowStyles: (GlowStyle | undefined)[] = [undefined, 'glow', 'animate-borders-glow'];

export const Hexagons = {
    render: () => {
        const theme = useTheme();
        const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);
        const [glowStyle, setGlowStyle] = useState<GlowStyle>();
        const [interactive, setInteractive] = useState(false);

        return (
            <>
                <Text style={{ fontWeight: 700, marginBottom: 10 }}>Active highlightColor:</Text>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            icon={Icons.Beaker}
                            variant={highlightColor === c ? "fill" : "ghost"}
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

                <div style={{ display: 'flex', marginBottom: "10px" }}>
                    <input type="checkbox" checked={interactive} onChange={(e) => setInteractive(e.target.checked)} />
                    <Text>Interactive</Text>
                </div>
                {interactive ? (
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {allGlowStyles.map((gs) => (
                            <Button
                                key={gs ?? 'default'}
                                variant={glowStyle === gs ? "fill" : "ghost"}
                                size="xs"
                                corners="circle"
                                active={glowStyle === gs}
                                onClick={() => setGlowStyle(gs)}
                            >
                                {gs ?? 'none'}
                            </Button>
                        ))}
                    </div>
                ) : null}

                <FlexBox direction="column" gap="xl" style={{ marginTop: "20px" }}>
                    <Text>All variants</Text>
                    <div style={{ display: 'grid', gap: 40 }}>
                        {allSizes.map((size) => (
                            <div key={size?.toString()}>
                                <Text>{size || 'Auto size'}</Text>
                                <div style={{ display: 'grid', gap: 12 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`, gap: 8 }}>
                                        {allVariants.map((variant) => (
                                            <Text key={variant}>{variant}</Text>
                                        ))}
                                    </div>
                                    {allColors.map((color) => (
                                        <div key={color} style={{ display: 'grid', gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`, gap: 8 }}>
                                            {allVariants.map((variant, i) => (
                                                <Hexagon
                                                    key={variant}
                                                    variant={variant}
                                                    color={color}
                                                    highlightColor={highlightColor}
                                                    size={size}
                                                    glowStyle={glowStyle}
                                                    interactive={interactive}
                                                >
                                                    <Text style={{
                                                        color: theme.mode === 'dark' ? "white" : "black",
                                                        fontSize: { xs: 10, sm: 12, md: 14 }[size || 'md'],
                                                    }}
                                                    >
                                                        {color}
                                                    </Text>
                                                </Hexagon>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Text>Hover: Glow (default)</Text>
                    <FlexBox gap="md" alignItems="center">
                        <Hexagon shape="pointy-top" interactive color="primary" style={{ width: 100 }}>
                            <span>1</span>
                        </Hexagon>
                        <Hexagon shape="flat-top" interactive glowStyle="glow" color="secondary" style={{ width: 100 }}>
                            <span>2</span>
                        </Hexagon>
                    </FlexBox>

                    <Text>Hover: Borders glow</Text>
                    <FlexBox gap="md" alignItems="center">
                        <Hexagon shape="pointy-top" interactive glowStyle="animate-borders-glow" color="primary" style={{ width: 100 }}>
                            <span>1</span>
                        </Hexagon>
                        <Hexagon shape="flat-top" interactive glowStyle="animate-borders-glow" color="secondary" style={{ width: 100 }}>
                            <span>2</span>
                        </Hexagon>
                    </FlexBox>

                    <span style={{ fontWeight: 700 }}>sizes</span>
                    <FlexBox gap="md" alignItems="center">
                        <Hexagon shape='pointy-top' interactive color="tertiary" size="xs" />
                        <Hexagon shape='pointy-top' interactive color="tertiary" size="sm" />
                        <Hexagon shape='pointy-top' interactive color="tertiary" size="md" />
                    </FlexBox>
                    <FlexBox gap="md" alignItems="center">
                        <Hexagon shape='flat-top' interactive color="tertiary" size="xs" />
                        <Hexagon shape='flat-top' interactive color="tertiary" size="sm" />
                        <Hexagon shape='flat-top' interactive color="tertiary" size="md" />
                    </FlexBox>
                    <span style={{ fontWeight: 700 }}>stroke width</span>
                    <FlexBox gap="md" alignItems="center">
                        <Hexagon interactive strokeWidth={1} color="primary" style={{ width: 100 }} />
                        <Hexagon interactive strokeWidth={3} color="primary" style={{ width: 100 }} />
                        <Hexagon interactive strokeWidth={5} color="primary" style={{ width: 100 }} />
                    </FlexBox>
                </FlexBox>
            </>
        );
    },
} satisfies Story;
