import {
    appearanceColorOptions,
    FieldsetProps,
    fieldsetStoryArgs,
    fieldsetStoryControls,
    surfaceVariantOptions,
} from "@ui";
import { Fieldset } from "./Fieldset";
import { Text } from "../../design-system/typography";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const StoryFieldset = (args: FieldsetProps) => (
    <Fieldset {...args}>
        <Text
            variant={args.variant}
            color={args.color}
            highlightColor={args.highlightColor}
            themeMode={args.themeMode}
            highlighted={args.highlighted}
            disabled={args.disabled}
        >
            {args.children}
        </Text>
    </Fieldset>
);

const story: MobileStoryDefinition<FieldsetProps> = {
    args: fieldsetStoryArgs,
    controls: fieldsetStoryControls,
    galleryEditableControls: [
        "label",
        "children",
        "themeMode",
        "highlightColor",
        "highlighted",
        "disabled",
        "expandable",
        "expanded",
    ],
    renderPlayground: (args) => <StoryFieldset {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <StoryFieldset
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
