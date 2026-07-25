import { FC, useState } from "react";
import { ScrollView, View, StyleSheet, TextInput } from "react-native";
import { FileInput } from "./FileInput";
import { Text } from "../../typography";
import { ColorVariant } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    section: {
        paddingVertical: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 4,
        padding: 8,
        color: '#fff',
    },
});

const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const FileInputVariants: FC = () => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [color] = useState<ColorVariant>('primary');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text>No file</Text>
                <FileInput
                    type={['public.item']}
                    fileName={null}
                    fileLabel="Upload"
                    purgeLabel="Purge"
                    cancelLabel="Cancel"
                    noNameLabel="No file selected"
                    onUpload={() => {}}
                    onPurge={() => {}}
                />
            </View>

            <View style={styles.section}>
                <Text>With file</Text>
                <FileInput
                    type={['public.item']}
                    fileName="my-route.gpx"
                    fileLabel="Upload"
                    purgeLabel="Purge"
                    cancelLabel="Cancel"
                    noNameLabel="No file selected"
                    onUpload={() => {}}
                    onPurge={() => {}}
                />
            </View>

            <View style={styles.section}>
                <Text>Colors</Text>
                {allColors.map(c => (
                    <View key={c} style={{ paddingVertical: 4 }}>
                        <FileInput
                            type={['public.item']}
                            color={c}
                            fileName={`route-${c}.gpx`}
                            fileLabel="Upload"
                            purgeLabel="Purge"
                            cancelLabel="Cancel"
                            noNameLabel="No file selected"
                            onUpload={() => {}}
                            onPurge={() => {}}
                        />
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text>Interactive</Text>
                <Text>Type a file name to simulate upload:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter file name..."
                    placeholderTextColor="#999"
                    value={fileName ?? ''}
                    onChangeText={(text) => setFileName(text || null)}
                />
                <View style={{ marginTop: 8 }}>
                    <FileInput
                        type={['public.item']}
                        color={color}
                        fileName={fileName}
                        fileLabel="Upload"
                        purgeLabel="Purge"
                        cancelLabel="Cancel"
                        noNameLabel="No file selected"
                        onUpload={() => {}}
                        onPurge={() => setFileName(null)}
                    />
                </View>
            </View>
        </ScrollView>
    );
};
