import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ChipColor, Icons } from '@ui';
import { Chip } from './Chip';
import { sizeOptions as allSizes, surfaceVariantOptions as allVariants } from '../storybook/controls';

const meta = {
    title: 'Chip',
    component: Chip,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const allColors: ChipColor[] = ['warning', 'success', 'error', 'info', 'neutral', 'primary', 'secondary', 'tertiary'];

export const ChipVariants = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {allVariants.map((variant) => (
                <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {allSizes.map((size) => (
                        allColors.map((color) => (
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
