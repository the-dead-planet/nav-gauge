import { FC, useEffect } from "react";
import { Button } from "react-native";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { ToolProps, useStateWarden, useSubjectState } from "@apparatus";
import { RouteFitBoundsProps } from "@the-dead-planet/nav-gauge-gears-route-story";

export const RouteLayerFitBounds: FC<ToolProps<MapViewRef | null> & RouteFitBoundsProps> = ({
    map,
    data$,
    onFitBounds,
    padding,
    animate,
}) => {
    // const stateWarden = useStateWarden();
    // const [data] = useSubjectState(data$);
    // const { boundingBox } = data;

    // const handleFitBounds = () => onFitBounds(stateWarden, map, boundingBox, { padding, animate });

    // useEffect(() => {
    //     handleFitBounds();
    // }, [boundingBox]);

    return (
        <Button title="Fit" onPress={() => {
            // TODO:
        }}></Button>
    );
};
