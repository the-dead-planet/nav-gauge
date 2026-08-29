import { FC } from "react";
import classNames from "classnames";
import { MachineWardTopBarProps, useMultipleTranslations } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { FontType, Icons, useTheme } from "@ui";
import { Button, H1 } from "@web-ui";
import { LayoutMenu } from "./menu/LayoutMenu";
import { UnderConstructionChip } from "./UnderConstructionChip";
import { useSubjectState } from "@tinker-chest";
import styles from './top-bar.module.css';

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    const theme = useTheme();
    const { namespace, translationKey, individuator, toolsStation } = useWebMachineWard();
    const [topBarTools] = useSubjectState(toolsStation.topBarTools$);
    const [
        modeTooltip,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.ToggleMode },
    ]);

    // TODO: Icons: light/dark mode, sound, geolocation on/off, recording on/off?, menu
    return (
        <nav
            ref={(instance) => {
                toolsStation.topBarSizeRef.current = instance;
            }}
            className={styles["top-bar"]}
        >
            <div className={classNames(styles["section"], styles["left"])}>
                <UnderConstructionChip />
            </div>
            <H1 color="primary" fontType={FontType.NeonHeader} className={styles['header']}>
                {title}
            </H1>
            <div className={classNames(styles["section"], styles["right"])}>
                {Array.from(topBarTools).map(([id, Component]) => <Component key={id} />)}
                <Button
                    aria-label={modeTooltip}
                    tooltip={modeTooltip}
                    tooltipPlacement="bottom"
                    icon={Icons.NounProject.LightBulbCogWheel}
                    onClick={individuator.toggleMode}
                    variant="inset"
                    size="md"
                    color={theme.isDark ? "secondary" : 'neutral'}
                />
                <LayoutMenu />
            </div>
        </nav>
    );
};
