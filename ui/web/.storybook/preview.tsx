import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Preview } from 'storybook-react-rsbuild';
import {
    Orientation,
    Theme,
    ThemeContext,
    ThemeMode,
    ThemeName,
    themeSpecifications,
} from '@ui';
import { Label, ThemeModeToggle, ThemeSelect, useThemeVariables } from '../src';
import { storybookTheme } from './theme';
import './preview.css';

const getMedia = () => {
    return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        orientation:
            window.innerWidth > window.innerHeight
                ? Orientation.Landscape
                : Orientation.Portrait,
    };
};

const ThemeDecorator = ({ children }: { children: ReactNode }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [themeName, setThemeName] = useState<ThemeName>(ThemeName.Default);
    const theme = useMemo(() => new Theme(
        themeSpecifications[themeName][themeMode],
        {
            initial: () => getMedia(),
            subscribe: (onChange) => {
                const handler = () => {
                    onChange(getMedia());
                };
                window.addEventListener('resize', handler);

                return {
                    unsubscribe: () =>
                        window.removeEventListener('resize', handler),
                };
            },
        },
    ), [themeMode, themeName]);

    useEffect(() => () => theme.destroy(), [theme]);

    useThemeVariables(theme);

    return (
        <ThemeContext.Provider value={theme}>
            <div>
                <div className="theme-selection">
                    <div className="theme-mode-toggle">
                        <ThemeModeToggle
                            lightModeTooltip="Switch to light mode"
                            darkModeTooltip="Switch to dark mode"
                            onToggle={() =>
                                setThemeMode((currentMode) =>
                                    currentMode === 'dark' ? 'light' : 'dark',
                                )
                            }
                        />
                    </div>
                    <div className="theme-selection-field">
                        <Label id="theme-name-label">Theme</Label>
                        <ThemeSelect
                            mode={themeMode}
                            value={themeName}
                            onChange={setThemeName}
                        />
                    </div>
                </div>
                <div className="story">{children}</div>
            </div>
        </ThemeContext.Provider>
    );
};

const preview: Preview = {
    tags: ['autodocs'],
    parameters: {
        docs: {
            theme: {
                ...storybookTheme,
                colorSecondary: storybookTheme.barSelectedColor,
            },
        },
        options: {
            storySort: {
                order: [
                    'Design System',
                    [
                        'Overview',
                        'Typography',
                        'Colors',
                        'Icons',
                        'Theming',
                        'Appearance',
                        'Sizing',
                        'Motion',
                    ],
                    'Chassis',
                    'Motion',
                    'Hud',
                    'Gizmos',
                    'Rigs',
                    'Forms',
                    'Assemblies',
                    'Application',
                    '*',
                ],
            },
        },
    },
    decorators: [
        (Story) => (
            <ThemeDecorator>
                <Story />
            </ThemeDecorator>
        ),
    ],
};

export default preview;
