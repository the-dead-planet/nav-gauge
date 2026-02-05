import { FC } from "react";
import { OverlayComponentProps } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { View } from "react-native";
import { Text } from "@mobile-ui";

export const RouteLayer: FC<OverlayComponentProps<MapViewRef | null> & RouteToolProps> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
}) => {
    return <View><Text>Routelayer</Text></View>;
};
