import { ErrorBoundaryProps } from "@ui";

export const ErrorFallback: ErrorBoundaryProps['fallbackComponent'] = () => {
    return <div>Error fallback</div>
};
