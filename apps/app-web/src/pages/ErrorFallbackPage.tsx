import * as styles from './pages.module.css';
import { ErrorInfo, FC } from "react";

interface Props {
    error: Error;
    errorInfo?: ErrorInfo;
}

export const ErrorFallbackPage: FC<Props> = ({
    error,
    errorInfo,
}) => {
    return (
        <div className={styles['page']}>
            <div>
                <h3>Error</h3>
                <p>
                    {error.message || "Something went wrong =("}
                </p>
                <p>
                    {errorInfo?.componentStack}
                </p>
            </div>
        </div>
    );
};
