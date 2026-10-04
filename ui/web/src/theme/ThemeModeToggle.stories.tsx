import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ThemeMode } from '@ui';
import { ThemeModeToggle } from './ThemeModeToggle';

const meta = {
    title: 'Design System/Theme Mode Toggle',
    component: ThemeModeToggle,
    args: {
        mode: 'dark',
        lightModeTooltip: 'Switch to light mode',
        darkModeTooltip: 'Switch to dark mode',
        onToggle: () => undefined,
    },
    argTypes: {
        onToggle: { control: false },
    },
} satisfies Meta<typeof ThemeModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [mode, setMode] = useState<ThemeMode>(args.mode);

        return (
            <ThemeModeToggle
                {...args}
                mode={mode}
                onToggle={() => setMode((currentMode) => currentMode === 'dark' ? 'light' : 'dark')}
            />
        );
    },
};

export const Gallery: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: 16 }}>
            <ThemeModeToggle {...args} mode="light" onToggle={() => undefined} />
            <ThemeModeToggle {...args} mode="dark" onToggle={() => undefined} />
        </div>
    ),
};
