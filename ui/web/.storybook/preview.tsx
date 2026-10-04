import { useState, type ReactNode } from 'react';
import type { Preview } from 'storybook-react-rsbuild';
import { themes } from 'storybook/theming';
import { Orientation, Theme, ThemeContext, ThemeMode, ThemeName, themeNameOptions, themeSpecifications } from '@ui';
import { Dropdown, Label, ThemeModeToggle, useThemeVariables } from '../src';
import './preview.css';

const getMedia = () => {
    return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight
            ? Orientation.Landscape
            : Orientation.Portrait
    }
};

const ThemeDecorator = ({ children }: { children: ReactNode }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [themeName, setThemeName] = useState<ThemeName>(ThemeName.Default);
    const theme = new Theme(themeSpecifications[themeName][themeMode], {
        initial: () => getMedia(),
        subscribe: (onChange) => {
            const handler = () => {
                onChange(getMedia());
            };
            window.addEventListener('resize', handler);

            return {
                unsubscribe: () => window.removeEventListener('resize', handler)
            }
        }
    });

    useThemeVariables(theme);

    return (
        <ThemeContext.Provider value={theme}>
            <div>
                <div className="theme-selection">
                    <div className="theme-mode-toggle">
                        <ThemeModeToggle
                            mode={themeMode}
                            lightModeTooltip="Switch to light mode"
                            darkModeTooltip="Switch to dark mode"
                            onToggle={() => setThemeMode((currentMode) => currentMode === 'dark' ? 'light' : 'dark')}
                        />
                    </div>
                    <div className="theme-selection-field">
                        <Label id="theme-name-label">Theme</Label>
                        <Dropdown
                            labelledBy="theme-name-label"
                            size="md"
                            value={themeName}
                            options={themeNameOptions}
                            onChange={setThemeName}
                        />
                    </div>
                </div>
                <div className="story">
                    {children}
                </div>
            </div>
        </ThemeContext.Provider>
    );
};

const preview: Preview = {
    tags: ['autodocs'],
    parameters: {
        docs: {
            theme: themes.dark,
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
