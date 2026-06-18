import { StrictMode, useEffect, useMemo } from "react";
import { ErrorBoundary, MediaSubscriptionDefinition, Theme, ThemeContext, themeSpecifications } from "@ui";
import { MachineWardNotices } from "./MachineWardNotices";
import { Animatrix, AttributionVault, Cartomancer, ChronoLens, Engine, SignaliumBureau, ToolsStation, Translatron } from "..";
import { Individuator } from "./individuator";
import { StorageKeeper } from "./storage-keeper";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";
import { useSubjectState } from "@tinker-chest";
import { MachineWardComponents } from "./model";

interface MachineWardProps<TMap, TNavigationPath extends string> {
    namespace: string;
    title: string;
    media: MediaSubscriptionDefinition;
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    signaliumBureau: SignaliumBureau;
    attributionVault: AttributionVault;
    animatrix: Animatrix;
    cartomancer: Cartomancer<TMap>;
    chronoLens: ChronoLens;
    toolsStation: ToolsStation<TMap>;
    translatron: Translatron;
    engine: Engine<TMap>
    components: MachineWardComponents<TNavigationPath>;
    onMount: () => void;
    onUnmount: () => void;
    onNavigate: (path: TNavigationPath) => void;
    onNavigateBack: () => void;
}

export function MachineWardApp<TMap, TNavigationPath extends string>({
    namespace,
    title,
    media,
    individuator,
    storageKeeper,
    animatrix,
    attributionVault,
    cartomancer,
    chronoLens,
    toolsStation,
    signaliumBureau,
    translatron,
    engine,
    components,
    onMount,
    onUnmount,
    onNavigate,
    onNavigateBack,
}: MachineWardProps<TMap, TNavigationPath>) {
    const [settings] = useSubjectState(individuator.settings$);

    useEffect(() => {
        onMount();

        return () => {
            onUnmount();
        };
    }, []);

    const theme = useMemo(
        () => new Theme(themeSpecifications[settings.themeName], media),
        [settings.themeName, media],
    );

    useEffect(() => {
        return theme.destroy;
    }, [theme])

    return (
        <StrictMode>
            <ThemeContext.Provider value={theme}>
                <ErrorBoundary fallbackComponent={components.errorFallbackComponent}>
                    <MachineWardContext.Provider value={{
                        namespace,
                        individuator,
                        storageKeeper,
                        animatrix,
                        attributionVault,
                        cartomancer,
                        chronoLens,
                        toolsStation,
                        signaliumBureau,
                        translatron,
                        engine,
                    } as MachineWardContextValue}>
                        <components.layoutComponent>
                            <components.topBarComponent title={title} onNavigate={onNavigate} onNavigateBack={onNavigateBack} />
                            <components.machineComponent onNavigate={onNavigate} onNavigateBack={onNavigateBack} />
                            <components.footerComponent />
                            <MachineWardNotices noticesComponent={components.noticesComponent} />
                        </components.layoutComponent>
                    </MachineWardContext.Provider>
                </ErrorBoundary>
            </ThemeContext.Provider>
        </StrictMode>
    );
}
