import { ReactNode } from "react";
import { Theme } from "@ui";
import { SignaliumNotice } from "../state-warden";

export interface ApplicationSettingsType {
    theme: Theme;
    /**
     * When set to `true`, a native confirmation popup will be shown before closing or reloading the page.
     */
    confirmBeforeLeave: boolean;
}

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

