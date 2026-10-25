import type {
    ColorShade,
    ColorVariant,
    FillVariant,
    SizeVariant,
} from '../../design-system/model';
import type {
    ThemeColor,
    ThemeMode,
    ThemeName,
} from '../../design-system/theme';

export interface ThemeSelectProps {
    mode: ThemeMode;
    value: ThemeName;
    onChange: (value: ThemeName) => void;
    color?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
}

export interface ThemeSelectColorPreview {
    role: ColorVariant;
    name: string;
    color: ThemeColor;
    shade: ColorShade;
}

export type ThemeSelectStoryProps = Omit<ThemeSelectProps, 'onChange'>;
