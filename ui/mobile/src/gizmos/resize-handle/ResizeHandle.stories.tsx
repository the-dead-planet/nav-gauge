import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    ResizeHandleProps,
    resizeHandleDirections,
    resizeHandleStoryArgs,
    resizeHandleStoryControls,
} from "@ui";
import { ResizeHandleDemo } from "./ResizeHandleDemo";
import { MobileStoryDefinition } from "../../storybook/model";

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
            {resizeHandleDirections.flatMap((direction) =>
                appearanceColorOptions.flatMap((color) =>
                    (direction === "horizontal"
                        ? (["left", "right"] as const)
                        : (["top"] as const)
                    ).map((side) => (
                        <View key={`${direction}-${color}-${side}`}>
                            <ResizeHandleDemo
                                {...args}
                                direction={direction}
                                side={side}
                                color={color}
                            />
                        </View>
                    )),
                ),
            )}
        </ScrollView>
    ),
};
export default story;
