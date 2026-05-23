import { useState, type ReactNode } from 'react';
import type { Preview } from 'storybook-react-rsbuild';
import { Theme, ThemeContext, ThemeName, themeOptions, themeSpecifications } from '@ui';
import './preview.css';

const ThemeDecorator = ({ children }: { children: ReactNode }) => {
    const [themeName, setThemeName] = useState<ThemeName>(ThemeName.Light);
    const theme = new Theme(themeSpecifications[themeName]);

    return (
        <ThemeContext.Provider value={theme}>
            <div style={{
                padding: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Century Gothic", sans-serif',
            }}>
                <div style={{
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <label htmlFor="theme-select" style={{ fontWeight: 'bold' }}>Theme:</label>
                    <select
                        id="theme-select"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value as ThemeName)}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                        }}
                    >
                        {themeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: theme.componentColor('background'),
                    color: theme.componentColor('text'),
                }}>
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
