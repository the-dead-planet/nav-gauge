import { ReactNode } from "react";
import {
    AppearancePropsBase,
    ActiveGlow,
    FillVariant,
} from "../../design-system/model";
import {
    ElevationLevel,
    ElevationLayer,
} from "../../design-system/theme/model";

export type PanelProps = AppearancePropsBase<FillVariant> & {
    interactive?: boolean;
    activeGlow?: ActiveGlow;
    /** Overrides the width of borders present in the shared appearance policy. */
    borderWidth?: number;
    children?: ReactNode;
} & (
        | {
              /** Defaults to `none`; callers opt into surface elevation. */
              elevation?: ElevationLevel;
              elevationLayer?: never;
          }
        | {
              elevation?: never;
              /** Selects z-index and elevation together for a globally stacked surface. */
              elevationLayer: ElevationLayer;
          }
    );
