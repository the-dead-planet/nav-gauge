import { FC, useEffect } from "react";
import { ToolProps, useStateWarden, useSubjectState } from "@apparatus";
import * as styles from './route-layer.module.css';
import { Icons } from "@web-ui";
import { RouteFitBoundsProps } from "@the-dead-planet/nav-gauge-gears-route-story";

export const RouteLayerFitBounds: FC<ToolProps & RouteFitBoundsProps> = ({
    map,
    data$,
    onFitBounds,
    padding,
    animate,
}) => {
    const stateWarden = useStateWarden();
    const [data] = useSubjectState(data$);
    const { boundingBox } = data;

    const handleFitBounds = () => onFitBounds(stateWarden, map, boundingBox, { padding, animate });

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
