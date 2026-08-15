import { Option } from "../model";
import { ThemeMode, ThemeName, ThemeSpecification } from "./model";
import { Theme } from "./theme";

export const themeNameOptions: Option<ThemeName>[] = [
    { value: ThemeName.Default, label: ThemeName.Default },
    { value: ThemeName.NeonBlue, label: ThemeName.NeonBlue },
];

export const themeModeOptions: Option<ThemeMode>[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
];

export const themeSpecifications: { [key in ThemeName]: { [key in ThemeMode]: ThemeSpecification } } = {
    [ThemeName.Default]: {
        light: {
            mode: 'light',
            themeName: ThemeName.Default,
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
                    shade: 200
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
        dark: {
            mode: 'dark',
            themeName: ThemeName.Default,
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
    },
    [ThemeName.NeonBlue]: {
        light: {
            mode: 'light',
            themeName: ThemeName.NeonBlue,
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
                    shade: 200
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
                primary: Theme.palette.blue,
                secondary: Theme.palette.lime,
                tertiary: Theme.palette.red,
                neutral: Theme.palette.grey,
            }
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.NeonBlue,
            colors: {
                primary: Theme.palette.blue,
                secondary: Theme.palette.lime,
                tertiary: Theme.palette.red,
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
    },
};
