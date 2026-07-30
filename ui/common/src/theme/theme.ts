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
            500: { r: 115, g: 120, b: 119 },
            600: { r: 92, g: 96, b: 95 },
            700: { r: 69, g: 72, b: 71 },
            800: { r: 46, g: 48, b: 47 },
            900: { r: 23, g: 24, b: 24 },
        },
        yellow: {
            50: { r: 255, g: 245, b: 204 },
            100: { r: 255, g: 236, b: 153 },
            200: { r: 255, g: 226, b: 102 },
            300: { r: 255, g: 217, b: 51 },
            400: { r: 255, g: 204, b: 26 },
            500: { r: 230, g: 172, b: 0 },
            600: { r: 205, g: 153, b: 0 },
            700: { r: 179, g: 134, b: 0 },
            800: { r: 128, g: 96, b: 0 },
            900: { r: 77, g: 57, b: 0 },
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
        'copper-dark': {
            50: { r: 245, g: 232, b: 224 },
            100: { r: 227, g: 204, b: 192 },
            200: { r: 206, g: 175, b: 159 },
            300: { r: 184, g: 145, b: 125 },
            400: { r: 159, g: 112, b: 89 },
            500: { r: 121, g: 79, b: 52 },
            600: { r: 97, g: 63, b: 41 },
            700: { r: 73, g: 47, b: 31 },
            800: { r: 51, g: 33, b: 22 },
            900: { r: 30, g: 19, b: 13 },
        },
        red: {
            50: { r: 255, g: 237, b: 235 },
            100: { r: 255, g: 218, b: 216 },
            200: { r: 255, g: 179, b: 178 },
            300: { r: 255, g: 136, b: 137 },
            400: { r: 255, g: 82, b: 92 },
            500: { r: 238, g: 0, b: 55 },
            600: { r: 191, g: 0, b: 42 },
            700: { r: 146, g: 0, b: 30 },
            800: { r: 104, g: 0, b: 18 },
            900: { r: 65, g: 0, b: 8 },
        },
        pink: {
            50: { r: 250, g: 240, b: 250 },
            100: { r: 243, g: 224, b: 243 },
            200: { r: 235, g: 208, b: 235 },
            300: { r: 226, g: 192, b: 226 },
            400: { r: 217, g: 176, b: 217 },
            500: { r: 221, g: 160, b: 221 },
            600: { r: 190, g: 128, b: 190 },
            700: { r: 158, g: 96, b: 158 },
            800: { r: 126, g: 64, b: 126 },
            900: { r: 94, g: 32, b: 94 },
        },
        magenta: {
            50: { r: 245, g: 224, b: 245 },
            100: { r: 235, g: 193, b: 235 },
            200: { r: 224, g: 162, b: 224 },
            300: { r: 214, g: 131, b: 214 },
            400: { r: 203, g: 100, b: 203 },
            500: { r: 191, g: 64, b: 191 },
            600: { r: 160, g: 48, b: 160 },
            700: { r: 128, g: 32, b: 128 },
            800: { r: 96, g: 16, b: 96 },
            900: { r: 64, g: 0, b: 64 },
        },
        purple: {
            50: { r: 251, g: 236, b: 255 },
            100: { r: 243, g: 218, b: 255 },
            200: { r: 227, g: 181, b: 255 },
            300: { r: 210, g: 144, b: 255 },
            400: { r: 192, g: 103, b: 255 },
            500: { r: 173, g: 52, b: 253 },
            600: { r: 144, g: 0, b: 222 },
            700: { r: 110, g: 0, b: 171 },
            800: { r: 77, g: 0, b: 122 },
            900: { r: 47, g: 0, b: 76 },
        },
        blue: {
            50: { r: 240, g: 239, b: 255 },
            100: { r: 221, g: 225, b: 255 },
            200: { r: 184, g: 195, b: 255 },
            300: { r: 148, g: 166, b: 255 },
            400: { r: 109, g: 136, b: 255 },
            500: { r: 67, g: 105, b: 255 },
            600: { r: 18, g: 74, b: 240 },
            700: { r: 0, g: 53, b: 190 },
            800: { r: 0, g: 35, b: 136 },
            900: { r: 0, g: 19, b: 86 },
        },
        green: {
            50: { r: 235, g: 247, b: 238 },
            100: { r: 214, g: 233, b: 220 },
            200: { r: 185, g: 213, b: 192 },
            300: { r: 154, g: 192, b: 163 },
            400: { r: 117, g: 169, b: 128 },
            500: { r: 26, g: 104, b: 64 },
            600: { r: 19, g: 84, b: 51 },
            700: { r: 13, g: 64, b: 39 },
            800: { r: 8, g: 45, b: 28 },
            900: { r: 4, g: 27, b: 17 },
        },
        teal: {
            50: { r: 240, g: 255, b: 255 },
            100: { r: 215, g: 247, b: 247 },
            200: { r: 177, g: 227, b: 227 },
            300: { r: 135, g: 200, b: 200 },
            400: { r: 84, g: 168, b: 168 },
            500: { r: 15, g: 133, b: 132 },
            600: { r: 0, g: 106, b: 106 },
            700: { r: 0, g: 79, b: 79 },
            800: { r: 0, g: 55, b: 55 },
            900: { r: 0, g: 32, b: 32 },
        },
        lime: {
            50: { r: 248, g: 255, b: 220 },
            100: { r: 236, g: 250, b: 180 },
            200: { r: 214, g: 231, b: 125 },
            300: { r: 184, g: 201, b: 70 },
            400: { r: 148, g: 165, b: 25 },
            500: { r: 110, g: 127, b: 0 },
            600: { r: 87, g: 101, b: 0 },
            700: { r: 65, g: 76, b: 0 },
            800: { r: 44, g: 52, b: 0 },
            900: { r: 25, g: 30, b: 0 },
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
    public componentColor = (componentName: ThemeComponentColor): string => {
        const { name, shade } = this.componentColors[componentName];

        return this.color(name, shade);
    };
}
