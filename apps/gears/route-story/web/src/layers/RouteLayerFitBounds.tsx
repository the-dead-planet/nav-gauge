import { FC, useEffect } from "react";
import { ToolProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { Icons } from "@ui";
import { RouteFitBoundsProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import styles from './route-layer.module.css';

export const RouteLayerFitBounds: FC<ToolProps<maplibregl.Map> & RouteFitBoundsProps<maplibregl.Map>> = ({
    map,
    data$,
    onFitBounds,
}) => {
    const [data] = useSubjectState(data$);
    const { boundingBox } = data;

    const handleFitBounds = () => {
        if (boundingBox) {
            onFitBounds(map,
                [boundingBox[0], boundingBox[1]],
                [boundingBox[2], boundingBox[3]],
            );
        }
    };

    useEffect(() => {
        handleFitBounds();
    }, [boundingBox?.[0], boundingBox?.[1], boundingBox?.[2], boundingBox?.[3]]);

    return (
        <button
            aria-label="Fit map bounds to route"
            title="Fit bounds to route"
            onClick={handleFitBounds}
            className={styles["zoom-button"]}
        >
            <img src={Icons.Find} width={20} />
        </button>
    );
};
