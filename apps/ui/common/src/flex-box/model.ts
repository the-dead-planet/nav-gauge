import { CSSProperties, ReactNode } from "react";

export interface FlexBoxProps {
    direction?: CSSProperties['flexDirection'];
    gap?: CSSProperties['gap'];
    rowGap?: CSSProperties['rowGap'];
    colGap?: CSSProperties['columnGap'];
    justifyContent?: CSSProperties['justifyContent'];
    alignItems?: CSSProperties['alignItems'];
    children?: ReactNode;
}
