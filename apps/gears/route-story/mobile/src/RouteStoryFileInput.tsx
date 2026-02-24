import { FC } from "react";
import { View, } from "react-native";
import { DocumentPickerResponse, types } from "@react-native-documents/picker";
import RNFS from 'react-native-fs';
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FileInputStatus, FileInput } from "@mobile-ui";
import { parsers, useStateWarden, useSubjectState } from "@apparatus";
import { useImageReader } from "./images/useImageReader";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$, fileOperator }) => {
    const { signaliumBureau } = useStateWarden();
    const [{ geojson, routeName, error }] = useSubjectState(data$);
    const [isLoading, setIsLoading] = useSubjectState(fileOperator.isLoading$);
    const readImage = useImageReader(fileOperator, images$)

    const handleUpload = async (files: DocumentPickerResponse[]) => {
        fileOperator.uploadFile<DocumentPickerResponse>(
            files,
            signaliumBureau,
            (file) => RNFS.readFile(file.uri, 'utf8'),
            readImage,
        );
    };

    return (
        <View>
            <FileInput
                type={[
                    ...[...parsers.values()].flatMap((parser) => parser.fileTypes),
                    types.images
                ]}
                allowMultiSelection
                onIsLoadingChange={setIsLoading}
                onUpload={handleUpload}
                onError={(err) => fileOperator.onError(err, signaliumBureau)}
            />
            <FileInputStatus
                isLoading={isLoading}
                ok={!!geojson && !error}
                error={error}
                routeName={routeName}
            />
        </View>
    );
};
