import { useState } from "react";
import {
    DocumentPickerOptions,
    DocumentPickerResponse,
    pick,
} from "@react-native-documents/picker";
import { FileInputProps, useFileInputUpload } from "@ui";

export const useFileInput = (
    props: FileInputProps<DocumentPickerResponse> & {
        type: DocumentPickerOptions["type"];
    },
) => {
    const [showPurgeDialog, setShowPurgeDialog] = useState(false);
    const { isLoading, upload } = useFileInputUpload(props);
    const disabled = props.disabled || isLoading;
    const handleUpload = () =>
        upload(() =>
            pick({
                mode: "open",
                type: props.type,
                allowMultiSelection: props.mutiple,
            }),
        );
    const confirmPurge = () => {
        if (!disabled && props.fileName) {
            props.onPurge();
        }
        setShowPurgeDialog(false);
    };

    return {
        disabled,
        handleUpload,
        showPurgeDialog,
        setShowPurgeDialog,
        confirmPurge,
    };
};
