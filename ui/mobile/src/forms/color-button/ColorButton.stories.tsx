import { ComponentProps } from "react";
import {
    appearanceColorOptions,
    colorButtonStoryArgs,
    colorButtonStoryControls,
    DEFAULT_VARIANT,
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
            variants={[DEFAULT_VARIANT]}
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
    renderPlayground: (args, updateArgs) => (
        <ColorButton
            {...args}
            onPress={() => updateArgs({ selected: !args.selected })}
        />
    ),
    renderGallery: (args, updateArgs) => (
        <Gallery
            {...args}
            onPress={() => updateArgs({ selected: !args.selected })}
        />
    ),
};

export default story;
