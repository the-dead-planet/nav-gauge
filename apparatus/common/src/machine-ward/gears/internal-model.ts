import { CSSProperties, ReactNode } from "react";

/**
 * Type to satisfy the react native svg pack - cannot use mobile specific packages in the common section.
 * Do not use outside of this folder.
 */
export interface SvgProps {
    width?: string | number;
    height?: string | number;
    viewBox?: string;
    preserveAspectRatio?: string;
    fill?: string;
    fillOpacity?: string | number;
    stroke?: string;
    strokeWidth?: string | number;
    strokeOpacity?: string | number;
    strokeLinecap?: "butt" | "square" | "round";
    strokeLinejoin?: "miter" | "bevel" | "round";
    opacity?: string | number;
    color?: string;
    id?: string;
    className?: string;
    children?: ReactNode;
}
