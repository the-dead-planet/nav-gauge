import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { appearanceColorOptions, FontType, typographyStoryArgs, typographyStoryControls, typographyUsages } from '@ui';
import { H1, H2, H3, H4, H5, H6, P, Span, Text } from './';
import styles from './typography-gallery.module.css';

const meta = {
    title: 'Design System/Text',
    component: Text,
    args: typographyStoryArgs,
    argTypes: {
        ...typographyStoryControls,
        as: {
            control: 'select',
            options: ['Default', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            mapping: {
                Default: undefined,
            },
        },
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};

makeLiveEditStory(Playground, {
    availableImports: {
        '@web-ui': {
            Text,
            H1,
            H2,
            H3,
            H4,
            H5,
            H6,
            P,
            Span,
        },
    },
    code: `import { Text } from '@web-ui';

export default Text;`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    argTypes: {
        color: {
            table: {
                disable: true,
            },
        },
        usage: {
            table: {
                disable: true,
            },
        },
        fontType: {
            table: {
                disable: true,
            },
        },
        as: {
            table: {
                disable: true,
            },
        },
    },
    render: ({ usage: _usage, as: _as, children, ...args }) => (
        <div className={styles.gallery}>
            {Object.values(FontType).map((fontType) => (
                <section key={fontType} className={styles.section}>
                    <h2>{fontType}</h2>
                    {typographyUsages.map((usage) => appearanceColorOptions.map((color) => (
                        <Text
                            {...args}
                            key={`${usage}-${color}`}
                            as={undefined}
                            usage={usage}
                            color={color}
                            fontType={fontType}
                        >
                            {color}: {children}
                        </Text>
                    )))}
                </section>
            ))}
            <section className={styles.section}>
                <h2>Semantic elements</h2>
                {[H1, H2, H3, H4, H5, H6, P, Span].map((Component, index) => (
                    <Component {...args} key={index}>Semantic element {index + 1}</Component>
                ))}
            </section>
        </div>
    ),
};
