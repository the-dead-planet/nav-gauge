import { ComponentProps } from "react";
import {
    appearanceColorOptions,
    DEFAULT_VARIANT,
    opacityRampStoryArgs,
    opacityRampStoryControls,
    useTheme,
} from "@ui";
import { OpacityRamp } from "./OpacityRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const Gallery = (args: ComponentProps<typeof OpacityRamp>) => {
    const theme = useTheme();
    return (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={[DEFAULT_VARIANT]}
            render={({ color, size }) => (
                <OpacityRamp {...args} color={theme.color(color)} size={size} />
            )}
        />
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof OpacityRamp>> = {
    args: {
        ...opacityRampStoryArgs,
        onChange: () => {},
    },
    controls: opacityRampStoryControls,
    galleryEditableControls: ["value", "label", "disabled"],
    renderPlayground: (args, updateArgs) => (
        <OpacityRamp {...args} onChange={(value) => updateArgs({ value })} />
    ),
    renderGallery: (args, updateArgs) => (
        <Gallery {...args} onChange={(value) => updateArgs({ value })} />
    ),
};

export default story;
