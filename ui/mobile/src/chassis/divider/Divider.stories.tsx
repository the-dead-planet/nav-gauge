import { ScrollView, View, StyleSheet } from "react-native";
import {
    appearanceColorOptions,
    DividerProps,
    dividerStoryArgs,
    dividerStoryControls,
} from "@ui";
import { Divider } from "./Divider";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    preview: {
        flexDirection: "row",
        alignItems: "center",
        height: 80,
        width: "100%",
    },
});

const story: MobileStoryDefinition<DividerProps> = {
    args: dividerStoryArgs,
    controls: dividerStoryControls,
    galleryEditableControls: ["m", "mv", "mh", "mt", "mr", "mb", "ml"],
    renderPlayground: (args) => (
        <View style={styles.preview}>
            <Divider {...args} />
        </View>
    ),
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.container}>
            {appearanceColorOptions.map((color) => (
                <View key={color} style={styles.section}>
                    <Text usage="header">{color}</Text>
                    <Divider {...args} color={color} orientation="horizontal" />
                    <View style={styles.preview}>
                        <Divider
                            {...args}
                            color={color}
                            orientation="vertical"
                        />
                    </View>
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;
