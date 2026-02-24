import { BehaviorSubject } from 'rxjs';
import RNFS from 'react-native-fs';
import * as Exify from '@lodev09/react-native-exify';
import { Cartomancer, MarkerImage, useSubjectState } from "@apparatus";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { FileOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { GeoJson, getExifError, getExifLngLat } from "@tinker-chest";

export const useImageReader = (
    fileOperator: FileOperator,
    images$: BehaviorSubject<MarkerImage[]>
) => {
    const [_images, setImages] = useSubjectState(images$);

    const readImage = async (file: DocumentPickerResponse, geojson?: GeoJson) => {
        const fileName = file.name;
        if (!fileName) {
            return;
        }
        fileOperator.pushInitialImage(fileName);

        Exify.read(file.uri)
            .then(async (exif) => {
                const lngLat = !exif ? undefined : getExifLngLat(exif);
                // TODO: Decrease size? Delete temp file before app close?
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
                fileOperator.updateImageError(file.name!, err?.message);
            });
    };

    return readImage;
};
