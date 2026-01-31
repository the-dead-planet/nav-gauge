import { ComponentType, ReactNode } from "react";
import { SignaliumNotice } from "../state-warden";
import { ErrorBoundaryProps } from "@ui";

export interface MachineWardLayoutProps {
    children?: ReactNode;
}

export interface MachineWardTopBarProps {
    title: string;
}

export interface MachineWardMachineProps {
}

export interface MachineWardFooterProps {
}

export interface MachineWardNoticesProps {
    notices: SignaliumNotice[];
    onRemove: (id: string) => void;
}

export interface MachineWardComponents {
    errorFallbackComponent: ErrorBoundaryProps['fallbackComponent'];
    layoutComponent: ComponentType<MachineWardLayoutProps>;
    topBarComponent: ComponentType<MachineWardTopBarProps>;
    machineComponent: ComponentType<MachineWardMachineProps>;
    footerComponent: ComponentType<MachineWardFooterProps>;
    noticesComponent: ComponentType<MachineWardNoticesProps>;
}
