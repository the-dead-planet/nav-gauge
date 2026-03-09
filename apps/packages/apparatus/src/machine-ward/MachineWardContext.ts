import { createContext, } from "react";
import { StorageKeeper } from "./storage-keeper";
import { Individuator } from "./individuator";
import { ChronoLens } from "./chrono-lens";

export interface MachineWardContextValue {
    individuator: Individuator;
    storageKeeper: StorageKeeper;
    chronoLens: ChronoLens;
}

export const MachineWardContext = createContext<MachineWardContextValue | null>(null);
