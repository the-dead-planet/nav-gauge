import { FC, useEffect } from "react";
import { MachineWardLayoutProps } from "@apparatus";
import { useTheme } from "@ui";
import './app.css';
import "./themes.css";

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();

    useEffect(() => {
        document.body.setAttribute("data-theme", theme.theme);
    }, [theme.theme]);

    return children;
}
