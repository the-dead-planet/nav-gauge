import { FC, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Camera, CameraRef, MapView, MapViewRef, UserLocation, UserLocationRef } from "@maplibre/maplibre-react-native";
import { Cartomancer, useSubjectState, useStateWarden } from "@apparatus";
import { MapTools } from "./map-tools/MapTools";

const styles = StyleSheet.create({
    mapView: {
        flex: 1,
    }
});

export const MapSection: FC = () => {
    const mapRef = useRef<MapViewRef>(null);
    const cameraRef = useRef<CameraRef>(null);
    const userLocationRef = useRef<UserLocationRef>(null);
    const map = {
        map: mapRef.current,
        camera: cameraRef.current,
        userLocation: userLocationRef.current,
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

    return (
        <MapTools map={map}>
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
                {/* <UserLocation ref={userLocationRef} visible={false} onUpdate={(_location) => { }} /> */}
                {[...overlays.entries()].map(([id, OverlayComponent]) => (
                    <OverlayComponent
                        key={id}
                        map={map}
                    />
                ))}
            </MapView>
        </MapTools>
    );
};
