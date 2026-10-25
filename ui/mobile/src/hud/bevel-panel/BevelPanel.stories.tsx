import { StyleSheet } from "react-native";
import {
    appearanceColorOptions,
    BevelPanelProps,
    bevelPanelStoryArgs,
    bevelPanelStoryControls,
} from "@ui";
import { BevelPanel } from "./BevelPanel";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";

const styles = StyleSheet.create({
    sample: { padding: 16, minHeight: 64 },
});

const story: MobileStoryDefinition<BevelPanelProps> = {
    args: bevelPanelStoryArgs,
    controls: bevelPanelStoryControls,
    galleryEditableControls: [
        "children",
        "highlightColor",
        "highlighted",
        "disabled",
        "interactive",
        "activeGlow",
    ],
    renderPlayground: (args) => <BevelPanel {...args} style={styles.sample} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            render={({ color, size, variant }) => (
                <BevelPanel
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                    style={styles.sample}
                />
            )}
        />
    ),
};
export default story;
