import { FC, useState } from "react";
import { ButtonProps, StyleSheet, View, ViewProps } from "react-native";
import { DocumentPickerOptions, DocumentPickerResponse, pick } from '@react-native-documents/picker';
import { Button } from "../../button/Button";
import { Text } from "../../text";

const styles = StyleSheet.create({
    container: {
    },
    button: {
    },
});

export interface FileInputProps {
    /**
     * Defaults to `Upload`
     */
    title?: string;
    type: DocumentPickerOptions['type'],
    allowMultiSelection?: boolean,
    buttonProps?: Omit<ButtonProps, 'title' | 'onPress'>;
    onUploadStart?: () => void;
    onUpload: (files: DocumentPickerResponse[]) => Promise<void>;
    onError?: (error: Error) => void;
}

export const FileInput: FC<FileInputProps & ViewProps> = ({
    title = 'Upload',
    type,
    allowMultiSelection,
    buttonProps = {},
    onUploadStart,
    onUpload,
    onError,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        setIsLoading(true);

        try {
            onUploadStart?.();
            const files = await pick({
                mode: 'open',
                type,
                allowMultiSelection,
            });
            await onUpload(files);
        } catch (err) {
            onError?.(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container} {...props}>
            <Button
                title={title}
                onPress={handleUpload}
                {...buttonProps}
            />
            {isLoading ? <Text>Loading...</Text> : null}
        </View>
    );
};
