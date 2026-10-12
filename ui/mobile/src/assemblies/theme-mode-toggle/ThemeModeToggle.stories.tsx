import { FC } from 'react';
import { ThemeModeToggle } from './ThemeModeToggle';

export const Playground: FC = () => (
    <ThemeModeToggle
        lightModeTooltip="Switch to light mode"
        darkModeTooltip="Switch to dark mode"
        onToggle={() => undefined}
    />
);

export const Gallery: FC = () => (
    <ThemeModeToggle
        lightModeTooltip="Switch to light mode"
        darkModeTooltip="Switch to dark mode"
        onToggle={() => undefined}
    />
);
