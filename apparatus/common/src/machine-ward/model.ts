import { ComponentType, ReactNode } from "react";
import { ErrorBoundaryProps } from "@ui";
import { AttributionVault, SignaliumNotice } from "..";
import { Gear, GearApparatus } from "./gears";

export interface MachineWardLayoutProps {
    children?: ReactNode;
}

export interface MachineWardTopBarProps<TNavigationPath extends string = string> {
    title: string;
    onNavigate: (path: TNavigationPath) => void;
    onNavigateBack: () => void;
}

export interface MachineWardMachineProps<TNavigationPath extends string = string> {
    onNavigate: (path: TNavigationPath) => void;
    onNavigateBack: () => void;
}

export interface MachineWardNoticesProps {
    notices: SignaliumNotice[];
    onRemove: (id: string) => void;
}

export interface MachineWardComponents<TNavigationPath extends string = string> {
    errorFallbackComponent: ErrorBoundaryProps['fallbackComponent'];
    layoutComponent: ComponentType<MachineWardLayoutProps>;
    topBarComponent: ComponentType<MachineWardTopBarProps<TNavigationPath>>;
    machineComponent: ComponentType<MachineWardMachineProps<TNavigationPath>>;
    footerComponent: ComponentType;
    noticesComponent: ComponentType<MachineWardNoticesProps>;
}

export type MachineGear<TMap> = new (apparatus: GearApparatus<TMap>) => Gear<TMap>;

export enum MachineTranslationKey {
    Legal = 'legal',
    Privacy = 'privacy',
    Close = 'close',
    Save = 'save',
    Menu = 'menu',
    ToggleMode = 'toggle-mode',
    Gears = 'gears',
    Collapse = 'collapse',
    Expand = 'expand',
    PanelMenu = 'panel-menu',
    SwapPlacement = 'swap-placement',
    UnderConstruction = 'under-construction',
}