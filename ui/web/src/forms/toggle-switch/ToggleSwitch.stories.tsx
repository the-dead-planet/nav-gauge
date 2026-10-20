import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    colorOptions,
    fillVariantOptions,
    sizeOptions,
    toggleSwitchOrientations,
    toggleSwitchStoryArgs,
    toggleSwitchStoryControls,
} from '@ui';
import { VariantGallery } from '../../storybook/VariantGallery';
import { ToggleSwitch } from './ToggleSwitch';

const meta = {
    title: 'Forms/ToggleSwitch',
    component: ToggleSwitch,
    args: {
        ...toggleSwitchStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...toggleSwitchStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};

makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { ToggleSwitch } },
    code: `import { ToggleSwitch } from '@web-ui';

export default ToggleSwitch;`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        orientation: { table: { disable: true } },
        size: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <div style={{ display: 'grid', gap: 40 }}>
            {toggleSwitchOrientations.map((orientation) => (
                <section key={orientation}>
                    <h2>{orientation}</h2>
                    <VariantGallery
                        sizes={sizeOptions}
                        colors={colorOptions}
                        variants={fillVariantOptions}
                        render={({ color, size, variant }) => (
                            <ToggleSwitch
                                {...args}
                                color={color}
                                orientation={orientation}
                                size={size}
                                variant={variant}
                            />
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};
