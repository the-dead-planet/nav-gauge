import { FC } from "react";
import { View } from "react-native";
import { Text } from '@mobile-ui';
import { MachineWardFooterProps } from "@apparatus";

export const Footer: FC<MachineWardFooterProps> = ({ }) => {
    return (
        <View>
            <Text>
                Footer
            </Text>
        </View>
    );
};
