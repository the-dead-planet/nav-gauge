import { FC } from "react";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { View } from "react-native";
import { Text } from "@mobile-ui";

export const ImagesLayer: FC<OverlayComponentProps<MapViewRef | null> & RouteToolProps> = ({
    map,
    data$,
    images$
}) => {
    return null;
};
