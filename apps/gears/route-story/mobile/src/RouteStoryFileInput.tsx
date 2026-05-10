import { FC } from "react";
import { StyleSheet, View, } from "react-native";
import { DocumentPickerResponse, types } from "@react-native-documents/picker";
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FileInputStatus, FileInput, MobileMap, Button } from "@mobile-ui";
import { parsers, useSubjectState } from "@apparatus";
import { MobileMarkerImageData } from "./images/image-parser";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        columnGap: 10,
        padding: 5,
    },
    uploadButton: {
        flex: 1,
    },
    resetButton: {
        width: "auto"
    }
});

export const RouteStoryFileInput: FC<RouteFileInputProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    data$,
    images$: _images$,
    fileOperator
}) => {
    const [{ geojson, routeName, error }] = useSubjectState(data$);
    const [isLoading, setIsLoading] = useSubjectState(fileOperator.isLoading$);

    return (
        <View>
            <View style={styles.container}>
                <FileInput
                    type={[
                        ...[...parsers.values()].flatMap((parser) => parser.fileTypes),
                        types.images
                    ]}
                    allowMultiSelection
                    onIsLoadingChange={setIsLoading}
                    onUpload={fileOperator.uploadFile}
                    onError={fileOperator.onError}
                    style={styles.uploadButton}
                />
                <View style={styles.resetButton}>
                    <Button title='Reset story' onPress={fileOperator.resetStory} />
                </View>
            </View>
            <FileInputStatus
                isLoading={isLoading}
                ok={!!geojson && !error}
                error={error}
                routeName={routeName}
            />
        </View>
    );
};
