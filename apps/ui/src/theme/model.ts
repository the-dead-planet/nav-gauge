import { Property } from "csstype";

export enum ThemeName {
    Light = 'theme-light',
    Dark = 'theme-dark',
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
    themeName: ThemeName;
    colors: { [key in ThemeColor]: Property.Color; }
}
