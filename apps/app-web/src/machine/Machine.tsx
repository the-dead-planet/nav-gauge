import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { Presets } from "./controls/Presets";
import { AnimationControls } from "./controls/AnimationControls";
import { MapLayoutControls } from "./controls/MapLayoutControls";
import { ApplicationSettingsSection } from "./controls/ApplicationSettings";
import { GaugeControls } from "./controls/GaugeControls";
import { MapStyleSelection } from "./controls/MapStyleSelection";
import { MapTools } from "./map-tools/MapTools";
import { P } from "@web-ui";
import { createMap } from "./map";
import styles from './machine.module.css';

export const Machine: FC = () => {
    const [map, setMap] = useState<maplibregl.Map>();
    const { cartomancer, toolsStation } = useMachineWard();
    const [overlays] = useSubjectState(cartomancer.overlays$);

    useEffect(() => {
        let m = createMap();
        setMap(m);

        return () => {
            setMap(undefined);
            requestAnimationFrame(() => m.remove());
        };
    }, []);

    return (
        <div className={styles.machine}>
            {/* <div className={styles["side-panel"]}>
                {[...controlComponents.entries()].map(([id, ControlComponent]) => <ControlComponent key={id} />)}
                <hr className={styles.divider} />
                <Presets />
                <MapStyleSelection />
                <MapLayoutControls />
                <GaugeControls />
                <AnimationControls />
                <ApplicationSettingsSection />
            </div> */}
            {map ? (
                <MapTools map={map}>
                    {[...overlays.entries()].map(([id, OverlayComponent]) => <OverlayComponent key={id} map={map} />)}
                </MapTools>
            ) : null}
            <div className={classNames(styles['toolbar'], styles['top'])}><P>Sample text to test 12346. Abc Gedg Xseuyie QtrtyyuSAH</P></div>
            <div className={classNames(styles['toolbar'], styles['left'])}><P>left</P></div>
            <div className={classNames(styles['toolbar'], styles['right'])}><P>right</P></div>
            <div className={classNames(styles['toolbar'], styles['bottom'])}><P>bottom</P></div>
        </div>
    );
};
