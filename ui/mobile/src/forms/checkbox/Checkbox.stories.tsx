import {
    appearanceColorOptions,
    buttonCorners,
    CheckboxProps,
    checkboxStoryArgs,
    checkboxStoryControls,
    fillVariantOptions,
} from "@ui";
import { Checkbox } from "./Checkbox";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../../design-system/typography";

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
        <ScrollView>
            {buttonCorners.map((corners) => (
                <View key={corners}>
                    <Text usage="header">{corners}</Text>
                    <VariantGallery
                        size={args.size}
                        colors={appearanceColorOptions}
                        variants={fillVariantOptions}
                        scrollEnabled={false}
                        render={({ color, variant, size }) => (
                            <StoryCheckbox
                                key={String(args.checked)}
                                {...args}
                                color={color}
                                variant={variant}
                                size={size}
                                corners={corners}
                            >
                                {color}
                            </StoryCheckbox>
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;
