import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Color } from './Color';
import { Theme, useTheme } from '@ui';
import { Text } from '../typography';
import { Fragment } from 'react';
import { ColorBox } from './ColorBox';

const meta = {
    title: 'Design System/Colors',
} satisfies Meta<typeof Color>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPalette = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: ' max-content max-content',
                alignItems: 'center',
                columnGap: '20px',
            }}
        >
            {Object.entries(Theme.palette).map(([name, color]) => (
                <Color key={name} name={name} color={color} />
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
