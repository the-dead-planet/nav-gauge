import { FC } from "react";
import { View } from "react-native";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { Text } from "@mobile-ui";

export const Player: FC<OverlayComponentProps<MapViewRef | null> & RouteToolProps> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$
}) => {
    return null;
};
