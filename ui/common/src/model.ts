import { ReactNode } from "react";
import { DesignSystemColor } from "./theme";

export interface Option<T> {
    value: T;
    label: ReactNode;
}

export type GlowStyle = 'none' | 'glow' | 'animate-borders-glow';
export type SurfaceFillVariant = 'fill' | 'fill-inverse' | 'fill-translucent';
export type SurfaceVariant = SurfaceFillVariant | 'ghost' | 'outline' | 'inset';
export type ColorVariant = DesignSystemColor;
export type SizeVariant = 'xs' | 'sm' | 'md';
export type SpacingVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LayoutOrientation = 'horizontal' | 'vertical';

export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
