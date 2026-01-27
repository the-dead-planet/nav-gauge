import { FC } from "react";
import { MachineWardTopBarProps } from "@apparatus";
import * as styles from './layout.module.css';

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    return (
        <nav className={styles["navbar"]}>
            <span>
                {title}
            </span>
        </nav>
    );
}
