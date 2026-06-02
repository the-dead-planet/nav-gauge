import { ErrorInfo, FC } from "react";

interface Props {
    error: Error;
    errorInfo?: ErrorInfo;
}

export const TranslatronError: FC<Props> = ({ error, errorInfo }) => {
    return (
        <span title={`${error.message}. Stack: ${errorInfo?.componentStack ?? undefined}`}>
            {error.message}
        </span>
    );
};
