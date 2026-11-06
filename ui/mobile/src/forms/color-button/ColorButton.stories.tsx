import { ComponentProps } from "react";
import {
    appearanceColorOptions,
    colorButtonStoryArgs,
    colorButtonStoryControls,
    useTheme,
} from "@ui";
import { ColorButton } from "./ColorButton";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const Gallery = (args: ComponentProps<typeof ColorButton>) => {
    const theme = useTheme();
    return (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={["default"]}
            render={({ color, size }) => (
                <ColorButton {...args} value={theme.color(color)} size={size} />
            )}
        />
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof ColorButton>> = {
    args: colorButtonStoryArgs,
    controls: colorButtonStoryControls,
    galleryEditableControls: ["label", "selected", "disabled"],
    renderPlayground: (args) => <ColorButton {...args} />,
    renderGallery: (args) => <Gallery {...args} />,
};

export default story;
