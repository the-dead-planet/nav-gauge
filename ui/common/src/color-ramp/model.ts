import { SizeVariant } from "../model";

export const colorRampThumbSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 18,
};

export interface ColorRampProps {
    value: string;
    label?: string;
    opacityLabel?: string;
    size?: SizeVariant;
    disabled?: boolean;
    onChange: (value: string) => void;
}

export interface SaturationValueRampProps {
    hue: number;
    saturation: number;
    brightness: number;
    label?: string;
    size?: SizeVariant;
    disabled?: boolean;
    onChange: (saturation: number, brightness: number) => void;
}

export interface HueRampProps {
    value: number;
    label?: string;
    size?: SizeVariant;
    disabled?: boolean;
    onChange: (value: number) => void;
}

export interface OpacityRampProps {
    color: string;
    value: number;
    label?: string;
    size?: SizeVariant;
    disabled?: boolean;
    onChange: (value: number) => void;
}
