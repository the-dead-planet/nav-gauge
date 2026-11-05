import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    surfaceVariantOptions,
    stepControlsStoryArgs,
    stepControlsStoryControls,
} from "@ui";
import { StepControls } from "./StepControls";
import { Text } from "../../design-system/typography";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const StoryStepControls = (props: ComponentProps<typeof StepControls>) => {
    const [value, setValue] = useState(props.value);
    useEffect(() => setValue(props.value), [props.value]);
    return (
        <StepControls {...props} value={value} onChange={setValue}>
            <Text>{value}</Text>
        </StepControls>
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof StepControls>> = {
    args: {
        ...stepControlsStoryArgs,
        children: "Value",
        onChange: () => {},
    },
    controls: {
        ...stepControlsStoryControls,
    },
    galleryEditableControls: [
        "value",
        "min",
        "max",
        "step",
        "ariaLabel",
        "highlightColor",
        "glyphsShade",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
    ],
    renderPlayground: (args) => <StoryStepControls {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <StoryStepControls
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
