import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    appearanceColorOptions,
    fillVariantOptions,
    sizeOptions,
    ThemeName,
    themeModeOptions,
    themeSelectStoryArgs,
    themeSelectStoryControls,
} from '@ui';
import { ThemeSelect } from './ThemeSelect';
import { VariantGallery } from '../../storybook/VariantGallery';

const meta = {
    title: 'Assemblies/Theme Select',
    component: ThemeSelect,
    args: {
        ...themeSelectStoryArgs,
        onChange: () => undefined,
    },
    argTypes: {
        ...themeSelectStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ThemeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return <ThemeSelect {...args} value={value} onChange={setValue} />;
    },
};

makeLiveEditStory(Playground, {
    availableImports: {
        '@web-ui': { ThemeSelect },
        '@ui': { ThemeName },
    },
    code: `import { useState } from 'react';
import { ThemeName } from '@ui';
import { ThemeSelect } from '@web-ui';

export default () => {
    const [value, setValue] = useState(ThemeName.Default);
    return <ThemeSelect mode="dark" value={value} onChange={setValue} />;
};`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    argTypes: {
        mode: {
            table: {
                disable: true,
            },
        },
        color: {
            table: {
                disable: true,
            },
        },
        size: {
            table: {
                disable: true,
            },
        },
        variant: {
            table: {
                disable: true,
            },
        },
    },
    render: (args) => (
        <>
            {themeModeOptions.map(({ value: mode, label }) => (
                <section key={mode}>
                    <h2>{label}</h2>
                    <VariantGallery
                        sizes={sizeOptions}
                        colors={appearanceColorOptions}
                        variants={fillVariantOptions}
                        render={({ size, color, variant }) => (
                            <ThemeSelect
                                {...args}
                                mode={mode}
                                size={size}
                                color={color}
                                variant={variant}
                            />
                        )}
                    />
                </section>
            ))}
        </>
    ),
};
