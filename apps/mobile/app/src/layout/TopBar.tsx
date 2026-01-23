import { FC } from "react";
import { View } from "react-native";
import { Text } from '@mobile-ui';

interface Props { }

export const TopBar: FC<Props> = ({ }) => {
    return (
        <View>
            <Text>
                Top bar
            </Text>
        </View>
    );
};
