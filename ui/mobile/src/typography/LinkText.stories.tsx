import { FC, useState } from "react";
import { Switch, View } from "react-native";
import { LinkText } from "./LinkText";
import { Text } from "./Text";

export const ExternalLink: FC = () => {
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={{ rowGap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                <Switch value={disabled} onValueChange={setDisabled} accessibilityLabel="Disabled" />
                <Text>Disabled</Text>
            </View>
            <LinkText
                href="https://openstreetmap.org/copyright"
                accessibilityLabel="OpenStreetMap copyright"
                accessibilityHint="Opens in the browser"
                disabled={disabled}
            >
                OpenStreetMap copyright
            </LinkText>
        </View>
    );
};
