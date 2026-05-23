/** Design system color tokens for text. Maps to `var(--color-<variant>)`. */
export type TypographyVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral';

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

export interface TypographyProps {
    variant?: TypographyVariant;
    fontType?: FontType;
}
