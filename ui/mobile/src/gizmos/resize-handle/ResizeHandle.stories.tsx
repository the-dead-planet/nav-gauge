import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    fillVariantOptions,
    ResizeHandleProps,
    resizeHandleDirections,
    resizeHandleStoryArgs,
    resizeHandleStoryControls,
} from "@ui";
import { ResizeHandleDemo } from "./ResizeHandleDemo";
import { MobileStoryDefinition } from "../../storybook/model";
import { Text } from "../../design-system/typography";

const styles = StyleSheet.create({
    gallery: { gap: 24 },
});

const story: MobileStoryDefinition<ResizeHandleProps> = {
    args: {
        ...resizeHandleStoryArgs,
        onDrag: () => undefined,
    },
    controls: resizeHandleStoryControls,
    galleryEditableControls: ["highlightColor", "disabled", "tooltip"],
    renderPlayground: (args) => <ResizeHandleDemo {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {fillVariantOptions.map((variant) => (
                <View key={variant}>
                    <Text>{variant}</Text>
                    {resizeHandleDirections.flatMap((direction) =>
                        appearanceColorOptions.flatMap((color) =>
                            (direction === "horizontal"
                                ? (["left", "right"] as const)
                                : (["top"] as const)
                            ).map((side) => (
                                <View key={`${direction}-${color}-${side}`}>
                                    <ResizeHandleDemo
                                        {...args}
                                        variant={variant}
                                        direction={direction}
                                        side={side}
                                        color={color}
                                    />
                                </View>
                            )),
                        ),
                    )}
                </View>
            ))}
        </ScrollView>
    ),
};
export default story;
