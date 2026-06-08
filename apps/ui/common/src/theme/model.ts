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
    'lime' |
    'green';

export type DesignSystemColor =
    'primary' |
    'secondary' |
    'tertiary' |
    'neutral';

export type ThemeComponentColor =
    'background' |
    'menu-background' |
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
    mode: ThemeMode;
    themeName: ThemeName;
    colors: {
        [key in DesignSystemColor]: ThemeColor;
    };
    componentColors: ThemeComponentColors;
}

export type ThemeMode = 'light' | 'dark';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export enum Orientation {
    Portrait,
    Landscape,
}

export interface Media {
    orientation: Orientation;
    windowWidth: number;
    windowHeight: number;
}

export interface MediaWithBreakpoints extends Media {
    breakpoint: Breakpoint;
    isXs: boolean;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    isXxl: boolean;
    isXxxl: boolean;
    isLessThanMd: boolean;
    isLessThanLg: boolean;
    isLessThanXl: boolean;
    isLessThanXxl: boolean;
    isMoreThanXl: boolean;
    isMoreThanLg: boolean;
    isMoreThanMd: boolean;
    isMoreThanSm: boolean;
}

export interface MediaSubscriptionDefinition {
    initial: () => Media,
    subscribe: (onChange: (media: Media) => void) => ({ unsubscribe: () => void }),
}
