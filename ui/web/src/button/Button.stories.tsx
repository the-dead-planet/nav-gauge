import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, ButtonCorners, SurfaceVariant, Icons, GlowStyle, ColorShade, allColorShades } from '@ui';
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
const allVariants: SurfaceVariant[] = ['ghost', 'fill', 'fill-inverse', 'fill-translucent', 'outline', 'inset'];
const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle', 'hexagon'];
const allGlowStyles: (GlowStyle | undefined)[] = [undefined, 'glow', 'animate-borders-glow'];

export const ButtonVariants = {
    render: () => {
        const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);
        const [glowStyle, setGlowStyle] = useState<GlowStyle>();
        const [shade, setShade] = useState<ColorShade>();
        const [highlightShade, setHighlightShade] = useState<ColorShade>();
        const [disabled, setDisabled] = useState(false);

        return (
            <>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <label>
                        Shade:{' '}
                        <select
                            value={shade ?? ''}
                            onChange={(event) => setShade(
                                event.target.value ? Number(event.target.value) as ColorShade : undefined
                            )}
                        >
                            <option value="">Default</option>
                            {allColorShades.filter((option) => option >= 100).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Highlight shade:{' '}
                        <select
                            value={highlightShade ?? ''}
                            onChange={(event) => setHighlightShade(
                                event.target.value ? Number(event.target.value) as ColorShade : undefined
                            )}
                        >
                            <option value="">Default</option>
                            {allColorShades.filter((option) => option >= 100).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Button
                        variant={disabled ? 'fill' : 'ghost'}
                        size="xs"
                        corners="circle"
                        active={disabled}
                        onClick={() => setDisabled((d) => !d)}
                    >
                        disabled: {String(disabled)}
                    </Button>
                </div>
                <Text style={{ fontWeight: 700, marginBottom: 10 }}>Active highlightColor: {highlightColor ?? 'default'}</Text>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            icon={Icons.Beaker}
                            variant="fill-translucent"
                            color={c}
                            size="xs"
                            corners="circle"
                            active={highlightColor === c}
                            disabled={disabled}
                            onClick={() => setHighlightColor(c)}
                        >
                            {c ?? 'default'}
                        </Button>
                    ))}
                </div>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {allGlowStyles.map((gs) => (
                        <Button
                            key={gs ?? 'default'}
                            variant={glowStyle === gs ? "fill" : "ghost"}
                            size="xs"
                            corners="circle"
                            active={glowStyle === gs}
                            disabled={disabled}
                            onClick={() => setGlowStyle(gs)}
                        >
                            {gs ?? 'none'}
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
                                                        shade={shade}
                                                        highlightColor={highlightColor}
                                                        highlightShade={highlightShade}
                                                        glowStyle={glowStyle}
                                                        disabled={disabled}
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

export const NativeBehavior = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <Button tooltip="Regular button">Regular</Button>
            <Button corners="hexagon" tooltip="Hexagon button" aria-label="Hexagon button" />
            <Button disabled onClick={() => { throw new Error('Disabled button activated'); }}>Disabled</Button>
        </div>
    ),
} satisfies Story;

export const ShadeOverride = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            {allVariants.map((variant) => (
                <Button key={variant} color="primary" variant={variant} shade={100} icon={Icons.Beaker}>
                    {variant}
                </Button>
            ))}
        </div>
    ),
} satisfies Story;
