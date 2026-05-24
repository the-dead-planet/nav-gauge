import { FC } from "react";
import { MachineWardLayoutProps } from "@apparatus";
import { useThemeVariables } from "@web-ui";
import { useTheme } from "@ui";
import styles from './layout.module.css';
import './app.css';

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();
    
    useThemeVariables(theme);

    return (
        <div className={styles.layout}>
            {children}
        </div>
    );
}
