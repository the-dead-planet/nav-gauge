import { createContext, } from "react";
import { GaugeControlsType, MapLayout } from "@tinker-chest";

export type GaugeContext = GaugeControlsType & MapLayout;

export const GaugeContext = createContext<GaugeContext | undefined>(undefined);
