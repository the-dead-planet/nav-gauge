import { ComponentProps, ElementType, FC, Fragment } from "react";
import classNames from "classnames";
import {
    ButtonProps,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    FileInputProps,
    Icons,
} from "@ui";
import { Button } from "../../gizmos/button";
import { Dialog } from "../../rigs/dialog";
import { P, Label } from "../../design-system/typography";
import { useFileInput } from "./useFileInput";
import styles from "./file-input.module.css";

interface Props extends FileInputProps<File> {
    accept: string;
    fileNameComponent?: ElementType;
}

export const FileInput: FC<
    Props & Omit<ComponentProps<"div">, keyof Props>
> = ({
    fileIcon = Icons.NounProject.Upload,
    fileName,
    fileNameProps,
    fileUploadButtonProps,
    purgeButtonProps,
    purgeConfirmationDialogProps,
    mutiple,
    color = DEFAULT_COLOR,
    variant = DEFAULT_SURFACE_VARIANT,
    size = DEFAULT_SIZE,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
    disabled: disabledProp,
    fileLabel,
    fileTooltipPlacement,
    purgeLabel,
    purgeTooltipPlacement,
    cancelLabel,
    noNameLabel,
    actionButtons,
    accept,
    onUpload,
    onPurge,
    onError,
    onIsLoadingChange,
    purgeText,
    className,
    ...props
}) => {
    const {
        inputRef,
        disabled,
        showPurgeDialog,
        setShowPurgeDialog,
        handleInput,
        confirmPurge,
    } = useFileInput({
        fileName,
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
        <div
            className={classNames(styles.container, className)}
            data-size={size}
            {...props}
        >
            <input
                aria-label={fileLabel}
                type="file"
                multiple={!!mutiple}
                accept={accept}
                disabled={disabled || fileUploadButtonProps?.disabled}
                onChange={handleInput}
                ref={inputRef}
                className={styles["file-input"]}
            />
            <Button
                aria-label={fileLabel}
                {...buttonAppearance}
                icon={fileIcon}
                tooltip={fileLabel}
                tooltipPlacement={fileTooltipPlacement}
                showTooltipConnection
                {...fileUploadButtonProps}
                disabled={disabled || fileUploadButtonProps?.disabled}
                onClick={() => inputRef.current?.click()}
            />
            <Label
                color={color}
                highlightColor={highlightColor}
                shade={glyphsShade}
                highlightShade={highlightGlyphsShade}
                highlighted={highlighted}
                {...fileNameProps}
                disabled={disabled || fileNameProps?.disabled}
                title={fileName ?? undefined}
                className={styles["file-name"]}
            >
                {fileName || noNameLabel}
            </Label>
            {actionButtons?.map(({ id, element }) => (
                <Fragment key={id}>{element}</Fragment>
            ))}
            <Button
                {...buttonAppearance}
                icon={Icons.NounProject.Clear}
                onClick={() => setShowPurgeDialog(true)}
                aria-label={purgeLabel}
                tooltip={fileName ? purgeLabel : undefined}
                tooltipPlacement={purgeTooltipPlacement}
                showTooltipConnection
                {...purgeButtonProps}
                disabled={disabled || !fileName || purgeButtonProps?.disabled}
            />
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
                    <P color={purgeConfirmationDialogProps?.color ?? color}>
                        {purgeText}
                    </P>
                </Dialog>
            ) : null}
        </div>
    );
};
