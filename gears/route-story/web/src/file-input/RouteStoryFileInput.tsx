import { ChangeEvent, FC } from "react";
import { BehaviorSubject } from "rxjs";
import { Button, FileInputStatus } from "@web-ui";
import { parsers } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { FileOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../images/image-parser";
import styles from './file-input.module.css';

interface Props {
    data$: BehaviorSubject<ParsingResultWithError>;
    fileOperator: FileOperator<maplibregl.Map, File, WebMarkerImageData>;
}

export const RouteStoryFileInput: FC<Props> = ({
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
                <Button variant="outline" onClick={fileOperator.resetStory}>
                    Reset story
                </Button>
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
