import { FC, useEffect } from "react";
import { Button, Pressable } from "react-native";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { ToolProps, useStateWarden, useSubjectState } from "@apparatus";
import { RouteFitBoundsProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { StyleSheet } from "react-native";
import { Text } from "@mobile-ui";

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 8
    },
    text: {
        color: 'white',
        paddingTop: 10,
        textAlign: 'center'
    }
});

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
        <Pressable style={styles.button} onPress={() => { }}>
            <Text style={styles.text}>Fit</Text>
        </Pressable>
    );
};
