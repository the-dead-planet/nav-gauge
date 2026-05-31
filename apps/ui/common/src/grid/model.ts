import { CSSProperties, ReactNode } from "react";

export interface GridProps {
    gap?: CSSProperties['gap'];
    rows?: CSSProperties['gridTemplateRows'];
    rowGap?: CSSProperties['rowGap'];
    cols?: CSSProperties['gridTemplateColumns'];
    colGap?: CSSProperties['columnGap'];
    templateAreas?: CSSProperties['gridTemplateAreas'];
    justifyContent?: CSSProperties['justifyContent'];
    alignItems?: CSSProperties['alignItems'];
    alignContent?: CSSProperties['alignContent'];
    children?: ReactNode;
}
