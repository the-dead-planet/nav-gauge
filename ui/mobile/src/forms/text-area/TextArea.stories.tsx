import { useState } from "react";
import { View } from "react-native";
import {
    appearanceColorOptions,
    fillVariantOptions,
    textAreaStoryArgs,
    textAreaStoryControls,
    TextAreaProps,
} from "@ui";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";
import { TextArea } from "./TextArea";

const StoryTextArea = (args: TextAreaProps) => {
    const [value, setValue] = useState(args.value);

    return <TextArea {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<TextAreaProps> = {
    args: {
        ...textAreaStoryArgs,
        onChange: () => {},
    },
    controls: textAreaStoryControls,
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
            <StoryTextArea key={String(args.value)} {...args} />
        </View>
    ),
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <StoryTextArea
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
