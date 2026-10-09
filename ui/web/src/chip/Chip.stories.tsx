import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { chipColorOptions, Icons } from '@ui';
import { Chip } from './Chip';
import { sizeOptions as allSizes, surfaceVariantOptions as allVariants } from '../storybook/controls';

const meta = {
    title: 'Chip',
    component: Chip,
    args: { children: 'Chip', color: 'primary', size: 'sm', variant: 'fill', icon: Icons.NounProject.UnderConstruction },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {allVariants.map((variant) => (
                <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {allSizes.map((size) => (
                        chipColorOptions.map((color) => (
                            <Chip key={`${variant}-${size}-${color}`} variant={variant} size={size} color={color} icon={Icons.NounProject.UnderConstruction}>
                                {color}
                            </Chip>
                        ))
                    ))}
                </div>
            ))}
        </div>
    ),
} satisfies Story;
