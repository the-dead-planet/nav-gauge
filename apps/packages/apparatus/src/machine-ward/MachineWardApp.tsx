import { FC, StrictMode, useMemo } from "react";
import { ErrorBoundary, ThemeContext, themes } from "@ui";
import { MachineWardNotices } from "./MachineWardNotices";
import { StateWarden, StateWardenContext } from "../state-warden";
import { Individuator } from "./individuator";
import { StorageKeeper } from "./storage-keeper";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";
import { useSubjectState } from "../state";
import { MachineWardComponents } from "./model";

interface MachineWardProps {
    title: string;
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    stateWarden: StateWarden;
    components: MachineWardComponents
}

export const MachineWardApp: FC<MachineWardProps> = ({
    title,
    individuator,
    storageKeeper,
    stateWarden,
    components,
}) => {
    const [settings] = useSubjectState(individuator.settings$);

    const machineWardContextValue = useMemo((): MachineWardContextValue => ({
        individuator,
        storageKeeper
    }), [individuator, storageKeeper])

    return (
        <StrictMode>
            <ErrorBoundary fallbackComponent={components.errorFallbackComponent}>
                <ThemeContext.Provider value={themes[settings.themeName]}>
                    <MachineWardContext.Provider value={machineWardContextValue}>
                        <StateWardenContext.Provider value={stateWarden}>
                            <components.layoutComponent>
                                <components.topBarComponent title={title} />
                                <components.machineComponent />
                                <components.footerComponent />
                                <MachineWardNotices noticesComponent={components.noticesComponent} />
                            </components.layoutComponent>
                        </StateWardenContext.Provider>
                    </MachineWardContext.Provider>
                </ThemeContext.Provider>
            </ErrorBoundary>
        </StrictMode>
    );
};
