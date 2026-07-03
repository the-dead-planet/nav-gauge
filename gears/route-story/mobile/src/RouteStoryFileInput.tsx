import { FC } from "react";
import { StyleSheet, View, } from "react-native";
import { DocumentPickerResponse, types } from "@react-native-documents/picker";
import { FileOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FileInput, MobileMap, Button } from "@mobile-ui";
import { parsers } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { MobileMarkerImageData } from "./images/image-parser";
import { BehaviorSubject } from "rxjs";

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

interface Props {
    data$: BehaviorSubject<ParsingResultWithError>;
    fileOperator: FileOperator<MobileMap, DocumentPickerResponse, MobileMarkerImageData>;
}

export const RouteStoryFileInput: FC<Props> = ({
    data$,
    fileOperator
}) => {
    const [{ geojson, routeName, error }] = useSubjectState(data$);
    const [isLoading, setIsLoading] = useSubjectState(fileOperator.isLoading$);

    return (
        <View>
            <View style={styles.container}>
                {/* TODO: */}
                {/* <FileInput
                    fileName={routeName}
                    type={[
                        ...[...parsers.values()].flatMap((parser) => parser.fileTypes),
                        types.images
                    ]}
                    allowMultiSelection
                    onIsLoadingChange={setIsLoading}
                    onUpload={fileOperator.uploadFile}
                    onError={fileOperator.onError}
                    style={styles.uploadButton}
                /> */}
                <View style={styles.resetButton}>
                    <Button title='Reset story' onPress={fileOperator.resetStory} />
                </View>
            </View>
            {/* <FileInputStatus
                isLoading={isLoading}
                ok={!!geojson && !error}
                error={error}
                routeName={routeName}
            /> */}
        </View>
    );
};
