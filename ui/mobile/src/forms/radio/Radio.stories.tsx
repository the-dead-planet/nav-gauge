import {
    appearanceColorOptions,
    buttonCorners,
    RadioProps,
    radioStoryArgs,
    radioStoryControls,
    fillVariantOptions,
} from "@ui";
import { Radio } from "./Radio";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../../design-system/typography";

const StoryRadio = (args: RadioProps) => {
    const [checked, setChecked] = useState(args.checked);
    return <Radio {...args} checked={checked} onChange={setChecked} />;
};

const story: MobileStoryDefinition<RadioProps> = {
    args: {
        ...radioStoryArgs,
        onChange: () => {},
    },
    controls: radioStoryControls,
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
        <StoryRadio key={String(args.checked)} {...args} />
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
                            <StoryRadio
                                key={String(args.checked)}
                                {...args}
                                color={color}
                                variant={variant}
                                size={size}
                                corners={corners}
                            >
                                {color}
                            </StoryRadio>
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;
