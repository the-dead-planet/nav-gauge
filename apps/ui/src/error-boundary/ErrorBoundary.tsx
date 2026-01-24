import { ErrorInfo, PureComponent, ReactNode } from "react";

interface DefaultProps {
    /**
     * Rendered if an error is caught. Defaults to `null`.
     */
    fallback: ReactNode | null;
}

interface Props extends DefaultProps {
    /**
     * If provided, will take precedence over the internal error state.
     */
    error?: Error | null;
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
}

/**
 * Catches an error and displays the fallback, if provided.
 */
export class ErrorBoundary extends PureComponent<Props, State> {
    public static defaultProps: DefaultProps = {
        fallback: null,
    }

    public state: Readonly<State> = {
        error: null
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ error });
        this.props.onError?.(error, errorInfo);
    }

    public render() {
        const e = this.props.error ?? this.state.error
        if (e instanceof Error) {
            return this.props.fallback;
        }

        return this.props.children;
    }
};
