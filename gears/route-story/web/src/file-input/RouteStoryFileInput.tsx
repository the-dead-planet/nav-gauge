import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { parsers } from "@apparatus";
import { FileInput } from "@web-ui";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { FileOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../images/image-parser";

interface Props {
    data$: BehaviorSubject<ParsingResultWithError>;
    fileOperator: FileOperator<maplibregl.Map, File, WebMarkerImageData>;
}

export const RouteStoryFileInput: FC<Props> = ({
    data$,
    fileOperator
}) => {
    const [{ routeName }] = useSubjectState(data$);

    return (
        <FileInput
            fileName={routeName}
            fileLabel="File"
            purgeLabel="Purge story"
            cancelLabel="Cancel"
            noNameLabel="Designation void"
            accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')}
            onUpload={(files) => fileOperator.uploadFile(files)}
            onPurge={() => fileOperator.resetStory()}
        />
    );
};
