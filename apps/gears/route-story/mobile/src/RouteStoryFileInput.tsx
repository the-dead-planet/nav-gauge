import { FC, useState } from "react";
import { View, } from "react-native";
import { DocumentPickerResponse, types } from "@react-native-documents/picker";
import RNFS from 'react-native-fs';
import { RouteFileInputProps, RouteStoryGear } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FileInputStatus, FileInput } from "@mobile-ui";
import { parsers, useStateWarden, useSubjectState } from "@apparatus";
import { GeoJson } from "@tinker-chest";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$ }) => {
    const { signaliumBureau } = useStateWarden();
    const [{ geojson, routeName, error }, setData] = useSubjectState(data$);
    const [isLoading, setIsLoading] = useState(false);
    const [_images, setImages] = useSubjectState(images$);
    // const readImage = useImageReader(setImages);

    const handleError = (error: Error) => {
        const id = 'file-upload';
        signaliumBureau.addNotice({
            id,
            type: 'error',
            text: 'File upload failed',
            error,
        });
    };

    const handleUpload = async (files: DocumentPickerResponse[]) => {
        return RouteStoryGear.uploadFile<DocumentPickerResponse>(
            files,
            geojson,
            (file) => RNFS.readFile(file.uri, 'utf8'),
            handleError,
            setData,
            (a: DocumentPickerResponse, geojson: GeoJson | undefined) => {
                // TODO:
            }
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
                onError={handleError}
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
