import { ComponentType, ReactNode } from "react";
import { ErrorBoundaryProps } from "@ui";
import { SignaliumNotice, StateWarden } from "../state-warden";
import { Gear } from "../gears";
import { Individuator } from "./individuator";

export interface MachineWardLayoutProps {
    children?: ReactNode;
}

export interface MachineWardTopBarProps<TNavigationPath extends string = string> {
    title: string;
    navigate: (path: TNavigationPath) => void;
}

export interface MachineWardNoticesProps {
    notices: SignaliumNotice[];
    onRemove: (id: string) => void;
}

export interface MachineWardComponents<TNavigationPath extends string = string> {
    errorFallbackComponent: ErrorBoundaryProps['fallbackComponent'];
    layoutComponent: ComponentType<MachineWardLayoutProps>;
    topBarComponent: ComponentType<MachineWardTopBarProps<TNavigationPath>>;
    machineComponent: ComponentType;
    footerComponent: ComponentType;
    noticesComponent: ComponentType<MachineWardNoticesProps>;
}

export type MachineGear<TMap> = new (stateWarden: StateWarden<TMap>, individuator: Individuator) => Gear<TMap>;
