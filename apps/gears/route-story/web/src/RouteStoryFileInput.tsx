import { FC } from "react";
import { FileInputStatus } from "@web-ui";
import { useImageReader } from "./images/useImageReader";
import { FileToGeoJSONParser, useSubjectState, parsers } from "@apparatus";
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$ }) => {
    const [{ geojson, routeName, error }, setData] = useSubjectState(data$);
    const [_images, setImages] = useSubjectState(images$);
    const readImage = useImageReader(setImages);

    const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || files.length === 0) {
            return;
        }
        let currentGeojson = geojson;
        let geojsonFile: File | undefined = undefined;
        let imageFiles: File[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            if (file.type.includes('image')) {
                imageFiles.push(file);
            } else {
                geojsonFile = file;
            }
        }

        if (geojsonFile) {
            setData({});
            const result = await parsers
                .get(FileToGeoJSONParser.getFileExtension(geojsonFile.name))
                ?.parse(await geojsonFile.text());
            setData(result ?? { error: new Error('No parser found for file.') });
            currentGeojson = result?.geojson
        }

        imageFiles.forEach((file) => readImage(file, currentGeojson));
    };

    return (
        <div>
            <input
                id="files"
                type="file"
                multiple
                accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')}
                onChange={handleInput}
            />
            <FileInputStatus ok={!!geojson && !error} error={error} routeName={routeName} />
        </div>
    );
};
