import { useState } from "react";
import { View } from "react-native";
import {
    appearanceColorOptions,
    fillVariantOptions,
    textInputStoryArgs,
    textInputStoryControls,
    TextInputProps,
} from "@ui";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";
import { TextInput } from "./TextInput";

const StoryTextInput = (args: TextInputProps) => {
    const [value, setValue] = useState(args.value);

    return <TextInput {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<TextInputProps> = {
    args: {
        ...textInputStoryArgs,
        onChange: () => {},
    },
    controls: textInputStoryControls,
    galleryEditableControls: [
        "themeMode",
        "label",
        "placeholder",
        "glyphsShade",
        "highlightColor",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "autoSelect",
    ],
    renderPlayground: (args) => (
        <View style={{ width: 240 }}>
            <StoryTextInput key={String(args.value)} {...args} />
        </View>
    ),
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <StoryTextInput
                    key={`${String(args.value)}-${color}-${variant}-${size}`}
                    {...args}
                    value="Text"
                    color={color}
                    highlightColor={args.highlightColor}
                    variant={variant}
                    size={size}
                />
            )}
        />
    ),
};

export default story;
