import { ComponentProps, FC } from "react";
import {
    ScrollView,
    View,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { Button } from "./Button";
import { Text } from "../../design-system/typography";
import {
    buttonCorners,
    appearanceColorOptions,
    buttonStoryArgs,
    buttonStoryControls,
    Icons,
    surfaceVariantOptions,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
        gap: 8,
    },
    label: {
        marginBottom: 4,
    },
});

const StoryButton: FC<ComponentProps<typeof Button>> = ({
    accessibilityLabel,
    children,
    corners,
    ...props
}) => {
    const { width, height } = useWindowDimensions();
    const buttonChildren =
        corners === "square" ? (width > height ? children : "B") : null;

    return (
        <Button
            {...props}
            corners={corners}
            accessibilityLabel={
                accessibilityLabel ?? (buttonChildren ? undefined : "Button")
            }
        >
            {buttonChildren}
        </Button>
    );
};

const story = {
    args: {
        ...buttonStoryArgs,
        icon: Icons.Beaker,
        glyphsShade: undefined,
        highlightColor: undefined,
        highlightGlyphsShade: undefined,
        tooltipPlacement: undefined,
    },
    controls: {
        ...buttonStoryControls,
        icon: {
            control: "select",
            options: ["None", "Beaker", "Light bulb"],
            mapping: {
                None: undefined,
                Beaker: Icons.Beaker,
                "Light bulb": Icons.NounProject.LightBulbCogWheel,
            },
        },
    },
    galleryEditableControls: [
        "children",
        "fontType",
        "icon",
        "glyphsShade",
        "highlightColor",
        "highlightGlyphsShade",
        "activeGlow",
        "highlighted",
        "disabled",
        "tooltip",
        "tooltipPlacement",
        "showTooltipConnection",
        "iconRotateX",
        "iconRotateZ",
    ],
    renderPlayground: (args) => {
        return (
            <StoryButton
                {...args}
                accessibilityLabel={
                    args.corners === "square" ? undefined : "Button"
                }
            />
        );
    },
    renderGallery: (args) => {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                {buttonCorners.map((corners) => (
                    <View key={corners} style={styles.section}>
                        <Text style={styles.label}>{corners}</Text>
                        <VariantGallery
                            colors={appearanceColorOptions}
                            variants={surfaceVariantOptions}
                            scrollEnabled={false}
                            render={({ color, size, variant }) => (
                                <StoryButton
                                    {...args}
                                    variant={variant}
                                    color={color}
                                    corners={corners}
                                    size={size}
                                    accessibilityLabel={
                                        corners === "square"
                                            ? undefined
                                            : `${corners} button`
                                    }
                                />
                            )}
                        />
                    </View>
                ))}
            </ScrollView>
        );
    },
} satisfies MobileStoryDefinition<ComponentProps<typeof Button>>;

export default story;
