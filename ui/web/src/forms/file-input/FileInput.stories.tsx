import { ComponentProps, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    buttonCorners,
    fileInputStoryArgs,
    fileInputStoryControls,
    Icons,
    surfaceVariantOptions,
} from "@ui";
import { FileInput } from "./FileInput";
import { VariantGallery } from "../../storybook/VariantGallery";

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

const meta = {
    title: "Forms/FileInput",
    component: FileInput,
    args: {
        ...fileInputStoryArgs,
        fileIcon: Icons.NounProject.Upload,
        accept: "*",
        onUpload: () => undefined,
        onPurge: () => undefined,
    },
    argTypes: {
        ...fileInputStoryControls,
        fileName: {
            ...fileInputStoryControls.fileName,
            table: { category: "File name" },
        },
        noNameLabel: {
            ...fileInputStoryControls.noNameLabel,
            table: { category: "File name" },
        },
        fileNameProps: {
            control: "object",
            table: { category: "File name" },
        },
        fileIcon: {
            control: "select",
            options: ["Upload", "Beaker", "Clear"],
            mapping: {
                Upload: Icons.NounProject.Upload,
                Beaker: Icons.Beaker,
                Clear: Icons.NounProject.Clear,
            },
            table: { category: "Upload button" },
        },
        fileLabel: {
            ...fileInputStoryControls.fileLabel,
            table: { category: "Upload button" },
        },
        fileUploadButtonProps: {
            control: "object",
            table: { category: "Upload button" },
        },
        fileTooltipPlacement: {
            ...fileInputStoryControls.fileTooltipPlacement,
            table: { category: "Upload button" },
        },
        mutiple: {
            ...fileInputStoryControls.mutiple,
            table: { category: "Upload button" },
        },
        accept: { table: { category: "Upload button" } },
        purgeLabel: {
            ...fileInputStoryControls.purgeLabel,
            table: { category: "Purge button" },
        },
        purgeButtonProps: {
            control: "object",
            table: { category: "Purge button" },
        },
        purgeTooltipPlacement: {
            ...fileInputStoryControls.purgeTooltipPlacement,
            table: { category: "Purge button" },
        },
        purgeText: {
            ...fileInputStoryControls.purgeText,
            table: { category: "Purge button" },
        },
        cancelLabel: {
            ...fileInputStoryControls.cancelLabel,
            table: { category: "Purge button" },
        },
        purgeConfirmationDialogProps: {
            control: "object",
            table: { category: "Purge button" },
        },
        onUpload: { control: false },
        onPurge: { control: false },
        onError: { control: false },
        onIsLoadingChange: { control: false },
    },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveFileInput key={args.fileName} {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { FileInput } },
    code: `import { FileInput } from '@web-ui';

export default FileInput;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        fileUploadButtonProps: { table: { disable: true } },
        purgeButtonProps: { table: { disable: true } },
    },
    render: (args) => (
        <>
            {buttonCorners.map((corners) => (
                <section key={corners}>
                    <h2>{corners}</h2>
                    <VariantGallery
                        colors={appearanceColorOptions}
                        variants={surfaceVariantOptions}
                        size={args.size}
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
                </section>
            ))}
        </>
    ),
};
