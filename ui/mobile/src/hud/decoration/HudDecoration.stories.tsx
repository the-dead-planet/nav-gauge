import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    HudDecorationProps,
    hudDecorationCornerSets,
    hudDecorationStoryArgs,
    hudDecorationStoryControls,
} from "@ui";
import { HudDecoration } from "./HudDecoration";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";

const styles = StyleSheet.create({
    gallery: { padding: 16, gap: 32 },
    sample: { padding: 24 },
});

const story: MobileStoryDefinition<HudDecorationProps> = {
    args: hudDecorationStoryArgs,
    controls: hudDecorationStoryControls,
    galleryEditableControls: ["children", "activeGlow"],
    renderPlayground: (args) => (
        <View style={styles.sample}>
            <HudDecoration {...args} />
        </View>
    ),
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {hudDecorationCornerSets.map(({ label, corners }) => (
                <View key={label}>
                    <Text usage="header">{label}</Text>
                    <VariantGallery
                        colors={appearanceColorOptions}
                        variants={["brackets"]}
                        scrollEnabled={false}
                        render={({ color, size }) => (
                            <View style={styles.sample}>
                                <HudDecoration
                                    {...args}
                                    color={color}
                                    size={size}
                                    corners={corners}
                                />
                            </View>
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
};
export default story;
