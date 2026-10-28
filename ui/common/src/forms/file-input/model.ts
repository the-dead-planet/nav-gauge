import { ReactNode } from "react";
import { ColorVariant } from "../../design-system/model";
import { TooltipPlacement } from "../../gizmos/tooltip";
import { ThemeMode } from "../../design-system";
import type { TypographyProps } from '../../design-system/typography/model';

export interface FileInputProps<TFile> {
    themeMode?: ThemeMode;
    fileIcon?: string;
    color?: ColorVariant;
    mutiple?: boolean;
    fileName: string | null | undefined;
    fileNameProps?: TypographyProps;
    fileLabel: string;
    fileTooltipPlacement?: TooltipPlacement;
    purgeLabel: string;
    purgeTooltipPlacement?: TooltipPlacement;
    cancelLabel: string;
    noNameLabel: string;
    actionButtons?: { id: string; element: ReactNode }[];
    onUpload: (files: TFile[]) => void;
    onPurge: () => void;
    purgeText: string;
    onError?: (error: Error) => void;
    onIsLoadingChange?: (isLoading: boolean) => void;
}
