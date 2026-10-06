import { Option } from "../model";
import { ThemeMode, ThemeName, ThemeSpecification } from "./model";
import { Theme } from "./theme";

export const themeNameOptions: Option<ThemeName>[] = [
    { value: ThemeName.Default, label: ThemeName.Default },
    { value: ThemeName.NeonBlue, label: ThemeName.NeonBlue },
    { value: ThemeName.Batman, label: ThemeName.Batman },
    { value: ThemeName.Joker, label: ThemeName.Joker },
    { value: ThemeName.Foundry, label: ThemeName.Foundry },
    { value: ThemeName.Aurora, label: ThemeName.Aurora },
    { value: ThemeName.SolarFlare, label: ThemeName.SolarFlare },
    { value: ThemeName.Verdant, label: ThemeName.Verdant },
    { value: ThemeName.GoldenCircuit, label: ThemeName.GoldenCircuit },
];

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

export const themeSpecifications: { [key in ThemeName]: { [key in ThemeMode]: ThemeSpecification } } = {
    [ThemeName.Default]: {
        light: {
            mode: 'light',
            themeName: ThemeName.Default,
            componentColors: defaultComponentColors.light,
            colors: {
                primary: Theme.palette.teal,
                secondary: Theme.palette['copper'],
                tertiary: Theme.palette.magenta,
                neutral: Theme.palette.grey,
            }
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.Default,
            componentColors: defaultComponentColors.dark,
            colors: {
                primary: Theme.palette.teal,
                secondary: Theme.palette.yellow,
                tertiary: Theme.palette.pink,
                neutral: Theme.palette.grey,
            },
        }
    },
    [ThemeName.NeonBlue]: {
        light: {
            mode: 'light',
            themeName: ThemeName.NeonBlue,
            componentColors: defaultComponentColors.light,
            colors: {
                primary: Theme.palette.navy,
                secondary: Theme.palette.navy,
                tertiary: Theme.palette.copper,
                neutral: Theme.palette.grey,
            }
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.NeonBlue,
            componentColors: defaultComponentColors.dark,
            colors: {
                primary: Theme.palette.blue,
                secondary: Theme.palette.blue,
                tertiary: Theme.palette.copper,
                neutral: Theme.palette.grey,
            },
        }
    },
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
                primary: Theme.palette['grey-blue'],
                secondary: Theme.palette['grey-blue'],
                tertiary: Theme.palette['dark-gold'],
                neutral: Theme.palette['grey-blue'],
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
                primary: Theme.palette['grey-blue'],
                secondary: Theme.palette['grey-blue'],
                tertiary: Theme.palette['luminous-yellow'],
                neutral: Theme.palette['grey-blue'],
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
                neutral: Theme.palette.grey,
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
    [ThemeName.Foundry]: {
        light: {
            mode: 'light',
            themeName: ThemeName.Foundry,
            componentColors: defaultComponentColors.light,
            colors: {
                primary: Theme.palette.mahogany,
                secondary: Theme.palette.copper,
                tertiary: Theme.palette.teal,
                neutral: Theme.palette['grey-brown'],
            },
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.Foundry,
            componentColors: defaultComponentColors.dark,
            colors: {
                primary: Theme.palette.coral,
                secondary: Theme.palette.copper,
                tertiary: Theme.palette.aqua,
                neutral: Theme.palette['grey-brown'],
            },
        },
    },
    [ThemeName.Aurora]: {
        light: {
            mode: 'light',
            themeName: ThemeName.Aurora,
            componentColors: defaultComponentColors.light,
            colors: {
                primary: Theme.palette.indigo,
                secondary: Theme.palette.mint,
                tertiary: Theme.palette.rose,
                neutral: Theme.palette['grey-violet'],
            },
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.Aurora,
            componentColors: defaultComponentColors.dark,
            colors: {
                primary: Theme.palette.purple,
                secondary: Theme.palette.mint,
                tertiary: Theme.palette.rose,
                neutral: Theme.palette['deep-violet'],
            },
        },
    },
    [ThemeName.SolarFlare]: {
        light: {
            mode: 'light',
            themeName: ThemeName.SolarFlare,
            componentColors: defaultComponentColors.light,
            colors: {
                primary: Theme.palette.orange,
                secondary: Theme.palette.plum,
                tertiary: Theme.palette.green,
                neutral: Theme.palette['grey-khaki'],
            },
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.SolarFlare,
            componentColors: defaultComponentColors.dark,
            colors: {
                primary: Theme.palette.peach,
                secondary: Theme.palette.magenta,
                tertiary: Theme.palette.mint,
                neutral: Theme.palette['grey-olive'],
            },
        },
    },
    [ThemeName.Verdant]: {
        light: {
            mode: 'light',
            themeName: ThemeName.Verdant,
            componentColors: defaultComponentColors.light,
            colors: {
                primary: Theme.palette.green,
                secondary: Theme.palette.chartreuse,
                tertiary: Theme.palette.plum,
                neutral: Theme.palette['grey-green'],
            },
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.Verdant,
            componentColors: defaultComponentColors.dark,
            colors: {
                primary: Theme.palette.mint,
                secondary: Theme.palette.lime,
                tertiary: Theme.palette.magenta,
                neutral: Theme.palette['grey-green'],
            },
        },
    },
    [ThemeName.GoldenCircuit]: {
        light: {
            mode: 'light',
            themeName: ThemeName.GoldenCircuit,
            componentColors: defaultComponentColors.light,
            colors: {
                primary: Theme.palette['dark-gold'],
                secondary: Theme.palette.navy,
                tertiary: Theme.palette.mahogany,
                neutral: Theme.palette['grey-khaki'],
            },
        },
        dark: {
            mode: 'dark',
            themeName: ThemeName.GoldenCircuit,
            componentColors: defaultComponentColors.dark,
            colors: {
                primary: Theme.palette['luminous-yellow'],
                secondary: Theme.palette.blue,
                tertiary: Theme.palette.coral,
                neutral: Theme.palette['grey-khaki'],
            },
        },
    },
};
