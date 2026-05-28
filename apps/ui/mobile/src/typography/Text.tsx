import { FC } from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { defaultTypographyProps, FontType, ColorVariant, TypographyProps, useTheme } from "@ui";

export type TextVariant = 'header' | 'body' | 'caption';

const variantStyles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
});

const mobileFontFamily: Record<FontType, string | undefined> = {
    [FontType.Default]: 'SpaceGrotesk-Regular',
    [FontType.Numeric]: 'UbuntuMono-Regular',
    [FontType.SpecialMessaging]: 'SyneMono-Regular',
    [FontType.NeonHeader]: 'Sixtyfour-Regular-VariableFont_BLED,SCAN',
    [FontType.NeonText]: 'BitcountSingle-VariableFont_CRSV,ELSH,ELXP,slnt,wght',
};

export interface TextProps extends RNTextProps, TypographyProps {
    variant?: TextVariant;
    /** Accepted for API compatibility with web. On mobile only `<Text>` is rendered. */
    as?: string;
}

export const Text: FC<TextProps> = ({
    variant = 'body',
    color,
    fontType = defaultTypographyProps.fontType,
    style,
    ...props
}) => {
    const theme = useTheme();

    return (
        <RNText
            style={[
                variantStyles[variant],
                {
                    fontFamily: fontType ? mobileFontFamily[fontType] : undefined,
                    color: color
                        ? theme.color(color as ColorVariant)
                        : theme.componentColor('text'),
                },
                style,
            ]}
            {...props}
        />
    );
};
