import { useContext } from "react";
import { GaugeContext } from "./GaugeContext";

export const useGaugeContext = (): GaugeContext => {
    const context = useContext(GaugeContext);

    if (!context) {
        throw new Error("useGaugeContext must be used within a GaugeContext provider");
    }

    return context;
};
