import { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import {
    appearanceColorOptions,
    octagonalPanelStoryArgs,
    octagonalPanelStoryControls,
} from "@ui";
import { OctagonalPanel } from "./OctagonalPanel";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const styles = StyleSheet.create({
    sample: { padding: 16 },
});

const story: MobileStoryDefinition<ComponentProps<typeof OctagonalPanel>> = {
    args: { ...octagonalPanelStoryArgs, style: styles.sample },
    controls: octagonalPanelStoryControls,
    galleryEditableControls: [
        "children",
        "themeMode",
        "highlightColor",
        "highlighted",
        "disabled",
    ],
    renderPlayground: (args) => <OctagonalPanel {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            render={({ color, size, variant }) => (
                <OctagonalPanel
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};
export default story;
