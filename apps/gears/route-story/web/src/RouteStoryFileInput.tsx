import { FC } from "react";
import { FileInputStatus } from "@web-ui";
import { useImageReader } from "./images/useImageReader";
import { useSubjectState, parsers, useStateWarden } from "@apparatus";
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$, fileOperator }) => {
    const { signaliumBureau } = useStateWarden();
    const [{ geojson, routeName, error }] = useSubjectState(data$);
    const [isLoading] = useSubjectState(fileOperator.isLoading$);
    const readImage = useImageReader(fileOperator, images$);

    const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        const files: File[] = [];
        for (let i = 0; i < event.target.files.length; i++) {
            files.push(event.target.files.item(i)!);
        }

        fileOperator.uploadFile<File>(
            files,
            signaliumBureau,
            (file) => file.text(),
            readImage
        );
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
            <FileInputStatus
                isLoading={isLoading}
                ok={!!geojson && !error}
                error={error}
                routeName={routeName}
            />
        </div>
    );
};
