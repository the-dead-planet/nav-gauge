import { FC } from "react";
import { TopToolsProps } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, H4, BevelPanel } from "@web-ui";
import { WebMarkerImageData } from "../images/image-parser";
import { useSubjectState } from "@tinker-chest";
import { T } from "@web-apparatus";

export const RouteName: FC<TopToolsProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    gearId,
    translationKey,
    data$
}) => {
    const [{ geojson, routeName, error }] = useSubjectState(data$);

    return (
        <BevelPanel
            variant="fill-translucent"
            color="primary"
            padding="sm"
            style={{
                marginTop: '6px',
                display: 'inline-flex',
            }}
            contentStyle={{
                display: 'inline-flex',
                gap: '8px',
                alignItems: 'center'
            }}>
            <Button variant="fill" color="primary" corners="circle" onClick={() => { }}>
                <T n={gearId} t={translationKey.File} />
            </Button>
            <H4 color="primary">
                {routeName || <T n={gearId} t={translationKey.NoName} />}
            </H4>
            {/* <Button variant="fill" color="primary" corners="circle" onClick={() => { }}>
                <T n={gearId} t={translationKey.File} />
            </Button> */}
        </BevelPanel>
    );
};
