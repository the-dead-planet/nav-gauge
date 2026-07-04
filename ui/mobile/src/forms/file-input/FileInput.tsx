import { FC } from "react";
import { Alert, StyleSheet, View, ViewProps } from "react-native";
import { DocumentPickerOptions, DocumentPickerResponse, pick } from '@react-native-documents/picker';
import { Button } from "../../button";
import { Text } from "../../typography";
import { FileInputProps } from "@ui";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    routeName: {
        flex: 1,
        overflow: 'hidden',
    },
});

interface Props extends FileInputProps<DocumentPickerResponse> {
    type: DocumentPickerOptions['type'];
    allowMultiSelection?: boolean;
}

export const FileInput: FC<Props & ViewProps> = ({
    fileName,
    fileLabel,
    purgeLabel,
    cancelLabel,
    noNameLabel,
    type,
    allowMultiSelection,
    onUpload,
    onPurge,
    onError,
    onIsLoadingChange,
    style,
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

    const handlePurge = () => {
        Alert.alert(
            purgeLabel,
            'Are you sure you want to purge all story data? This will remove the route and images and cannot be undone.',
            [
                { text: cancelLabel, style: 'cancel' },
                {
                    text: purgeLabel,
                    style: 'destructive',
                    onPress: onPurge,
                },
            ],
        );
    };

    return (
        <View style={[styles.container, style]} {...props}>
            <Button title={fileLabel} onPress={handleUpload} />
            <Text style={styles.routeName}>
                {fileName || noNameLabel}
            </Text>
            <Button title={purgeLabel} onPress={handlePurge} />
        </View>
    );
};