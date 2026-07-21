import { ReactNode } from "react";
import { ColorVariant } from "../../model";
import { TooltipPlacement } from "../../tooltip";

export interface FileInputProps<TFile> {
    fileIcon?: string;
    color?: ColorVariant;
    mutiple?: boolean;
    fileName: string | null | undefined;
    fileLabel: string;
    fileTooltipPlacement?: TooltipPlacement;
    purgeLabel: string;
    purgeTooltipPlacement?: TooltipPlacement;
    cancelLabel: string;
    noNameLabel: string;
    actionButtons?: { id: string; element: ReactNode }[];
    onUpload: (files: TFile[]) => void;
    onPurge: () => void;
    onError?: (error: Error) => void;
    onIsLoadingChange?: (isLoading: boolean) => void;
}
