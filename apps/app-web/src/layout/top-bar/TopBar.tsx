import { FC } from "react";
import { MachineWardTopBarProps } from "@apparatus";
import { Icons } from "@web-ui";
import styles from './top-bar.module.css';
import classNames from "classnames";

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    // TODO: Icons: light/dark mode, sound, geolocation on/off, recording on/off?, menu
    return (
        <nav className={styles["top-bar"]}>
            <div className={classNames(styles["section"], styles["left"])}>
                <img src={Icons.Find} width={20} />
            </div>
            <span>
                {title}
            </span>
            <div className={classNames(styles["section"], styles["right"])}>
                <button style={{ display: 'flex', padding: 0, alignItems: 'center', justifyContent: "center" }}>
                    <Icons.FindIcon />
                </button>
            </div>
        </nav>
    );
}
