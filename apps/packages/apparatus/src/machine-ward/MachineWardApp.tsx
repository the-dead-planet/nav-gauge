import { FC, StrictMode } from "react";
import { StateWardenContext } from "../state-warden";
import { ErrorBoundary, ThemeContext, themes } from "@ui";
import { MachineWard } from "./machine-ward";
import { useSubjectState } from "../state";
import { Notices } from "./Notices";

interface MachineWardProps {
    machineWard: MachineWard;
}

export const MachineWardApp: FC<MachineWardProps> = ({ machineWard }) => {
    const [applicationSettings] = useSubjectState(machineWard.stateWarden.applicationSettings$);

    return (
        <StrictMode>
            <ErrorBoundary fallbackComponent={machineWard.errorFallbackComponent}>
                <ThemeContext.Provider value={themes[applicationSettings.theme]}>
                    <StateWardenContext.Provider value={machineWard.stateWarden}>
                        <machineWard.layoutComponent>
                            <machineWard.topBarComponent />
                            <machineWard.machineComponent />
                            <machineWard.footerComponent />
                            <Notices noticesComponent={machineWard.noticesComponent} />
                        </machineWard.layoutComponent>
                    </StateWardenContext.Provider>
                </ThemeContext.Provider>
            </ErrorBoundary>
        </StrictMode>
    );
};
