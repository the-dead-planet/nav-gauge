import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ThemeName } from '@ui';
import { ThemeSelect } from './ThemeSelect';

const meta = {
    title: 'Theme/Theme Select',
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
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return <ThemeSelect {...args} value={value} onChange={setValue} />;
    },
};

export const Gallery: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: 16 }}>
            <ThemeSelect {...args} mode="light" />
            <ThemeSelect {...args} mode="dark" />
        </div>
    ),
};
