import { FC, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import { ToolProps, StateWarden, useStateWarden, useSubjectState } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import * as styles from './route-layer.module.css';
import { Icons } from "@web-ui";

interface Props {
    data$: BehaviorSubject<ParsingResultWithError>;
    onFitBounds: (stateWarden: StateWarden, map: maplibregl.Map, bbox: ParsingResultWithError['boundingBox'], options?: {
        padding?: number;
        animate?: boolean;
    }) => void;
    /**
     * Defaults to `50`.
     */
    padding?: number;
    /**
     * Defaults to `true`.
     */
    animate?: boolean;
}

export const RouteLayerFitBounds: FC<ToolProps & Props> = ({
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
