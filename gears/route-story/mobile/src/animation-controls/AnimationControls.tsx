import { FC } from "react";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { ToolPanelProps, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap, Text, TextInput } from "@mobile-ui";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMarkerImageData } from "../images/image-parser";
import { View } from "react-native";

export const AnimationControls: FC<ToolPanelProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    animatrix,
}) => {

    return (
        <View>
            <Text>Coming soon...</Text>
        </View>
    );
};
