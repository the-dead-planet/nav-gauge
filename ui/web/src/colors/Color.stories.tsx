import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Color } from './Color';
import { Theme, useTheme } from '@ui';
import { Text } from '../typography';

const meta = {
    title: 'Colors',
} satisfies Meta<typeof Color>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPalette = {
    render: () => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: ' max-content max-content',
            alignItems: 'center',
            columnGap: '20px',
        }}>
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
            <div style={{
                display: 'grid',
                gridTemplateColumns: ' max-content max-content',
                alignItems: 'center',
                gap: '20px',
            }}>
                {Object.entries(theme.componentColors).map(([name, color]) => (
                    <>
                        <Text>{name}</Text>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            display: 'block',
                            backgroundColor: theme.color(color.name, color.shade),
                        }} />
                    </>
                ))}
            </div>
        );
    },
} satisfies Story;
