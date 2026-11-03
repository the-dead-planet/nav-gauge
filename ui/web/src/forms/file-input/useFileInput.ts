import { ChangeEvent, useRef, useState } from "react";
import { FileInputProps, useFileInputUpload } from "@ui";

export const useFileInput = (
    props: Pick<
        FileInputProps<File>,
        | "fileName"
        | "disabled"
        | "onUpload"
        | "onPurge"
        | "onError"
        | "onIsLoadingChange"
    >,
) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPurgeDialog, setShowPurgeDialog] = useState(false);
    const { isLoading, upload } = useFileInputUpload(props);
    const disabled = props.disabled || isLoading;

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.currentTarget.files ?? []);
        event.currentTarget.value = "";
        if (!disabled && files.length > 0) {
            void upload(() => files);
        }
    };

    const confirmPurge = () => {
        if (!disabled && props.fileName) {
            props.onPurge();
        }
        setShowPurgeDialog(false);
    };

    return {
        inputRef,
        disabled,
        showPurgeDialog,
        setShowPurgeDialog,
        handleInput,
        confirmPurge,
    };
};
