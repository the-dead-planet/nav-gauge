import { createContext, } from "react";
import { StorageKeeper } from "./storage-keeper";
import { Individuator } from "./individuator";
import { AttributionVault, Cartomancer, ChronoLens, Engine, MachineTranslationKey, SignaliumBureau, ToolsStation, Translatron } from "..";

export interface MachineWardContextValue<TMap = unknown, TChronoLens extends ChronoLens = ChronoLens> {
    isDev: boolean;
    namespace: string;
    translationKey: typeof MachineTranslationKey;
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    attributionVault: AttributionVault;
    cartomancer: Cartomancer<TMap>;
    chronoLens: TChronoLens;
    toolsStation: ToolsStation<TMap>;
    signaliumBureau: SignaliumBureau;
    translatron: Translatron;
    engine: Engine<TMap, TChronoLens>
}

export const MachineWardContext = createContext<MachineWardContextValue | null>(null);
