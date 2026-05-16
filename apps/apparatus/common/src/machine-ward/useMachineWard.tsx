import { useContext } from "react";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";

export function useMachineWard<TMap>(): MachineWardContextValue<TMap> {
    const context = useContext(MachineWardContext );

    if (!context) {
        throw new Error("useMachineWard must be used within a MachineWardContext provider");
    }

    return context as MachineWardContextValue<TMap>;
}
