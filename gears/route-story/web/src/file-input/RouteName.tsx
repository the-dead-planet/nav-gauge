import { FC } from "react";
import { TopToolsProps } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { H4, Panel } from "@web-ui";
import { WebMarkerImageData } from "../images/image-parser";
import { useSubjectState } from "@tinker-chest";

export const RouteName: FC<TopToolsProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    data$
}) => {
    const [{ geojson, routeName, error }] = useSubjectState(data$);

    return (
        <Panel variant="fill-translucent" color="primary" style={{ 
            display: 'inline-block',
            marginTop: '6px',
            padding: '4px 8px',
            }}>
            <H4 color="primary">
                {routeName}
            </H4>
        </Panel>
    );
};
