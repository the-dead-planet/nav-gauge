import { FC } from "react";
import { Text, View } from "react-native";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";

export const Player: FC<OverlayComponentProps<MapViewRef | null> & RouteToolProps> = ({
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
