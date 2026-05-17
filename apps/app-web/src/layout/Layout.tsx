import { FC, useEffect } from "react";
import { MachineWardLayoutProps } from "@apparatus";
import { allShades, DesignSystemColor, PaletteColor, ThemeComponentColor, useTheme } from "@ui";
import styles from './layout.module.css';
import './app.css';

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();

    useEffect(() => {
        for (const [key] of Object.entries(theme.componentColors)) {
            const componentColorName = key as ThemeComponentColor;
            document.documentElement.style.setProperty(
                `--${componentColorName}-color`,
                theme.componentColor(componentColorName)
            );
        }
        
        for (const [key] of Object.entries(theme.colors)) {
            const colorName = key as PaletteColor | DesignSystemColor;
            document.documentElement.style.setProperty(
                `--${colorName}-color`,
                theme.color(colorName, 500)
            );

            for (const shade of allShades) {
                document.documentElement.style.setProperty(
                    `--${colorName}-color-${shade}`,
                    theme.color(colorName, shade)
                );
            }
        }
        document.body.setAttribute("data-theme", theme.name);
    }, [theme.name]);

    return (
        <div className={styles.layout}>
            {children}
        </div>
    );
}
