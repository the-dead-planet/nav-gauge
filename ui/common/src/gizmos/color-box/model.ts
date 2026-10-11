import { ColorShade } from '../../design-system/model';
import { ThemeColor } from '../../design-system/theme';

export interface ColorBoxProps {
    name?: string;
    color: ThemeColor;
    shade?: ColorShade;
    size?: number;
    showPaletteOnHover?: boolean;
}
