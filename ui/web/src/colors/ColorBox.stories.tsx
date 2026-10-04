import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { allColorShades, Theme } from '@ui';
import { ColorBox } from './ColorBox';

const meta = {
    title: 'Design System/Color Box',
    component: ColorBox,
    args: {
        name: 'Copper',
        color: Theme.palette.copper,
        shade: 500,
        size: 24,
        showPaletteOnHover: true,
    },
    argTypes: {
        color: {
            control: 'select',
            options: Object.keys(Theme.palette),
            mapping: Theme.palette,
        },
        shade: {
            control: 'select',
            options: allColorShades,
        },
        size: {
            control: { type: 'range', min: 8, max: 64, step: 1 },
        },
    },
} satisfies Meta<typeof ColorBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};

makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { ColorBox }, '@ui': { Theme } },
    code: `import { Theme } from '@ui';
import { ColorBox } from '@web-ui';

export default () => <ColorBox color={Theme.palette.copper} size={24} showPaletteOnHover />;`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries(Theme.palette).map(([name, color]) => (
                <ColorBox
                    key={name}
                    name={name}
                    color={color}
                    size={24}
                    showPaletteOnHover
                />
            ))}
        </div>
    ),
};
