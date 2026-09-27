import { FC } from "react";
import { View } from "react-native";
import { FontType } from "@ui";
import { Text } from "./Text";
import { TypographyPreview } from "./TypographyPreview";

export const TextVariants: FC = () => (
    <TypographyPreview>{(props) => (
        <View style={{ rowGap: 12 }}>
            <Text variant="header" {...props}>Header variant</Text>
            <Text variant="body" {...props}>Body variant</Text>
            <Text variant="caption" {...props}>Caption variant</Text>
        </View>
    )}</TypographyPreview>
);

export const TextColors: FC = () => (
    <TypographyPreview>{(props) => (
        <View style={{ rowGap: 12 }}>
            <Text color="primary" {...props}>Primary color</Text>
            <Text color="secondary" {...props}>Secondary color</Text>
            <Text color="tertiary" {...props}>Tertiary color</Text>
            <Text color="neutral" {...props}>Neutral color</Text>
        </View>
    )}</TypographyPreview>
);

export const TextShades: FC = () => (
    <TypographyPreview>{(props) => (
        <View style={{ rowGap: 12 }}>
            <Text color="primary" shade={100} {...props}>Primary 100</Text>
            <Text color="primary" shade={500} {...props}>Primary 500</Text>
            <Text color="primary" shade={900} {...props}>Primary 900</Text>
        </View>
    )}</TypographyPreview>
);

export const TextFonts: FC = () => (
    <TypographyPreview>{(props) => (
        <View style={{ rowGap: 12 }}>
            {Object.values(FontType).map((fontType) => (
                <Text key={fontType} fontType={fontType} {...props}>Font: {fontType}</Text>
            ))}
        </View>
    )}</TypographyPreview>
);

export const TextStyling: FC = () => (
    <TypographyPreview>{(props) => (
        <View style={{ rowGap: 12, width: 240 }}>
            <Text color="primary" {...props}>Primary styled text</Text>
            <Text align="center" {...props}>Centered text</Text>
            <Text color="secondary" m="sm" p="md" {...props}>Text with margin and padding</Text>
        </View>
    )}</TypographyPreview>
);
