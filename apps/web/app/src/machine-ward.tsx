import { MachineWard, MachineWardComponents } from "@apparatus";
import { ErrorFallback } from "./ErrorFallback";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";

export class WebMachineWard extends MachineWard {
    public components: MachineWardComponents = {
        errorFallbackComponent: ErrorFallback,
        layoutComponent: Layout,
        topBarComponent: TopBar,
        machineComponent: Machine,
        footerComponent: Footer,
        noticesComponent: Notices
    };
}
