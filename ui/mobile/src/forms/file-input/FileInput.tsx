import { ComponentType, FC, Fragment } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { SvgProps } from "react-native-svg";
import {
    DocumentPickerOptions,
    DocumentPickerResponse,
} from "@react-native-documents/picker";
import { Button } from "../../gizmos/button";
import { Label, Text } from "../../design-system/typography";
import { Dialog } from "../../rigs/dialog";
import {
    ButtonProps,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    FileInputProps,
    Icons,
    ThemeContext,
    useTheme,
} from "@ui";
import { useFileInput } from "./useFileInput";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        minWidth: 0,
        maxWidth: "100%",
    },
    fileName: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 0,
        overflow: "hidden",
    },
});

interface Props extends Omit<
    FileInputProps<DocumentPickerResponse>,
    "fileIcon"
> {
    fileIcon?: string | ComponentType<SvgProps>;
    type: DocumentPickerOptions["type"];
}

export const FileInput: FC<Props & ViewProps> = ({
    themeMode,
    color = DEFAULT_COLOR,
    variant = DEFAULT_SURFACE_VARIANT,
    size = DEFAULT_SIZE,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
    disabled: disabledProp,
    fileIcon = Icons.NounProject.Upload,
    fileName,
    fileNameProps,
    fileUploadButtonProps,
    purgeButtonProps,
    purgeConfirmationDialogProps,
    fileLabel,
    purgeLabel,
    purgeText,
    fileTooltipPlacement,
    purgeTooltipPlacement,
    cancelLabel,
    noNameLabel,
    type,
    mutiple,
    actionButtons,
    onUpload,
    onPurge,
    onError,
    onIsLoadingChange,
    style,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const {
        disabled,
        handleUpload,
        showPurgeDialog,
        setShowPurgeDialog,
        confirmPurge,
    } = useFileInput({
        fileName,
        fileLabel,
        purgeLabel,
        cancelLabel,
        noNameLabel,
        purgeText,
        type,
        mutiple,
        disabled: disabledProp,
        onUpload,
        onPurge,
        onError,
        onIsLoadingChange,
    });
    const buttonAppearance: Partial<ButtonProps> = {
        color,
        variant,
        size,
        highlightColor,
        glyphsShade,
        highlightGlyphsShade,
        highlighted,
        disabled,
    };

    return (
        <ThemeContext.Provider value={theme}>
            <View
                style={[
                    styles.container,
                    { gap: theme.sizes.control[size].gap },
                    style,
                ]}
                {...props}
            >
                <Button
                    {...buttonAppearance}
                    icon={fileIcon as ComponentType<SvgProps>}
                    accessibilityLabel={fileLabel}
                    tooltip={fileLabel}
                    tooltipPlacement={fileTooltipPlacement}
                    {...fileUploadButtonProps}
                    disabled={disabled || fileUploadButtonProps?.disabled}
                    onPress={handleUpload}
                />
                <Label
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    highlighted={highlighted}
                    {...fileNameProps}
                    disabled={disabled || fileNameProps?.disabled}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={styles.fileName}
                >
                    {fileName || noNameLabel}
                </Label>
                {actionButtons?.map(({ id, element }) => (
                    <Fragment key={id}>{element}</Fragment>
                ))}
                <Button
                    {...buttonAppearance}
                    icon={Icons.NounProject.Clear}
                    accessibilityLabel={purgeLabel}
                    tooltip={purgeLabel}
                    tooltipPlacement={purgeTooltipPlacement}
                    {...purgeButtonProps}
                    onPress={() => setShowPurgeDialog(true)}
                    disabled={
                        disabled || !fileName || purgeButtonProps?.disabled
                    }
                />
            </View>
            {showPurgeDialog && !disabled ? (
                <Dialog
                    color={color}
                    header={purgeLabel}
                    closeText={cancelLabel}
                    {...purgeConfirmationDialogProps}
                    onClose={() => setShowPurgeDialog(false)}
                    save={{
                        saveText: purgeLabel,
                        onSave: confirmPurge,
                    }}
                >
                    <Text color={purgeConfirmationDialogProps?.color ?? color}>
                        {purgeText}
                    </Text>
                </Dialog>
            ) : null}
        </ThemeContext.Provider>
    );
};
