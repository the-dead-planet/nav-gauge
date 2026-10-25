import { ScrollView, StyleSheet, View } from "react-native";
import {
    FlexBoxProps,
    flexBoxGalleryCases,
    flexBoxStoryArgs,
    flexBoxStoryControls,
} from "@ui";
import { FlexBox } from "./FlexBox";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 24,
    },
    preview: {
        minHeight: 96,
    },
});

const story: MobileStoryDefinition<FlexBoxProps> = {
    args: flexBoxStoryArgs,
    controls: flexBoxStoryControls,
    galleryEditableControls: [],
    renderPlayground: (args) => (
        <FlexBox {...args} style={styles.preview}>
            <Text p="xs">[1]</Text>
            <Text p="sm">[Two]</Text>
            <Text p="xs">[3]</Text>
        </FlexBox>
    ),
    renderGallery: () => (
        <ScrollView contentContainerStyle={styles.container}>
            {flexBoxGalleryCases.map(({ label, props }) => (
                <View key={label}>
                    <Text usage="header">{label}</Text>
                    <FlexBox {...props} style={styles.preview}>
                        <Text p="xs">[1]</Text>
                        <Text p="sm">[Two]</Text>
                        <Text p="xs">[3]</Text>
                    </FlexBox>
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;
