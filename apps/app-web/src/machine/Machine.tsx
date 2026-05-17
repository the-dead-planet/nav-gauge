import { CSSProperties, FC, useMemo } from "react";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapSection } from "./MapSection";
import { Presets } from "./controls/Presets";
import { AnimationControls } from "./controls/AnimationControls";
import { MapLayoutControls } from "./controls/MapLayoutControls";
import { ApplicationSettingsSection } from "./controls/ApplicationSettings";
import { GaugeControls } from "./controls/GaugeControls";
import { MapStyleSelection } from "./controls/MapStyleSelection";
import styles from './machine.module.css';

export const Machine: FC = () => {
    const { cartomancer, toolsStation } = useMachineWard();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const [mapLayout] = useSubjectState(cartomancer.mapLayout$);
    const [controlComponents] = useSubjectState(toolsStation.controlComponents$);

    const controlsCssStyle = useMemo(
        () => {
            const { top, bottom, right, left } = gaugeControls.controlPlacement;

            switch (gaugeControls.controlPosition) {
                case 'top-left': return { '--ctrl-top': top + 'px', '--ctrl-left': left + 'px' }
                case 'top-right': return { '--ctrl-top': top + 'px', '--ctrl-right': right + 'px' }
                case 'bottom-left': return { '--ctrl-bottom': bottom + 'px', '--ctrl-left': left + 'px' }
                case 'bottom-right': return { '--ctrl-bottom': bottom + 'px', '--ctrl-right': right + 'px' }
            }
        },
        [gaugeControls]
    );

    return (
        <div className={styles.machine} style={{
            ...controlsCssStyle,
        } as unknown as CSSProperties}>
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
            <MapSection />
            <div className={styles['top-toolbar']}><p>gears</p></div>
            <div className={styles['left-toolbar']}><p>left</p></div>
            <div className={styles['right-toolbar']}><p>right</p></div>
            <div className={styles['bottom-toolbar']}><p>bottom</p></div>
        </div>
    );
};
