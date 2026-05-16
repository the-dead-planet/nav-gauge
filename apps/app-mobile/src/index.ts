import { MachineGear } from "@apparatus";
import { MobileMap } from "@mobile-ui";
import { MobileMachineWard } from "./machine-ward";
import NavigateGear from '@the-dead-planet/nav-gauge-gears-navigate-mobile'
import RecordRouteGear from '@the-dead-planet/nav-gauge-gears-record-route-mobile'
import RouteStoryGear from '@the-dead-planet/nav-gauge-gears-route-story-mobile'
import SubmitDataGear from '@the-dead-planet/nav-gauge-gears-submit-data-mobile'

const gears: MachineGear<MobileMap>[] = [
    NavigateGear,
    RecordRouteGear,
    RouteStoryGear,
    SubmitDataGear
];

export const machineWard = new MobileMachineWard(gears);
console.log({machineWard})
