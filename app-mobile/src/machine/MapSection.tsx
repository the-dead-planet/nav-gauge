import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { CameraRef, MapRef } from "@maplibre/maplibre-react-native";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap, Text } from "@mobile-ui";
import { MapToolsGridAreas } from "./map-tools-grid/MapToolsGridAreas";
import { GearsTopToolbar } from "./GearsTopToolbar";
import {
    MapCanvas,
    dragPan$,
    onPressHandlers$,
    onLongPressHandlers$,
    onPanResponderStartHandlers$,
    onPanResponderMoveHandlers$,
    onPanResponderEndHandlers$
} from "./map-canvas/MapCanvas";
import { ErrorBoundary } from "@ui";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    mapView: {
        flex: 1,
    },
});

const map: MobileMap = {
    map$: new BehaviorSubject<MapRef | null>(null),
    camera$: new BehaviorSubject<CameraRef | null>(null),
    mapSize$: new BehaviorSubject<{ width: number; height: number; }>({ width: 100, height: 100 }),
    dragPan$,
    onPressHandlers$,
    onLongPressHandlers$,
    onPanResponderStartHandlers$,
    onPanResponderMoveHandlers$,
    onPanResponderEndHandlers$,
};

export const MapSection: FC = () => {
    const { cartomancer } = useMachineWard();
    const [overlays] = useSubjectState(cartomancer.overlays$);

    return (
        <View style={styles.container}>
            <ErrorBoundary fallbackComponent={({error, errorInfo }) => (
                <View>
                    <Text>Oops... some error happened</Text>
                    <Text>{error.name}</Text>
                    <Text>{error.message}</Text>
                    <Text>{typeof error.cause == 'string' ? error.cause : 'Unknown cause'}</Text>
                    <Text>{errorInfo?.componentStack ?? 'no stack'}</Text>
                </View>
            )}>
                <MapCanvas map={map}>
                    {[...overlays.entries()].map(([id, OverlayComponent]) => (
                        <OverlayComponent key={id} map={map} />
                    ))}
                </MapCanvas>
            </ErrorBoundary>
            <GearsTopToolbar />
            <MapToolsGridAreas map={map} />
        </View>
    );
};
