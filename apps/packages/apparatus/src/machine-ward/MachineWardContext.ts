import { createContext, } from "react";
import { BehaviorSubject } from "rxjs";
import { ApplicationSettingsType } from "@tinker-chest";
import { StorageKeeper } from "../storage-keeper";

export interface MachineWardContextValue {
    applicationSettings$: BehaviorSubject<ApplicationSettingsType>;
    storageKeeper: StorageKeeper;
}

export const MachineWardContext = createContext<MachineWardContextValue | null>(null);
