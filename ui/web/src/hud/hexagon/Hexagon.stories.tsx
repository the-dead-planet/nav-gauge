import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { Hexagon } from './Hexagon';
import { VariantGallery } from '../../storybook/VariantGallery';
import {
    booleanControl,
    colorControl,
    colorOptions,
    optionalColorControl,
    sizeControl,
    sizeOptions,
    surfaceVariantControl,
    surfaceVariantOptions,
} from '../../storybook/controls';

const shapes = ['pointy-top', 'flat-top'] as const;

const meta = {
    title: 'Hud/Hexagon',
    component: Hexagon,
    args: {
        children: 'Hexagon',
        color: 'primary',
        variant: 'fill-translucent',
        size: 'md',
        shape: 'pointy-top',
        strokeWidth: 2,
        interactive: true,
        active: false,
        disabled: false,
        activeGlow: 'none',
    },
    argTypes: {
        children: { control: 'text' },
        color: colorControl,
        highlightColor: optionalColorControl,
        variant: surfaceVariantControl,
        size: sizeControl,
        shape: { control: 'select', options: shapes },
        strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 1 } },
        interactive: booleanControl,
        active: booleanControl,
        disabled: booleanControl,
        activeGlow: { control: 'select', options: ['none', 'glow', 'animate-borders-glow'] },
        onClick: { control: false },
    },
} satisfies Meta<typeof Hexagon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};

makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { Hexagon } },
    code: `import { Hexagon } from '@web-ui';

export default Hexagon;`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        size: { table: { disable: true } },
        variant: { table: { disable: true } },
        shape: { table: { disable: true } },
    },
    render: (args) => (
        <div style={{ display: 'grid', gap: 40 }}>
            {shapes.map((shape) => (
                <section key={shape}>
                    <h2>{shape}</h2>
                    <VariantGallery
                        sizes={sizeOptions}
                        colors={colorOptions}
                        variants={surfaceVariantOptions}
                        render={({ color, size, variant }) => (
                            <Hexagon
                                {...args}
                                color={color}
                                size={size}
                                variant={variant}
                                shape={shape}
                            />
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};
