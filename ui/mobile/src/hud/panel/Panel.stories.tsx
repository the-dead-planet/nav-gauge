import { StyleSheet } from "react-native";
import {
    appearanceColorOptions,
    PanelProps,
    panelStoryArgs,
    panelStoryControls,
} from "@ui";
import { Panel } from "./Panel";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";

const styles = StyleSheet.create({
    sample: { padding: 16, minHeight: 64 },
});

const story: MobileStoryDefinition<PanelProps> = {
    args: panelStoryArgs,
    controls: panelStoryControls,
    galleryEditableControls: [
        "children",
        "highlightColor",
        "highlighted",
        "disabled",
        "interactive",
        "activeGlow",
        "borderWidth",
        "elevation",
        "elevationLayer",
    ],
    renderPlayground: (args) => <Panel {...args} style={styles.sample} />,
    renderGallery: (args) => (
        <VariantGallery
            sizes={["sm"]}
            colors={appearanceColorOptions}
            render={({ color, variant }) => (
                <Panel
                    {...args}
                    color={color}
                    variant={variant}
                    style={styles.sample}
                />
            )}
        />
    ),
};
export default story;
