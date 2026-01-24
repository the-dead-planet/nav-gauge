import { Dispatch, FC, ReactNode, SetStateAction, useEffect } from "react";
import { ApplicationSettingsType } from "@tinker-chest";

interface Props {
    applicationSettings: ApplicationSettingsType;
    children?: ReactNode;
}

export const Layout: FC<Props> = ({
    applicationSettings,
    children
}) => {
    useEffect(() => {
        document.body.setAttribute("data-theme", applicationSettings.theme);
    }, [applicationSettings.theme]);

    return children;
}
