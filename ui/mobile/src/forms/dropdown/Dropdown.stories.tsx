import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    dropdownStoryArgs,
    dropdownStoryControls,
    fillVariantOptions,
    Icons,
    Theme,
} from "@ui";
import { ColorBox } from "../../gizmos/color-box";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";
import { Dropdown } from "./Dropdown";

const options = [
    { value: "brass", label: "Brass Cog", icon: Icons.Beaker, },
    { value: "copper", label: "Copper Valve", icon: Icons.Beaker },
    { value: "steam", label: "Steam Pipe", prepend: <ColorBox color={Theme.palette["neutral-grey"]} /> },
    { value: "gear", label: "Gear Assembly", icon: Icons.Beaker },
];

type Props = ComponentProps<typeof Dropdown<string>>;

function StoryDropdown(args: Props) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <Dropdown {...args} value={value} onChange={setValue} />;
}

const story: MobileStoryDefinition<Props> = {
    args: {
        ...dropdownStoryArgs,
        options,
    },
    controls: dropdownStoryControls,
    galleryEditableControls: [
        "highlightColor",
        "glyphsShade",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "value",
        "placeholder",
    ],
    renderPlayground: (args) => <StoryDropdown {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={(appearance) => <StoryDropdown {...args} {...appearance} />}
        />
    ),
};

export default story;
