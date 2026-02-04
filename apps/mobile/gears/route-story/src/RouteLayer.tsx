import { FC } from "react";
import { OverlayComponentProps } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { MapViewRef } from "@maplibre/maplibre-react-native";

export const RouteLayer: FC<OverlayComponentProps<MapViewRef | null> & RouteToolProps> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
}) => {
    return null;
};
