import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { ThemeName } from '@ui';
import { ThemeSelect } from './ThemeSelect';
import { Label } from '../typography';

const meta = {
    title: 'Design System/Theme Select',
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
    render: (args) => {
        return (
            <div style={{ display: 'flex', gap: 16 }}>
                <div>
                    <Label style={{ display: 'block' }}>Light Mode</Label>
                    <ThemeSelect {...args} mode="light" />
                </div>
                <div>
                    <Label style={{ display: 'block' }}>Dark Mode</Label>
                    <ThemeSelect {...args} mode="dark" />
                </div>
            </div>
        );
    },
};
