import { MachineWard } from "@apparatus";
import { ErrorFallback } from "./ErrorFallback";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";

export class WebMachineWard extends MachineWard {
    public readonly errorFallbackComponent = ErrorFallback;
    public readonly layoutComponent = Layout;
    public readonly topBarComponent = TopBar;
    public readonly machineComponent = Machine;
    public readonly footerComponent = Footer;
    public readonly noticesComponent = Notices;
}
