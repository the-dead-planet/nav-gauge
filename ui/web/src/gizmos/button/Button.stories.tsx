import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { appearanceColorOptions, buttonCorners, buttonStoryArgs, buttonStoryControls, Icons } from '@ui';
import { Button } from './Button';
import { VariantGallery } from '../../storybook/VariantGallery';
import {
    sizeOptions,
    surfaceVariantOptions,
} from '../../storybook/controls';

const meta = {
    title: 'Gizmos/Button',
    component: Button,
    args: {
        ...buttonStoryArgs,
        icon: Icons.Beaker,
    },
    argTypes: {
        ...buttonStoryControls,
        icon: {
            control: 'select',
            options: ['None', 'Beaker', 'Light bulb'],
            mapping: {
                None: undefined,
                Beaker: Icons.Beaker,
                'Light bulb': Icons.NounProject.LightBulbCogWheel,
            },
        },
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
        <div style={{ display: 'grid', gap: 40 }}>
            {buttonCorners.map((corners) => (
                <section key={corners}>
                    <h2>{corners}</h2>
                    <VariantGallery
                        sizes={sizeOptions}
                        colors={appearanceColorOptions}
                        variants={surfaceVariantOptions}
                        render={({ color, size, variant }) => (
                        <Button
                            {...args}
                            color={color}
                            size={size}
                            variant={variant}
                            corners={corners}
                            title={`Color: ${color}`}
                            aria-label={corners === 'square' ? undefined : `${corners} button`}
                        >
                            {corners === 'square' ? args.children : null}
                        </Button>
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};
