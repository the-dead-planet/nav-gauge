import { ReactNode } from "react";
import { SignaliumNotice } from "../state-warden";

export interface MachineWardLayoutProps {
    children?: ReactNode;
}

export interface MachineWardTopBarProps {
    children?: ReactNode;
}

export interface MachineWardMachineProps {
    children?: ReactNode;
}

export interface MachineWardFooterProps {
    children?: ReactNode;
}

export interface MachineWardNoticesProps {
    notices: SignaliumNotice[];
    onRemove: (id: string) => void;
}

export type GearId = 'route';
