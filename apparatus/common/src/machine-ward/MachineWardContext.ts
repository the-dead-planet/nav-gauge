import { createContext, } from "react";
import { StorageKeeper } from "./storage-keeper";
import { Individuator } from "./individuator";
import { Animatrix, AttributionVault, Cartomancer, ChronoLens, Engine, MachineTranslationKey, SignaliumBureau, ToolsStation, Translatron } from "..";

export interface MachineWardContextValue<TMap = unknown> {
    namespace: string;
    translationKey: typeof MachineTranslationKey;
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    animatrix: Animatrix;
    attributionVault: AttributionVault;
    cartomancer: Cartomancer<TMap>;
    chronoLens: ChronoLens;
    toolsStation: ToolsStation<TMap>;
    signaliumBureau: SignaliumBureau;
    translatron: Translatron;
    engine: Engine<TMap>
}

export const MachineWardContext = createContext<MachineWardContextValue | null>(null);
