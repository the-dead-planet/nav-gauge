import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { ButtonCorners, Icons } from '@ui';
import { Button } from './Button';
import { VariantGallery } from '../storybook/VariantGallery';
import {
    booleanControl,
    colorControl,
    colorOptions,
    optionalColorControl,
    optionalShadeControl,
    sizeControl,
    sizeOptions,
    surfaceVariantControl,
    surfaceVariantOptions,
    themeModeControl,
} from '../storybook/controls';

const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle', 'hexagon'];

const meta = {
    title: 'Button',
    component: Button,
    args: {
        children: 'Button',
        icon: Icons.Beaker,
        active: false,
        disabled: false,
        showTooltipConnection: false,
    },
    argTypes: {
        children: { control: 'text' },
        icon: {
            control: 'select',
            options: ['None', 'Beaker', 'Light bulb'],
            mapping: {
                None: undefined,
                Beaker: Icons.Beaker,
                'Light bulb': Icons.NounProject.LightBulbCogWheel,
            },
        },
        color: colorControl,
        shade: optionalShadeControl,
        highlightColor: optionalColorControl,
        highlightShade: optionalShadeControl,
        variant: surfaceVariantControl,
        glowStyle: { control: 'select', options: ['none', 'glow', 'animate-borders-glow'] },
        size: sizeControl,
        corners: { control: 'select', options: allCorners },
        active: booleanControl,
        disabled: booleanControl,
        tooltipPlacement: {
            control: 'select',
            options: ['Default', 'auto', 'top', 'right', 'bottom', 'left'],
            mapping: { Default: undefined },
        },
        tooltip: { control: 'text' },
        showTooltipConnection: { control: 'boolean' },
        themeMode: themeModeControl,
        iconRotateX: { control: { type: 'range', min: 0, max: 360, step: 1 } },
        iconRotateZ: { control: { type: 'range', min: 0, max: 360, step: 1 } },
        onClick: { control: false },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};

makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { Button } },
    code: `import { Button } from '@web-ui';

export default Button;`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        size: { table: { disable: true } },
        variant: { table: { disable: true } },
        corners: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            sizes={sizeOptions}
            colors={colorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {allCorners.map((corners) => (
                        <Button
                            {...args}
                            key={corners}
                            color={color}
                            size={size}
                            variant={variant}
                            corners={corners}
                        >
                            {corners === 'hexagon' ? null : args.children}
                        </Button>
                    ))}
                </div>
            )}
        />
    ),
};
