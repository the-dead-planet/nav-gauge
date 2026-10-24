import { ColorShade, ColorVariant, SpacingVariant } from "../model";

/**
 * Fonts available for typography components. Usage and role:
 *
 * - `Space Grotesk` — Default UI; texts, buttons, alerts, notices
 * - `Ubuntu Mono` — HUD elements; infrastructure, telemetry, timestamps, charts, tables, numeric elements, backend processing alerts
 * - `Syne Mono` — Special Messaging; psychological tone, propaganda
 * - `Sixtyfour` — Rare usage for neon headers; special graphics
 * - `Bitcount Single` — Rare usage for neon text; special graphics
 */
export type FontFamilyName =
    | 'Space Grotesk'
    | 'Ubuntu Mono'
    | 'Syne Mono'
    | 'Sixtyfour'
    | 'Bitcount Single';

export enum FontType {
    Default = 'default',
    Numeric = 'numeric',
    SpecialMessaging = 'special-messaging',
    NeonHeader = 'neon-header',
    NeonText = 'neon-text',
}

export type TextUsage = 'header' | 'body' | 'caption';

export type NumericFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontWeight = NumericFontWeight | `${NumericFontWeight}` | 'normal' | 'bold';

export interface TypographyStoryProps extends TypographyProps {
    usage?: TextUsage;
    children: string;
}

export interface TypographyProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    /** Persistent visual emphasis, distinct from a temporary press. */
    highlighted?: boolean;
    /** Overrides default glyphs using the selected color. */
    shade?: ColorShade;
    /** Applies a palette shade to interactive typography while highlighted. */
    highlightShade?: ColorShade;
    fontType?: FontType;
    /** Overrides `bold`, appearance weight, and the text usage's default weight. */
    fontWeight?: FontWeight;
    align?: 'left' | 'center' | 'right';
    nowrap?: boolean;
    shadow?: boolean;
    bold?: boolean;
    disabled?: boolean;
    uppercase?: boolean;
    tabular?: boolean;
    /**
     * Margin (all sides)
     */
    m?: SpacingVariant;
    /**
     * Margin horizontal (left & right)
     */
    mh?: SpacingVariant;
    /**
     * Margin vertical (top & bottom)
     */
    mv?: SpacingVariant;
    /**
     * Margin top
     */
    mt?: SpacingVariant;
    /**
     * Margin right
     */
    mr?: SpacingVariant;
    /**
     * Margin bottom
     */
    mb?: SpacingVariant;
    /**
     * Margin left
     */
    ml?: SpacingVariant;
    /**
     * Padding (all sides)
     */
    p?: SpacingVariant;
    /**
     * Padding horizontal (left & right)
     */
    ph?: SpacingVariant;
    /**
     * Padding vertical (top & bottom)
     */
    pv?: SpacingVariant;
    /**
     * Padding top
     */
    pt?: SpacingVariant;
    /**
     * Padding right
     */
    pr?: SpacingVariant;
    /**
     * Padding bottom
     */
    pb?: SpacingVariant;
    /**
     * Padding left
     */
    pl?: SpacingVariant;
}
