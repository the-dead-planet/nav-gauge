import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ThemeModeToggle } from './ThemeModeToggle';

const meta = {
    title: 'Design System/Theme Mode Toggle',
    component: ThemeModeToggle,
    args: {
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
};

export const Gallery: Story = {
    render: (args) => <ThemeModeToggle {...args} />,
};
