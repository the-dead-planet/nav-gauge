import { ComponentProps } from "react";
import {
    appearanceColorOptions,
    surfaceVariantOptions,
    typographyStoryArgs,
    typographyStoryControls,
} from "@ui";
import { Caption } from "./Caption";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const { usage: _usage, ...args } = typographyStoryArgs;
const { usage: _usageControl, ...controls } = typographyStoryControls;

const story: MobileStoryDefinition<ComponentProps<typeof Caption>> = {
    args,
    controls,
    renderPlayground: (props) => <Caption {...props} />,
    renderGallery: (props) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, variant }) => (
                <Caption {...props} color={color} variant={variant} />
            )}
        />
    ),
};

export default story;
