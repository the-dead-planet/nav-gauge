import { ColorShade, SizeVariant } from '../../design-system/model';
import { ThemeColor } from '../../design-system/theme';

export interface ColorBoxProps {
    name?: string;
    color: ThemeColor;
    shade?: ColorShade;
    /** Uses the shared control height, defaulting to `sm`. Numbers specify a custom side length in pixels. */
    size?: SizeVariant | number;
    showPaletteOnHover?: boolean;
}
