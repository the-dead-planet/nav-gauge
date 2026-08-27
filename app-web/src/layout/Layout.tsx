import { FC, useEffect } from "react";
import { MachineWardLayoutProps, Translatron } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useThemeVariables } from "@web-ui";
import { useTheme } from "@ui";
import { useSubjectState } from "@tinker-chest";
import styles from './layout.module.css';
import './app.css';

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();
    const { individuator } = useWebMachineWard();
    const [settings] = useSubjectState(individuator.settings$);

    useEffect(() => {
        document.documentElement.lang = Translatron.languages[settings.language].locale;
    }, [settings.language]);

    useThemeVariables(theme);

    return (
        <div className={styles.layout}>
            {children}
        </div>
    );
}
