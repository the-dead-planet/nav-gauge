import { FC } from "react";
import { MachineWardTopBarProps } from "@apparatus";
import * as styles from './layout.module.css';

export const TopBar: FC<MachineWardTopBarProps> = () => {
    return (
        <nav className={styles["navbar"]}>
            <span>nav gauge</span>
        </nav>
    );
}
