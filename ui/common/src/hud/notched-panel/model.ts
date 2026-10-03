import { ReactNode } from 'react';
import { ColorVariant, GlowStyle, SizeVariant, FillVariant } from '../../model';
import { ThemeMode } from '../../theme';

export interface NotchedPanelProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    variant?: FillVariant;
    padding?: SizeVariant;
    glowStyle?: GlowStyle;
    themeMode?: ThemeMode;
    header?: ReactNode;
    children?: ReactNode;
}
