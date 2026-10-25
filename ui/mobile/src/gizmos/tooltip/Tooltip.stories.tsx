import {
    TooltipProps,
    appearanceColorOptions,
    fillVariantOptions,
    tooltipStoryArgs,
    tooltipStoryControls,
} from "@ui";
import { Tooltip } from "./Tooltip";
import { Button } from "../button";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<TooltipProps> = {
    args: {
        ...tooltipStoryArgs,
        children: <Button>Long press</Button>,
    },
    controls: tooltipStoryControls,
    galleryEditableControls: [
        "content",
        "placement",
        "maxWidth",
        "showConnection",
    ],
    renderPlayground: (args) => <Tooltip {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <Tooltip {...args} color={color} size={size} variant={variant}>
                    <Button color={color}>{color}</Button>
                </Tooltip>
            )}
        />
    ),
};
export default story;
