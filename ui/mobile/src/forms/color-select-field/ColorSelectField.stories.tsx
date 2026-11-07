import { ComponentProps } from "react";
import {
    DEFAULT_COLOR,
    colorSelectFieldStoryArgs,
    colorSelectFieldStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorSelectField } from "./ColorSelectField";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<ComponentProps<typeof ColorSelectField>> = {
    args: {
        ...colorSelectFieldStoryArgs,
        onChange: () => {},
    },
    controls: colorSelectFieldStoryControls,
    galleryEditableControls: ["value", "label", "opacityLabel", "disabled"],
    renderPlayground: (args, updateArgs) => (
        <ColorSelectField
            {...args}
            onChange={(value) => updateArgs({ value })}
        />
    ),
    renderGallery: (args, updateArgs) => (
        <VariantGallery
            colors={[DEFAULT_COLOR]}
            variants={fillVariantOptions}
            render={({ size, variant }) => (
                <ColorSelectField
                    {...args}
                    size={size}
                    variant={variant}
                    onChange={(value) => updateArgs({ value })}
                />
            )}
        />
    ),
};

export default story;
