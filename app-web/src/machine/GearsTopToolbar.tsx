import { FC } from "react";
import classNames from "classnames";
import { useTranslate } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { T } from "@web-apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { Button, FlexBox, H2, Icon } from "@web-ui";
import { Icons, useTheme } from "@ui";
import styles from './machine.module.css';

export const GearsTopToolbar: FC = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { namespace, translationKey, engine, toolsStation } = useWebMachineWard();
    const gears = useObservableState(engine.gearsWithEngaged$, []);
    const translate = useTranslate();

    return (
        <div
            ref={(instance) => {
                toolsStation.topToolbarSizeRef.current = instance;
            }}
            className={classNames(styles['toolbar'], styles['top'])}
        >
            <FlexBox
                gap="md"
                alignItems="center"
                className={classNames(styles.content, {
                    [styles['has-captions']]: !media.isMoreThanSm,
                })}
            >
                <H2 color="secondary" shade={500} uppercase className={styles['gears-heading']}>
                    <Icon src={Icons.NounProject.Gear} color={theme.color('secondary')} width={20} height={20} />
                    {media.isMoreThanXs ? <T n={namespace} t={translationKey.Gears} /> : null}
                </H2>
                {gears.map(({ gear, isEngaged }) => {
                    const gearName = translate({ n: gear.id, t: gear.translationKey.GearName });
                    const gearShortName = translate({ n: gear.id, t: gear.translationKey.GearShortName });
                    
                    return (
                        <Button
                            key={gear.id}
                            variant="ghost"
                            highlightColor="secondary"
                            highlighted={isEngaged}
                            icon={gear.icon}
                            aria-label={gearName}
                            caption={media.isMoreThanSm ? undefined : gearShortName}
                            captionNowrap
                            onClick={() => {
                                if (isEngaged) {
                                    engine.disengageGear(gear);
                                } else {
                                    engine.engageGear(gear);
                                }
                            }}
                            tooltip={gearName}
                            tooltipPlacement="bottom"
                        >
                            {media.isMoreThanSm ? gearName : null}
                        </Button>
                    );
                })}
            </FlexBox>
        </div>
    );
};
