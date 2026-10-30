import { ComponentProps } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    hexagonalPanelStoryArgs,
    hexagonalPanelStoryControls,
    hexagonShapes,
} from "@ui";
import { HexagonalPanel } from "./HexagonalPanel";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";

const styles = StyleSheet.create({
    sample: { padding: 16, minHeight: 64 },
});

const story: MobileStoryDefinition<ComponentProps<typeof HexagonalPanel>> = {
    args: { ...hexagonalPanelStoryArgs, style: styles.sample },
    controls: hexagonalPanelStoryControls,
    galleryEditableControls: [
        "children",
        "themeMode",
        "highlightColor",
        "highlighted",
        "disabled",
        "interactive",
        "activeGlow",
    ],
    renderPlayground: (args) => <HexagonalPanel {...args} />,
    renderGallery: (args) => (
        <ScrollView>
            {hexagonShapes.map((shape) => (
                <View key={shape}>
                    <Text usage="header">{shape}</Text>
                    <VariantGallery
                        size={args.size}
                        scrollEnabled={false}
                        colors={appearanceColorOptions}
                        render={({ color, size, variant }) => (
                            <HexagonalPanel
                                {...args}
                                color={color}
                                size={size}
                                variant={variant}
                                shape={shape}
                            />
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
};
export default story;
