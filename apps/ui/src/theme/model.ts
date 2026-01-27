import { Property } from "csstype";

export enum Theme {
    Light = 'theme-light',
    Dark = 'theme-dark',
}

export interface ThemeOption {
    value: Theme;
    label: string;
}

export type ThemeColor = 'background' |
    'border' |
    'box-shadow' |
    'divider' |
    'text' |
    'text-active' |
    'error' |
    'warning' |
    'success' |
    'info';

export interface ThemeSpecification {
    theme: Theme;
    colors: { [key in ThemeColor]: Property.Color; }
}
