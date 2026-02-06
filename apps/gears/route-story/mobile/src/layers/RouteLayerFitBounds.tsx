import { FC, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "@mobile-ui";
import { ToolProps, useStateWarden, useSubjectState } from "@apparatus";
import { RouteFitBoundsProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { MobileMap } from "@the-dead-planet/nav-gauge-mobile-ui/src/model";

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

export const RouteLayerFitBounds: FC<ToolProps<MobileMap> & RouteFitBoundsProps<MobileMap>> = ({
    map,
    data$,
    onFitBounds,
}) => {
    const stateWarden = useStateWarden();
    const [data] = useSubjectState(data$);
    const { boundingBox } = data;

    const handleFitBounds = () => {
        const { camera } = map;
        if (!camera || !boundingBox) {
            return;
        }
        onFitBounds(stateWarden, () => camera.fitBounds(
            [boundingBox[0], boundingBox[1]],
            [boundingBox[2], boundingBox[3]],
            20
        ));
    };

    useEffect(() => {
        handleFitBounds();
    }, [boundingBox]);

    return (
        <Pressable style={styles.button} onPress={handleFitBounds}>
            <Text style={styles.text}>Fit</Text>
        </Pressable>
    );
};
