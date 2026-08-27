import type * as maplibregl from "maplibre-gl";
import { useMachineWard } from "@apparatus";
import { WebChronoLens } from "../chrono-lens";

export const useWebMachineWard = () => {
    return useMachineWard<maplibregl.Map, WebChronoLens>();
};
