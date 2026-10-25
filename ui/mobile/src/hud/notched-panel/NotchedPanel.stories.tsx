import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    NotchedPanelProps,
    notchedPanelStoryArgs,
    notchedPanelStoryControls,
} from "@ui";
import { NotchedPanel } from "./NotchedPanel";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";

const styles = StyleSheet.create({
    gallery: { padding: 16, gap: 32 },
    sample: { padding: 16, minHeight: 64 },
});

const story: MobileStoryDefinition<NotchedPanelProps> = {
    args: notchedPanelStoryArgs,
    controls: notchedPanelStoryControls,
    galleryEditableControls: [
        "children",
        "highlightColor",
        "highlighted",
        "disabled",
        "interactive",
        "activeGlow",
    ],
    renderPlayground: (args) => (
        <NotchedPanel {...args} contentStyle={styles.sample} />
    ),
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {[false, true].map((hasHeader) => (
                <View key={String(hasHeader)}>
                    <Text usage="header">
                        {hasHeader ? "With header" : "Without header"}
                    </Text>
                    <VariantGallery
                        sizes={["sm"]}
                        colors={appearanceColorOptions}
                        scrollEnabled={false}
                        render={({ color, variant }) => (
                            <NotchedPanel
                                {...args}
                                color={color}
                                variant={variant}
                                header={hasHeader ? "Navigation" : undefined}
                                contentStyle={styles.sample}
                            />
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
};
export default story;
