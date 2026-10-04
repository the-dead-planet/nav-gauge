import { FC } from "react";
import classNames from "classnames";
import { MachineWardTopBarProps, useMultipleTranslations } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { FontType, useTheme } from "@ui";
import { H1, ThemeModeToggle } from "@web-ui";
import { LayoutMenu } from "./menu/LayoutMenu";
import { UnderConstructionChip } from "./UnderConstructionChip";
import { useSubjectState } from "@tinker-chest";
import styles from './top-bar.module.css';

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    const theme = useTheme();
    const { namespace, translationKey, individuator, toolsStation } = useWebMachineWard();
    const [topBarTools] = useSubjectState(toolsStation.topBarTools$);
    const [lightModeTooltip, darkModeTooltip] = useMultipleTranslations([
        { n: namespace, t: translationKey.SwitchToLightMode },
        { n: namespace, t: translationKey.SwitchToDarkMode },
    ]);

    // TODO: Icons: sound, geolocation on/off
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
            <H1 color="primary" shade={500} fontType={FontType.NeonHeader} className={styles['header']}>
                {title}
            </H1>
            <div className={classNames(styles["section"], styles["right"])}>
                {Array.from(topBarTools).map(([id, Component]) => <Component key={id} />)}
                <ThemeModeToggle
                    mode={theme.mode}
                    lightModeTooltip={lightModeTooltip}
                    darkModeTooltip={darkModeTooltip}
                    onToggle={individuator.toggleMode}
                />
                <LayoutMenu />
            </div>
        </nav>
    );
};
