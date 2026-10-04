import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { ThemeName } from '@ui';
import { ThemeSelect } from './ThemeSelect';

const meta = {
    title: 'Colors & Theme/Theme Select',
    component: ThemeSelect,
    args: {
        mode: 'dark',
        value: ThemeName.Default,
        onChange: () => undefined,
    },
    argTypes: {
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
    render: (args) => (
        <div style={{ display: 'flex', gap: 16 }}>
            <ThemeSelect {...args} mode="light" />
            <ThemeSelect {...args} mode="dark" />
        </div>
    ),
};
