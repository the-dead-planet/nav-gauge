import { FC } from "react";
import classNames from "classnames";
import { useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { Button, FlexBox, H2, Icon } from "@web-ui";
import { Icons, useTheme } from "@ui";
import styles from './machine.module.css';

export const GearsTopToolbar: FC = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { namespace, translationKey, engine, toolsStation } = useMachineWard();
    const gears = useObservableState(engine.gearsWithEngaged$, []);

    return (
        <div
            ref={(instance) => {
                toolsStation.topToolbarSizeRef.current = instance;
            }}
            className={classNames(styles['toolbar'], styles['top'])}
        >
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
                        {media.isMoreThanSm ? <T n={gear.id} t={gear.translationKey.GearName} /> : null}
                    </Button>
                ))}
            </FlexBox>
        </div>
    );
};
