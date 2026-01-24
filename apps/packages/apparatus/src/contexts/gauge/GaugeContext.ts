import { createContext, } from "react";
import {
    ApplicationSettingsType,
    GaugeControlsType,
    MapLayout,
} from "@tinker-chest";

export type GaugeContext = GaugeControlsType & MapLayout & ApplicationSettingsType;

export const GaugeContext = createContext<GaugeContext | undefined>(undefined);
