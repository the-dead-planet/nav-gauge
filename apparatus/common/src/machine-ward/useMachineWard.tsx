import { useContext } from "react";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";
import { ChronoLens } from "./chrono-lens";

export function useMachineWard<TMap, TChronoLens extends ChronoLens>(): MachineWardContextValue<TMap, TChronoLens> {
    const context = useContext(MachineWardContext);

    if (!context) {
        throw new Error("useMachineWard must be used within a MachineWardContext provider");
    }

    return context as unknown as MachineWardContextValue<TMap, TChronoLens>;
}
