import { ComponentProps, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    appearanceColorOptions,
    buttonCorners,
    fileInputStoryArgs,
    fileInputStoryControls,
    Icons,
    surfaceVariantOptions,
} from "@ui";
import { FileInput } from "./FileInput";
import { Label } from "../../design-system/typography";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 24,
    },
    section: {
        gap: 8,
    },
});

const InteractiveFileInput = (args: ComponentProps<typeof FileInput>) => {
    const [fileName, setFileName] = useState(args.fileName);
    return (
        <FileInput
            {...args}
            fileName={fileName}
            onUpload={(files) =>
                setFileName(files.map((file) => file.name).join(", "))
            }
            onPurge={() => setFileName(null)}
        />
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof FileInput>> = {
    args: {
        ...fileInputStoryArgs,
        fileIcon: Icons.NounProject.Upload,
        type: ["public.item"],
        onUpload: () => undefined,
        onPurge: () => undefined,
        onError: console.error,
    },
    controls: {
        ...fileInputStoryControls,
        fileIcon: {
            control: "select",
            options: ["Upload", "Beaker", "Clear"],
            mapping: {
                Upload: Icons.NounProject.Upload,
                Beaker: Icons.Beaker,
                Clear: Icons.NounProject.Clear,
            },
        },
    },
    galleryEditableControls: [
        "highlightColor",
        "glyphsShade",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "fileName",
        "noNameLabel",
        "fileNameProps",
        "fileIcon",
        "fileLabel",
        "fileTooltipPlacement",
        "mutiple",
        "purgeLabel",
        "purgeTooltipPlacement",
        "purgeText",
        "cancelLabel",
        "purgeConfirmationDialogProps",
    ],
    renderPlayground: (args) => (
        <InteractiveFileInput key={args.fileName} {...args} />
    ),
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.container}>
            {buttonCorners.map((corners) => (
                <View key={corners} style={styles.section}>
                    <Label>{corners}</Label>
                    <VariantGallery
                        colors={appearanceColorOptions}
                        variants={surfaceVariantOptions}
                        scrollEnabled={false}
                        render={({ color, variant, size }) => (
                            <FileInput
                                {...args}
                                color={color}
                                variant={variant}
                                size={size}
                                fileUploadButtonProps={{ corners }}
                                purgeButtonProps={{ corners }}
                            />
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;
