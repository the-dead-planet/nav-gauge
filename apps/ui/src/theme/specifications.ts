import { Theme, ThemeOption, ThemeSpecification } from "./model";

export const themeOptions: ThemeOption[] = [
    { value: Theme.Dark, label: 'Dark' },
    { value: Theme.Light, label: 'Light' },
];

export const themes: { [key in Theme]: ThemeSpecification } = {
    [Theme.Light]: {
        theme: Theme.Light,
        colors: {
            background: "#dad9cd",
            text: "#383124",
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
