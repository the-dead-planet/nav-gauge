import { Gear, GearId, MachineWard } from "@apparatus";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";
import { ErrorFallback } from "./ErrorFallback";

export class MobileMachineWard extends MachineWard {
    public readonly errorFallbackComponent = ErrorFallback;
    public readonly layoutComponent = Layout;
    public readonly topBarComponent = TopBar;
    public readonly machineComponent = Machine;
    public readonly footerComponent = Footer;
    public readonly noticesComponent = Notices;

    public gears: { [key in GearId]: Gear<GearId> | null } = {
        route: null,
    };
}
