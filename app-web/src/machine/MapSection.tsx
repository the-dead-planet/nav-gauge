import { FC, useEffect, useState } from "react";
import { combineLatest, of, switchMap, map as rxjsMap } from "rxjs";
import classNames from "classnames";
import { useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { MapTools } from "./map-tools/MapTools";
import { Button, FlexBox, H2, Icon } from "@web-ui";
import { createMap } from "./map";
import { MapSectionPanel } from "./MapSectionPanel";
import { MapSectionIcons } from "./MapSectionIcons";
import { Icons, useTheme } from "@ui";
import styles from './map-section.module.css';
import { MapSectionTopTools } from "./MapSectionTopTools";

export const MapSection: FC = () => {
    const theme = useTheme();
    const [map, setMap] = useState<maplibregl.Map>();
    const { namespace, translationKey, engine, cartomancer, toolsStation } = useMachineWard();
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
    const [activeLeftPanelToolId, setActiveLeftPanelToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightPanelToolId, setActiveRightPanelToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);
    const [activeBottomPanelToolId, setActiveBottomPanelToolId] = useSubjectState(toolsStation.activeBottomPanelToolId$);

    useEffect(() => {
        const m = createMap();
        setMap(m);

        return () => {
            setMap(undefined);
            requestAnimationFrame(() => m.remove());
        };
    }, []);

    return (
        <div className={styles.machine}>
            <div className={classNames(styles['toolbar'], styles['top'])}>
                <FlexBox gap="md" alignItems="center" className={styles['content']}>
                    <H2 color="secondary" className={styles['gears-heading']}>
                        <Icon src={Icons.NounProject.Gear} color={theme.color('secondary')} width={20} height={20} />
                        <T n={namespace} t={translationKey.Gears} />
                    </H2>
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
                            tooltipPlacement="bottom"
                        >
                            <T n={gear.id} t={gear.translationKey.GearName} />
                        </Button>
                    ))}
                </FlexBox>
            </div>
            {map ? (
                <MapTools map={map}>
                    {[...overlays.entries()].map(([id, OverlayComponent]) => <OverlayComponent key={id} map={map} />)}
                </MapTools>
            ) : null}
            <MapSectionPanel placement="left" map={map} activeId={activeLeftPanelToolId} onActiveIdChange={setActiveLeftPanelToolId} />
            <MapSectionIcons placement="left" map={map} />
            <MapSectionTopTools map={map} />
            <MapSectionIcons placement="right" map={map} />
            <MapSectionPanel placement="right" map={map} activeId={activeRightPanelToolId} onActiveIdChange={setActiveRightPanelToolId} />
            <MapSectionPanel placement="bottom" map={map} activeId={activeBottomPanelToolId} onActiveIdChange={setActiveBottomPanelToolId} />
        </div>
    );
};
