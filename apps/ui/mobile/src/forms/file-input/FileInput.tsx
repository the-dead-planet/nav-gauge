import { FC } from "react";
import { ButtonProps, View, ViewProps } from "react-native";
import { DocumentPickerOptions, DocumentPickerResponse, pick } from '@react-native-documents/picker';
import { Button } from "../../button/Button";

export interface FileInputProps {
    /**
     * Defaults to `Upload`
     */
    title?: string;
    type: DocumentPickerOptions['type'],
    allowMultiSelection?: boolean,
    buttonProps?: Omit<ButtonProps, 'title' | 'onPress'>;
    onIsLoadingChange?: (isLoading: boolean) => void;
    onUpload: (files: DocumentPickerResponse[]) => Promise<void>;
    onError?: (error: Error) => void;
}

export const FileInput: FC<FileInputProps & ViewProps> = ({
    title = 'Upload',
    type,
    allowMultiSelection,
    buttonProps = {},
    onIsLoadingChange,
    onUpload,
    onError,
    ...props
}) => {
    const handleUpload = async () => {
        onIsLoadingChange?.(true);

        try {
            const files = await pick({
                mode: 'open',
                type,
                allowMultiSelection,
            });
            await onUpload(files);
        } catch (err) {
            onError?.(err as Error);
        } finally {
            onIsLoadingChange?.(false);
        }
    };

    return (
        <View {...props}>
            <Button
                title={title}
                onPress={handleUpload}
                {...buttonProps}
            />
        </View>
    );
};
