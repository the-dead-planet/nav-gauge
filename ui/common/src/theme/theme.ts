import { BehaviorSubject } from 'rxjs';
import {
    Breakpoint,
    ColorShade,
    DesignSystemColor,
    Media,
    MediaSubscriptionDefinition,
    MediaWithBreakpoints,
    PaletteColor,
    ThemeColor,
    ThemeComponentColor,
    ThemeComponentColors,
    ThemeSpecification,
    ThemeMode,
} from "./model";
import { SpacingVariant } from '../model';

export class Theme {
    public name: string;
    public mode: ThemeMode;
    public isLight: boolean;
    public isDark: boolean;
    public otherMode: ThemeMode;

    private mediaSubscription: { unsubscribe: () => void } | null = null;

    public readonly media$: BehaviorSubject<MediaWithBreakpoints>;

    /**
     * Minimum value in pixels from which a breakpoint is active
     */
    public static breakpointThresholds: { [key in Breakpoint]: number } = {
        xxs: 0,
        xs: 480,
        sm: 600,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: 1600,
        xxxl: 1920
    };

    public static calculateMedia = ({ windowWidth, ...media }: Media): MediaWithBreakpoints => {
        const breakpoint = (Object.entries(Theme.breakpointThresholds) as [Breakpoint, number][])
            .sort((a, b) => a[1] - b[1])
            .reduce<Breakpoint>((acc, [b, threshold]) => windowWidth > threshold ? b : acc, 'xs');

        return {
            ...media,
            windowWidth,
            breakpoint,
            isXxs: breakpoint === 'xxs',
            isXs: breakpoint === 'xs',
            isSm: breakpoint === 'sm',
            isMd: breakpoint === 'md',
            isLg: breakpoint === 'lg',
            isXl: breakpoint === 'xl',
            isXxl: breakpoint === 'xxl',
            isXxxl: breakpoint === 'xxxl',
            isLessThanSm: windowWidth < Theme.breakpointThresholds.sm,
            isLessThanMd: windowWidth < Theme.breakpointThresholds.md,
            isLessThanLg: windowWidth < Theme.breakpointThresholds.lg,
            isLessThanXl: windowWidth < Theme.breakpointThresholds.xl,
            isLessThanXxl: windowWidth < Theme.breakpointThresholds.xxl,
            isMoreThanXl: windowWidth >= Theme.breakpointThresholds.xxl,
            isMoreThanLg: windowWidth >= Theme.breakpointThresholds.xl,
            isMoreThanMd: windowWidth >= Theme.breakpointThresholds.lg,
            isMoreThanSm: windowWidth >= Theme.breakpointThresholds.md,
            isMoreThanXs: windowWidth >= Theme.breakpointThresholds.sm,
        };
    };

    public componentColors: ThemeComponentColors;

    public static palette: { [key in PaletteColor]: ThemeColor } = {
        grey: {
            50: { r: 241, g: 242, b: 242 },
            100: { r: 220, g: 222, b: 221 },
            200: { r: 198, g: 201, b: 200 },
            300: { r: 176, g: 180, b: 179 },
            400: { r: 154, g: 159, b: 158 },
            500: { r: 113, g: 118, b: 117 },
            600: { r: 92, g: 96, b: 95 },
            700: { r: 69, g: 72, b: 71 },
            800: { r: 46, g: 48, b: 47 },
            900: { r: 23, g: 24, b: 24 },
        },

        'grey-brown': {
            50: { r: 243, g: 240, b: 237 },
            100: { r: 225, g: 219, b: 213 },
            200: { r: 205, g: 196, b: 188 },
            300: { r: 183, g: 170, b: 158 },
            400: { r: 158, g: 142, b: 128 },
            500: { r: 128, g: 108, b: 91 },
            600: { r: 101, g: 83, b: 69 },
            700: { r: 76, g: 61, b: 51 },
            800: { r: 52, g: 41, b: 35 },
            900: { r: 32, g: 25, b: 22 },
        },

        'grey-khaki': {
            50: { r: 245, g: 244, b: 233 },
            100: { r: 226, g: 224, b: 204 },
            200: { r: 204, g: 200, b: 171 },
            300: { r: 180, g: 174, b: 140 },
            400: { r: 153, g: 145, b: 110 },
            500: { r: 125, g: 116, b: 82 },
            600: { r: 99, g: 91, b: 63 },
            700: { r: 74, g: 68, b: 47 },
            800: { r: 52, g: 47, b: 33 },
            900: { r: 33, g: 30, b: 22 },
        },

        'grey-olive': {
            50: { r: 244, g: 244, b: 236 },
            100: { r: 226, g: 226, b: 211 },
            200: { r: 205, g: 205, b: 185 },
            300: { r: 181, g: 181, b: 157 },
            400: { r: 153, g: 153, b: 127 },
            500: { r: 122, g: 122, b: 98 },
            600: { r: 97, g: 97, b: 75 },
            700: { r: 73, g: 73, b: 56 },
            800: { r: 51, g: 51, b: 40 },
            900: { r: 32, g: 32, b: 25 },
        },

        'grey-green': {
            50: { r: 240, g: 244, b: 241 },
            100: { r: 218, g: 225, b: 220 },
            200: { r: 194, g: 205, b: 197 },
            300: { r: 169, g: 183, b: 172 },
            400: { r: 142, g: 159, b: 146 },
            500: { r: 108, g: 127, b: 113 },
            600: { r: 86, g: 103, b: 91 },
            700: { r: 65, g: 79, b: 69 },
            800: { r: 45, g: 56, b: 48 },
            900: { r: 28, g: 36, b: 31 },
        },

        'grey-teal': {
            50: { r: 237, g: 244, b: 243 },
            100: { r: 213, g: 227, b: 225 },
            200: { r: 187, g: 207, b: 203 },
            300: { r: 158, g: 184, b: 179 },
            400: { r: 128, g: 157, b: 151 },
            500: { r: 99, g: 128, b: 121 },
            600: { r: 77, g: 103, b: 97 },
            700: { r: 58, g: 80, b: 75 },
            800: { r: 41, g: 59, b: 55 },
            900: { r: 27, g: 40, b: 37 },
        },

        'grey-cyan': {
            50: { r: 239, g: 245, b: 246 },
            100: { r: 216, g: 228, b: 230 },
            200: { r: 190, g: 207, b: 210 },
            300: { r: 162, g: 184, b: 188 },
            400: { r: 132, g: 157, b: 162 },
            500: { r: 103, g: 130, b: 136 },
            600: { r: 81, g: 105, b: 111 },
            700: { r: 61, g: 81, b: 86 },
            800: { r: 43, g: 59, b: 63 },
            900: { r: 28, g: 40, b: 43 },
        },

        'grey-blue': {
            50: { r: 246, g: 247, b: 250 },
            100: { r: 232, g: 234, b: 240 },
            200: { r: 210, g: 214, b: 225 },
            300: { r: 182, g: 187, b: 203 },
            400: { r: 143, g: 150, b: 173 },
            500: { r: 100, g: 108, b: 135 },
            600: { r: 78, g: 86, b: 111 },
            700: { r: 59, g: 66, b: 90 },
            800: { r: 42, g: 48, b: 68 },
            900: { r: 29, g: 32, b: 44 },
        },

        'grey-violet': {
            50: { r: 244, g: 242, b: 247 },
            100: { r: 225, g: 222, b: 234 },
            200: { r: 204, g: 199, b: 216 },
            300: { r: 180, g: 172, b: 196 },
            400: { r: 151, g: 142, b: 171 },
            500: { r: 116, g: 105, b: 137 },
            600: { r: 92, g: 81, b: 111 },
            700: { r: 70, g: 61, b: 87 },
            800: { r: 50, g: 42, b: 65 },
            900: { r: 31, g: 26, b: 43 },
        },

        'grey-pink': {
            50: { r: 247, g: 241, b: 243 },
            100: { r: 232, g: 220, b: 224 },
            200: { r: 212, g: 197, b: 202 },
            300: { r: 190, g: 170, b: 177 },
            400: { r: 163, g: 139, b: 148 },
            500: { r: 133, g: 106, b: 116 },
            600: { r: 106, g: 82, b: 91 },
            700: { r: 81, g: 61, b: 68 },
            800: { r: 57, g: 42, b: 47 },
            900: { r: 36, g: 26, b: 30 },
        },

        'grey-red': {
            50: { r: 247, g: 242, b: 242 },
            100: { r: 232, g: 222, b: 222 },
            200: { r: 214, g: 201, b: 201 },
            300: { r: 193, g: 177, b: 177 },
            400: { r: 166, g: 146, b: 147 },
            500: { r: 132, g: 111, b: 112 },
            600: { r: 105, g: 86, b: 87 },
            700: { r: 80, g: 64, b: 65 },
            800: { r: 57, g: 44, b: 45 },
            900: { r: 35, g: 26, b: 27 },
        },

        'burnt-orange': {
            50: { r: 246, g: 227, b: 222 },
            100: { r: 239, g: 210, b: 201 },
            200: { r: 228, g: 178, b: 166 },
            300: { r: 215, g: 143, b: 127 },
            400: { r: 198, g: 104, b: 89 },
            500: { r: 184, g: 68, b: 65 },
            600: { r: 156, g: 55, b: 51 },
            700: { r: 127, g: 44, b: 40 },
            800: { r: 95, g: 34, b: 31 },
            900: { r: 63, g: 24, b: 22 },
        },

        coral: {
            50: { r: 255, g: 239, b: 233 },
            100: { r: 255, g: 221, b: 211 },
            200: { r: 255, g: 196, b: 181 },
            300: { r: 248, g: 166, b: 146 },
            400: { r: 239, g: 132, b: 111 },
            500: { r: 224, g: 99, b: 81 },
            600: { r: 194, g: 76, b: 62 },
            700: { r: 159, g: 57, b: 47 },
            800: { r: 121, g: 42, b: 36 },
            900: { r: 82, g: 28, b: 25 },
        },

        mahogany: {
            50: { r: 248, g: 231, b: 226 },
            100: { r: 235, g: 202, b: 194 },
            200: { r: 218, g: 165, b: 153 },
            300: { r: 198, g: 125, b: 111 },
            400: { r: 174, g: 88, b: 76 },
            500: { r: 148, g: 57, b: 52 },
            600: { r: 119, g: 43, b: 40 },
            700: { r: 91, g: 31, b: 30 },
            800: { r: 65, g: 22, b: 23 },
            900: { r: 42, g: 14, b: 17 },
        },

        'warm-brown': {
            50: { r: 248, g: 237, b: 226 },
            100: { r: 235, g: 214, b: 195 },
            200: { r: 219, g: 184, b: 156 },
            300: { r: 201, g: 151, b: 116 },
            400: { r: 177, g: 119, b: 80 },
            500: { r: 145, g: 88, b: 52 },
            600: { r: 116, g: 67, b: 39 },
            700: { r: 88, g: 49, b: 29 },
            800: { r: 61, g: 34, b: 22 },
            900: { r: 38, g: 21, b: 14 },
        },

        copper: {
            50: { r: 250, g: 236, b: 224 },
            100: { r: 245, g: 220, b: 193 },
            200: { r: 239, g: 204, b: 162 },
            300: { r: 234, g: 188, b: 131 },
            400: { r: 228, g: 172, b: 100 },
            500: { r: 205, g: 127, b: 50 },
            600: { r: 174, g: 102, b: 40 },
            700: { r: 143, g: 76, b: 30 },
            800: { r: 112, g: 51, b: 20 },
            900: { r: 81, g: 25, b: 10 },
        },

        peach: {
            50: { r: 255, g: 242, b: 232 },
            100: { r: 255, g: 224, b: 199 },
            200: { r: 250, g: 198, b: 159 },
            300: { r: 244, g: 169, b: 119 },
            400: { r: 232, g: 137, b: 82 },
            500: { r: 214, g: 103, b: 55 },
            600: { r: 179, g: 79, b: 43 },
            700: { r: 143, g: 59, b: 34 },
            800: { r: 108, g: 43, b: 28 },
            900: { r: 70, g: 28, b: 20 },
        },

        orange: {
            50: { r: 255, g: 243, b: 224 },
            100: { r: 255, g: 226, b: 178 },
            200: { r: 255, g: 205, b: 125 },
            300: { r: 255, g: 181, b: 70 },
            400: { r: 255, g: 153, b: 25 },
            500: { r: 240, g: 123, b: 0 },
            600: { r: 204, g: 96, b: 0 },
            700: { r: 163, g: 72, b: 0 },
            800: { r: 119, g: 49, b: 0 },
            900: { r: 77, g: 30, b: 0 },
        },

        yellow: {
            50: { r: 255, g: 245, b: 204 },
            100: { r: 255, g: 236, b: 153 },
            200: { r: 255, g: 226, b: 102 },
            300: { r: 255, g: 217, b: 51 },
            400: { r: 246, g: 197, b: 25 },
            500: { r: 220, g: 166, b: 0 },
            600: { r: 198, g: 149, b: 0 },
            700: { r: 174, g: 131, b: 0 },
            800: { r: 143, g: 108, b: 0 },
            900: { r: 77, g: 57, b: 0 },
        },

        'luminous-yellow': {
            50: { r: 255, g: 255, b: 226 },
            100: { r: 255, g: 255, b: 202 },
            200: { r: 255, g: 255, b: 171 },
            300: { r: 255, g: 253, b: 132 },
            400: { r: 250, g: 242, b: 91 },
            500: { r: 222, g: 209, b: 49 },
            600: { r: 198, g: 184, b: 31 },
            700: { r: 171, g: 154, b: 17 },
            800: { r: 139, g: 123, b: 7 },
            900: { r: 103, g: 92, b: 3 },
        },

        chartreuse: {
            50: { r: 252, g: 255, b: 218 },
            100: { r: 246, g: 250, b: 177 },
            200: { r: 235, g: 238, b: 125 },
            300: { r: 220, g: 222, b: 76 },
            400: { r: 198, g: 200, b: 35 },
            500: { r: 168, g: 171, b: 12 },
            600: { r: 137, g: 140, b: 7 },
            700: { r: 105, g: 108, b: 4 },
            800: { r: 72, g: 75, b: 2 },
            900: { r: 43, g: 45, b: 0 },
        },

        lime: {
            50: { r: 248, g: 255, b: 220 },
            100: { r: 236, g: 250, b: 180 },
            200: { r: 214, g: 231, b: 125 },
            300: { r: 184, g: 201, b: 70 },
            400: { r: 148, g: 165, b: 25 },
            500: { r: 108, g: 125, b: 0 },
            600: { r: 87, g: 101, b: 0 },
            700: { r: 65, g: 76, b: 0 },
            800: { r: 44, g: 52, b: 0 },
            900: { r: 25, g: 30, b: 0 },
        },

        'dark-gold': {
            50: { r: 248, g: 246, b: 222 },
            100: { r: 238, g: 233, b: 190 },
            200: { r: 222, g: 214, b: 151 },
            300: { r: 201, g: 190, b: 112 },
            400: { r: 176, g: 161, b: 76 },
            500: { r: 148, g: 131, b: 51 },
            600: { r: 116, g: 100, b: 37 },
            700: { r: 87, g: 74, b: 27 },
            800: { r: 61, g: 51, b: 20 },
            900: { r: 38, g: 32, b: 14 },
        },

        green: {
            50: { r: 232, g: 245, b: 235 },
            100: { r: 211, g: 231, b: 216 },
            200: { r: 184, g: 210, b: 191 },
            300: { r: 155, g: 187, b: 163 },
            400: { r: 103, g: 148, b: 116 },
            500: { r: 26, g: 104, b: 64 },
            600: { r: 19, g: 84, b: 51 },
            700: { r: 13, g: 64, b: 39 },
            800: { r: 8, g: 45, b: 28 },
            900: { r: 4, g: 27, b: 17 },
        },

        mint: {
            50: { r: 225, g: 255, b: 241 },
            100: { r: 190, g: 248, b: 220 },
            200: { r: 145, g: 232, b: 190 },
            300: { r: 96, g: 211, b: 157 },
            400: { r: 48, g: 184, b: 124 },
            500: { r: 20, g: 153, b: 98 },
            600: { r: 14, g: 122, b: 78 },
            700: { r: 9, g: 94, b: 61 },
            800: { r: 6, g: 66, b: 44 },
            900: { r: 3, g: 40, b: 28 },
        },

        teal: {
            50: { r: 240, g: 255, b: 255 },
            100: { r: 215, g: 247, b: 247 },
            200: { r: 177, g: 227, b: 227 },
            300: { r: 135, g: 200, b: 200 },
            400: { r: 84, g: 168, b: 168 },
            500: { r: 14, g: 128, b: 127 },
            600: { r: 0, g: 106, b: 106 },
            700: { r: 0, g: 79, b: 79 },
            800: { r: 0, g: 55, b: 55 },
            900: { r: 0, g: 32, b: 32 },
        },

        aqua: {
            50: { r: 225, g: 255, b: 253 },
            100: { r: 188, g: 247, b: 241 },
            200: { r: 139, g: 231, b: 222 },
            300: { r: 86, g: 210, b: 201 },
            400: { r: 38, g: 181, b: 174 },
            500: { r: 12, g: 145, b: 143 },
            600: { r: 8, g: 116, b: 116 },
            700: { r: 5, g: 88, b: 90 },
            800: { r: 3, g: 61, b: 65 },
            900: { r: 2, g: 38, b: 43 },
        },

        cyan: {
            50: { r: 224, g: 255, b: 255 },
            100: { r: 178, g: 248, b: 250 },
            200: { r: 125, g: 232, b: 238 },
            300: { r: 70, g: 211, b: 222 },
            400: { r: 25, g: 184, b: 200 },
            500: { r: 0, g: 153, b: 173 },
            600: { r: 0, g: 125, b: 146 },
            700: { r: 0, g: 96, b: 116 },
            800: { r: 0, g: 68, b: 84 },
            900: { r: 0, g: 40, b: 52 },
        },

        navy: {
            50: { r: 228, g: 239, b: 247 },
            100: { r: 197, g: 220, b: 237 },
            200: { r: 148, g: 190, b: 219 },
            300: { r: 108, g: 157, b: 195 },
            400: { r: 72, g: 120, b: 156 },
            500: { r: 47, g: 91, b: 125 },
            600: { r: 30, g: 72, b: 104 },
            700: { r: 19, g: 57, b: 85 },
            800: { r: 10, g: 43, b: 67 },
            900: { r: 5, g: 30, b: 49 },
        },

        blue: {
            50: { r: 240, g: 239, b: 255 },
            100: { r: 221, g: 225, b: 255 },
            200: { r: 184, g: 195, b: 255 },
            300: { r: 148, g: 166, b: 255 },
            400: { r: 109, g: 136, b: 255 },
            500: { r: 75, g: 115, b: 255 },
            600: { r: 18, g: 74, b: 240 },
            700: { r: 0, g: 53, b: 190 },
            800: { r: 0, g: 35, b: 136 },
            900: { r: 0, g: 19, b: 86 },
        },

        indigo: {
            50: { r: 239, g: 237, b: 255 },
            100: { r: 220, g: 216, b: 255 },
            200: { r: 194, g: 187, b: 255 },
            300: { r: 164, g: 153, b: 245 },
            400: { r: 128, g: 113, b: 220 },
            500: { r: 91, g: 73, b: 190 },
            600: { r: 72, g: 54, b: 160 },
            700: { r: 54, g: 39, b: 126 },
            800: { r: 39, g: 28, b: 91 },
            900: { r: 26, g: 18, b: 62 },
        },

        violet: {
            50: { r: 239, g: 234, b: 246 },
            100: { r: 222, g: 213, b: 235 },
            200: { r: 198, g: 183, b: 218 },
            300: { r: 169, g: 149, b: 194 },
            400: { r: 135, g: 111, b: 166 },
            500: { r: 91, g: 63, b: 125 },
            600: { r: 76, g: 52, b: 105 },
            700: { r: 61, g: 42, b: 84 },
            800: { r: 46, g: 31, b: 64 },
            900: { r: 32, g: 22, b: 45 },
        },

        "deep-violet": {
            50: { r: 231, g: 226, b: 240 },
            100: { r: 211, g: 203, b: 225 },
            200: { r: 183, g: 171, b: 202 },
            300: { r: 151, g: 135, b: 175 },
            400: { r: 109, g: 91, b: 139 },
            500: { r: 82, g: 62, b: 135 },
            600: { r: 62, g: 45, b: 105 },
            700: { r: 45, g: 32, b: 78 },
            800: { r: 30, g: 21, b: 54 },
            900: { r: 17, g: 11, b: 33 },
        },

        purple: {
            50: { r: 251, g: 236, b: 255 },
            100: { r: 243, g: 218, b: 255 },
            200: { r: 227, g: 181, b: 255 },
            300: { r: 210, g: 144, b: 255 },
            400: { r: 192, g: 103, b: 255 },
            500: { r: 170, g: 50, b: 250 },
            600: { r: 144, g: 0, b: 222 },
            700: { r: 110, g: 0, b: 171 },
            800: { r: 77, g: 0, b: 122 },
            900: { r: 47, g: 0, b: 76 },
        },

        plum: {
            50: { r: 247, g: 235, b: 247 },
            100: { r: 237, g: 211, b: 237 },
            200: { r: 222, g: 179, b: 222 },
            300: { r: 204, g: 143, b: 204 },
            400: { r: 182, g: 105, b: 181 },
            500: { r: 154, g: 71, b: 151 },
            600: { r: 128, g: 54, b: 125 },
            700: { r: 101, g: 40, b: 99 },
            800: { r: 75, g: 29, b: 74 },
            900: { r: 49, g: 18, b: 50 },
        },

        magenta: {
            50: { r: 245, g: 224, b: 245 },
            100: { r: 235, g: 193, b: 235 },
            200: { r: 224, g: 162, b: 224 },
            300: { r: 214, g: 131, b: 214 },
            400: { r: 203, g: 100, b: 203 },
            500: { r: 187, g: 62, b: 187 },
            600: { r: 160, g: 48, b: 160 },
            700: { r: 128, g: 32, b: 128 },
            800: { r: 96, g: 16, b: 96 },
            900: { r: 64, g: 0, b: 64 },
        },

        pink: {
            50: { r: 250, g: 240, b: 250 },
            100: { r: 243, g: 224, b: 243 },
            200: { r: 235, g: 208, b: 235 },
            300: { r: 226, g: 192, b: 226 },
            400: { r: 217, g: 176, b: 217 },
            500: { r: 205, g: 145, b: 205 },
            600: { r: 190, g: 128, b: 190 },
            700: { r: 158, g: 96, b: 158 },
            800: { r: 126, g: 64, b: 126 },
            900: { r: 94, g: 32, b: 94 },
        },

        rose: {
            50: { r: 255, g: 235, b: 241 },
            100: { r: 255, g: 211, b: 222 },
            200: { r: 255, g: 178, b: 197 },
            300: { r: 255, g: 139, b: 165 },
            400: { r: 247, g: 91, b: 128 },
            500: { r: 220, g: 52, b: 94 },
            600: { r: 185, g: 34, b: 70 },
            700: { r: 147, g: 23, b: 53 },
            800: { r: 108, g: 15, b: 39 },
            900: { r: 70, g: 9, b: 27 },
        },

        red: {
            50: { r: 255, g: 237, b: 235 },
            100: { r: 255, g: 218, b: 216 },
            200: { r: 255, g: 179, b: 178 },
            300: { r: 255, g: 136, b: 137 },
            400: { r: 255, g: 82, b: 92 },
            500: { r: 235, g: 0, b: 53 },
            600: { r: 191, g: 0, b: 42 },
            700: { r: 146, g: 0, b: 30 },
            800: { r: 104, g: 0, b: 18 },
            900: { r: 65, g: 0, b: 8 },
        },
    }

    public colors: { [key in PaletteColor | DesignSystemColor]: ThemeColor };

    public static spacing: { [key in SpacingVariant]: string } = {
        xs: '6px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    }

    public static zIndex = {
        hudConnector: 2,
        popup: 1000,
        floating: 1100,
        dialog: 5000,
        dropdown: 6000,
        tooltipConnector: 9998,
        tooltip: 10000,
    } as const;

    public static properties = {
        disabledOpacity: 0.4,
    }

    public constructor(
        specification: ThemeSpecification,
        protected media: MediaSubscriptionDefinition
    ) {
        this.mode = specification.mode;
        this.isLight = specification.mode === 'light';
        this.isDark = specification.mode === 'dark';
        this.otherMode = specification.mode === 'light' ? 'dark' : 'light';
        this.name = specification.themeName;
        this.colors = Object.assign({}, Theme.palette, specification.colors);
        this.componentColors = specification.componentColors;
        this.media$ = new BehaviorSubject<MediaWithBreakpoints>(Theme.calculateMedia(media.initial()));
        this.mediaSubscription = this.subscribeMedia();
    }

    private subscribeMedia = (): { unsubscribe: () => void } => {
        return this.media.subscribe((m) => {
            this.media$.next(Theme.calculateMedia(m));
        });
    }

    public destroy = () => {
        this.mediaSubscription?.unsubscribe();
    };

    /**
     * Returns an rgb or rgba color string.
     * @param name 
     * @param shade Optional. One of `50,100,200,...,900`. Defaults to 500.
     * @param opacity Optional value `[0,1]`. If not provided will be rgb(r, g, b), otherwise rgba(r, g, b, opacity)
     * @returns 
     */
    public color = (
        name: PaletteColor | DesignSystemColor,
        shade: ColorShade = 500,
        opacity?: number,
    ): string => {
        const { r, g, b } = this.colors[name][shade];

        if (opacity === undefined) {
            return `rgb(${r}, ${g}, ${b})`;
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    /**
     * Returns a css color string from the current theme.
     */
    public componentColor = (
        componentName: ThemeComponentColor,
        opacity?: number,
    ): string => {
        const { name, shade } = this.componentColors[componentName];

        return this.color(name, shade, opacity);
    };
}
