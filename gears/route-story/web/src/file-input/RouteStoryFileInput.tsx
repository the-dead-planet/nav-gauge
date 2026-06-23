import { ChangeEvent, FC } from "react";
import { FileInputStatus } from "@web-ui";
import { parsers } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../images/image-parser";
import styles from './file-input.module.css';

export const RouteStoryFileInput: FC<RouteFileInputProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    data$,
    fileOperator
}) => {
    const [{ geojson, routeName, error }] = useSubjectState(data$);
    const [isLoading] = useSubjectState(fileOperator.isLoading$);

    const handleInput = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        const files: File[] = [];
        for (let i = 0; i < event.target.files.length; i++) {
            files.push(event.target.files.item(i)!);
        }
        fileOperator.uploadFile(files);
    };

    return (
        <div>
            <div className={styles.container}>
                <input
                    id="files"
                    type="file"
                    multiple
                    accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')}
                    onChange={handleInput}
                />
                <button onClick={fileOperator.resetStory}>
                    Reset story
                </button>
            </div>
            <FileInputStatus
                isLoading={isLoading}
                ok={!!geojson && !error}
                error={error}
                routeName={routeName}
            />
        </div>
    );
};
