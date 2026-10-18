import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { hexagonShapes, hexagonStoryArgs, hexagonStoryControls } from '@ui';
import { Hexagon } from './Hexagon';
import { VariantGallery } from '../../storybook/VariantGallery';
import {
    colorOptions,
    sizeOptions,
    surfaceVariantOptions,
} from '../../storybook/controls';

const meta = {
    title: 'Hud/Hexagon',
    component: Hexagon,
    args: hexagonStoryArgs,
    argTypes: {
        ...hexagonStoryControls,
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
            {hexagonShapes.map((shape) => (
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
