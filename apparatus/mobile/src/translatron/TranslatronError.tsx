import { ErrorInfo, FC } from "react";

interface Props {
    error: Error;
    errorInfo?: ErrorInfo;
}

export const TranslatronError: FC<Props> = ({ error }) => {
    return error.message;
};
