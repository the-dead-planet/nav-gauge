import { useMachineWard } from "@apparatus";
import { MobileChronoLens } from "../chrono-lens";
import { MobileMap } from "../model";

export const useMobileMachineWard = () => {
    return useMachineWard<MobileMap, MobileChronoLens>();
};
