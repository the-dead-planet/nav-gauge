import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { appearanceColorOptions, typographyStoryArgs, typographyStoryControls } from '@ui';
import { LinkText } from './LinkText';
import styles from './typography-gallery.module.css';

const { variant: _variant, ...args } = typographyStoryArgs;
const { variant: _variantControl, ...controls } = typographyStoryControls;
const meta = {
    title: 'Design System/LinkText',
    component: LinkText,
    args: {
        ...args,
        href: 'https://openstreetmap.org/copyright',
        children: 'OpenStreetMap copyright',
    },
    argTypes: controls,
} satisfies Meta<typeof LinkText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};
makeLiveEditStory(Playground, {
    availableImports: {
        '@web-ui': {
            LinkText,
        },
    },
    code: `import { LinkText } from '@web-ui';

export default LinkText;`,
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
            {appearanceColorOptions.map((color) => <LinkText {...props} key={color} color={color} />)}
        </div>
    ),
};
