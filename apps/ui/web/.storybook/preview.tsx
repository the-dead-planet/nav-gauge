import { useState, type ReactNode } from 'react';
import type { Preview } from 'storybook-react-rsbuild';
import { Orientation, Theme, ThemeContext, ThemeMode, ThemeName, themeNameOptions, themeModeOptions, themeSpecifications } from '@ui';
import { P, useThemeVariables } from '../src';
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
                <div className="theme-mode-selection">
                    <label htmlFor="theme-mode-select" className="theme-mode-selection-label">
                        <P>Mode:</P>
                    </label>
                    <select
                        id="theme-mode-select"
                        value={themeMode}
                        onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
                        className="select"
                    >
                        {themeModeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="theme-name-select" className="theme-name-selection-label">
                        <P>Theme:</P>
                    </label>
                    <select
                        id="theme-name-select"
                        value={themeMode}
                        onChange={(e) => setThemeName(e.target.value as ThemeName)}
                        className="select"
                    >
                        {themeNameOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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
    decorators: [
        (Story) => (
            <ThemeDecorator>
                <Story />
            </ThemeDecorator>
        ),
    ],
};

export default preview;
