import { Option } from "../model";
import { ThemeName, ThemeSpecification } from "./model";

export const themeOptions: Option<ThemeName>[] = [
    { value: ThemeName.Dark, label: 'Dark' },
    { value: ThemeName.Light, label: 'Light' },
];

export const themes: { [key in ThemeName]: ThemeSpecification } = {
    [ThemeName.Light]: {
        themeName: ThemeName.Light,
        colors: {
            background: "#dad9cd",
            border: "#66666e",
            'box-shadow': "#aa957b",
            divider: "#808080",
            button: "gray",
            text: "#383124",
            'text-active': "#66666e",
            error: "crimson",
            warning: "goldenrod",
            success: "darkcyan",
            info: "lightskyblue",
        }
    },
    [ThemeName.Dark]: {
        themeName: ThemeName.Dark,
        colors: {
            background: "#000000",
            border: "#66666e",
            'box-shadow': "#66666e",
            divider: "#808080",
            button: "gray",
            text: "#fafafa",
            'text-active': "#66666e",
            error: "crimson",
            warning: "goldenrod",
            success: "darkcyan",
            info: "lightskyblue",
        }
    },
};
