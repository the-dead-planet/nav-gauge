import { useState } from "react";
import { FileInputProps } from "./model";

export const useFileInputUpload = <TFile>({
    onUpload,
    onError,
    onIsLoadingChange,
}: Pick<
    FileInputProps<TFile>,
    "onUpload" | "onError" | "onIsLoadingChange"
>) => {
    const [isLoading, setIsLoading] = useState(false);

    const upload = async (selectFiles: () => TFile[] | Promise<TFile[]>) => {
        setIsLoading(true);
        onIsLoadingChange?.(true);
        try {
            await onUpload(await selectFiles());
        } catch (error) {
            onError?.(
                error instanceof Error ? error : new Error(String(error)),
            );
        } finally {
            setIsLoading(false);
            onIsLoadingChange?.(false);
        }
    };

    return { isLoading, upload };
};
