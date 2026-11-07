import { ComponentProps } from "react";
import {
    DEFAULT_COLOR,
    DEFAULT_VARIANT,
    saturationValueRampStoryArgs,
    saturationValueRampStoryControls,
} from "@ui";
import { SaturationValueRamp } from "./SaturationValueRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<ComponentProps<typeof SaturationValueRamp>> =
    {
        args: {
            ...saturationValueRampStoryArgs,
            onChange: () => {},
        },
        controls: saturationValueRampStoryControls,
        galleryEditableControls: [
            "label",
            "hue",
            "saturation",
            "brightness",
            "disabled",
        ],
        renderPlayground: (args, updateArgs) => (
            <SaturationValueRamp
                {...args}
                onChange={(saturation, brightness) =>
                    updateArgs({ saturation, brightness })
                }
            />
        ),
        renderGallery: (args, updateArgs) => (
            <VariantGallery
                colors={[DEFAULT_COLOR]}
                variants={[DEFAULT_VARIANT]}
                render={({ size }) => (
                    <SaturationValueRamp
                        {...args}
                        size={size}
                        onChange={(saturation, brightness) =>
                            updateArgs({ saturation, brightness })
                        }
                    />
                )}
            />
        ),
    };

export default story;
