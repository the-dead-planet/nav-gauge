import { FC } from "react";
import { View } from "react-native";
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@mobile-ui";

export const FileInput: FC<RouteFileInputProps> = ({ data$, images$ }) => {

    return (
        <View>
            <Text>
                File Input
            </Text>
        </View>
    );
};
