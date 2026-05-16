import { StrictMode, useEffect, useMemo } from "react";
import { ErrorBoundary, Theme, ThemeContext, themeSpecifications } from "@ui";
import { MachineWardNotices } from "./MachineWardNotices";
import { StateWarden, StateWardenContext } from "../state-warden";
import { Individuator } from "./individuator";
import { StorageKeeper } from "./storage-keeper";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";
import { useSubjectState } from "@tinker-chest";
import { MachineWardComponents } from "./model";

interface MachineWardProps<TMap, TNavigationPath extends string> {
    title: string;
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    stateWarden: StateWarden<TMap>;
    components: MachineWardComponents<TNavigationPath>;
    onNavigate: (path: TNavigationPath) => void;
    onNavigateBack: () => void;
    onMount: () => void;
    onUnmount: () => void;
}

export function MachineWardApp<TMap, TNavigationPath extends string>({
    title,
    individuator,
    storageKeeper,
    stateWarden,
    components,
    onNavigate,
    onNavigateBack,
    onMount,
    onUnmount,
}: MachineWardProps<TMap, TNavigationPath>) {
    const [settings] = useSubjectState(individuator.settings$);

    const machineWardContextValue = useMemo((): MachineWardContextValue => ({
        individuator,
        storageKeeper,
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

    const theme = useMemo(
        () => new Theme(themeSpecifications[settings.themeName]),
        [settings.themeName],
    );

    return (
        <StrictMode>
            <ThemeContext.Provider value={theme}>
                <ErrorBoundary fallbackComponent={components.errorFallbackComponent}>
                    <MachineWardContext.Provider value={machineWardContextValue}>
                        <StateWardenContext.Provider value={stateWarden as StateWarden}>
                            <components.layoutComponent>
                                <components.topBarComponent title={title} onNavigate={onNavigate} onNavigateBack={onNavigateBack} />
                                <components.machineComponent onNavigate={onNavigate} onNavigateBack={onNavigateBack} />
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
