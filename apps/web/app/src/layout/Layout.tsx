import { FC, useEffect } from "react";
import { MachineWardLayoutProps } from "@apparatus";
import { useTheme } from "@ui";
import './app.css';

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();

    useEffect(() => {
        for (const [key, value] of Object.entries(theme.colors)) {
            document.documentElement.style.setProperty(`--${key}-color`, value);
        }
        document.body.setAttribute("data-theme", theme.theme);
    }, [theme.theme]);

    return children;
}
