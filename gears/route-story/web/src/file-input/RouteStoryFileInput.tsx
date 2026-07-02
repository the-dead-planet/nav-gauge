import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { FileInputStatus } from "@web-ui";
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
    const [{ geojson, routeName, error }] = useSubjectState(data$);
    const [isLoading] = useSubjectState(fileOperator.isLoading$);

    return (
        <FileInputStatus
            isLoading={isLoading}
            ok={!!geojson && !error}
            error={error}
            routeName={routeName}
        />
    );
};
