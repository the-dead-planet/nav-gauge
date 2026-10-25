import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    HudConnectorProps,
    hudConnectorAnchors,
    hudConnectorStoryArgs,
    hudConnectorStoryControls,
} from "@ui";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";
import { HudConnectorExample } from "./HudConnectorExample";

const styles = StyleSheet.create({
    gallery: { padding: 16, gap: 24 },
});

const story: MobileStoryDefinition<HudConnectorProps> = {
    args: hudConnectorStoryArgs,
    controls: hudConnectorStoryControls,
    galleryEditableControls: ["activeGlow"],
    renderPlayground: (args) => <HudConnectorExample {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {appearanceColorOptions.map((color) => (
                <View key={color}>
                    <Text usage="header">{color}</Text>
                    {hudConnectorAnchors.map((fromAnchor, index) => (
                        <HudConnectorExample
                            key={fromAnchor}
                            {...args}
                            color={color}
                            fromAnchor={fromAnchor}
                            toAnchor={
                                hudConnectorAnchors[
                                    (index + 4) % hudConnectorAnchors.length
                                ]
                            }
                        />
                    ))}
                </View>
            ))}
        </ScrollView>
    ),
};
export default story;
