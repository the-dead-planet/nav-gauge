import { ReactNode } from "react";
import { ActionButtonVariants, SizeVariant } from "../../design-system/model";
import { PanelProps } from "../../hud/panel/model";

export interface TileProps {
    name: string;
    size?: SizeVariant;
    append?: ReactNode;
    description?: string;
    actions?: (size: SizeVariant, variants: ActionButtonVariants) => ReactNode;
    children?: ReactNode;
}

export type TileStoryProps = TileProps &
    Pick<
        PanelProps,
        | "color"
        | "highlightColor"
        | "variant"
        | "highlighted"
        | "disabled"
        | "interactive"
        | "activeGlow"
        | "elevation"
    >;
