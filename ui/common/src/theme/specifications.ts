import { Option } from "../model";
import { ThemeMode, ThemeName, ThemeSpecification } from "./model";
import { Theme } from "./theme";

export const themeNameOptions: Option<ThemeName>[] = Object.values(ThemeName)
    .map((value) => ({ value, label: value }));

export const themeModeOptions: Option<ThemeMode>[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
];

export const defaultComponentColors: { [key in ThemeMode]: ThemeSpecification['componentColors'] } = {
    light: {
        background: {
            name: 'neutral',
            shade: 100
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
        text: {
            name: 'neutral',
            shade: 900
        },
        'text-inverse': {
            name: 'neutral',
            shade: 50
        },
        error: {
            name: 'red',
            shade: 600
        },
        warning: {
            name: 'copper',
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
    dark: {
        background: {
            name: 'neutral',
            shade: 900
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
        text: {
            name: 'neutral',
            shade: 100
        },
        'text-inverse': {
            name: 'neutral',
            shade: 900
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
}

const standardTheme = (
    themeName: ThemeName,
    lightColors: ThemeSpecification['colors'],
    darkColors: ThemeSpecification['colors'],
): { [key in ThemeMode]: ThemeSpecification } => ({
    light: {
        mode: 'light',
        themeName,
        componentColors: defaultComponentColors.light,
        colors: lightColors,
    },
    dark: {
        mode: 'dark',
        themeName,
        componentColors: defaultComponentColors.dark,
        colors: darkColors,
    },
});

export const themeSpecifications: { [key in ThemeName]: { [key in ThemeMode]: ThemeSpecification } } = {
    [ThemeName.Default]: standardTheme(
        ThemeName.Default,
        {
            primary: Theme.palette.teal,
            secondary: Theme.palette.copper,
            tertiary: Theme.palette.magenta,
            neutral: Theme.palette['neutral-grey'],
        },
        {
            primary: Theme.palette.teal,
            secondary: Theme.palette.yellow,
            tertiary: Theme.palette.pink,
            neutral: Theme.palette['neutral-grey'],
        },
    ),
    [ThemeName.NeonBlue]: standardTheme(
        ThemeName.NeonBlue,
        {
            primary: Theme.palette.navy,
            secondary: Theme.palette.navy,
            tertiary: Theme.palette.copper,
            neutral: Theme.palette['neutral-grey'],
        },
        {
            primary: Theme.palette.blue,
            secondary: Theme.palette.blue,
            tertiary: Theme.palette.copper,
            neutral: Theme.palette['neutral-grey'],
        },
    ),
    [ThemeName.Batman]: {
        light: {
            mode: 'light',
            themeName: ThemeName.Batman,
            componentColors: {
                ...defaultComponentColors.light,
                warning: {
                    name: 'luminous-yellow',
                    shade: 600,
                },
                "border": {
                    name: "luminous-yellow",
                    shade: 400,
                },
                "divider": {
                    name: "luminous-yellow",
                    shade: 400,
                },
            },
            colors: {
                primary: Theme.palette['neutral-blue'],
                secondary: Theme.palette['neutral-blue'],
                tertiary: Theme.palette['dark-gold'],
                neutral: Theme.palette['neutral-blue'],
            }
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.Batman,
            componentColors: {
                ...defaultComponentColors.dark,
                warning: {
                    name: 'luminous-yellow',
                    shade: 500,
                },
            },
            colors: {
                primary: Theme.palette['neutral-blue'],
                secondary: Theme.palette['neutral-blue'],
                tertiary: Theme.palette['luminous-yellow'],
                neutral: Theme.palette['neutral-blue'],
            },
        }
    },
    [ThemeName.Joker]: {
        light: {
            mode: 'light',
            themeName: ThemeName.Joker,
            componentColors: {
                ...defaultComponentColors.light,
                warning: {
                    name: 'chartreuse',
                    shade: 500,
                }
            },
            colors: {
                primary: Theme.palette.violet,
                secondary: Theme.palette.lime,
                tertiary: Theme.palette['burnt-orange'],
                neutral: Theme.palette['neutral-grey'],
            }
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.Joker,
            componentColors: {
                ...defaultComponentColors.dark,
                warning: {
                    name: 'chartreuse',
                    shade: 500,
                }
            },
            colors: {
                primary: Theme.palette.violet,
                secondary: Theme.palette.lime,
                tertiary: Theme.palette['burnt-orange'],
                neutral: Theme.palette['deep-violet'],
            },
        }
    },
    [ThemeName.Foundry]: standardTheme(
        ThemeName.Foundry,
        {
            primary: Theme.palette.mahogany,
            secondary: Theme.palette.copper,
            tertiary: Theme.palette.teal,
            neutral: Theme.palette['neutral-brown'],
        },
        {
            primary: Theme.palette.coral,
            secondary: Theme.palette.copper,
            tertiary: Theme.palette.aqua,
            neutral: Theme.palette['neutral-brown'],
        },
    ),
    [ThemeName.Aurora]: standardTheme(
        ThemeName.Aurora,
        {
            primary: Theme.palette.indigo,
            secondary: Theme.palette.mint,
            tertiary: Theme.palette.rose,
            neutral: Theme.palette['neutral-violet'],
        },
        {
            primary: Theme.palette.purple,
            secondary: Theme.palette.mint,
            tertiary: Theme.palette.rose,
            neutral: Theme.palette['deep-violet'],
        },
    ),
    [ThemeName.SolarFlare]: standardTheme(
        ThemeName.SolarFlare,
        {
            primary: Theme.palette.orange,
            secondary: Theme.palette.plum,
            tertiary: Theme.palette.green,
            neutral: Theme.palette['neutral-khaki'],
        },
        {
            primary: Theme.palette.peach,
            secondary: Theme.palette.magenta,
            tertiary: Theme.palette.mint,
            neutral: Theme.palette['neutral-olive'],
        },
    ),
    [ThemeName.Verdant]: standardTheme(
        ThemeName.Verdant,
        {
            primary: Theme.palette.green,
            secondary: Theme.palette.chartreuse,
            tertiary: Theme.palette.plum,
            neutral: Theme.palette['neutral-green'],
        },
        {
            primary: Theme.palette.mint,
            secondary: Theme.palette.lime,
            tertiary: Theme.palette.magenta,
            neutral: Theme.palette['neutral-green'],
        },
    ),
    [ThemeName.GoldenCircuit]: standardTheme(
        ThemeName.GoldenCircuit,
        {
            primary: Theme.palette['dark-gold'],
            secondary: Theme.palette.navy,
            tertiary: Theme.palette.mahogany,
            neutral: Theme.palette['neutral-khaki'],
        },
        {
            primary: Theme.palette['luminous-yellow'],
            secondary: Theme.palette.blue,
            tertiary: Theme.palette.coral,
            neutral: Theme.palette['neutral-khaki'],
        },
    ),
};
