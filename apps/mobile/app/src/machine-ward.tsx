import { MachineWard } from "@apparatus";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { ErrorFallback } from "./ErrorFallback";
import { NoticesList } from "./notices/NoticesList";

export class MobileMachineWard extends MachineWard {
    public readonly errorFallbackComponent = ErrorFallback;
    public readonly layoutComponent = Layout;
    public readonly topBarComponent = TopBar;
    public readonly machineComponent = Machine;
    public readonly footerComponent = Footer;
    public readonly noticesComponent = NoticesList;
}
