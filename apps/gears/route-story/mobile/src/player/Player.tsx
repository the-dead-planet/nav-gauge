import { FC } from "react";
import { View } from "react-native";
import { OverlayComponentProps } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { Text } from "@mobile-ui";
import { MobileMap } from "@the-dead-planet/nav-gauge-mobile-ui/src/model";

export const Player: FC<OverlayComponentProps<MobileMap> & RouteToolProps> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$
}) => {
        return (
            <View>
                <Text>Player</Text>
            </View>
        );
    };
