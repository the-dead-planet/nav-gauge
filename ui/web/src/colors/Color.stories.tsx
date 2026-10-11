import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Color } from './Color';
import { Icons, Theme, useTheme } from '@ui';
import type { ButtonCorners, SurfaceVariant, ThemeColor } from '@ui';
import { Text } from '../typography';
import { Fragment, useEffect, useState } from 'react';
import { ColorBox } from './ColorBox';
import { Button } from '../button';

const copyPalette = (color: ThemeColor): void => {
    const rgbByShade = Object.fromEntries(
        Object.entries(color).map(([shade, { r, g, b }]) => [shade, `rgb(${r}, ${g}, ${b})`])
    );
    void navigator.clipboard.writeText(JSON.stringify(rgbByShade, null, 4));
};

const meta = {
    title: 'Design System/Color Palette',
} satisfies Meta<typeof Color>;

export default meta;
type Story = StoryObj<typeof meta>;

const VariantStates = ({ variant }: { variant: SurfaceVariant }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
            variant={variant}
            icon={Icons.Beaker}
        >
            Default
        </Button>
        <Button
            variant={variant}
            icon={Icons.Beaker}
            active
        >
            Active
        </Button>
        <Button
            variant={variant}
            icon={Icons.Beaker}
            disabled
        >
            Disabled
        </Button>
    </div>
);

const AnimatedGlowButton = ({ corners = 'square' }: { corners?: ButtonCorners }) => {
    const [active, setActive] = useState(true);

    useEffect(() => {
        const interval = window.setInterval(() => setActive((current) => !current), 1000);
        return () => window.clearInterval(interval);
    }, []);

    return (
        <Button
            variant="outline"
            color="primary"
            highlightColor="secondary"
            activeGlow="animate-borders-glow"
            icon={Icons.Beaker}
            corners={corners}
            size="lg"
            active={active}
            aria-label="Animated border glow"
        />
    );
};

export const ColorPalette = {
    render: () => (
        <div
            style={{
                display: 'grid',
                rowGap: '12px',
            }}
        >
            {Object.entries(Theme.palette).map(([name, color]) => (
                <Color
                    key={name}
                    name={name}
                    color={color}
                    action={(
                        <Button
                            icon={Icons.NounProject.Copy}
                            tooltip={`Copy ${name} palette as RGB JSON`}
                            onClick={() => copyPalette(color)}
                        />
                    )}
                />
            ))}
        </div>
    ),
} satisfies Story;

export const ComponentColors = {
    render: () => {
        const theme = useTheme();

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: ' max-content max-content',
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                {Object.entries(theme.componentColors).map(([name, color]) => (
                    <Fragment key={name}>
                        <Text>{name}</Text>
                        <ColorBox
                            name={color.name}
                            color={theme.colors[color.name]}
                            shade={color.shade}
                            size={40}
                            showPaletteOnHover
                        />
                    </Fragment>
                ))}
            </div>
        );
    },
} satisfies Story;

export const FillStates = {
    render: () => <VariantStates variant="fill" />,
} satisfies Story;

export const FillInverseStates = {
    render: () => <VariantStates variant="fill-inverse" />,
} satisfies Story;

export const FillTranslucentStates = {
    render: () => <VariantStates variant="fill-translucent" />,
} satisfies Story;

export const GhostStates = {
    render: () => <VariantStates variant="ghost" />,
} satisfies Story;

export const OutlineStates = {
    render: () => <VariantStates variant="outline" />,
} satisfies Story;

export const InsetStates = {
    render: () => <VariantStates variant="inset" />,
} satisfies Story;

export const ActiveGlow = {
    render: () => (
        <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button
                    variant="outline"
                    color="primary"
                    highlightColor="secondary"
                    activeGlow="glow"
                    icon={Icons.Beaker}
                    size="lg"
                    active
                    aria-label="Static glow"
                />
                <AnimatedGlowButton />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button
                    variant="outline"
                    color="primary"
                    highlightColor="secondary"
                    activeGlow="glow"
                    icon={Icons.Beaker}
                    corners="hexagon"
                    size="lg"
                    active
                    aria-label="Static hexagon glow"
                />
                <AnimatedGlowButton corners="hexagon" />
            </div>
        </div>
    ),
} satisfies Story;
