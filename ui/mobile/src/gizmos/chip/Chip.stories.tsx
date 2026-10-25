import { ComponentProps } from "react";
import {
    appearanceColorOptions,
    chipStoryArgs,
    chipStoryControls,
    Icons,
    surfaceVariantOptions,
} from "@ui";
import { Chip } from "./Chip";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<ComponentProps<typeof Chip>> = {
    args: {
        ...chipStoryArgs,
        icon: Icons.NounProject.UnderConstruction,
    },
    controls: {
        ...chipStoryControls,
        icon: {
            control: "select",
            options: ["None", "Construction"],
            mapping: {
                None: undefined,
                Construction: Icons.NounProject.UnderConstruction,
            },
        },
    },
    galleryEditableControls: [
        "children",
        "icon",
        "tooltip",
        "tooltipPlacement",
        "tooltipVariant",
        "showTooltipConnection",
    ],
    renderPlayground: (args) => <Chip {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <Chip {...args} color={color} size={size} variant={variant} />
            )}
        />
    ),
};
export default story;
