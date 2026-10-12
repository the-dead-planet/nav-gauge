import type { ColorVariant, FillVariant, SizeVariant } from '../../design-system/model';
import type { ThemeMode, ThemeName } from '../../design-system/theme';

export interface ThemeSelectProps {
    mode: ThemeMode;
    value: ThemeName;
    onChange: (value: ThemeName) => void;
    color?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
}
