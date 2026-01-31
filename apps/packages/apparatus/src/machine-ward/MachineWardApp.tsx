import { FC, StrictMode, useEffect, useMemo } from "react";
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
    components: MachineWardComponents;
    onMount: () => void;
    onUnmount: () => void;
}

export const MachineWardApp: FC<MachineWardProps> = ({
    title,
    individuator,
    storageKeeper,
    stateWarden,
    components,
    onMount,
    onUnmount,
}) => {
    const [settings] = useSubjectState(individuator.settings$);

    const machineWardContextValue = useMemo((): MachineWardContextValue => ({
        individuator,
        storageKeeper
    }), [individuator, storageKeeper]);

    useEffect(() => {
        storageKeeper.initialize();
        individuator.initialize(storageKeeper);
        stateWarden.initialize(storageKeeper);
        onMount();

        return () => {
            onUnmount();
            stateWarden.cleanUp();
            individuator.cleanUp();
            storageKeeper.cleanUp();
        };
    }, []);

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
