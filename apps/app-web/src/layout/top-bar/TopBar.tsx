import { FC } from "react";
import classNames from "classnames";
import { MachineWardTopBarProps, useMachineWard } from "@apparatus";
import { Icons, ThemeName, useTheme } from "@ui";
import { H4, Icon } from "@web-ui";
import styles from './top-bar.module.css';

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    const theme = useTheme();
    const { individuator } = useMachineWard();
    
    // TODO: Icons: light/dark mode, sound, geolocation on/off, recording on/off?, menu
    return (
        <nav className={styles["top-bar"]}>
            <div className={classNames(styles["section"], styles["left"])}>
                <img src={Icons.Find} width={20} />
            </div>
            <H4>
                {title}
            </H4>
            <div className={classNames(styles["section"], styles["right"])}>
                <button
                    style={{ display: 'flex', padding: 0, alignItems: 'center', justifyContent: "center", backgroundColor: theme.componentColor('button') }}
                    onClick={individuator.toggleMode}
                >
                    <Icon src={Icons.NounProject.Cyber} />
                </button>
                <button style={{ display: 'flex', padding: 0, alignItems: 'center', justifyContent: "center", backgroundColor: theme.componentColor('button') }}>
                    <Icon src={Icons.Find} />
                </button>
            </div>
        </nav>
    );
}
