import type { ColorVariant, FillVariant, SizeVariant } from '../model';

export enum ThemeName {
    Default = 'Default',
    NeonBlue = 'Neon Blue',
    Batman = 'Batman',
    Joker = 'Joker',
    Foundry = 'Foundry',
    Aurora = 'Aurora',
    SolarFlare = 'Solar Flare',
    Verdant = 'Verdant',
    GoldenCircuit = 'Golden Circuit',
}

export type ColorShade =
    50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type ThemeColor = {
    [key in ColorShade]: RGBColor;
};

export type PaletteColor =
    | 'grey'
    | 'grey-blue'
    | 'grey-brown'
    | 'grey-khaki'
    | 'grey-green'
    | 'grey-olive'
    | 'grey-teal'
    | 'grey-cyan'
    | 'grey-pink'
    | 'grey-violet'
    | 'grey-red'
    | 'yellow'
    | 'coral'
    | 'chartreuse'
    | 'luminous-yellow'
    | 'copper'
    | 'peach'
    | 'warm-brown'
    | 'dark-gold'
    | 'mahogany'
    | 'teal'
    | 'cyan'
    | 'aqua'
    | 'magenta'
    | 'pink'
    | 'rose'
    | 'blue'
    | 'navy'
    | 'burnt-orange'
    | 'orange'
    | 'red'
    | 'purple'
    | 'violet'
    | 'plum'
    | 'indigo'
    | 'deep-violet'
    | 'lime'
    | 'mint'
    | 'green';

export type DesignSystemColor =
    'primary' | 'secondary' | 'tertiary' | 'neutral';

export type ThemeComponentColor =
    | 'background'
    | 'border'
    | 'box-shadow'
    | 'divider'
    | 'text'
    | 'text-inverse'
    | 'error'
    | 'warning'
    | 'success'
    | 'info';

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
};

export interface ThemeSpecification {
    mode: ThemeMode;
    themeName: ThemeName;
    colors: {
        [key in DesignSystemColor]: ThemeColor;
    };
    componentColors: ThemeComponentColors;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeModeToggleProps {
    mode: ThemeMode;
    lightModeTooltip: string;
    darkModeTooltip: string;
    onToggle: () => void;
}

export interface ThemeSelectProps {
    mode: ThemeMode;
    value: ThemeName;
    onChange: (value: ThemeName) => void;
    color?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
}

export type Breakpoint =
    'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

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
    isXxs: boolean;
    isXs: boolean;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    isXxl: boolean;
    isXxxl: boolean;
    isLessThanSm: boolean;
    isLessThanMd: boolean;
    isLessThanLg: boolean;
    isLessThanXl: boolean;
    isLessThanXxl: boolean;
    isMoreThanXl: boolean;
    isMoreThanLg: boolean;
    isMoreThanMd: boolean;
    isMoreThanSm: boolean;
    isMoreThanXs: boolean;
}

export interface MediaSubscriptionDefinition {
    initial: () => Media;
    subscribe: (onChange: (media: Media) => void) => {
        unsubscribe: () => void;
    };
}
