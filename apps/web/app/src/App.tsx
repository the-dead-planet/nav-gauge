import { FC, StrictMode, useEffect } from "react";
import { StateWarden, StateWardenContext, useStorageState } from "@apparatus";
import { ApplicationSettingsType, getDefaultApplicationSettings } from "@tinker-chest";
import { routeGear } from "@gears";
import { ErrorBoundary, Theme, ThemeContext, themes } from "@ui";
import { TopBar, Footer, Layout } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";
import './app.css';
import "./themes.css";

interface Props {
    stateWarden: StateWarden;
}

export const App: FC<Props> = ({ stateWarden }) => {
    const [applicationSettings, setApplicationSettings] = useStorageState<ApplicationSettingsType>(
        localStorage,
        'application-settings',
        getDefaultApplicationSettings(window.matchMedia("(prefers-color-scheme: light)").matches ? Theme.Light : Theme.Dark)
    );

    useEffect(() => {
        stateWarden.engine.addGear(routeGear);

        return () => {
            stateWarden.engine.removeGear(routeGear.id);
        };
    }, []);

    return (
        <StrictMode>
            <ErrorBoundary fallback={<div>Fallback</div>}>
                <ThemeContext.Provider value={themes[applicationSettings.theme]}>
                    <StateWardenContext.Provider value={stateWarden}>
                        <Layout applicationSettings={applicationSettings}>
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
