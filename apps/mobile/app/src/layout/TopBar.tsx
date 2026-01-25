import { FC } from "react";
import { View } from "react-native";
import { Text } from '@mobile-ui';
import { MachineWardTopBarProps } from "@apparatus";

export const TopBar: FC<MachineWardTopBarProps> = ({ }) => {
    return (
        <View>
            <Text>
                Top bar
            </Text>
        </View>
    );
};
