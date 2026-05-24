import { FC } from "react";
import { View } from "react-native";
import { FontType } from "@ui";
import { Text } from "./Text";

export const TextVariants: FC = () => (
    <View style={{ rowGap: 12 }}>
        <Text variant="header">Header variant</Text>
        <Text variant="body">Body variant</Text>
        <Text variant="caption">Caption variant</Text>
    </View>
);

export const TextColors: FC = () => (
    <View style={{ rowGap: 12 }}>
        <Text color="primary">Primary color</Text>
        <Text color="secondary">Secondary color</Text>
        <Text color="tertiary">Tertiary color</Text>
        <Text color="neutral">Neutral color</Text>
    </View>
);

export const TextFonts: FC = () => (
    <View style={{ rowGap: 12 }}>
        {Object.values(FontType).map((ft) => (
            <Text key={ft} fontType={ft}>Font: {ft}</Text>
        ))}
    </View>
);

export const TextCustomElement: FC = () => (
    <View style={{ rowGap: 12 }}>
        <Text as="h1" variant="header">as="h1" — renders as h2 per variant</Text>
        <Text as="span" variant="body">as="span" — renders as body text</Text>
        <Text as="p" variant="caption">as="p" — renders as caption</Text>
    </View>
);
