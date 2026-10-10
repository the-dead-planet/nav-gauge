import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Color } from './Color';
import { Icons, Theme, useTheme } from '@ui';
import type { ThemeColor } from '@ui';
import { Text } from '../typography';
import { Fragment } from 'react';
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
