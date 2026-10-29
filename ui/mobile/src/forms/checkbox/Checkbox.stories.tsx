import {
    appearanceColorOptions,
    CheckboxProps,
    checkboxStoryArgs,
    checkboxStoryControls,
    fillVariantOptions,
} from "@ui";
import { Checkbox } from "./Checkbox";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";
import { useState } from "react";

const StoryCheckbox = (args: CheckboxProps) => {
    const [checked, setChecked] = useState(args.checked);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
};

const story: MobileStoryDefinition<CheckboxProps> = {
    args: {
        ...checkboxStoryArgs,
        onChange: () => {},
    },
    controls: checkboxStoryControls,
    galleryEditableControls: [
        "themeMode",
        "checked",
        "glyphsShade",
        "highlightColor",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
    ],
    renderPlayground: (args) => (
        <StoryCheckbox key={String(args.checked)} {...args} />
    ),
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <StoryCheckbox
                    key={String(args.checked)}
                    {...args}
                    color={color}
                    variant={variant}
                    size={size}
                >
                    {color}
                </StoryCheckbox>
            )}
        />
    ),
};

export default story;
