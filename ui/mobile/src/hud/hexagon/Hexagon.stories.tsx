import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    HexagonProps,
    hexagonShapes,
    hexagonStoryArgs,
    hexagonStoryControls,
    surfaceVariantOptions,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";
import { Text } from "../../design-system/typography";
import { Hexagon } from "./Hexagon";

const styles = StyleSheet.create({
    gallery: { padding: 16, gap: 32 },
});

const story: MobileStoryDefinition<HexagonProps> = {
    args: hexagonStoryArgs,
    controls: hexagonStoryControls,
    galleryEditableControls: [
        "children",
        "highlightColor",
        "strokeWidth",
        "interactive",
        "highlighted",
        "disabled",
        "activeGlow",
    ],
    renderPlayground: (args) => <Hexagon {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {hexagonShapes.map((shape) => (
                <View key={shape}>
                    <Text usage="header">{shape}</Text>
                    <VariantGallery
                        colors={appearanceColorOptions}
                        variants={surfaceVariantOptions}
                        scrollEnabled={false}
                        render={({ color, size, variant }) => (
                            <Hexagon
                                {...args}
                                color={color}
                                size={size}
                                variant={variant}
                                shape={shape}
                            />
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
};
export default story;
