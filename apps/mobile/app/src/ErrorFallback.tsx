import { View } from 'react-native';
import { ErrorBoundaryProps } from '@ui';
import { Text } from '@mobile-ui';

export const ErrorFallback: ErrorBoundaryProps['fallbackComponent'] = ({
    error,
    errorInfo
}) => {
    return (
        <View>
            <Text>Error</Text>
            <Text>{error.message}</Text>
            {errorInfo?.componentStack
                ? <Text style={{ fontSize: 10, marginTop: 10 }}>{errorInfo.componentStack}</Text>
                : null}
        </View>
    );
};
