import { ReactNode } from "react";

export interface TransitionProps {
    render: boolean;
    durationMs?: number;
    slide?: 'to-top' | 'to-right' | 'to-bottom' | 'to-left';
    fade?: boolean;
    children: ReactNode;
}
