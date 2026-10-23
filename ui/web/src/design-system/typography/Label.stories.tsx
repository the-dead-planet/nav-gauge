import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { appearanceColorOptions, typographyStoryArgs, typographyStoryControls } from '@ui';
import { Label } from './Label';
import styles from './typography-gallery.module.css';

const { usage: _usage, ...args } = typographyStoryArgs;
const { usage: _usageControl, ...controls } = typographyStoryControls;
const meta = {
    title: 'Design System/Label',
    component: Label,
    args: {
        ...args,
        children: 'Label',
    },
    argTypes: controls,
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};
makeLiveEditStory(Playground, {
    availableImports: {
        '@web-ui': {
            Label,
        },
    },
    code: `import { Label } from '@web-ui';

export default Label;`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    argTypes: {
        color: {
            table: {
                disable: true,
            },
        },
    },
    render: (props) => (
        <div className={styles.gallery}>
            {appearanceColorOptions.map((color) => <Label {...props} key={color} color={color} />)}
        </div>
    ),
};
