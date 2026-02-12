import { FC } from "react";
import { ButtonProps, StyleSheet, View, ViewProps } from "react-native";
import { pick, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { Button } from "../../button/Button";

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
    buttonProps?: Omit<ButtonProps, 'title' | 'onPress'>;
}

export const FileInput: FC<FileInputProps & ViewProps> = ({
    title = 'Upload',
    buttonProps = {},
    ...props
}) => {
    const handleUpload = async () => {
        try {
            const [file] = await pick({
                mode: 'open',
                type: [
                    types.images,
                    'application/gpx+xml',
                    'application/xml',
                    'text/xml',
                    'application/octet-stream'
                ],
                allowMultiSelection: true,
                allowVirtualFiles: true
            });

            const content = await RNFS.readFile(file.uri, 'utf8');
        } catch (err) {
            console.error(err)
            // see error handling
        }
    };

    return (
        <View style={styles.container} {...props}>
            <Button
                title={title}
                onPress={handleUpload}
                {...buttonProps}
            />
        </View>
    );
};
