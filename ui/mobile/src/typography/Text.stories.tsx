import { FC, ReactNode, useState } from "react";
import { Switch, View } from "react-native";
import { FontType } from "@ui";
import { Text } from "./Text";

const DisabledPreview: FC<{ children: (disabled: boolean) => ReactNode }> = ({ children }) => {
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={{ rowGap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                <Switch value={disabled} onValueChange={setDisabled} accessibilityLabel="Disabled" />
                <Text>Disabled</Text>
            </View>
            {children(disabled)}
        </View>
    );
};

export const TextVariants: FC = () => (
    <DisabledPreview>{(disabled) => (
        <View style={{ rowGap: 12 }}>
            <Text variant="header" disabled={disabled}>Header variant</Text>
            <Text variant="body" disabled={disabled}>Body variant</Text>
            <Text variant="caption" disabled={disabled}>Caption variant</Text>
        </View>
    )}</DisabledPreview>
);

export const TextColors: FC = () => (
    <DisabledPreview>{(disabled) => (
        <View style={{ rowGap: 12 }}>
            <Text color="primary" disabled={disabled}>Primary color</Text>
            <Text color="secondary" disabled={disabled}>Secondary color</Text>
            <Text color="tertiary" disabled={disabled}>Tertiary color</Text>
            <Text color="neutral" disabled={disabled}>Neutral color</Text>
        </View>
    )}</DisabledPreview>
);

export const TextShades: FC = () => (
    <View style={{ rowGap: 12 }}>
        <Text color="primary" shade={100}>Primary 100</Text>
        <Text color="primary" shade={500}>Primary 500</Text>
        <Text color="primary" shade={900}>Primary 900</Text>
    </View>
);

export const TextFonts: FC = () => (
    <DisabledPreview>{(disabled) => (
        <View style={{ rowGap: 12 }}>
            {Object.values(FontType).map((fontType) => (
                <Text key={fontType} fontType={fontType} disabled={disabled}>Font: {fontType}</Text>
            ))}
        </View>
    )}</DisabledPreview>
);

export const TextStyling: FC = () => (
    <DisabledPreview>{(disabled) => (
        <View style={{ rowGap: 12 }}>
            <Text color="primary" bold uppercase disabled={disabled}>Bold uppercase text</Text>
            <Text color="secondary" m="sm" p="md" disabled={disabled}>Text with margin and padding</Text>
        </View>
    )}</DisabledPreview>
);

export const TextCustomElement: FC = () => (
    <DisabledPreview>{(disabled) => (
        <View style={{ rowGap: 12 }}>
            <Text as="h1" variant="header" disabled={disabled}>as="h1" renders as native header text</Text>
            <Text as="span" variant="body" disabled={disabled}>as="span" renders as native body text</Text>
            <Text as="p" variant="caption" disabled={disabled}>as="p" renders as native caption</Text>
        </View>
    )}</DisabledPreview>
);
