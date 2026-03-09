import { StrictMode, useEffect, useMemo } from "react";
import { ErrorBoundary, ThemeContext, themes } from "@ui";
import { MachineWardNotices } from "./MachineWardNotices";
import { StateWarden, StateWardenContext } from "../state-warden";
import { Individuator } from "./individuator";
import { StorageKeeper } from "./storage-keeper";
import { ChronoLens } from "./chrono-lens";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";
import { useSubjectState } from "../state";
import { MachineWardComponents } from "./model";

interface MachineWardProps<TMap> {
    title: string;
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    stateWarden: StateWarden<TMap>;
    chronoLens: ChronoLens;
    components: MachineWardComponents;
    onMount: () => void;
    onUnmount: () => void;
}

export function MachineWardApp<TMap>({
    title,
    individuator,
    storageKeeper,
    chronoLens,
    stateWarden,
    components,
    onMount,
    onUnmount,
}: MachineWardProps<TMap>) {
    const [settings] = useSubjectState(individuator.settings$);

    const machineWardContextValue = useMemo((): MachineWardContextValue => ({
        individuator,
        storageKeeper,
        chronoLens,
    }), [individuator, storageKeeper, chronoLens]);

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
            <ThemeContext.Provider value={themes[settings.themeName]}>
                <ErrorBoundary fallbackComponent={components.errorFallbackComponent}>
                    <MachineWardContext.Provider value={machineWardContextValue}>
                        <StateWardenContext.Provider value={stateWarden as StateWarden}>
                            <components.layoutComponent>
                                <components.topBarComponent title={title} />
                                <components.machineComponent />
                                <components.footerComponent />
                                <MachineWardNotices noticesComponent={components.noticesComponent} />
                            </components.layoutComponent>
                        </StateWardenContext.Provider>
                    </MachineWardContext.Provider>
                </ErrorBoundary>
            </ThemeContext.Provider>
        </StrictMode>
    );
}
