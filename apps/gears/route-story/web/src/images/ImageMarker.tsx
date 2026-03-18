import { CSSProperties, FC, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import maplibregl from "maplibre-gl";
import { Cartomancer, useStateWarden, useSubjectState, FeatureStateProps } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { sourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import * as styles from './images.module.css';

const imageSize = 30;

interface Props {
    map: maplibregl.Map;
    imageId: number,
    data: string;
    marker: maplibregl.Marker;
    markerElement: HTMLDivElement;
    onUpdateImageFeatureId: (imageId: number, featureId: number) => void;
    geojson: GeoJson;
}

// TODO: If multiple in the same location, render all
export const ImageMarker: FC<Props> = ({ map, imageId, data, marker, markerElement, geojson, onUpdateImageFeatureId }) => {
    const { animatrix, cartomancer } = useStateWarden();
    const [closestFeatureId, setClosestFeatureId] = useState<number | null>(null);
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [mapLayout] = useSubjectState(cartomancer.mapLayout$);

    useEffect(() => {
        const handleDrag = () => {
            setClosestFeatureId(Cartomancer.getClosestFeature(geojson, marker.getLngLat())[0]);
        };

        const handleDragEnd = () => {
            const [id, feature] = Cartomancer.getClosestFeature(geojson, marker.getLngLat());
            marker.setLngLat(new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]));
            onUpdateImageFeatureId(imageId, id);

            setClosestFeatureId(null);
        };

        marker.addTo(map);
        marker.on('drag', handleDrag);
        marker.on('dragend', handleDragEnd);

        return () => {
            marker.off('drag', handleDrag);
            marker.off('dragend', handleDragEnd);
            marker.remove();
        };
    }, [imageId, marker]);

    useEffect(() => {
        if (closestFeatureId === null) {
            return;
        }
        // TODO: Add another source for all points or closest point and update data here
        const updateHighlight = (highlight: boolean) => {
            map.setFeatureState({ source: sourceIds.line, id: closestFeatureId }, {
                [FeatureStateProps.Highlight]: highlight
            });
        }
        updateHighlight(true);

        return () => {
            updateHighlight(false);
        };
    }, [closestFeatureId]);

    useEffect(() => {
        if (displayImageId !== imageId) {
            return;
        }
        markerElement.classList.add(styles['display-container']);

        return () => {
            markerElement.classList.remove(styles['display-container']);
        };
    }, [displayImageId, imageId]);

    // TODO: Check if string data should be supported
    return ReactDOM.createPortal(
        <img
            src={data}
            alt={`image ${imageId}`}
            className={classNames(styles['image-marker'], {
                [styles['in-display']]: displayImageId === imageId
            })}
            style={{
                // TODO: Add ref client size observer to handle the "full screen" size
                '--image-size': `${imageSize}px`,
                '--image-display-scale': Math.ceil(Math.min(mapLayout.size.width, mapLayout.size.height) / imageSize)
            } as CSSProperties}
        />,
        markerElement
    );
};
