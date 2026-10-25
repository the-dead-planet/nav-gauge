import { FC } from "react";
import { ErrorBoundary, TooltipProps } from "@ui";
import { TooltipContent } from "./TooltipContent";

export const Tooltip: FC<TooltipProps> = (props) => (
    <ErrorBoundary>
        <TooltipContent {...props} />
    </ErrorBoundary>
);
