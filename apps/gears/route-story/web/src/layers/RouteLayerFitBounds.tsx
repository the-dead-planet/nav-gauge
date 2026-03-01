import { FC, useEffect } from "react";
import { ToolProps, useSubjectState } from "@apparatus";
import { Icons } from "@web-ui";
import { RouteFitBoundsProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import * as styles from './route-layer.module.css';

export const RouteLayerFitBounds: FC<ToolProps<maplibregl.Map> & RouteFitBoundsProps<maplibregl.Map>> = ({
    map,
    data$,
    onFitBounds,
}) => {
    const [data] = useSubjectState(data$);
    const { boundingBox } = data;

    const handleFitBounds = () => {
        if (!boundingBox) {
            return;
        }
        onFitBounds(map,
            [boundingBox[0], boundingBox[1]], [boundingBox[2], boundingBox[3]],
        );
    };

    useEffect(() => {
        handleFitBounds();
    }, [boundingBox]);

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
