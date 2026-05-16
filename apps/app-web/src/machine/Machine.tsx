import { CSSProperties, FC, useMemo } from "react";
import { useStateWarden } from "@apparatus";
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
    const { cartomancer, toolsStation } = useStateWarden();
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
        <div className={styles.layout} style={{
            ...controlsCssStyle,
            '--map-width': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.width}px`,
            '--map-height': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.height}px`,
            '--map-border-width': mapLayout.borderWidth + 'px',
            '--map-border-color': mapLayout.borderColor,
            '--map-inner-border-width': mapLayout.innerBorderWidth + 'px',
            '--map-inner-border-color': mapLayout.innerBorderColor,
            '--map-radius': mapLayout.borderRadius,
            '--map-box-shadow': mapLayout.boxShadow,
            '--map-inner-box-shadow': mapLayout.innerBoxShadow,
            // TODO: Make draggable on mobile
            '--side-panel-height-sm': "240px",
        } as unknown as CSSProperties}>
            <div className={styles["side-panel"]}>
                {[...controlComponents.entries()].map(([id, ControlComponent]) => <ControlComponent key={id} />)}
                <hr className={styles.divider} />
                <Presets />
                <MapStyleSelection />
                <MapLayoutControls />
                <GaugeControls />
                <AnimationControls />
                <ApplicationSettingsSection />
            </div>
            <div className={styles["main-area"]}>
                <MapSection />
            </div>
        </div>
    );
};
