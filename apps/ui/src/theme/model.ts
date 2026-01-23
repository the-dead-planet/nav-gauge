export enum Theme {
    Light = 'theme-light',
    Dark = 'theme-dark',
}

export interface ThemeOption {
    value: Theme;
    label: string;
}

export interface ThemeSpecification {
    theme: Theme;
    colors: {
        background: string;
        text: string;
    }
}
