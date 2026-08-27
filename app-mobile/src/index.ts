import { MachineGear } from "@apparatus";
import { MobileChronoLens, MobileMap } from "@mobile-apparatus";
import { MobileMachineWard } from "./machine-ward";
import NavigateGear from '@the-dead-planet/nav-gauge-gears-navigate-mobile'
import RecordRouteGear from '@the-dead-planet/nav-gauge-gears-record-route-mobile'
import RouteStoryGear from '@the-dead-planet/nav-gauge-gears-route-story-mobile'
import SubmitDataGear from '@the-dead-planet/nav-gauge-gears-submit-data-mobile'

const gears: MachineGear<MobileMap, MobileChronoLens>[] = [
    NavigateGear,
    RecordRouteGear,
    RouteStoryGear,
    SubmitDataGear
];

export const machineWard = new MobileMachineWard(gears);
