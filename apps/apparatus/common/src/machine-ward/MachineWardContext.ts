import { createContext, } from "react";
import { StorageKeeper } from "./storage-keeper";
import { Individuator } from "./individuator";
import { Animatrix, AttributionVault, Cartomancer, ChronoLens, SignaliumBureau, ToolsStation } from "..";

export interface MachineWardContextValue<TMap = unknown> {
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    animatrix: Animatrix;
    attributionVault: AttributionVault;
    cartomancer: Cartomancer<TMap>;
    chronoLens: ChronoLens;
    toolsStation: ToolsStation<TMap>;
    signaliumBureau: SignaliumBureau;
}

export const MachineWardContext = createContext<MachineWardContextValue | null>(null);
