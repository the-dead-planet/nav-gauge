import { FC, useState } from "react";
import { View, } from "react-native";
import { DocumentPickerResponse, types } from "@react-native-documents/picker";
import RNFS from 'react-native-fs';
import * as Exify from '@lodev09/react-native-exify';
import { RouteFileInputProps, RouteStoryGear } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FileInputStatus, FileInput } from "@mobile-ui";
import { Cartomancer, parsers, useStateWarden, useSubjectState } from "@apparatus";
import { getExifError, getExifLngLat, getNext } from "@tinker-chest";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$ }) => {
    const { signaliumBureau } = useStateWarden();
    const [{ geojson, routeName, error }, setData] = useSubjectState(data$);
    const [isLoading, setIsLoading] = useState(false);
    const [_images, setImages] = useSubjectState(images$);

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
            async (file, geojson) => {
                if (!file.name) {
                    return;
                }

                setImages((prev) => {
                    return prev.filter((el) => el.name !== file.name).concat([{
                        id: getNext(prev.map((el) => el.id)),
                        name: file.name!,
                        progress: 0
                    }]);
                });

                Exify.read(file.uri)
                    .then(async (exif) => {
                        const lngLat = !exif ? undefined : getExifLngLat(exif);
                        // TODO: Decrease size?
                        const destPath = `${RNFS.TemporaryDirectoryPath}/${file.name}`;
                        await RNFS.copyFile(file.uri, destPath);

                        setImages((prev) => {
                            const nextImages = prev.slice();
                            const index = prev.findIndex((el) => el.name === file.name);
                            const [featureId, _feature] = geojson ? Cartomancer.getClosestFeature(geojson, lngLat) : [0, undefined];

                            nextImages[index] = {
                                ...nextImages[index],
                                progress: 100,
                                lngLat,
                                data: 'file://' + destPath,
                                error: getExifError(exif),
                                featureId,
                            };

                            return nextImages;
                        });
                    })
                    .catch((err: Error) => {
                        setImages((prev) => {
                            const nextImages = prev.slice();
                            const index = prev.findIndex((el) => el.name === file.name);
                            nextImages[index] = { ...nextImages[index], error: err?.message ?? 'Cannot read file' };

                            return nextImages;
                        });
                    });
            },
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
