import { FC, StrictMode } from "react";
import { ErrorBoundary, ThemeContext, themes } from "@ui";
import { MachineWardNotices } from "./MachineWardNotices";
import { MachineWard } from "./machine-ward";
import { StateWardenContext } from "../state-warden";
import { useSubjectState } from "../state";

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
                            <machineWard.topBarComponent title={machineWard.title} />
                            <machineWard.machineComponent />
                            <machineWard.footerComponent />
                            <MachineWardNotices noticesComponent={machineWard.noticesComponent} />
                        </machineWard.layoutComponent>
                    </StateWardenContext.Provider>
                </ThemeContext.Provider>
            </ErrorBoundary>
        </StrictMode>
    );
};
