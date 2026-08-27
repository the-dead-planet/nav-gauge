import { StrictMode, useEffect, useMemo } from "react";
import { ErrorBoundary, MediaSubscriptionDefinition, Theme, ThemeContext, themeSpecifications } from "@ui";
import { MachineWardNotices } from "./MachineWardNotices";
import { AttributionVault, Cartomancer, ChronoLens, Engine, SignaliumBureau, ToolsStation, Translatron } from "..";
import { Individuator } from "./individuator";
import { StorageKeeper } from "./storage-keeper";
import { MachineWardContext } from "./MachineWardContext";
import { useSubjectState } from "@tinker-chest";
import { MachineTranslationKey, MachineWardComponents } from "./model";

interface MachineWardProps<TMap, TChronoLens extends ChronoLens, TNavigationPath extends string> {
    namespace: string;
    title: string;
    media: MediaSubscriptionDefinition;
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    signaliumBureau: SignaliumBureau;
    attributionVault: AttributionVault;
    cartomancer: Cartomancer<TMap>;
    chronoLens: TChronoLens;
    toolsStation: ToolsStation<TMap>;
    translatron: Translatron;
    engine: Engine<TMap, TChronoLens>
    components: MachineWardComponents<TNavigationPath>;
    onMount: () => void;
    onUnmount: () => void;
    onNavigate: (path: TNavigationPath) => void;
    onNavigateBack: () => void;
}

export function MachineWardApp<TMap, TChronoLens extends ChronoLens, TNavigationPath extends string>({
    namespace,
    title,
    media,
    individuator,
    storageKeeper,
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
}: MachineWardProps<TMap, TChronoLens, TNavigationPath>) {
    const [settings] = useSubjectState(individuator.settings$);

    useEffect(() => {
        onMount();

        return () => {
            onUnmount();
        };
    }, []);

    const theme = useMemo(
        () => new Theme(themeSpecifications[settings.themeName][settings.themeMode], media),
        [settings.themeName, settings.themeMode, media],
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
                        translationKey: MachineTranslationKey,
                        individuator,
                        storageKeeper,
                        attributionVault,
                        cartomancer: cartomancer as Cartomancer<unknown>,
                        chronoLens,
                        toolsStation: toolsStation as ToolsStation<unknown>,
                        signaliumBureau,
                        translatron,
                        engine: engine as unknown as Engine<unknown, ChronoLens>,
                    }}>
                        <components.layoutComponent>
                            <components.topBarComponent title={title} onNavigate={onNavigate} onNavigateBack={onNavigateBack} />
                            <components.machineComponent onNavigate={onNavigate} onNavigateBack={onNavigateBack} />
                            <MachineWardNotices noticesComponent={components.noticesComponent} />
                        </components.layoutComponent>
                    </MachineWardContext.Provider>
                </ErrorBoundary>
            </ThemeContext.Provider>
        </StrictMode>
    );
}
