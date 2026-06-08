import { Option } from "../model";
import { ThemeName, ThemeSpecification } from "./model";
import { Theme } from "./theme";

export const themeOptions: Option<ThemeName>[] = [
    { value: ThemeName.Dark, label: 'Dark' },
    { value: ThemeName.Light, label: 'Light' },
];

export const themeSpecifications: { [key in ThemeName]: ThemeSpecification } = {
    [ThemeName.Light]: {
        mode: 'light',
        themeName: ThemeName.Light,
        componentColors: {
            background: {
                name: 'neutral',
                shade: 100
            },
            "menu-background": {
                name: 'neutral',
                shade: 200
            },
            border: {
                name: 'neutral',
                shade: 800
            },
            'box-shadow': {
                name: 'neutral',
                shade: 800
            },
            divider: {
                name: 'neutral',
                shade: 800
            },
            button: {
                name: 'neutral',
                shade: 200
            },
            text: {
                name: 'neutral',
                shade: 900
            },
            'text-active': {
                name: 'teal',
                shade: 500
            },
            error: {
                name: 'red',
                shade: 600
            },
            warning: {
                name: 'yellow',
                shade: 500
            },
            success: {
                name: 'lime',
                shade: 500
            },
            info: {
                name: 'blue',
                shade: 400
            },
        },
        colors: {
            primary: Theme.palette.green,
            secondary: Theme.palette['copper-dark'],
            tertiary: Theme.palette.magenta,
            neutral: Theme.palette.grey,
        }
    },
    [ThemeName.Dark]: {
        mode: 'dark',
        themeName: ThemeName.Dark,
        colors: {
            primary: Theme.palette.teal,
            secondary: Theme.palette.yellow,
            tertiary: Theme.palette.pink,
            neutral: Theme.palette.grey,
        },
        componentColors: {
            background: {
                name: 'neutral',
                shade: 900
            },
            "menu-background": {
                name: 'neutral',
                shade: 700
            },
            border: {
                name: 'neutral',
                shade: 800
            },
            'box-shadow': {
                name: 'neutral',
                shade: 800
            },
            divider: {
                name: 'neutral',
                shade: 800
            },
            button: {
                name: 'neutral',
                shade: 800
            },
            text: {
                name: 'neutral',
                shade: 100
            },
            'text-active': {
                name: 'teal',
                shade: 500
            },
            error: {
                name: 'red',
                shade: 600
            },
            warning: {
                name: 'yellow',
                shade: 500
            },
            success: {
                name: 'lime',
                shade: 500
            },
            info: {
                name: 'blue',
                shade: 400
            },
        },
    },
};
