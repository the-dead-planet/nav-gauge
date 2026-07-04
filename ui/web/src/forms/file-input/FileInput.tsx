import { ChangeEvent, ComponentProps, ElementType, FC, useRef, useState } from "react";
import {  FileInputProps, Icons } from "@ui";
import { Button } from "../../button";
import { Dialog } from "../../dialog";
import { P, Label } from "../../typography";
import classNames from "classnames";
import styles from './file-input.module.css';

interface Props extends FileInputProps<File> {
    accept: string;
    fileNameComponent?: ElementType;
}

export const FileInput: FC<Props & ComponentProps<'div'>> = ({
    fileIcon = Icons.NounProject.Upload,
    fileName,
    mutiple,
    color,
    fileLabel,
    fileTooltipPlacement,
    purgeLabel,
    purgeTooltipPlacement,
    cancelLabel,
    noNameLabel,
    accept,
    onUpload,
    onPurge,
    fileNameComponent: FileNameComponent = Label,
    className,
    ...props
}) => {
    const [showPurgeDialog, setShowPurgeDialog] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        const files: File[] = [];
        for (let i = 0; i < event.target.files.length; i++) {
            files.push(event.target.files.item(i)!);
        }
        onUpload(files);
    };

    return (
        <div className={classNames(styles['container'], className)} {...props}>
            <input
                aria-label={fileLabel}
                type="file"
                multiple={mutiple}
                accept={accept}
                onChange={handleInput}
                ref={inputRef}
                className={styles['file-input']}
            />
            <Button
                aria-label={fileLabel}
                variant="fill"
                color={color}
                size="sm"
                corners="circle"
                icon={fileIcon}
                tooltip={fileLabel}
                tooltipPlacement={fileTooltipPlacement}
                showTooltipConnection
                onClick={() => inputRef.current?.click()}
            />
            <FileNameComponent
                color={color}
                title={fileName ?? undefined}
                className={styles['route-name']}
            >
                {fileName || noNameLabel}
            </FileNameComponent>
            <Button
                variant="ghost"
                color={color}
                corners="circle"
                icon={Icons.NounProject.Clear}
                onClick={() => setShowPurgeDialog(true)}
                aria-label={purgeLabel}
                tooltip={fileName ? purgeLabel : undefined}
                tooltipPlacement={purgeTooltipPlacement}
                showTooltipConnection
                disabled={!fileName}
                className={styles['purge-button']}
            />
            {showPurgeDialog ? (
                <Dialog
                    variant="fill-inverse"
                    header={purgeLabel}
                    closeText={cancelLabel}
                    onClose={() => setShowPurgeDialog(false)}
                    save={{
                        saveText: purgeLabel,
                        onSave: () => {
                            onPurge();
                            setShowPurgeDialog(false);
                        },
                    }}
                >
                    <P color={color}>
                        Are you sure you want to purge all story data? This will remove the route and images and cannot be undone.
                    </P>
                </Dialog>
            ) : null}
        </div>
    );
};
