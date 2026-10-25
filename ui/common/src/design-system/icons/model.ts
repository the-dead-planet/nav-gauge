import { AppearanceProps, ColorVariant } from "../model";
import { ThemeAppearanceState } from "../theme/model";

export interface IconAppearanceProps extends Omit<
    AppearanceProps,
    "variant" | "color"
> {
    /** Theme color role or a literal SVG color. Omit to inherit owned content color on web. */
    color?: ColorVariant |string;
    /** Visual state supplied by the owning control; icons do not own interactions. */
    appearanceState?: ThemeAppearanceState;
}
