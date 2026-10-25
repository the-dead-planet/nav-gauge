import { ScrollView, StyleSheet, View } from "react-native";
import {
    allColorShades,
    appearanceColorOptions,
    ColorBoxProps,
    colorBoxGallerySizes,
    colorBoxStoryArgs,
    colorBoxStoryControls,
    Theme,
    useTheme,
} from "@ui";
import { ColorBox } from "./ColorBox";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";

const styles = StyleSheet.create({
    gallery: { gap: 16 },
    row: { flexDirection: "row" },
});

const Gallery = (args: ColorBoxProps) => {
    const theme = useTheme();
    const colors = {
        ...Theme.palette,
        ...Object.fromEntries(
            appearanceColorOptions.map((color) => [color, theme.colors[color]]),
        ),
    };
    return (
        <ScrollView contentContainerStyle={styles.gallery}>
            {Object.entries(colors).map(([name, color]) => (
                <View key={name}>
                    <Text>{name}</Text>
                    {colorBoxGallerySizes.map((size) => (
                        <View key={size} style={styles.row}>
                            {allColorShades.map((shade) => (
                                <ColorBox
                                    {...args}
                                    key={shade}
                                    name={name}
                                    color={color}
                                    size={size}
                                    shade={shade}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const story: MobileStoryDefinition<ColorBoxProps> = {
    args: colorBoxStoryArgs,
    controls: {
        ...colorBoxStoryControls,
        color: {
            control: "select",
            options: Object.keys(Theme.palette),
            mapping: Theme.palette,
        },
    },
    galleryEditableControls: ["showPaletteOnHover"],
    renderPlayground: (args) => <ColorBox {...args} />,
    renderGallery: (args) => <Gallery {...args} />,
};
export default story;
