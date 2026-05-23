import { FC, useEffect } from "react";
import { MachineWardLayoutProps } from "@apparatus";
import { useThemeVariables } from "@web-ui";
import styles from './layout.module.css';
import './app.css';
import { useTheme } from "@ui";

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();
    
    useThemeVariables(theme);

    return (
        <div className={styles.layout}>
            {children}
        </div>
    );
}
