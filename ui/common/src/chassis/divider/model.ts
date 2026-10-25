import { ColorVariant, SpacingVariant } from "../../design-system/model";
import { LayoutOrientation } from "../../chassis/model";

export interface DividerProps {
    /** Direction of the separator. Defaults to horizontal. */
    orientation?: LayoutOrientation;
    /** Palette used by the shared default-border appearance. Defaults to neutral. */
    color?: ColorVariant;
    /** Margin on all sides. Overridden by axis and individual side margins. */
    m?: SpacingVariant;
    /** Top and bottom margins. Overrides m; overridden by mt and mb. */
    mv?: SpacingVariant;
    /** Left and right margins. Overrides m; overridden by ml and mr. */
    mh?: SpacingVariant;
    /** Top margin. Overrides m and mv. */
    mt?: SpacingVariant;
    /** Right margin. Overrides m and mh. */
    mr?: SpacingVariant;
    /** Bottom margin. Overrides m and mv. */
    mb?: SpacingVariant;
    /** Left margin. Overrides m and mh. */
    ml?: SpacingVariant;
}
