import { FC } from "react";
import { TopToolsProps } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMarkerImageData } from "../images/image-parser";
import { MobileMap, Text } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";

export const RouteName: FC<TopToolsProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({ }) => {
    return <Text>Route name</Text>
};
