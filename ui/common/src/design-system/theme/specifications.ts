import { Option } from "../../model";
import { ThemeMode, ThemeName, ThemeSpecification } from "./model";
import { Theme } from "./theme";

export const themeNameOptions: Option<ThemeName>[] = Object.values(ThemeName)
    .map((value) => ({ value, label: value }));

export const themeModeOptions: Option<ThemeMode>[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
];

export const defaultStatusColors: { [key in ThemeMode]: ThemeSpecification['statusColors'] } = {
    light: {
        glitch: {
            name: 'red',
            shade: 600
        },
        hazard: {
            name: 'copper',
            shade: 500
        },
        secured: {
            name: 'lime',
            shade: 500
        },
        intel: {
            name: 'blue',
            shade: 400
        },
    },
    dark: {
        glitch: {
            name: 'red',
            shade: 600
        },
        hazard: {
            name: 'yellow',
            shade: 500
        },
        secured: {
            name: 'lime',
            shade: 500
        },
        intel: {
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
        statusColors: defaultStatusColors.light,
        colors: lightColors,
    },
    dark: {
        mode: 'dark',
        themeName,
        statusColors: defaultStatusColors.dark,
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
            statusColors: {
                ...defaultStatusColors.light,
                hazard: {
                    name: 'luminous-yellow',
                    shade: 600,
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
            statusColors: {
                ...defaultStatusColors.dark,
                hazard: {
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
            statusColors: {
                ...defaultStatusColors.light,
                hazard: {
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
            statusColors: {
                ...defaultStatusColors.dark,
                hazard: {
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
