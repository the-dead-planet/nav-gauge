import {
    OctagonProps,
    appearanceColorOptions,
    octagonStoryArgs,
    octagonStoryControls,
    surfaceVariantOptions,
} from "@ui";
import { Octagon } from "./Octagon";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<OctagonProps> = {
    args: octagonStoryArgs,
    controls: octagonStoryControls,
    galleryEditableControls: [
        "children",
        "themeMode",
        "highlightColor",
        "strokeWidth",
        "interactive",
        "highlighted",
        "disabled",
        "activeGlow",
    ],
    renderPlayground: (args) => <Octagon {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <Octagon
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
