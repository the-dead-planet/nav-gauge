import { FC, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Camera, CameraRef, MapView, MapViewRef, UserLocation, UserLocationRef } from "@maplibre/maplibre-react-native";
import { Cartomancer, useSubjectState, useStateWarden } from "@apparatus";
import { MapTools } from "./map-tools/MapTools";
import { MobileMap } from "@mobile-ui";

const styles = StyleSheet.create({
    mapViewContainer: {
        flex: 1,
    },
    mapView: {
        flex: 1,
    }
});

export const MapSection: FC = () => {
    const mapRef = useRef<MapViewRef>(null);
    const cameraRef = useRef<CameraRef>(null);
    const userLocationRef = useRef<UserLocationRef>(null);
    const [mapSize, setMapSize] = useState<{ width: number; height: number; }>({ width: 100, height: 100 });
    const map: MobileMap = {
        map: mapRef,
        camera: cameraRef,
        userLocation: userLocationRef,
        width: mapSize.width,
        height: mapSize.height,
    };
    const { cartomancer, signaliumBureau } = useStateWarden();
    const [_isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [_isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [overlays] = useSubjectState(cartomancer.overlays$);

    useEffect(() => {
        setIsInitialised(true);
        setIsStyleLoaded(true);
    }, []);

    const handleLayoutChange = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setMapSize({ width, height })
    };

    return (
        <MapTools map={map}>
            <View style={styles.mapViewContainer} onLayout={handleLayoutChange}>
                <MapView
                    ref={mapRef}
                    style={styles.mapView}
                    mapStyle={Cartomancer.styles[selectedStyle.id]?.style}
                    onDidFinishLoadingMap={() => setIsInitialised(true)}
                    onDidFinishLoadingStyle={() => setIsStyleLoaded(true)}
                    onDidFailLoadingMap={() => {
                        signaliumBureau.addNotice({
                            id: 'map-failed',
                            type: 'error',
                            error: new Error('Map loading failed'),
                            text: 'Something went wrong'
                        })
                    }}
                    onRegionIsChanging={(feature) => {
                        cartomancer.bearing$.next(feature.properties.heading);
                    }}
                >
                    <Camera ref={cameraRef} />
                    <UserLocation ref={userLocationRef} visible={false} onUpdate={(_location) => { }} />
                    {[...overlays.entries()].map(([id, OverlayComponent]) => (
                        <OverlayComponent key={id} map={map} />
                    ))}
                </MapView>
            </View>
        </MapTools>
    );
};
