import { FC } from "react";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import styles from './map-section.module.css';

interface Props {
    map?: maplibregl.Map;
}

export const MapSectionTopTools: FC<Props> = ({
    map,
}) => {
    const { toolsStation } = useMachineWard();
    const [topTools] = useSubjectState(toolsStation.topTools$);

    return (
        <div className={styles['top-tools']}>
            {map ? Array.from(topTools).map(([id, Component]) => <Component key={id} map={map} />) : null}
        </div>
    );
};
