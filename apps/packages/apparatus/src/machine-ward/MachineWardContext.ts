import { createContext, } from "react";
import { StorageKeeper } from "./storage-keeper";
import { Individuator } from "./individuator";

export interface MachineWardContextValue {
    individuator: Individuator;
    storageKeeper: StorageKeeper;
}

export const MachineWardContext = createContext<MachineWardContextValue | null>(null);
