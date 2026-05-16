import { useContext } from "react";
import { MachineWardContext, MachineWardContextValue } from "./MachineWardContext";

export const useMachineWard = (): MachineWardContextValue => {
    const context = useContext(MachineWardContext);

    if (!context) {
        throw new Error("useMachineWard must be used within a MachineWardContext provider");
    }

    return context;
};
