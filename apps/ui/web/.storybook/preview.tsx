import { useState, type ReactNode } from 'react';
import type { Preview } from 'storybook-react-rsbuild';
import { Orientation, Theme, ThemeContext, ThemeName, themeOptions, themeSpecifications } from '@ui';
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
    const [themeName, setThemeName] = useState<ThemeName>(ThemeName.Dark);
    const theme = new Theme(themeSpecifications[themeName], {
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
                    <label htmlFor="theme-select" className="theme-selection-label">
                        <P>Theme:</P>
                    </label>
                    <select
                        id="theme-select"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value as ThemeName)}
                        className="select"
                    >
                        {themeOptions.map((option) => (
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
