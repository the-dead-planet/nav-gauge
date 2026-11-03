import { ReactNode } from "react";
import { AppearanceProps } from "../../design-system/model";
import { TooltipPlacement } from "../../gizmos/tooltip";
import type { TypographyProps } from "../../design-system/typography/model";
import type { ButtonProps } from "../../gizmos/button/model";
import type { DialogProps } from "../../rigs/dialog/model";

export interface FileInputProps<TFile> extends AppearanceProps {
    fileIcon?: string;
    fileUploadButtonProps?: Omit<ButtonProps, "children">;
    purgeButtonProps?: Omit<ButtonProps, "children">;
    purgeConfirmationDialogProps?: Partial<
        Omit<DialogProps, "children" | "onClose" | "save">
    >;
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
