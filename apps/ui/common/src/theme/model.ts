export enum ThemeName {
    Light = 'theme-light',
    Dark = 'theme-dark',
}

export type ColorShade =
    50 |
    100 |
    200 |
    300 |
    400 |
    500 |
    600 |
    700 |
    800 |
    900;

export type ThemeColor = {
    [key in ColorShade]: RGBColor;
}

export type PaletteColor =
    'grey' |
    'yellow' |
    'copper' |
    'teal' |
    'magenta' |
    'pink' |
    'blue' |
    'red' |
    'purple' |
    'lime';

export type DesignSystemColor =
    'primary' |
    'secondary' |
    'tertiary' |
    'neutral';

export type ThemeComponentColor =
    'background' |
    'border' |
    'box-shadow' |
    'divider' |
    'button' |
    'text' |
    'text-active' |
    'error' |
    'warning' |
    'success' |
    'info';

export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export interface SelectedColor {
    name: DesignSystemColor | PaletteColor;
    /**
     * Defaults to `500`.
     */
    shade?: ColorShade;
}

export type ThemeComponentColors = {
    [key in ThemeComponentColor]: SelectedColor;
}

export interface ThemeSpecification {
    themeName: ThemeName;
    colors: {
        [key in DesignSystemColor]: ThemeColor;
    };
    componentColors: ThemeComponentColors;
}
