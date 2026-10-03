import { Theme } from "../theme/theme";
import { ColorShade, DesignSystemColor } from "../theme/model";

export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

export interface ParsedColor {
    color: RgbaColor;
    format: ColorFormat;
}

export const toCssColor = ({ r, g, b, a }: RgbaColor): string =>
    a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;

export const toHexColor = ({ r, g, b }: RgbaColor): string =>
    '#' + [r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('');

export const formatColorDescription = (label: string, value: string): string => {
    const color = parseColor(value);
    return `${label}: ${toHexColor(color)}; ${toCssColor(color)}`;
};

export const parseColor = (value: string): RgbaColor =>
    tryParseColor(value)?.color ?? { r: 0, g: 0, b: 0, a: 1 };

export interface HslColor {
    h: number;
    s: number;
    l: number;
}

export interface HsvColor {
    h: number;
    s: number;
    v: number;
}

export const rgbToHsv = ({ r, g, b }: RgbaColor): HsvColor => {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const delta = maximum - minimum;
    let hue = 0;

    if (delta !== 0) {
        if (maximum === red) {
            hue = 60 * (((green - blue) / delta) % 6);
        } else if (maximum === green) {
            hue = 60 * ((blue - red) / delta + 2);
        } else {
            hue = 60 * ((red - green) / delta + 4);
        }
    }

    return {
        h: hue < 0 ? hue + 360 : hue,
        s: maximum === 0 ? 0 : delta / maximum,
        v: maximum,
    };
};

export const hsvToRgb = ({ h, s, v }: HsvColor): RgbaColor => {
    const hue = ((h % 360) + 360) % 360;
    const chroma = v * s;
    const intermediate = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
    const offset = v - chroma;
    let channels: [number, number, number];

    if (hue < 60) {
        channels = [chroma, intermediate, 0];
    } else if (hue < 120) {
        channels = [intermediate, chroma, 0];
    } else if (hue < 180) {
        channels = [0, chroma, intermediate];
    } else if (hue < 240) {
        channels = [0, intermediate, chroma];
    } else if (hue < 300) {
        channels = [intermediate, 0, chroma];
    } else {
        channels = [chroma, 0, intermediate];
    }

    return {
        r: Math.round((channels[0] + offset) * 255),
        g: Math.round((channels[1] + offset) * 255),
        b: Math.round((channels[2] + offset) * 255),
        a: 1,
    };
};

export const rgbToHsl = ({ r, g, b }: RgbaColor): HslColor => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    const l = (max + min) / 2;

    if (delta === 0) {
        return { h: 0, s: 0, l: Math.round(l * 100) };
    }

    const s = delta / (1 - Math.abs(2 * l - 1));
    let h: number;
    if (max === rn) {
        h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
        h = (bn - rn) / delta + 2;
    } else {
        h = (rn - gn) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }

    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToRgb = ({ h, s, l }: HslColor): RgbaColor => {
    const hn = ((h % 360) + 360) % 360 / 360;
    const sn = s / 100;
    const ln = l / 100;
    const c = (1 - Math.abs(2 * ln - 1)) * sn;
    const x = c * (1 - Math.abs((hn * 6) % 2 - 1));
    const m = ln - c / 2;

    let rgb: [number, number, number];
    const sextant = Math.floor(hn * 6);
    switch (sextant) {
        case 0: rgb = [c, x, 0]; break;
        case 1: rgb = [x, c, 0]; break;
        case 2: rgb = [0, c, x]; break;
        case 3: rgb = [0, x, c]; break;
        case 4: rgb = [x, 0, c]; break;
        default: rgb = [c, 0, x]; break;
    }

    return {
        r: Math.round((rgb[0] + m) * 255),
        g: Math.round((rgb[1] + m) * 255),
        b: Math.round((rgb[2] + m) * 255),
        a: 1,
    };
};

export const tryParseColor = (value: string): ParsedColor | null => {
    const compactValue = value.trim().replace(/\s/g, '');
    const hexMatch = compactValue.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1].length === 3
            ? [...hexMatch[1]].map((character) => character + character).join('')
            : hexMatch[1];
        return {
            color: {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16),
                a: 1,
            },
            format: 'hex',
        };
    }

    const rgbMatch = compactValue.match(/^(rgb|rgba)\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)(?:,([\d.]+))?\)$/i);
    if (rgbMatch) {
        const color = {
            r: Number(rgbMatch[2]),
            g: Number(rgbMatch[3]),
            b: Number(rgbMatch[4]),
            a: rgbMatch[5] === undefined ? 1 : Number(rgbMatch[5]),
        };
        const format = rgbMatch[1].toLowerCase() as 'rgb' | 'rgba';
        const hasAlpha = rgbMatch[5] !== undefined;
        if (Object.values(color).some((channel) => !Number.isFinite(channel)) || color.r > 255 || color.g > 255 || color.b > 255 || color.a > 1 || (format === 'rgba') !== hasAlpha) {
            return null;
        }
        return { color, format };
    }

    const hslMatch = compactValue.match(/^(hsl|hsla)\((-?[\d.]+),(\d+(?:\.\d+)?)%,(\d+(?:\.\d+)?)%(?:,([\d.]+))?\)$/i);
    if (hslMatch) {
        const saturation = Number(hslMatch[3]);
        const lightness = Number(hslMatch[4]);
        const alpha = hslMatch[5] === undefined ? 1 : Number(hslMatch[5]);
        const hue = Number(hslMatch[2]);
        const format = hslMatch[1].toLowerCase() as 'hsl' | 'hsla';
        const hasAlpha = hslMatch[5] !== undefined;
        if (![hue, saturation, lightness, alpha].every(Number.isFinite) || saturation > 100 || lightness > 100 || alpha > 1 || (format === 'hsla') !== hasAlpha) {
            return null;
        }
        return {
            color: { ...hslToRgb({ h: hue, s: saturation, l: lightness }), a: alpha },
            format,
        };
    }

    return null;
};

export const formatColor = (color: RgbaColor, format: ColorFormat): string => {
    if (format === 'hex') {
        return toHexColor(color);
    }
    if (format === 'rgb') {
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
    if (format === 'rgba') {
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
    const { h, s, l } = rgbToHsl(color);
    return format === 'hsl'
        ? `hsl(${h}, ${s}%, ${l}%)`
        : `hsla(${h}, ${s}%, ${l}%, ${color.a})`;
};

const swatchDesignSystemColors: DesignSystemColor[] = ['primary', 'secondary', 'tertiary', 'neutral'];
const swatchShades: ColorShade[] = [300, 500, 700];

export const getThemeColorSwatches = (theme: Theme): { label: string; color: string }[] =>
    swatchDesignSystemColors.flatMap((name) =>
        swatchShades.map((shade) => ({
            label: `${name} ${shade}`,
            color: toCssColor({ ...theme.colors[name][shade], a: 1 }),
        })),
    );
