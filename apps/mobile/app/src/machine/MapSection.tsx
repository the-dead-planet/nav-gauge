import { FC } from "react";
import { StyleSheet } from "react-native";
import { MapView } from "@maplibre/maplibre-react-native";

const styles = StyleSheet.create({
    mapView: {
        flex: 1,
    }
});

export const MapSection: FC = () => {
    return (
        <MapView style={styles.mapView} />
    );
};
