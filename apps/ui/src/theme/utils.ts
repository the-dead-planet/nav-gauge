import { Theme, ThemeOption, ThemeSpecification } from "./model";

export const themeOptions: ThemeOption[] = [
    { value: Theme.Dark, label: 'Dark' },
    { value: Theme.Light, label: 'Light' },
];

export const themes: { [key in Theme]: ThemeSpecification } = {
    [Theme.Light]: {
        theme: Theme.Light,
        colors: {
            background: "#fafafa",
            text: "#000000",
        }
    },
    [Theme.Dark]: {
        theme: Theme.Dark,
        colors: {
            background: "#000000",
            text: "#fafafa",
        }
    },
};
