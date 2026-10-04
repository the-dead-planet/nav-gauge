import { ColorShade, ThemeColor } from '../theme';

export interface ColorBoxProps {
    name?: string;
    color: ThemeColor;
    shade?: ColorShade;
    size?: number;
    showPaletteOnHover?: boolean;
}
