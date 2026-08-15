import { ErrorInfo, FC } from "react";

interface Props {
    error: Error;
    errorInfo?: ErrorInfo;
}

// TODO: Make it an error icon with a tooltip
export const TranslatronError: FC<Props> = ({ error, errorInfo }) => {
    return (
        <span title={`${error.message}. Stack: ${errorInfo?.componentStack ?? undefined}`}>
            {error.message}
        </span>
    );
};
