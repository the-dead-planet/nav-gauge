import { useState } from "react";
import { View } from "react-native";
import {
    appearanceColorOptions,
    fillVariantOptions,
    numberInputStoryArgs,
    numberInputStoryControls,
    NumberInputProps,
} from "@ui";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";
import { NumberInput } from "./NumberInput";

const StoryNumberInput = (args: NumberInputProps) => {
    const [value, setValue] = useState(args.value);

    return <NumberInput {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<NumberInputProps> = {
    args: {
        ...numberInputStoryArgs,
        onChange: () => {},
    },
    controls: numberInputStoryControls,
    galleryEditableControls: [
        "themeMode",
        "glyphsShade",
        "highlightColor",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "autoSelect",
        "showStepControls",
        "unit",
    ],
    renderPlayground: (args) => (
        <View style={{ width: 240 }}>
            <StoryNumberInput key={String(args.value)} {...args} />
        </View>
    ),
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <StoryNumberInput
                    key={`${String(args.value)}-${color}-${variant}-${size}`}
                    {...args}
                    color={color}
                    highlightColor={args.highlightColor}
                    variant={variant}
                    size={size}
                    ariaLabel={`${color} ${variant} ${size}`}
                />
            )}
        />
    ),
};

export default story;
