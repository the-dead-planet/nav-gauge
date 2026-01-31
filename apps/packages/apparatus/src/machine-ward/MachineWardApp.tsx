import { FC, StrictMode, useMemo } from "react";
import { ErrorBoundary, ThemeContext, themes } from "@ui";
import { MachineWardNotices } from "./MachineWardNotices";
import { MachineWard } from "./machine-ward";
import { StateWardenContext } from "../state-warden";
import { useSubjectState } from "../state";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";

interface MachineWardProps {
    machineWard: MachineWard;
}

export const MachineWardApp: FC<MachineWardProps> = ({ machineWard }) => {
    const [applicationSettings] = useSubjectState(machineWard.applicationSettings$);

    const machineWardContextValue = useMemo((): MachineWardContextValue => ({
        applicationSettings$: machineWard.applicationSettings$,
        storageKeeper: machineWard.storageKeeper
    }), [machineWard])

    return (
        <StrictMode>
            <ErrorBoundary fallbackComponent={machineWard.errorFallbackComponent}>
                <ThemeContext.Provider value={themes[applicationSettings.theme]}>
                    <MachineWardContext.Provider value={machineWardContextValue}>
                        <StateWardenContext.Provider value={machineWard.stateWarden}>
                            <machineWard.layoutComponent>
                                <machineWard.topBarComponent title={machineWard.title} />
                                <machineWard.machineComponent />
                                <machineWard.footerComponent />
                                <MachineWardNotices noticesComponent={machineWard.noticesComponent} />
                            </machineWard.layoutComponent>
                        </StateWardenContext.Provider>
                    </MachineWardContext.Provider>
                </ThemeContext.Provider>
            </ErrorBoundary>
        </StrictMode>
    );
};
