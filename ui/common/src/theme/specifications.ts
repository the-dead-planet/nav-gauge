import { Option } from "../model";
import { ThemeMode, ThemeName, ThemeSpecification } from "./model";
import { Theme } from "./theme";

export const themeNameOptions: Option<ThemeName>[] = [
    { value: ThemeName.Default, label: ThemeName.Default },
    { value: ThemeName.NeonBlue, label: ThemeName.NeonBlue },
    { value: ThemeName.Batman, label: ThemeName.Batman },
    { value: ThemeName.Joker, label: ThemeName.Joker },
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
                secondary: Theme.palette['copper-dark'],
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
                primary: Theme.palette.blue,
                secondary: Theme.palette.blue,
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
                    shade: 500,
                },
                "border": {
                    name: "luminous-yellow",
                },
                "divider": {
                    name: "luminous-yellow",
                },
                "box-shadow": {
                    name: "luminous-yellow",
                }
            },
            colors: {
                primary: Theme.palette['grey-blue'],
                secondary: Theme.palette['grey-blue'],
                tertiary: Theme.palette['grey-blue'],
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
                }
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
            componentColors: defaultComponentColors.light,
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
                text: {
                    name: 'neutral',
                    shade: 200
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
};
