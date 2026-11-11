import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Map, Marker } from "maplibre-gl";
import { Chip, Span } from "@web-ui";
import {
    formatImageMarkerCount,
    ImageFeature,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import styles from "./image-marker-count.module.css";

export const ImageMarkerCount: FC<{ map: Map; feature: ImageFeature }> = ({
    map,
    feature,
}) => {
    const [element] = useState(() => document.createElement("span"));
    const [longitude, latitude] = feature.geometry.coordinates;

    useEffect(() => {
        element.className = styles["marker-count"];
        const marker = new Marker({ element, offset: [20, -20] })
            .setLngLat([longitude, latitude])
            .addTo(map);
        return () => {
            marker.remove();
        };
    }, [map, element, longitude, latitude]);

    return createPortal(
        <Chip size="xs" color="tertiary" variant="fill">
            <Span className={styles["badge-number"]}>
                {formatImageMarkerCount(feature.properties.markerCount ?? 1)}
            </Span>
        </Chip>,
        element,
    );
};
