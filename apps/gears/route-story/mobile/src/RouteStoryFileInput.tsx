import { FC } from "react";
import { View, } from "react-native";
import { DocumentPickerResponse, types } from "@react-native-documents/picker";
import RNFS from 'react-native-fs';
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FileInputStatus, FileInput } from "@mobile-ui";
import { FileToGeoJSONParser, parsers, useStateWarden, useSubjectState } from "@apparatus";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$ }) => {
    const { signaliumBureau } = useStateWarden();
    const [{ geojson, routeName, error }, setData] = useSubjectState(data$);
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
        if (!files || files.length === 0) {
            return;
        }
        let currentGeojson = geojson;
        let geojsonFile: DocumentPickerResponse | undefined = undefined;
        let imageFiles: DocumentPickerResponse[] = [];
        const geoExtensions = ['.gpx', '.kml']; // TODO: Read from parsers

        for (const file of files) {
            if (!file.name || !file.type) {
                continue;
            }
            if (file.type.includes('image')) {
                imageFiles.push(file);
            } else if (geoExtensions.some((ext) => file.name!.endsWith(ext))) {
                geojsonFile = file;
            }
        }

        if (geojsonFile) {
            const content = await RNFS.readFile(geojsonFile.uri, 'utf8').catch(handleError);
            setData({});
            const result = await parsers
                .get(FileToGeoJSONParser.getFileExtension(geojsonFile.name!))
                ?.parse(content ?? '');
            setData(result ?? { error: new Error('No parser found for file.') });
            currentGeojson = result?.geojson
        }

        // imageFiles.forEach((file) => readImage(file, currentGeojson));
    };

    return (
        <View>
            <FileInput
                type={[
                    types.images,
                    'application/gpx+xml',
                    'application/xml',
                    'text/xml',
                    'application/octet-stream'
                ]}
                allowMultiSelection
                onUpload={handleUpload}
                onError={handleError}
            />
            <FileInputStatus ok={!!geojson && !error} error={error} routeName={routeName} />
        </View>
    );
};
