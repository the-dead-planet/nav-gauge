import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MobileMachineWard } from "./machine-ward";

export const machineWard = new MobileMachineWard(
    {
        "navigate": null,
        "route-story": null,
        "record-route": null,
        "submit-data": null
    },
    AsyncStorage,
    Appearance.getColorScheme() === 'light',
);
