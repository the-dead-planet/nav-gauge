import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    fillVariantOptions,
    surfaceVariantOptions,
} from "../../design-system";
import { buttonStoryControls } from "../../gizmos/button";
import { StoryControl, StoryControls } from "../../storybook";
import { FileInputProps } from "./model";

export const fileInputStoryArgs: Omit<
    FileInputProps<unknown>,
    "onUpload" | "onPurge"
> = {
    color: DEFAULT_COLOR,
    variant: DEFAULT_SURFACE_VARIANT,
    size: DEFAULT_SIZE,
    highlighted: false,
    disabled: false,
    fileName: "route.gpx",
    noNameLabel: "No file selected",
    fileNameProps: undefined,
    fileLabel: "Upload file",
    fileUploadButtonProps: undefined,
    fileTooltipPlacement: undefined,
    mutiple: false,
    purgeLabel: "Purge",
    purgeButtonProps: undefined,
    purgeTooltipPlacement: undefined,
    purgeText: "Purge the selected file?",
    cancelLabel: "Cancel",
    purgeConfirmationDialogProps: undefined,
};

const surfaceVariantControl: StoryControl = {
    control: "select",
    options: ["Default", ...surfaceVariantOptions],
    mapping: {
        Default: undefined,
        ...Object.fromEntries(
            surfaceVariantOptions.map((variant) => [variant, { variant }]),
        ),
    },
};

export const fileInputStoryControls: StoryControls<FileInputProps<unknown>> = {
    themeMode: buttonStoryControls.themeMode,
    color: buttonStoryControls.color,
    highlightColor: buttonStoryControls.highlightColor,
    glyphsShade: buttonStoryControls.glyphsShade,
    highlightGlyphsShade: buttonStoryControls.highlightGlyphsShade,
    variant: buttonStoryControls.variant,
    size: buttonStoryControls.size,
    highlighted: buttonStoryControls.highlighted,
    disabled: buttonStoryControls.disabled,
    fileName: { control: "text" },
    noNameLabel: { control: "text" },
    fileNameProps: surfaceVariantControl,
    fileIcon: { control: "text" },
    fileLabel: { control: "text" },
    fileUploadButtonProps: surfaceVariantControl,
    fileTooltipPlacement: buttonStoryControls.tooltipPlacement,
    mutiple: { control: "boolean" },
    purgeLabel: { control: "text" },
    purgeButtonProps: surfaceVariantControl,
    purgeTooltipPlacement: buttonStoryControls.tooltipPlacement,
    purgeText: { control: "text" },
    cancelLabel: { control: "text" },
    purgeConfirmationDialogProps: {
        control: "select",
        options: ["Default", ...fillVariantOptions],
        mapping: {
            Default: undefined,
            ...Object.fromEntries(
                fillVariantOptions.map((variant) => [variant, { variant }]),
            ),
        },
    },
};
