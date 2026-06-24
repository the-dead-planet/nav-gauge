import { FC } from "react";
import classNames from "classnames";
import { MachineWardTopBarProps, useMachineWard, useTranslation } from "@apparatus";
import { FontType, Icons, useTheme } from "@ui";
import { Button, H1 } from "@web-ui";
import { LayoutMenu } from "./menu/LayoutMenu";
import styles from './top-bar.module.css';

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    const theme = useTheme();
    const { namespace, translationKey, individuator } = useMachineWard();
    const modeTooltip = useTranslation({ n: namespace, t: translationKey.ToggleMode });

    // TODO: Icons: light/dark mode, sound, geolocation on/off, recording on/off?, menu
    return (
        <nav className={styles["top-bar"]}>
            <div className={classNames(styles["section"], styles["left"])}>
            </div>
            <H1 color="primary" fontType={FontType.NeonHeader} className={styles['header']}>
                {title}
            </H1>
            <div className={classNames(styles["section"], styles["right"])}>
                <Button
                    aria-label={modeTooltip}
                    tooltip={modeTooltip}
                    tooltipPlacement="bottom"
                    icon={Icons.NounProject.LightBulbCogWheel}
                    onClick={individuator.toggleMode}
                    variant="inset"
                    size="md"
                    color={theme.isDark ? "secondary" : 'neutral'}
                    highlightColor={theme.isDark ? "neutral" : 'secondary'}
                />
                <LayoutMenu />
            </div>
        </nav>
    );
}
