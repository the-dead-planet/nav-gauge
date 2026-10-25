import { ScrollView, StyleSheet, View } from "react-native";
import {
    GridProps,
    gridGalleryCases,
    gridStoryArgs,
    gridStoryControls,
} from "@ui";
import { Grid } from "./Grid";
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

const labels = ["[1]", "[Two]", "[3]", "[Four]", "[5]", "[Six]", "[7]"];

const story: MobileStoryDefinition<GridProps> = {
    args: gridStoryArgs,
    controls: gridStoryControls,
    galleryEditableControls: [],
    renderPlayground: (args) => (
        <Grid {...args} style={styles.preview}>
            {labels.map((label, index) => (
                <Text key={label} p={index % 2 ? "sm" : "xs"}>
                    {label}
                </Text>
            ))}
        </Grid>
    ),
    renderGallery: () => (
        <ScrollView contentContainerStyle={styles.container}>
            {gridGalleryCases.map(({ label, props }) => (
                <View key={label}>
                    <Text usage="header">{label}</Text>
                    <Grid {...props} style={styles.preview}>
                        {labels.map((text, index) => (
                            <Text key={text} p={index % 2 ? "sm" : "xs"}>
                                {text}
                            </Text>
                        ))}
                    </Grid>
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;
