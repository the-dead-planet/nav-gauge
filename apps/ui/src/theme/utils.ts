import { createContext, ReactNode, useContext } from "react";
import { Theme, ThemeOption, ThemeSpecification } from "./model";

export const themeOptions: ThemeOption[] = [
    { value: Theme.Dark, label: 'Dark' },
    { value: Theme.Light, label: 'Light' },
];

export const themes: { [key in Theme]: ThemeSpecification } = {
    [Theme.Light]: {
        colors: {
            background: "#fafafa",
            text: "#ffffff",
        }
    },
    [Theme.Dark]: {
        colors: {
            background: "#000000",
            text: "#fafafa",
        }
    },
};

export const ThemeContext = createContext<ThemeSpecification | undefined>(undefined);

export const useTheme = (): ThemeSpecification => {
    const context = useContext(ThemeContext);
console.log({context})
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
