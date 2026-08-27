import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { Attributions } from "../../attributions/Attributions";
import styles from '../machine.module.css';

interface Props {
    map?: maplibregl.Map;
}

export const TopToolsGridArea: FC<Props> = ({
    map,
}) => {
    const { toolsStation } = useWebMachineWard();
    const [topTools] = useSubjectState(toolsStation.topTools$);

    return (
        <div className={styles['top-tools']}>
            {map ? Array.from(topTools).map(([id, Component]) => <Component key={id} map={map} />) : null}
            <Attributions />
        </div>
    );
};
