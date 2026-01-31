import { createContext, } from "react";
import { BehaviorSubject } from "rxjs";
import { StorageKeeper } from "../storage-keeper";
import { ApplicationSettingsType } from "./model";

export interface MachineWardContextValue {
    applicationSettings$: BehaviorSubject<ApplicationSettingsType>;
    storageKeeper: StorageKeeper;
}

export const MachineWardContext = createContext<MachineWardContextValue | null>(null);
