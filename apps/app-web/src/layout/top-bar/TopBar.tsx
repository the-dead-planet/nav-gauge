import { FC } from "react";
import { MachineWardTopBarProps } from "@apparatus";
import styles from './top-bar.module.css';

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    return (
        <nav className={styles["top-bar"]}>
            <span>
                {title}
            </span>
        </nav>
    );
}
