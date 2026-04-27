import { MachineGear } from "@apparatus";
import { MobileMap } from "@mobile-ui";
import { MobileMachineWard } from "./machine-ward";

const gears: MachineGear<MobileMap>[] = [];

export const machineWard = new MobileMachineWard(gears);
