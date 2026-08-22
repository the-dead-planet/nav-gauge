import { FC } from "react";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { ToolPanelProps } from "@apparatus";
import { MobileMap } from "@mobile-apparatus";
import { Text } from "@mobile-ui";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMarkerImageData } from "../images/image-parser";
import { View } from "react-native";

export const AnimationControls: FC<ToolPanelProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = () => {

    return (
        <View>
            <Text>Coming soon...</Text>
        </View>
    );
};
