import { FC, useEffect, useState } from "react";
import { combineLatest, of, switchMap, map as rxjsMap } from "rxjs";
import classNames from "classnames";
import { useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { Presets } from "./controls/Presets";
import { AnimationControls } from "./controls/AnimationControls";
import { MapLayoutControls } from "./controls/MapLayoutControls";
import { ApplicationSettingsSection } from "./controls/ApplicationSettings";
import { GaugeControls } from "./controls/GaugeControls";
import { MapStyleSelection } from "./controls/MapStyleSelection";
import { MapTools } from "./map-tools/MapTools";
import { Button, FlexBox, Transition } from "@web-ui";
import { createMap } from "./map";
import styles from './map-section.module.css';
import { ToolIconRight } from "./map-tools/ToolIconRight";
import { ToolIconLeft } from "./map-tools/ToolIconLeft";

export const MapSection: FC = () => {
    const [map, setMap] = useState<maplibregl.Map>();
    const { engine, cartomancer, toolsStation } = useMachineWard();
    const gearsWithEngaged$ = engine.gears$.pipe(switchMap((gears) => {
        if (gears.length === 0) {
            return of([]);
        }

        return combineLatest(gears.map((gear) => gear.isEngaged$.pipe(
            rxjsMap((isEngaged) => ({ gear, isEngaged }))
        )));
    }));
    const gears = useObservableState(gearsWithEngaged$, []);
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);

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
            <div className={classNames(styles['toolbar'], styles['top'])}>
                <FlexBox gap="md" alignItems="center" className={styles['content']}>
                    {gears.map(({ gear, isEngaged }) => (
                        <Button
                            key={gear.id}
                            variant="ghost"
                            highlightColor="secondary"
                            active={isEngaged}
                            icon={gear.icon}
                            onClick={() => {
                                if (isEngaged) {
                                    engine.disengageGear(gear);
                                } else {
                                    engine.engageGear(gear);
                                }
                            }}
                            tooltip={<T n={gear.id} t={gear.translationKey.GearDescription} />}
                        >
                            <T n={gear.id} t={gear.translationKey.GearName} />
                        </Button>
                    ))}
                </FlexBox>
            </div>
            <div className={classNames(styles['toolbar'], styles['left'])}>
                {/* TODO: Collapsible sections list, panel expand/collapse, when collapsed just icons. */}
                <Transition slide="to-left" render={toolPanelsByPlacement.left.length > 0}>
                    <div className={styles['content']}>
                        {toolPanelsByPlacement.left.map(({ id, icon, title, component: Component }) => (
                            <Component key={id} map={map} />
                        ))}
                    </div>
                </Transition>
            </div>
            <div className={classNames(styles['icons'], styles['left'])}>
                {toolIconsByPlacement.left.length > 1 ? <div /> : null}
                {!!map && toolIconsByPlacement.left.map((toolIcon) => (
                    <ToolIconLeft
                        key={toolIcon.id}
                        map={map}
                        className={classNames(styles['icon-button'], styles['left'])}
                        {...toolIcon}
                    />
                ))}
            </div>
            {/* TODO: Bind right icons with right panel? */}
            {/* TODO: Rename right/left panels according to their use */}
            {/* TODO: Add option to swap left/right */}
            <div className={classNames(styles['icons'], styles['right'])}>
                {toolIconsByPlacement.right.length === 1 ? <div /> : null}
                {!map
                    ? null
                    : toolIconsByPlacement.right.map((toolIcon) => (
                        <ToolIconRight
                            key={toolIcon.id}
                            map={map}
                            className={classNames(styles['icon-button'], styles['right'])}
                            {...toolIcon}
                        />
                    ))}
            </div>
            <div className={classNames(styles['toolbar'], styles['right'])}>
                <Transition slide="to-left" render={toolPanelsByPlacement.right.length > 0}>
                    <div className={styles['content']}>
                        {toolPanelsByPlacement.right.map(({ id, icon, title, component: Component }) => (
                            <Component key={id} map={map} />
                        ))}
                    </div>
                </Transition>
            </div>
            <div className={classNames(styles['toolbar'], styles['bottom'])}>
                <Transition slide="to-top" render={toolPanelsByPlacement.bottom.length > 0}>
                    <div className={styles['content']}>
                        {toolPanelsByPlacement.bottom.map(({ id, icon, title, component: Component }) => (
                            <Component key={id} map={map} />
                        ))}
                    </div>
                </Transition>
            </div>
        </div>
    );
};
