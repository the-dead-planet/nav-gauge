import { FC, useEffect } from "react";
import { ToolProps, useStateWarden, useSubjectState } from "@apparatus";
import { Icons } from "@web-ui";
import { RouteFitBoundsProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import * as styles from './route-layer.module.css';

export const RouteLayerFitBounds: FC<ToolProps<maplibregl.Map> & RouteFitBoundsProps<maplibregl.Map>> = ({
    map,
    data$,
    onFitBounds,
}) => {
    const stateWarden = useStateWarden();
    const [data] = useSubjectState(data$);
    const { boundingBox } = data;

    const handleFitBounds = () => {
        if (!boundingBox) {
            return;
        }
        onFitBounds(stateWarden, () => map.fitBounds(
            [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]],
            { animate: true, padding: 50 }
        ));
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
