import { FC, useMemo } from "react";
import { combineLatest, of, switchMap, map as rxjsMap } from "rxjs";
import classNames from "classnames";
import { useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { useObservableState } from "@tinker-chest";
import { Button, FlexBox, H2, Icon } from "@web-ui";
import { Icons, useTheme } from "@ui";
import styles from './machine.module.css';

export const GearsTopToolbar: FC = () => {
    const theme = useTheme();
    const { namespace, translationKey, engine } = useMachineWard();

    const gearsWithEngaged$ = useMemo(() => engine.gears$.pipe(switchMap((gears) => {
        if (gears.length === 0) {
            return of([]);
        }

        return combineLatest(gears.map((gear) => gear.isEngaged$.pipe(
            rxjsMap((isEngaged) => ({ gear, isEngaged }))
        )));
    })), [engine]);

    const gears = useObservableState(gearsWithEngaged$, []);

    return (
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
    );
};
