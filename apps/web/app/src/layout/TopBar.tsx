import { FC } from "react";
import { Theme } from "@ui";
import { MachineWardTopBarProps, useStateWarden, useSubjectState } from "@apparatus";
import * as styles from './layout.module.css';

export const TopBar: FC<MachineWardTopBarProps> = () => {
    const stateWarden = useStateWarden();
    const [applicationSettings, setApplicationSettings] = useSubjectState(stateWarden.applicationSettings$);

    return (
        <nav className={styles["navbar"]}>
            <span>nav gauge</span>
            <input 
                type='checkbox' 
                value={applicationSettings.theme}
                onChange={() => setApplicationSettings((prev) => ({...prev, theme: prev.theme === Theme.Light ? Theme.Dark : Theme.Light}))}
            />
        </nav>
    );
}
