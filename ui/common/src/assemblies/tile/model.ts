import { ReactNode } from "react";

export interface TileProps {
    name: string;
    append?: ReactNode;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
}
