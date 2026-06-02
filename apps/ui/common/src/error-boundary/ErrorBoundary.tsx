import { ComponentType, ErrorInfo, PureComponent, ReactNode } from "react";

interface DefaultProps {
    /**
     * Rendered if an error is caught. Defaults to `null`.
     */
    fallbackComponent: ComponentType<{ error: Error; errorInfo?: ErrorInfo; }> | null;
}

export interface ErrorBoundaryProps extends DefaultProps {
    /**
     * If provided, will take precedence over the internal error state.
     */
    error?: Error | null;
    /**
     * If provided, will take precedence over the internal error state.
     */
    errorInfo?: ErrorInfo;
    /**
     * Handler evoked in `componentDidCatch`
     */
    onError?: (error: Error | null, errorInfo: ErrorInfo) => void;
    /**
     * What to render when there is no error.
     */
    children?: ReactNode;
}

interface State {
    error: Error | null;
    errorInfo?: ErrorInfo;
}

/**
 * Catches an error and displays the fallback, if provided.
 */
export class ErrorBoundary extends PureComponent<ErrorBoundaryProps, State> {
    public static defaultProps: DefaultProps = {
        fallbackComponent: null,
    }

    public state: Readonly<State> = {
        error: null
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ error, errorInfo });
        this.props.onError?.(error, errorInfo);
    }

    public render() {
        const error = this.props.error ?? this.state.error;
        
        if (error instanceof Error) {
            const errorInfo = this.props.errorInfo ?? this.state.errorInfo;

            return this.props.fallbackComponent 
                ? <this.props.fallbackComponent error={error} errorInfo={errorInfo} /> 
                : null;
        }

        return this.props.children;
    }
};
