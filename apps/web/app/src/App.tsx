import { FC, StrictMode, useEffect } from "react";
import { theOneAndOnlyStateWarden, StateWardenContext } from "@apparatus";
import { ApplicationSettingsType, getDefaultApplicationSettings } from "@tinker-chest";
import { routeGear } from "@gears";
import { ErrorBoundary, Theme, ThemeContext, themes } from "@ui";
import { TopBar, Footer, Layout } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";
import { useLocalStorageState } from "./hooks";
import './app.css';
import "./themes.css";

export const App: FC = () => {
    const [applicationSettings, setApplicationSettings] = useLocalStorageState<ApplicationSettingsType>(
        'application-settings',
        getDefaultApplicationSettings(window.matchMedia("(prefers-color-scheme: light)").matches ? Theme.Light : Theme.Dark)
    );

    useEffect(() => {
        document.body.setAttribute("data-theme", applicationSettings.theme);
    }, [applicationSettings.theme]);

    useEffect(() => {
        theOneAndOnlyStateWarden.engine.addGear(routeGear);

        return () => {
            theOneAndOnlyStateWarden.engine.removeGear(routeGear.id);
        };
    }, []);

    return (
        <StrictMode>
            <ErrorBoundary fallback={<div>Fallback</div>}>
                <ThemeContext.Provider value={themes[applicationSettings.theme]}>
                    <StateWardenContext.Provider value={theOneAndOnlyStateWarden}>
                        <Layout>
                            <TopBar />
                            <Machine applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
                            <Footer />
                            <Notices />
                        </Layout>
                    </StateWardenContext.Provider>
                </ThemeContext.Provider>
            </ErrorBoundary>
        </StrictMode>
    );
};
