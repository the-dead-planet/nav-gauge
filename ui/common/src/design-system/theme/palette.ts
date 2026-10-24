import type { PaletteColor, RGBColor, ThemeColor } from './model';

interface OklchColor {
    lightness: number;
    chroma: number;
    hue: number;
}

const neutralPaletteLightness = {
    50: 0.964214,
    100: 0.907304,
    900: 0.238684,
};

const fillContrastLightnessThreshold = 0.7;

const toLinearRgbChannel = (channel: number): number => {
    const normalizedChannel = channel / 255;
    return normalizedChannel <= 0.04045
        ? normalizedChannel / 12.92
        : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
};

const toOklch = ({ r, g, b }: RGBColor): OklchColor => {
    const linearRed = toLinearRgbChannel(r);
    const linearGreen = toLinearRgbChannel(g);
    const linearBlue = toLinearRgbChannel(b);
    const long = Math.cbrt(0.4122214708 * linearRed + 0.5363325363 * linearGreen + 0.0514459929 * linearBlue);
    const medium = Math.cbrt(0.2119034982 * linearRed + 0.6806995451 * linearGreen + 0.1073969566 * linearBlue);
    const short = Math.cbrt(0.0883024619 * linearRed + 0.2817188376 * linearGreen + 0.6299787005 * linearBlue);
    const lightness = 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
    const axisA = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short;
    const axisB = 0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short;

    return {
        lightness,
        chroma: Math.hypot(axisA, axisB),
        hue: Math.atan2(axisB, axisA),
    };
};

const toSrgbChannel = (channel: number): number => channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * channel ** (1 / 2.4) - 0.055;

const toRgb = ({ lightness, chroma, hue }: OklchColor): RGBColor | null => {
    const axisA = chroma * Math.cos(hue);
    const axisB = chroma * Math.sin(hue);
    const long = (lightness + 0.3963377774 * axisA + 0.2158037573 * axisB) ** 3;
    const medium = (lightness - 0.1055613458 * axisA - 0.0638541728 * axisB) ** 3;
    const short = (lightness - 0.0894841775 * axisA - 1.291485548 * axisB) ** 3;
    const channels = [
        4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
        -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
        -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
    ].map(toSrgbChannel);

    if (channels.some((channel) => channel < 0 || channel > 1)) {
        return null;
    }

    return {
        r: Math.round(channels[0] * 255),
        g: Math.round(channels[1] * 255),
        b: Math.round(channels[2] * 255),
    };
};

const smoothstep = (progress: number): number => progress ** 2 * (3 - 2 * progress);

const colorAtLightness = (color: OklchColor, lightness: number): RGBColor => {
    const chromaProgress = lightness >= color.lightness
        ? (1 - lightness) / (1 - color.lightness)
        : lightness / color.lightness;
    const chroma = color.chroma * smoothstep(chromaProgress);
    let minimumChroma = 0;
    let maximumChroma = chroma;
    let result = toRgb({ ...color, lightness, chroma: 0 })!;

    for (let iteration = 0; iteration < 12; iteration += 1) {
        const chroma = (minimumChroma + maximumChroma) / 2;
        const candidate = toRgb({ ...color, lightness, chroma });
        if (candidate) {
            minimumChroma = chroma;
            result = candidate;
        } else {
            maximumChroma = chroma;
        }
    }

    return result;
};

const interpolate = (from: number, to: number, progress: number): number => from + (to - from) * progress;

const createPalette = (middle: RGBColor): ThemeColor => {
    const color = toOklch(middle);
    return {
        50: colorAtLightness(color, neutralPaletteLightness[50]),
        100: colorAtLightness(color, neutralPaletteLightness[100]),
        200: colorAtLightness(color, interpolate(neutralPaletteLightness[100], color.lightness, 0.25)),
        300: colorAtLightness(color, interpolate(neutralPaletteLightness[100], color.lightness, 0.5)),
        400: colorAtLightness(color, interpolate(neutralPaletteLightness[100], color.lightness, 0.75)),
        500: middle,
        600: colorAtLightness(color, interpolate(color.lightness, neutralPaletteLightness[900], 0.28)),
        700: colorAtLightness(color, interpolate(color.lightness, neutralPaletteLightness[900], 0.6)),
        800: colorAtLightness(color, interpolate(color.lightness, neutralPaletteLightness[900], 0.85)),
        900: colorAtLightness(color, neutralPaletteLightness[900]),
    };
};

const createNeutralPalette = (middle: RGBColor): ThemeColor => {
    const color = toOklch(middle);
    const neutralMiddle = colorAtLightness({ ...color, chroma: Math.min(color.chroma, 0.04) }, color.lightness);
    return createPalette(neutralMiddle);
};

export const palette: Record<PaletteColor, ThemeColor> = {
    'neutral-grey': createNeutralPalette({
        r: 113,
        g: 118,
        b: 117,
    }),
    'neutral-brown': createNeutralPalette({
        r: 128,
        g: 108,
        b: 91,
    }),
    'neutral-khaki': createNeutralPalette({
        r: 125,
        g: 116,
        b: 82,
    }),
    'neutral-olive': createNeutralPalette({
        r: 122,
        g: 122,
        b: 98,
    }),
    'neutral-green': createNeutralPalette({
        r: 108,
        g: 127,
        b: 113,
    }),
    'neutral-teal': createNeutralPalette({
        r: 99,
        g: 128,
        b: 121,
    }),
    'neutral-cyan': createNeutralPalette({
        r: 103,
        g: 130,
        b: 136,
    }),
    'neutral-blue': createNeutralPalette({
        r: 100,
        g: 108,
        b: 135,
    }),
    'neutral-violet': createNeutralPalette({
        r: 116,
        g: 105,
        b: 137,
    }),
    'neutral-pink': createNeutralPalette({
        r: 133,
        g: 106,
        b: 116,
    }),
    'neutral-red': createNeutralPalette({
        r: 132,
        g: 111,
        b: 112,
    }),

    mahogany: createPalette({
        r: 148,
        g: 57,
        b: 52,
    }),
    'burnt-orange': createPalette({
        r: 184,
        g: 68,
        b: 65,
    }),
    coral: createPalette({
        r: 213,
        g: 94,
        b: 77,
    }),
    peach: createPalette({
        r: 203,
        g: 98,
        b: 52,
    }),
    orange: createPalette({
        r: 240,
        g: 123,
        b: 0,
    }),
    copper: createPalette({
        r: 205,
        g: 127,
        b: 50,
    }),
    'warm-brown': createPalette({
        r: 145,
        g: 88,
        b: 52,
    }),
    yellow: createPalette({
        r: 220,
        g: 166,
        b: 0,
    }),
    'luminous-yellow': createPalette({
        r: 222,
        g: 209,
        b: 49,
    }),
    'dark-gold': createPalette({
        r: 148,
        g: 131,
        b: 51,
    }),
    chartreuse: createPalette({
        r: 168,
        g: 171,
        b: 12,
    }),
    lime: createPalette({
        r: 108,
        g: 125,
        b: 0,
    }),
    green: createPalette({
        r: 26,
        g: 104,
        b: 64,
    }),
    mint: createPalette({
        r: 19,
        g: 145,
        b: 93,
    }),
    teal: createPalette({
        r: 14,
        g: 128,
        b: 127,
    }),
    aqua: createPalette({
        r: 12,
        g: 145,
        b: 143,
    }),
    cyan: createPalette({
        r: 0,
        g: 153,
        b: 173,
    }),
    navy: createPalette({
        r: 47,
        g: 91,
        b: 125,
    }),
    blue: createPalette({
        r: 75,
        g: 115,
        b: 255,
    }),
    indigo: createPalette({
        r: 91,
        g: 73,
        b: 190,
    }),
    violet: createPalette({
        r: 91,
        g: 63,
        b: 125,
    }),
    'deep-violet': createPalette({
        r: 82,
        g: 62,
        b: 135,
    }),
    purple: createPalette({
        r: 170,
        g: 50,
        b: 250,
    }),
    plum: createPalette({
        r: 154,
        g: 71,
        b: 151,
    }),
    magenta: createPalette({
        r: 187,
        g: 62,
        b: 187,
    }),
    pink: createPalette({
        r: 205,
        g: 145,
        b: 205,
    }),
    rose: createPalette({
        r: 220,
        g: 52,
        b: 94,
    }),
    red: createPalette({
        r: 235,
        g: 0,
        b: 53,
    }),
};

export const resolveContrastShade = (
    color: ThemeColor,
    backgroundShade: keyof ThemeColor = 500,
): 100 | 900 => toOklch(color[backgroundShade]).lightness < fillContrastLightnessThreshold
        ? 100
        : 900;
