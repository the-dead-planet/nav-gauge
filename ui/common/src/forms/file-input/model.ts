import { ColorVariant } from "../../model";
import { TooltipPlacement } from "../../tooltip";

export interface FileInputProps<TFile> {
    fileIcon?: string;
    color?: ColorVariant;
    fileName: string | null | undefined;
    fileLabel: string;
    fileTooltipPlacement?: TooltipPlacement;
    purgeLabel: string;
    purgeTooltipPlacement?: TooltipPlacement;
    cancelLabel: string;
    noNameLabel: string;
    onUpload: (files: TFile[]) => void;
    onPurge: () => void;
    onError?: (error: Error) => void;
    onIsLoadingChange?: (isLoading: boolean) => void;
}
