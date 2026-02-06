import { FC } from "react";
import { OverlayComponentProps } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { View } from "react-native";
import { Text } from "@mobile-ui";
import { MobileMap } from "@the-dead-planet/nav-gauge-mobile-ui/src/model";

export const ImagesLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps> = ({
    map,
    data$,
    images$
}) => {
        return null;
    };
