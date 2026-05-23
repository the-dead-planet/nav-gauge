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
import classNames from "classnames";
import { P } from "@web-ui";

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
            <div className={classNames(styles['toolbar'], styles['top'])}><P>Sample text to test 12346. Abc Gedg Xseuyie QtrtyyuSAH</P></div>
            <div className={classNames(styles['toolbar'], styles['left'])}><P>left</P></div>
            <div className={classNames(styles['toolbar'], styles['right'])}><P>right</P></div>
            <div className={classNames(styles['toolbar'], styles['bottom'])}><P>bottom</P></div>
        </div>
    );
};
