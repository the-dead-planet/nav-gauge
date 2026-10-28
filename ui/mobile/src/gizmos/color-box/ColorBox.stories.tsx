import { ScrollView, StyleSheet, View } from "react-native";
import {
    allColorShades,
    ColorBoxProps,
    colorBoxStoryArgs,
    colorBoxStoryControls,
    DEFAULT_SIZE,
    Theme,
    useTheme,
} from "@ui";
import { ColorBox } from "./ColorBox";
import { Text } from "../../design-system/typography";
import { MobileStoryDefinition } from "../../storybook/model";

const styles = StyleSheet.create({
    gallery: {
        gap: 16,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        alignItems: "center",
    },
});

const Gallery = (args: ColorBoxProps) => {
    const theme = useTheme();
    return (
        <ScrollView contentContainerStyle={styles.gallery}>
            <Text>Copper</Text>
            <View>
                <Text>{args.size ?? DEFAULT_SIZE}</Text>
                <ScrollView horizontal>
                    <View style={styles.row}>
                        {allColorShades.map((shade) => (
                            <View
                                key={shade}
                                style={[
                                    styles.cell,
                                    {
                                        width: theme.sizes.control.lg.height,
                                    },
                                ]}
                            >
                                <ColorBox
                                    {...args}
                                    name="Copper"
                                    color={Theme.palette.copper}
                                    shade={shade}
                                />
                                <Text usage="caption">{shade}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
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
