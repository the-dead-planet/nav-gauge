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
            border: "#66666e",
            'box-shadow': "#aa957b",
            divider: "#808080",
            text: "#383124",
            'text-active': "#66666e",
            error: "crimson",
            warning: "goldenrod",
            success: "darkcyan",
            info: "lightskyblue",
        }
    },
    [Theme.Dark]: {
        theme: Theme.Dark,
        colors: {
            background: "#000000",
            border: "#66666e",
            'box-shadow': "#66666e",
            divider: "#808080",
            text: "#fafafa",
            'text-active': "#66666e",
            error: "crimson",
            warning: "goldenrod",
            success: "darkcyan",
            info: "lightskyblue",
        }
    },
};
