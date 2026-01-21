import { FC, StrictMode, useEffect } from "react";
import { theOneAndOnlyStateWarden, StateWardenContext } from "@apparatus";
import { ApplicationSettingsType, defaultApplicationSettings } from "@tinker-chest";
import { routeGear } from "@gears";
import { ErrorBoundary } from "@ui";
import { TopBar, Footer } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";
import { useLocalStorageState } from "./hooks";
import './app.css';
import "./themes.css";

export const App: FC = () => {
    const [applicationSettings, setApplicationSettings] = useLocalStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);

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
                <StateWardenContext.Provider value={theOneAndOnlyStateWarden}>
                    <TopBar />
                    <Machine applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
                    <Footer />
                    <Notices />
                </StateWardenContext.Provider>
            </ErrorBoundary>
        </StrictMode>
    );
};
