import { ComponentType, ReactNode } from "react";
import { ErrorBoundaryProps } from "@ui";
import { SignaliumNotice, StateWarden } from "../state-warden";
import { Gear } from "../gears";
import { Individuator } from "./individuator";

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

export type MachineGear<TMap> = new (stateWarden: StateWarden<TMap>, individuator: Individuator) => Gear<TMap>;
