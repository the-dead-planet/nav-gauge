import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    Icons,
    iconRotateInputStoryArgs,
    iconRotateInputStoryControls,
} from "@ui";
import { IconRotateInput } from "./IconRotateInput";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const StoryRotateInput = (props: ComponentProps<typeof IconRotateInput>) => {
    const [value, setValue] = useState(props.value);
    useEffect(() => setValue(props.value), [props.value]);
    return <IconRotateInput {...props} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<ComponentProps<typeof IconRotateInput>> = {
    args: {
        ...iconRotateInputStoryArgs,
        icon: Icons.NounProject.CameraVideoFront,
        onChange: () => {},
    },
    controls: {
        ...iconRotateInputStoryControls,
        icon: {
            control: "select",
            options: ["None", "Camera", "Beaker"],
            mapping: {
                None: undefined,
                Camera: Icons.NounProject.CameraVideoFront,
                Beaker: Icons.Beaker,
            },
        },
    },
    galleryEditableControls: [
        "themeMode",
        "value",
        "valueAdjustment",
        "min",
        "max",
        "step",
        "icon",
        "label",
        "highlightColor",
        "glyphsShade",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "showNumberInput",
        "showStepControls",
        "numberInputPlacement",
    ],
    renderPlayground: (args) => <StoryRotateInput {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={["default"]}
            render={({ color, size }) => (
                <StoryRotateInput {...args} color={color} size={size} />
            )}
        />
    ),
};

export default story;
