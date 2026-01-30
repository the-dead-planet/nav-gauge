import { ReactNode } from "react";
import { SignaliumNotice } from "../state-warden";

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

