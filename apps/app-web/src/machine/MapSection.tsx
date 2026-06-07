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
import { Button, FlexBox, P } from "@web-ui";
import { createMap } from "./map";
import { Icons, useTheme } from "@ui";
import styles from './map-section.module.css';

export const MapSection: FC = () => {
    const theme = useTheme();
    const [map, setMap] = useState<maplibregl.Map>();
    const { engine, cartomancer } = useMachineWard();
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const gearsWithEngaged$ = engine.gears$.pipe(switchMap((gears) => {
        if (gears.length === 0) {
            return of([]);
        }

        return combineLatest(gears.map((gear) => gear.isEngaged$.pipe(
            rxjsMap((isEngaged) => ({ gear, isEngaged }))
        )));
    }));
    const gears = useObservableState(gearsWithEngaged$, []);

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
            <FlexBox gap="md" alignItems="center" className={classNames(styles['toolbar'], styles['top'])}>
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
                        tooltip={<T n={gear.id} t="description" />}
                    >
                        <T n={gear.id} t="name" />
                    </Button>
                ))}
            </FlexBox>
            <div className={classNames(styles['toolbar'], styles['left'])}>
                {[
                    { id: 1, icon: null },
                    { id: 2, icon: Icons.Find },
                    { id: 3, icon: Icons.Beaker },
                    { id: 4, icon: Icons.Find },
                    { id: 5, icon: Icons.Beaker },
                    { id: 6, icon: Icons.Find },
                    { id: 7, icon: Icons.Beaker },
                    { id: 8, icon: Icons.Find },
                    { id: 9, icon: Icons.Beaker },
                    { id: 10, icon: Icons.Find },
                ].map(({ id, icon }, i) => !icon ? <span /> : (
                    <Button
                        key={id}
                        icon={icon}
                        size="sm"
                        variant={"fill-inverse"}
                        corners="hexagon"
                        // color="primary"
                        highlightColor="secondary"
                        style={{
                            transform: `translate(${i % 2 === 1 ? `-8px, calc(50% + 3px)` : undefined})`,
                            filter: 'drop-shadow(1px 2px 8px rgba(0, 0, 0, .3))'
                        }}
                    />
                ))}
            </div>
            <div className={classNames(styles['toolbar'], styles['right'])}><P>right</P></div>
            <div className={classNames(styles['toolbar'], styles['bottom'])}><P>bottom</P></div>
        </div>
    );
};
